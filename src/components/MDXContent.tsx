import React from 'react';
import { marked } from 'marked';
import { slugify } from '@/lib/utils';
import { isSafeUrl, sanitizeUrl, escapeHtml } from '@/lib/security';

interface MDXContentProps {
  content: string;
}

const renderer = new marked.Renderer();
const renderedContentCache = new Map<string, string>();

// Custom heading renderer for TOC anchor scrolling
renderer.heading = function({ tokens, depth }) {
  const text = this.parser.parseInline(tokens);
  const rawText = tokens.map(t => t.raw || '').join('');
  const id = slugify(rawText || text);

  if (depth === 2) {
    return `<h2 id="${id}" class="scroll-mt-28 border-b border-[var(--border-color)] pb-2 font-serif text-2xl md:text-3xl font-bold mt-10 mb-4 text-[var(--text-primary)]">${text}</h2>`;
  }
  if (depth === 3) {
    return `<h3 id="${id}" class="scroll-mt-28 font-serif text-xl md:text-2xl font-bold mt-8 mb-3 text-[var(--text-primary)]">${text}</h3>`;
  }
  if (depth === 1) {
    return `<h1 id="${id}" class="font-serif text-3xl md:text-5xl font-bold mt-8 mb-4 text-[var(--text-primary)]">${text}</h1>`;
  }
  return `<h${depth} id="${id}">${text}</h${depth}>`;
};

// Custom link renderer with strict XSS protocol protection and automatic noopener noreferrer for external URLs
renderer.link = function({ href, title, tokens }) {
  const text = this.parser.parseInline(tokens);
  const rawHref = href || '';

  // Block unsafe protocols (javascript:, vbscript:, data:text/html, etc.)
  if (!isSafeUrl(rawHref)) {
    return `<span>${text}</span>`;
  }

  const safeHref = sanitizeUrl(rawHref, '/');
  const isExternal = safeHref.startsWith('http://') || safeHref.startsWith('https://');
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
  const externalAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';

  return `<a href="${escapeHtml(safeHref)}"${titleAttr}${externalAttrs} class="text-[var(--accent)] hover:underline font-medium">${text}</a>`;
};

// Custom image renderer with reliable path normalization and smooth fade-in styling
renderer.image = function({ href, title, text }) {
  let cleanSrc = href || '';
  
  if (cleanSrc.startsWith('./assets/')) {
    cleanSrc = cleanSrc.replace('./assets/', '/assets/');
  } else if (cleanSrc.startsWith('assets/')) {
    cleanSrc = '/' + cleanSrc;
  }

  // Handle URL paths for issue asset folders (issue#1 -> issue-1)
  cleanSrc = cleanSrc.replace(/\/issue(%23|#)/gi, '/issue-');

  // Verify safe image URL
  if (!isSafeUrl(cleanSrc, ['http:', 'https:', 'data:'])) {
    return '';
  }

  const caption = text || title || '';
  const safeCaption = escapeHtml(caption);
  const safeSrc = escapeHtml(cleanSrc);

  return `
    <figure class="my-8 text-center non-reading-ui-wrapper">
      <img 
        src="${safeSrc}" 
        alt="${safeCaption}" 
        loading="lazy" 
        decoding="async"
        width="1376"
        height="768"
        style="aspect-ratio: 16 / 9;"
        class="rounded-2xl border border-[var(--border-color)] shadow-lg w-full max-w-4xl mx-auto object-cover bg-[var(--surface)] transition-transform duration-300 hover:scale-[1.01]" 
      />
      ${caption ? `<figcaption class="mt-2.5 text-center text-xs font-mono text-[var(--text-secondary)] italic">${safeCaption}</figcaption>` : ''}
    </figure>
  `;
};

marked.use({ renderer, gfm: true, breaks: false });

/**
 * Sanitizes rendered HTML by removing forbidden elements (<script>, <iframe>, <style>, etc.)
 * and removing inline event handlers (onerror=, onload=, onclick=, etc.).
 */
function sanitizeHtmlOutput(html: string): string {
  return html
    // Strip forbidden tag blocks
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, '')
    .replace(/<base\b[^>]*>/gi, '')
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
    // Strip inline event handlers (on* attributes)
    .replace(/\s+on[a-zA-Z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    // Strip javascript: in any remaining attribute
    .replace(/href\s*=\s*["']\s*javascript:[^"']*["']/gi, 'href=""')
    .replace(/src\s*=\s*["']\s*javascript:[^"']*["']/gi, 'src=""');
}

const MAX_CACHE_SIZE = 100;

export function MDXContent({ content }: MDXContentProps) {
  const source = content || '';
  let htmlContent = renderedContentCache.get(source);
  if (htmlContent === undefined) {
    const rawParsed = marked.parse(source) as string;
    htmlContent = sanitizeHtmlOutput(rawParsed);
    if (renderedContentCache.size >= MAX_CACHE_SIZE) {
      const firstKey = renderedContentCache.keys().next().value;
      if (firstKey) renderedContentCache.delete(firstKey);
    }
    renderedContentCache.set(source, htmlContent);
  }

  return (
    <div 
      className="prose prose-lg max-w-none text-[var(--text-primary)] leading-relaxed"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

export default MDXContent;

