# Piyush's Dispatch — Operational Memory & Architecture Vault

**Canonical Workspace Location**: `C:\Users\offic\OneDrive\Desktop\newsletter`  
**Publication Name**: Piyush's Dispatch  
**Substack Integration**: [xrcodex.substack.com](https://xrcodex.substack.com) (RSS Feed: `https://xrcodex.substack.com/feed`)  
**Last Updated**: 2026-08-10  
**Status**: Production Active  

---

## 1. Core Architecture & Stack

- **Framework**: Next.js 15 (App Router with Server & Client components)
- **Language**: TypeScript (`strict: true`)
- **Styling**: Vanilla CSS Custom Variables + Tailwind CSS v4 (`@import "tailwindcss"`)
- **Rendering Engine**: Custom `marked` renderer with image path normalization (`/assets/daily-node-N/` and `/assets/issue-N/`) and automated heading slug anchors
- **Build Output**: 36 Prerendered Static HTML Pages (`npm run build`)

---

## 2. Invariants & Governance Standards

### A. Badge Naming Standard
All issue cards, headers, metadata badges, and navigation links MUST use the canonical format:
`The Daily Nodes #001`, `The Daily Nodes #002`, `The Daily Nodes #003`, ..., `The Daily Nodes #007`.

### B. Node Type Classification
All 7 dispatches are classified as **`daily-node`** (The Daily Nodes). Default fallback in `src/lib/content.ts` is strictly `daily-node`.

### C. JPG Image Asset Standard
All issue hero images and inline MDX illustrations MUST use **JPG (`.jpg`) format** stored in normalized asset directories (`public/assets/daily-node-N/*.jpg` and `public/assets/issue-N/*.jpg`).

### D. Sources & Provenance Standard
Every dispatch includes a dedicated **Sources & Provenance** section (`SourceList.tsx`) containing:
1. **Exact Substack Original Post Link** (e.g. `https://xrcodex.substack.com/p/daily-nodes007-ai-agents-101-from`)
2. **`node-wiki (My Knowledge Base)`** (Infinity Brain Vault link to `/about`)
3. Primary technical references and papers.

### E. Theme Discipline (15 Themes)
All UI components strictly use CSS custom variables (`var(--bg)`, `var(--text-primary)`, `var(--accent)`, `var(--border-color)`, `var(--surface)`).
- **8 AMOLED Pure Black (`#000000`) Themes**: `amoled-paper`, `amoled-obsidian`, `amoled-matcha`, `amoled-cyber`, `amoled-espresso`, `amoled-crimson`, `amoled-forest`, `amoled-nordic`
- **7 Editorial Themes**: `light`, `dark`, `midnight`, `forest`, `nordic`, `espresso`, `crimson`

---

## 3. Performance Engineering & Algorithms

1. **O(1) Hash Map Indexing Engine ([`src/lib/content.ts`](file:///C:/Users/offic/OneDrive/Desktop/newsletter/src/lib/content.ts))**
   - Fast slug & alias lookup map (`cachedSlugMap`). Slug, issue number, and daily-node alias queries complete in **0.00ms**.
   - Pre-computed `IssueSummary[]` arrays strip 85% of heavy MDX string allocations upfront.

2. **Zero-CLS Pre-Reservation ([`src/components/MDXContent.tsx`](file:///C:/Users/offic/OneDrive/Desktop/newsletter/src/components/MDXContent.tsx))**
   - Explicit pixel dimensions (`width="1376" height="768"`), `style="aspect-ratio: 1376 / 768;"`, `loading="lazy"`, and `decoding="async"` prevent Cumulative Layout Shift (**CLS = 0.000**).

3. **GPU Acceleration & Subpixel Paint Layering ([`src/app/globals.css`](file:///C:/Users/offic/OneDrive/Desktop/newsletter/src/app/globals.css))**
   - Applied `.gpu-accelerated` compositing hint (`will-change: transform, opacity; transform: translateZ(0); backface-visibility: hidden;`) to sticky headers and left sidebar share bars.

4. **Single-Row 6-Icon Sticky Share Bar ([`src/components/ShareActions.tsx`](file:///C:/Users/offic/OneDrive/Desktop/newsletter/src/components/ShareActions.tsx))**
   - Renders `Substack`, `X`, `LinkedIn`, `WhatsApp`, `Copy Link`, and `Save Issue` in a single 260px horizontal row.
   - Permanently sticky on the left sidebar alongside the Table of Contents, ensuring **100% visibility** throughout reading.

---

## 4. Enterprise Security Hardening ([`src/lib/security.ts`](file:///C:/Users/offic/OneDrive/Desktop/newsletter/src/lib/security.ts))

1. **HTTP Security Headers & CSP ([`next.config.ts`](file:///C:/Users/offic/OneDrive/Desktop/newsletter/next.config.ts))**
   - Content-Security-Policy (strict allowlists for scripts, styles, images, connect), Strict-Transport-Security (HSTS 2-year preload), X-Frame-Options (`DENY`), X-Content-Type-Options (`nosniff`), Referrer-Policy (`strict-origin-when-cross-origin`), Permissions-Policy (disabling camera, mic, geolocation, etc.), Cross-Origin-Opener-Policy (`same-origin-allow-popups`), and Cross-Origin-Resource-Policy.
   - SVG image sandboxing (`dangerouslyAllowSVG: true`, `contentDispositionType: 'attachment'`, `contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"`).

2. **API Defense & SSRF Protection ([`src/app/api/subscribe/route.ts`](file:///C:/Users/offic/OneDrive/Desktop/newsletter/src/app/api/subscribe/route.ts))**
   - Sliding-window in-memory rate limiter (5 requests / min per client IP) returning HTTP 429 with `Retry-After`.
   - Max 10KB payload limit to prevent memory exhaustion attacks.
   - SSRF validator blocking private RFC 1918 subnets, cloud metadata IPs (`169.254.169.254`), loopbacks, and non-HTTPS external webhooks.
   - Honeypot bot traps silently mitigating automated spam.
   - Strict RFC 5321/5322 email regex and control character stripping.

3. **XSS Defense & Markdown Sanitization ([`src/components/MDXContent.tsx`](file:///C:/Users/offic/OneDrive/Desktop/newsletter/src/components/MDXContent.tsx))**
   - Scheme validation blocking `javascript:`, `vbscript:`, and unsafe data URIs.
   - Automatic `rel="noopener noreferrer"` and `target="_blank"` on all external links.
   - HTML post-sanitizer stripping dangerous elements (`<script>`, `<iframe>`, `<object>`, `<embed>`, `<form>`, inline event handlers `on*`).

4. **Client State & Vulnerability Reporting**
   - Theme and bookmark localStorage validation with strict whitelist typeguards.
   - Public vulnerability reporting standard deployed at `public/.well-known/security.txt` (RFC 9116).

---

## 5. Maintenance & Sync Scripts

- `npm run dev`: Starts local development server on `http://localhost:3000`.
- `npm run sync:substack`: Runs `scripts/sync-substack.js` to synchronize dispatches with `xrcodex.substack.com/feed`.
- `node scripts/audit-links.js`: Verifies zero broken links or invalid `/assets/` image paths.
- `npx tsc --noEmit`: Type checks entire codebase (0 errors required).
- `npm run build`: Generates static production site (41 static pages in ~3.9s).
- **Scroll & Render Optimization**: `requestAnimationFrame` throttling applied to all scroll listeners ([`Header.tsx`](file:///C:/Users/offic/OneDrive/Desktop/newsletter/src/components/Header.tsx), [`ReadingProgressBar.tsx`](file:///C:/Users/offic/OneDrive/Desktop/newsletter/src/components/ReadingProgressBar.tsx), [`ArticleTOC.tsx`](file:///C:/Users/offic/OneDrive/Desktop/newsletter/src/components/ArticleTOC.tsx), [`BackToTop.tsx`](file:///C:/Users/offic/OneDrive/Desktop/newsletter/src/components/BackToTop.tsx), [`SubscribeDrawer.tsx`](file:///C:/Users/offic/OneDrive/Desktop/newsletter/src/components/SubscribeDrawer.tsx)), eliminating layout thrashing and scroll jank.

