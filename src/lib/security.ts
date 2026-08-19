/**
 * Security utilities for Piyush's Dispatch.
 * Provides enterprise-grade input validation, sanitization, bounded rate limiting, SSRF defense, and XSS protection.
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
  'amoled-dark',
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
  if (/[\x00-\x1F\x7F]/.test(trimmed)) return false;

  const parts = trimmed.split('@');
  if (parts.length !== 2) return false;

  const [localPart, domainPart] = parts;
  if (!localPart || localPart.length > 64 || !domainPart || domainPart.length > 253) {
    return false;
  }

  // Must not have consecutive dots in local part or domain
  if (localPart.includes('..') || domainPart.includes('..')) return false;

  // RFC-compliant safe email regex (ReDoS safe with strict bounds)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

/**
 * Sanitizes an email string by trimming, converting to lowercase, and stripping any control characters.
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase().replace(/[\x00-\x1F\x7F]/g, '').slice(0, 254);
}

/**
 * Basic HTML entity escaping to prevent reflected and stored XSS in raw text contexts.
 */
export function escapeHtml(str: string): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * URL protocol validator to disallow dangerous schemes such as `javascript:`, `data:text/html`, `vbscript:`.
 * Strictly neutralizes protocol-relative and backslash evasions.
 */
export function isSafeUrl(url: string, allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:']): boolean {
  if (!url || typeof url !== 'string') return false;

  // Strip ASCII control characters and whitespace
  const clean = url.replace(/[\x00-\x1F\x7F\s]/g, '');
  if (!clean) return false;

  // Reject backslash escapes, protocol-relative '//', or malicious relative paths like '/\'
  if (clean.includes('\\') || clean.startsWith('//') || clean.startsWith('/\\')) {
    return false;
  }

  // Safe relative paths starting with / or # or ./
  if (clean.startsWith('/') || clean.startsWith('#') || clean.startsWith('./')) {
    return true;
  }

  try {
    const parsed = new URL(clean);
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
 * Helper: Parses an individual numerical octet/segment in decimal, octal (0-prefix), or hex (0x-prefix).
 */
function parseIpPart(partStr: string, maxVal: number): number | null {
  const trimmed = partStr.trim();
  if (!trimmed) return null;
  let num: number;
  if (/^0x[0-9a-fA-F]+$/i.test(trimmed)) {
    num = parseInt(trimmed, 16);
  } else if (trimmed.length > 1 && trimmed.startsWith('0') && /^[0-7]+$/.test(trimmed)) {
    num = parseInt(trimmed, 8);
  } else if (/^\d+$/.test(trimmed)) {
    num = parseInt(trimmed, 10);
  } else {
    return null;
  }
  if (isNaN(num) || num < 0 || num > maxVal) return null;
  return num;
}

/**
 * Helper: Converts any IPv4 representation (4-part dotted decimal, 3-part, 2-part shorthand,
 * hex, octal, or single 32-bit dword integer) into canonical [octet1, octet2, octet3, octet4] or null if invalid.
 */
function parseIpv4ToOctets(ipStr: string): [number, number, number, number] | null {
  const trimmed = ipStr.trim();
  if (!trimmed) return null;

  // Split by '.'
  const parts = trimmed.split('.');

  // 1. Standard 4-part: A.B.C.D (each 0-255)
  if (parts.length === 4) {
    const p0 = parseIpPart(parts[0], 255);
    const p1 = parseIpPart(parts[1], 255);
    const p2 = parseIpPart(parts[2], 255);
    const p3 = parseIpPart(parts[3], 255);
    if (p0 === null || p1 === null || p2 === null || p3 === null) return null;
    return [p0, p1, p2, p3];
  }

  // 2. 3-part: A.B.C (A, B 0-255, C is 16-bit uint: 0-65535, e.g. 127.0.1 -> 127.0.0.1)
  if (parts.length === 3) {
    const p0 = parseIpPart(parts[0], 255);
    const p1 = parseIpPart(parts[1], 255);
    const p2 = parseIpPart(parts[2], 65535);
    if (p0 === null || p1 === null || p2 === null) return null;
    return [p0, p1, (p2 >>> 8) & 255, p2 & 255];
  }

  // 3. 2-part: A.B (A 0-255, B is 24-bit uint: 0-16777215, e.g. 127.1 -> 127.0.0.1)
  if (parts.length === 2) {
    const p0 = parseIpPart(parts[0], 255);
    const p1 = parseIpPart(parts[1], 16777215);
    if (p0 === null || p1 === null) return null;
    return [p0, (p1 >>> 16) & 255, (p1 >>> 8) & 255, p1 & 255];
  }

  // 4. Single integer / DWORD or Hex notation (e.g. 2130706433 or 0x7f000001 -> 127.0.0.1)
  if (parts.length === 1) {
    const dword = parseIpPart(trimmed, 0xffffffff);
    if (dword !== null) {
      return [
        (dword >>> 24) & 255,
        (dword >>> 16) & 255,
        (dword >>> 8) & 255,
        dword & 255,
      ];
    }
  }

  return null;
}

/**
 * Checks if a parsed IPv4 address falls into private, loopback, link-local, or reserved ranges.
 */
function isPrivateOrReservedIpv4(octets: [number, number, number, number]): boolean {
  const [o1, o2] = octets;

  // 0.0.0.0/8 (Current network)
  if (o1 === 0) return true;

  // 10.0.0.0/8 (Private)
  if (o1 === 10) return true;

  // 100.64.0.0/10 (Carrier-Grade NAT) & 100.100.100.200 (Alibaba Cloud Metadata)
  if (o1 === 100 && ((o2 >= 64 && o2 <= 127) || o2 === 100)) return true;

  // 127.0.0.0/8 (Loopback)
  if (o1 === 127) return true;

  // 169.254.0.0/16 (Link-local / Cloud Metadata: AWS, Azure, GCP 169.254.169.254)
  if (o1 === 169 && o2 === 254) return true;

  // 172.16.0.0/12 (Private)
  if (o1 === 172 && o2 >= 16 && o2 <= 31) return true;

  // 192.0.0.0/24 (IETF Protocol Assignments)
  if (o1 === 192 && o2 === 0) return true;

  // 192.0.2.0/24 (TEST-NET-1)
  if (o1 === 192 && o2 === 0 && octets[2] === 2) return true;

  // 192.168.0.0/16 (Private)
  if (o1 === 192 && o2 === 168) return true;

  // 198.18.0.0/15 (Benchmarking)
  if (o1 === 198 && (o2 === 18 || o2 === 19)) return true;

  // 198.51.100.0/24 (TEST-NET-2)
  if (o1 === 198 && o2 === 51 && octets[2] === 100) return true;

  // 203.0.113.0/24 (TEST-NET-3)
  if (o1 === 203 && o2 === 0 && octets[2] === 113) return true;

  // 224.0.0.0/4 (Multicast)
  if (o1 >= 224 && o1 <= 239) return true;

  // 240.0.0.0/4 (Reserved / Future use & 255.255.255.255 broadcast)
  if (o1 >= 240) return true;

  return false;
}

/**
 * SSRF Protection: Checks whether a remote endpoint URL is safe to contact from server-side fetch.
 * Disallows private IP addresses, loopback, cloud metadata endpoints, embedded credentials,
 * non-standard ports, and non-HTTPS protocols in production.
 */
export function isSafeRemoteEndpoint(urlString: string): boolean {
  if (!urlString || typeof urlString !== 'string') return false;

  try {
    const parsed = new URL(urlString);

    // Require HTTPS for external API endpoints (or HTTP only during non-prod development)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return false;
    }

    if (process.env.NODE_ENV === 'production' && parsed.protocol !== 'https:') {
      return false;
    }

    // Disallow embedded credentials (http://user:pass@host)
    if (parsed.username || parsed.password) {
      return false;
    }

    // Only permit standard web ports (80, 443) or default
    if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
      return false;
    }

    let hostname = parsed.hostname.toLowerCase();
    // Strip IPv6 square brackets if present
    if (hostname.startsWith('[') && hostname.endsWith(']')) {
      hostname = hostname.slice(1, -1);
    }

    // Block localhost, loopback, cloud metadata aliases and internal hostnames
    if (
      hostname === 'localhost' ||
      hostname === '::1' ||
      hostname === '0:0:0:0:0:0:0:1' ||
      hostname === '0000:0000:0000:0000:0000:0000:0000:0001' ||
      hostname === '::' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.lan') ||
      hostname.endsWith('.home.arpa') ||
      hostname === 'metadata.google.internal' ||
      hostname === 'metadata.tencentyun.com' ||
      hostname === 'instance-data'
    ) {
      return false;
    }

    // Block IPv6 link-local (fe80::), unique-local (fc00::, fd00::), multicast (ff00::), documentation (2001:db8::)
    if (
      hostname.startsWith('fe80:') ||
      hostname.startsWith('fc') ||
      hostname.startsWith('fd') ||
      hostname.startsWith('ff') ||
      hostname.startsWith('2001:db8:') ||
      hostname.startsWith('100:')
    ) {
      return false;
    }

    // Check IPv6 mapped IPv4 (e.g. ::ffff:127.0.0.1 or 0:0:0:0:0:ffff:7f00:1)
    const ipv6MappedMatch = hostname.match(/^(?:0*:)*ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/i);
    if (ipv6MappedMatch) {
      const mappedOctets = parseIpv4ToOctets(ipv6MappedMatch[1]);
      if (mappedOctets && isPrivateOrReservedIpv4(mappedOctets)) {
        return false;
      }
    }

    // Check IPv4 forms (1-part, 2-part, 3-part, 4-part decimal, octal, hex, dword)
    const octets = parseIpv4ToOctets(hostname);
    if (octets && isPrivateOrReservedIpv4(octets)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * High-Performance Bounded In-Memory Sliding Window Rate Limiter.
 * Implements strict LRU/FIFO eviction and max-entry bounds to prevent memory exhaustion DoS attacks.
 */
interface RateLimitRecord {
  timestamps: number[];
}

export class InMemoryRateLimiter {
  private store: Map<string, RateLimitRecord> = new Map();
  private maxRequests: number;
  private windowMs: number;
  private maxEntries: number;
  private lastCleanup: number = Date.now();

  constructor(maxRequests = 5, windowMs = 60000, maxEntries = 5000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.maxEntries = maxEntries;
  }

  private cleanup() {
    const now = Date.now();
    // Run cleanup at most once every 30 seconds
    if (now - this.lastCleanup < 30000) return;
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

    // Memory protection guard: If capacity is exceeded, evict the oldest entry
    if (this.store.size >= this.maxEntries && !this.store.has(cleanId)) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey) this.store.delete(oldestKey);
    }

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

// Global subscription rate limiter instance (e.g., 5 subscription attempts per IP per 60 seconds, max 5000 tracked IPs)
export const subscribeRateLimiter = new InMemoryRateLimiter(5, 60000, 5000);

const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
const IPV6_REGEX = /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$|^::1$|^[a-fA-F0-9:]+$/;

/**
 * Extracts and validates a client IP identifier from standard proxy headers in a secure, spoof-resistant fashion.
 */
export function getClientIp(request: Request): string {
  // 1. Platform-verified Cloudflare connecting IP
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    const clean = cfConnectingIp.trim();
    if (IPV4_REGEX.test(clean) || IPV6_REGEX.test(clean)) return clean;
  }

  // 2. Vercel platform-verified client IP
  const vercelIp = request.headers.get('x-vercel-ip');
  if (vercelIp) {
    const clean = vercelIp.trim();
    if (IPV4_REGEX.test(clean) || IPV6_REGEX.test(clean)) return clean;
  }

  // 3. Fastly / Akamai / AWS True-Client-IP
  const trueClientIp = request.headers.get('true-client-ip');
  if (trueClientIp) {
    const clean = trueClientIp.trim();
    if (IPV4_REGEX.test(clean) || IPV6_REGEX.test(clean)) return clean;
  }

  // 4. Real IP
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    const clean = realIp.trim();
    if (IPV4_REGEX.test(clean) || IPV6_REGEX.test(clean)) return clean;
  }

  // 5. X-Forwarded-For (iterate to find valid IP)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map(s => s.trim());
    for (const ip of ips) {
      if (IPV4_REGEX.test(ip) || IPV6_REGEX.test(ip)) {
        return ip;
      }
    }
  }

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

/**
 * Safely sanitizes arbitrary user text before local storage or rendering.
 */
export function sanitizeUserText(text: unknown, maxLen = 1000): string {
  if (typeof text !== 'string') return '';
  return text
    .trim()
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .slice(0, maxLen);
}

/**
 * Safely writes to localStorage with automatic QuotaExceeded error handling.
 */
export function safeLocalStorageSet(key: string, value: unknown): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch {
    return false;
  }
}

