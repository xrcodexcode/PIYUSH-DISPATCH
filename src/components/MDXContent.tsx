import React from 'react';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { slugify } from '@/lib/utils';
import { isSafeUrl, sanitizeUrl, escapeHtml } from '@/lib/security';

interface MDXContentProps {
  content: string;
}

const renderer = new marked.Renderer();
const renderedContentCache = new Map<string, string>();

const headingCounters = new Map<string, number>();

// Custom heading renderer for TOC anchor scrolling
renderer.heading = function({ tokens, depth }) {
  const text = this.parser.parseInline(tokens);
  const rawText = tokens.map(t => t.raw || '').join('');
  const cleanText = (rawText || text).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_~`]/g, '').trim();
  const baseId = slugify(cleanText);
  const count = headingCounters.get(baseId) || 0;
  const id = count === 0 ? baseId : `${baseId}-${count}`;
  headingCounters.set(baseId, count + 1);

  if (depth === 2) {
    return `<h2 id="${id}" class="scroll-mt-28 border-b border-[var(--border-color)] pb-2 text-2xl md:text-3xl font-bold mt-10 mb-4 text-[var(--text-primary)]">${text}</h2>`;
  }
  if (depth === 3) {
    return `<h3 id="${id}" class="scroll-mt-28 text-xl md:text-2xl font-bold mt-8 mb-3 text-[var(--text-primary)]">${text}</h3>`;
  }
  if (depth === 1) {
    return `<h1 id="${id}" class="text-3xl md:text-5xl font-bold mt-8 mb-4 text-[var(--text-primary)]">${text}</h1>`;
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

// Custom image renderer with seamless edge-to-edge styling (no side bezels or black borders)
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
        width="1920"
        height="1080"
        class="w-full h-auto rounded-2xl shadow-xl border border-[var(--border-color)] object-cover block mx-auto transition-transform duration-300 hover:scale-[1.008]" 
      />
      ${caption ? `
        <figcaption class="mt-3 text-center text-xs font-mono text-[var(--text-secondary)] italic">
          ${safeCaption}
        </figcaption>
      ` : ''}
    </figure>
  `;
};

const RESERVED_DOM_IDS = new Set([
  'location', 'document', 'window', 'localstorage', 'sessionstorage', 'fetch',
  'top', 'parent', 'opener', 'self', 'cookie', 'navigator', 'eval', 'alert',
  'history', 'name', 'origin', 'status', 'event', 'body', 'head', 'defaultview'
]);

marked.use({ renderer, gfm: true, breaks: false });

function sanitizeHtmlOutput(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
      'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
      'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe',
      'img', 'figure', 'figcaption', 'span'
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel', 'title'],
      img: ['src', 'alt', 'width', 'height', 'loading', 'decoding', 'class'],
      iframe: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen'],
      '*': ['class', 'id']
    },
    transformTags: {
      a: (tagName, attribs) => {
        const href = (attribs.href || '').trim();
        const isExternal = href.startsWith('http://') || href.startsWith('https://');
        const safeAttribs = { ...attribs };
        if (safeAttribs.id && RESERVED_DOM_IDS.has(safeAttribs.id.toLowerCase())) {
          safeAttribs.id = `section-${safeAttribs.id}`;
        }
        if (isExternal) {
          safeAttribs.target = '_blank';
          safeAttribs.rel = 'noopener noreferrer';
        }
        return { tagName: 'a', attribs: safeAttribs };
      },
      '*': (tagName, attribs) => {
        const safeAttribs = { ...attribs };
        if (safeAttribs.id && RESERVED_DOM_IDS.has(safeAttribs.id.toLowerCase())) {
          safeAttribs.id = `section-${safeAttribs.id}`;
        }
        return { tagName, attribs: safeAttribs };
      },
    },
    allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com', 'xrcodex.substack.com'],
    allowIframeRelativeUrls: false,
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'data']
    },
    allowProtocolRelative: false,
  });
}

const MAX_CACHE_SIZE = 100;

export function MDXContent({ content }: MDXContentProps) {
  const source = content || '';
  let htmlContent = renderedContentCache.get(source);
  if (htmlContent === undefined) {
    headingCounters.clear();
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

