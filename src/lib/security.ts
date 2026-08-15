/**
 * Security utilities for Piyush's Dispatch.
 * Provides enterprise-grade input validation, sanitization, rate limiting, SSRF protection, and XSS defense.
 */

// Controlled list of valid themes matching the application theme system
export const VALID_THEMES = [
  'light',
  'dark',
  'midnight',
  'forest',
  'nordic',
  'espresso',
  'crimson',
  'amoled-paper',
  'amoled-obsidian',
  'amoled-matcha',
  'amoled-cyber',
  'amoled-espresso',
  'amoled-crimson',
  'amoled-forest',
  'amoled-nordic',
] as const;

export type ValidTheme = typeof VALID_THEMES[number];

export function isValidTheme(theme: unknown): theme is ValidTheme {
  return typeof theme === 'string' && (VALID_THEMES as readonly string[]).includes(theme);
}

/**
 * Strict RFC 5321/5322 email validation.
 * Checks for control characters, maximum total length (254 chars), maximum local part length (64 chars),
 * and standard email structure to prevent newline injection and header injection.
 */
export function isValidEmail(email: unknown): boolean {
  if (typeof email !== 'string') return false;

  const trimmed = email.trim();
  if (!trimmed || trimmed.length > 254) return false;

  // Disallow ASCII control characters (0-31 and 127)
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x1F\x7F]/.test(trimmed)) return false;

  const parts = trimmed.split('@');
  if (parts.length !== 2) return false;

  const [localPart, domainPart] = parts;
  if (!localPart || localPart.length > 64 || !domainPart || domainPart.length > 253) {
    return false;
  }

  // Must not have consecutive dots in local part or domain
  if (localPart.includes('..') || domainPart.includes('..')) return false;

  // RFC-compliant safe email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

/**
 * Sanitizes an email string by trimming, converting to lowercase, and stripping any control characters.
 */
export function sanitizeEmail(email: string): string {
  // eslint-disable-next-line no-control-regex
  return email.trim().toLowerCase().replace(/[\x00-\x1F\x7F]/g, '').slice(0, 254);
}

/**
 * Basic HTML entity escaping to prevent reflected XSS.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * URL protocol validator to disallow dangerous schemes such as `javascript:`, `data:text/html`, `vbscript:`.
 */
export function isSafeUrl(url: string, allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:']): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();

  // Allow relative URLs starting with / or # or ./
  if (trimmed.startsWith('/') || trimmed.startsWith('#') || trimmed.startsWith('./')) {
    // Disallow protocol-relative URLs (e.g. //evil.com) unless explicitly intended
    if (trimmed.startsWith('//')) return false;
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    return allowedProtocols.includes(parsed.protocol.toLowerCase());
  } catch {
    return false;
  }
}

/**
 * Normalizes and sanitizes a URL, returning a safe fallback if the URL is invalid or uses an unsafe scheme.
 */
export function sanitizeUrl(url: string, fallback = '#'): string {
  if (isSafeUrl(url)) {
    return url.trim();
  }
  return fallback;
}

/**
 * SSRF Protection: Checks whether a remote endpoint URL is safe to contact from server-side fetch.
 * Disallows private IP addresses, loopback, cloud metadata endpoints, and non-HTTPS protocols in production.
 */
export function isSafeRemoteEndpoint(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);

    // Require HTTPS for external API endpoints
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return false;
    }

    // In production, strictly require https
    if (process.env.NODE_ENV === 'production' && parsed.protocol !== 'https:') {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();

    // Block localhost and common loopback aliases
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname === '0.0.0.0' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal')
    ) {
      return false;
    }

    // Block Cloud metadata IP (AWS/GCP/Azure link-local: 169.254.169.254)
    if (hostname.startsWith('169.254.')) {
      return false;
    }

    // Block private IPv4 ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 100.64.0.0/10)
    const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (ipv4Match) {
      const octet1 = parseInt(ipv4Match[1], 10);
      const octet2 = parseInt(ipv4Match[2], 10);

      if (octet1 === 10) return false;
      if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) return false;
      if (octet1 === 192 && octet2 === 168) return false;
      if (octet1 === 100 && octet2 >= 64 && octet2 <= 127) return false;
      if (octet1 === 127) return false;
      if (octet1 === 0) return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * High-Performance In-Memory Sliding Window Rate Limiter.
 * Protects public API endpoints from bot floods, credential stuffing, and brute force spam.
 */
interface RateLimitRecord {
  timestamps: number[];
}

class InMemoryRateLimiter {
  private store: Map<string, RateLimitRecord> = new Map();
  private maxRequests: number;
  private windowMs: number;
  private lastCleanup: number = Date.now();

  constructor(maxRequests = 5, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  private cleanup() {
    const now = Date.now();
    // Run cleanup at most once every 60 seconds
    if (now - this.lastCleanup < 60000) return;
    this.lastCleanup = now;

    for (const [key, record] of this.store.entries()) {
      record.timestamps = record.timestamps.filter(t => now - t < this.windowMs);
      if (record.timestamps.length === 0) {
        this.store.delete(key);
      }
    }
  }

  public check(identifier: string): { allowed: boolean; remaining: number; resetTimeMs: number } {
    this.cleanup();
    const now = Date.now();
    const cleanId = identifier.trim() || 'unknown';

    let record = this.store.get(cleanId);
    if (!record) {
      record = { timestamps: [] };
      this.store.set(cleanId, record);
    }

    // Filter timestamps within current window
    record.timestamps = record.timestamps.filter(t => now - t < this.windowMs);

    if (record.timestamps.length >= this.maxRequests) {
      const oldest = record.timestamps[0];
      const resetTimeMs = Math.max(0, this.windowMs - (now - oldest));
      return {
        allowed: false,
        remaining: 0,
        resetTimeMs,
      };
    }

    record.timestamps.push(now);
    return {
      allowed: true,
      remaining: this.maxRequests - record.timestamps.length,
      resetTimeMs: this.windowMs,
    };
  }
}

// Global subscription rate limiter instance (e.g., 5 subscription attempts per IP per 60 seconds)
export const subscribeRateLimiter = new InMemoryRateLimiter(5, 60000);

/**
 * Extracts a client IP identifier from standard proxy headers in a secure fashion.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0].trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();

  return '127.0.0.1';
}

/**
 * Validates and sanitizes a bookmark or dispatch slug to prevent path traversal or injection.
 */
export function sanitizeSlug(slug: unknown): string {
  if (typeof slug !== 'string') return '';
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '')
    .slice(0, 100);
}
