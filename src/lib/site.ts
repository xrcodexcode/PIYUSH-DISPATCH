export const siteConfig = {
  name: "PIYUSH'S DISPATCH",
  shortName: "Piyush's Dispatch",
  url: 'https://dispatch.piyush.dev',
  description:
    'Understanding the technology behind the headlines, the architecture behind the products, and the ideas behind the companies shaping the future.',
  author: {
    name: 'Piyush',
    handle: 'PiyushPal143104',
    sameAs: [
      'https://x.com/PiyushPal143104',
      'https://github.com/xrcodexcode',
      'https://www.linkedin.com/in/xrcodex/',
    ],
  },
  contactEmail: 'xrpiyushh@gmail.com',
  defaultImage: '/assets/issue-6/9.jpg',
};

export function absoluteUrl(pathname: string = '/') {
  return new URL(pathname, siteConfig.url).toString();
}

export function safeJsonLd(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

