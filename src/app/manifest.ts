import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PIYUSH'S DISPATCH — Ideas, Analysis & Daily Intelligence",
    short_name: "Piyush's Dispatch",
    description: 'Understanding the technology behind the headlines, the architecture behind the products, and the ideas behind the companies shaping the future.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
