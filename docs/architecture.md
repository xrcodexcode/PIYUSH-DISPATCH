# Architecture Documentation

## System Overview
The application is built on **Next.js 16** (App Router) with **React 19** and **TypeScript**, leveraging static rendering and server components for fast content delivery.

## Tech Stack
- **Framework**: Next.js 16, React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4, `clsx`, `tailwind-merge`
- **Content Parsing**: `gray-matter`, `marked`
- **Automation Scripts**: Node.js, `ts-node`

## Project Directory Structure
```
newsletter/
├── docs/                # Product & Architecture documentation
│   ├── product.md
│   └── architecture.md
├── scripts/             # Data import and synchronization scripts
│   ├── import-content.ts
│   └── sync-substack.js
├── public/              # Static assets
├── package.json         # Dependencies and project scripts
└── tsconfig.json        # TypeScript configuration
```

## Data Flow & Pipelines
1. **Substack Sync Pipeline**: `scripts/sync-substack.js` fetches posts/metadata from Substack and converts them for local store/rendering.
2. **Content Import Pipeline**: `scripts/import-content.ts` parses raw content/markdown into structured data using `gray-matter`.
3. **Rendering Pipeline**: Next.js pages ingest parsed markdown and render HTML dynamically via `marked`.
