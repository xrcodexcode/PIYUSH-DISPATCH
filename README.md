# 📰 Piyush's Dispatch (`DAILY-NODES`)

> **A Reading-First Independent Technical Newsletter & Permanent Long-Form Technical Archive**

![Next.js](https://img.shields.io/badge/Next.js-16.3%2B-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=flat-square&logo=tailwindcss)
![Themes](https://img.shields.io/badge/Themes-16_Variants-purple?style=flat-square)
![Static Build](https://img.shields.io/badge/Static_Prerender-56_Pages-emerald?style=flat-square)

---

## 🌟 Overview

**Piyush's Dispatch** is a high-performance, reading-focused technical newsletter and permanent archive platform. Built around deep-dive topics in **AI Systems**, **Agentic AI**, **Context Engineering**, **Graph Engineering**, and **Retrieval-Augmented Generation (RAG)**, it combines editorial typography with modern web performance standards.

The application leverages **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, an in-memory cached **MDX compiler engine**, and a dynamic **16-theme engine** (featuring 9 AMOLED `#000000` Pure Black dark modes).

---

## ✨ Core Features

### 📖 Reading-First Experience
- **Autohiding Left TOC**: Table of Contents sidebar situated on the left side of articles that collapses (`opacity-0 pointer-events-none -translate-x-8`) on downward scroll and reveals smoothly on hover or upward scroll.
- **Reader Customizer**: Granular control over reading width (Standard/Wide), typeface (Sans, Serif, Mono), and text size explicitly optimized for long-form reading.
- **Reading Focus Ruler**: A fully keyboard-navigable focus ruler that gracefully steps line-by-line while automatically dodging image and media assets to maintain uninterrupted immersion.
- **Zero-Distraction Layout**: Optimized line lengths, fluid typography, readable font hierarchies, and responsive containers designed specifically for deep reading.

### 🎨 16 Theme Engine
- **7 Editorial Themes**: Designed for diverse reading environments (`light`, `dark`, `midnight`, `forest`, `nordic`, `espresso`, `crimson`).
- **9 AMOLED Pure Black (`#000000`) Themes**: Optimized for OLED displays (`amoled-dark`, `amoled-paper`, `amoled-obsidian`, `amoled-matcha`, `amoled-cyber`, `amoled-espresso`, `amoled-crimson`, `amoled-forest`, `amoled-nordic`).
- **CSS Custom Property Design System**: Standardized CSS variables (`var(--bg)`, `var(--text-primary)`, `var(--accent)`, `var(--border-color)`, `var(--surface)`) ensuring seamless instantaneous switching without flash of unstyled content (FOUC).

### 🏷️ Badge Naming Standardization
- Standardized issue format across all cards, navigation headers, article readers, and metadata: `The Daily Nodes #001`, `The Daily Nodes #002`, `The Daily Nodes #003`, etc.
- Distinct namespaces for `daily-node` and `deep-node` dispatches.

### ⚡ Fast MDX Content Compiler
- MDX parsing via `marked` and `gray-matter` with an efficient 10-second in-memory cache strategy.
- High-fidelity visual standards requiring 3D cinematic JPG imagery (strict exclusion of crude ASCII/Mermaid pipeline diagrams).
- Pre-rendered static generation (`next build`) delivering instant page transitions and sub-millisecond reader loading.

### 🔍 Interactive Search & Navigation
- Real-time client-side search powered by React 19 `useDeferredValue` filtering titles, subtitles, excerpts, content, topics, and tags without UI blocking.
- Topic and tag classification index pages with curated metadata.

### 🛡️ Link & Source Integrity
- Automated audit tools ensuring 100% link resolution across internal anchors, topic links, and source citations.
- Normalized asset architectures mapping `public/assets/daily-node-N/` gracefully into runtime resolution.

---

## 🛠️ Tech Stack & Dependencies

| Category | Technology / Library |
| :--- | :--- |
| **Framework** | [Next.js 16.3](https://nextjs.org/) (App Router) |
| **UI Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + PostCSS |
| **Content Processing** | `marked`, `gray-matter` |
| **Class Utilities** | `clsx`, `tailwind-merge` |
| **Tooling** | ESLint 9, Node.js, `ts-node` |

---

## 📁 Project Architecture

```text
newsletter/
├── content/
│   └── issues/            # Authentic MDX newsletter issues (001 to 014)
├── public/
│   └── assets/            # Issue hero images & illustrations (/assets/daily-node-N/)
├── src/
│   ├── app/               # Next.js App Router routes & layouts
│   │   ├── globals.css    # 16-Theme CSS variables & base typography
│   │   ├── page.tsx       # Homepage (Hero, Today's Issue, Archive, Newsletter Form)
│   │   ├── issues/        # Issue Reader ([slug]/page.tsx) & Archive index
│   │   ├── topics/        # Topic classification directory
│   │   ├── search/        # Instant search page (useDeferredValue)
│   │   ├── subscribe/     # Newsletter subscription workflow
│   │   └── about/         # Author & publication background
│   ├── components/        # UI Components (Header, Footer, ArticleTOC, MDXContent, etc.)
│   ├── lib/               # Content compiler, 10s caching loader, marked renderer
│   └── types/             # TypeScript interfaces (Issue, Topic, Source, Heading)
├── scripts/               # Maintenance, link auditing, and vault import scripts
│   ├── audit-links.js     # Validates internal links & source URL resolution
│   ├── renumber-issues.js # Enforces DAILY-NODES badge naming standard
│   ├── import-content.ts  # CLI importer for new Markdown/MDX notes
│   ├── fix-sources-links.js # Source citation link repair utility
│   └── delete-sample-issues.js # Workspace cleanup helper
├── GEMINI.md              # Governance & Operating Contract
└── AGENTS.md              # Agent Operating Directives
```

---

## 📝 MDX Frontmatter Contract

Every newsletter issue in `content/issues/` adheres to Frontmatter Schema v1:

```yaml
---
issueNumber: 6
date: "2026-08-09"
title: "Graph Engineering — Beyond Single AI Loops"
subtitle: "Why the best AI systems don't rely on a single agent running in circles."
excerpt: "A deep dive into connected node/edge workflows."
heroImage: "/assets/issue-6/9.jpg"
nodeType: daily-node
topics:
  - AI
  - Agentic AI
  - Graph Engineering
tags:
  - ai
  - agentic-ai
sources:
  - title: "Graph AI Research"
    publisher: "Google Research"
    date: "2026-08-09"
    url: "https://ai.google/research"
relatedIssues: []
published: true
---
```

---

## 🎨 Theme Matrix

| Theme Identifier | Visual Profile | Accent Color | Mode Type |
| :--- | :--- | :--- | :--- |
| `light` | Crisp White Background | Clean Navy / Blue | Light |
| `dark` | Deep Slate Grey | Cyan Accent | Dark |
| `midnight` | Deep Navy Night | Sky Blue | Dark |
| `forest` | Deep Sage Green | Emerald Accent | Dark |
| `nordic` | Polar Ice Tint | Ice Blue | Dark |
| `espresso` | Warm Roasted Coffee | Caramel / Bronze | Dark |
| `crimson` | Dark Burgundy Wine | Rose / Crimson | Dark |
| `amoled-dark` | Deep True Black | Cobalt Blue | **AMOLED Pure Black (`#000000`)** |
| `amoled-paper` | Warm Amber Parchment Text | Amber Gold | **AMOLED Pure Black (`#000000`)** |
| `amoled-obsidian` | Crisp White Text | Sky Blue | **AMOLED Pure Black (`#000000`)** |
| `amoled-matcha` | Mint Sage Text | Emerald Green | **AMOLED Pure Black (`#000000`)** |
| `amoled-cyber` | Rose Pink Text | Neon Pink | **AMOLED Pure Black (`#000000`)** |
| `amoled-espresso` | Latte Cream Text | Warm Bronze | **AMOLED Pure Black (`#000000`)** |
| `amoled-crimson` | Rose Silver Text | Crimson Red | **AMOLED Pure Black (`#000000`)** |
| `amoled-forest` | Pale Sage Text | Gold Amber | **AMOLED Pure Black (`#000000`)** |
| `amoled-nordic` | Ice Blue Text | Polar Cyan | **AMOLED Pure Black (`#000000`)** |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/xrcodexcode/PIYUSH-S-DISPATCH.git
cd newsletter
npm install
```

### 3. Development Server
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build & Static Export
Verify TypeScript types, linting, and build the optimized production output (56 pages):
```bash
npx tsc --noEmit
npx eslint src/
npm run build
```

### 5. Content & Maintenance Scripts
- **Audit Links**:
  ```bash
  node scripts/audit-links.js
  ```
- **Renumber Issues**:
  ```bash
  node scripts/renumber-issues.js
  ```
- **Import Content**:
  ```bash
  npm run import
  ```

---

## 📋 Quality & Verification Checklist

Before deploying or committing changes:
- [x] **TypeScript Check**: `npx tsc --noEmit` passes with 0 errors.
- [x] **Lint Check**: `npx eslint src/` passes with 0 errors and 0 warnings.
- [x] **Link Audit**: `node scripts/audit-links.js` validates 0 broken or dummy links.
- [x] **Static Generation**: `npm run build` succeeds and prerenders all pages cleanly.
- [x] **Badge Standards**: All references match canonical `The Daily Nodes #XXX` format.
- [x] **Theme Verification**: Components use `var(--...)` custom properties without fixed hardcoded colors.
