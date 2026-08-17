---
title: GEMINI.md — Piyush's Dispatch Governance & Operating Guide
type: governance-rule
status: active
version: 2.3.0
last_reviewed: 2026-08-17
approved_by: publication-owner
change_reason: "Updated with 16-theme support (9 AMOLED Pure Black + 7 Editorial), high-res editorial JPG imagery standard prohibiting crude ASCII/Mermaid pipeline diagrams, and keyboard-stepped reading focus ruler."
deprecation_date: null
---

# GEMINI.md — Piyush's Dispatch Operating Guide

This is the canonical governance operating guide for AI agents and developer automations working inside **Piyush's Dispatch** (`C:\Users\offic\OneDrive\Desktop\newsletter`).

The publication is a **premium independent newsletter & permanent long-form technical archive** built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, marked MDX rendering, 16 themes (including 9 AMOLED Pure Black themes), and left-sidebar sticky navigation.

---

## 1. Core Objectives & Non-Negotiable Invariants

1. **Reading-First Architecture**: Every feature, layout change, or typography rule must prioritize high-legibility long-form reading.
2. **Zero Data Loss**: Never delete, overwrite, or corrupt authentic issue content (`content/issues/*.mdx`) or user assets without explicit backup and user consent.
3. **Badge Naming Standard**: Issue numbers across all cards, headers, navigation, and badges MUST use the canonical format: `The Daily Nodes #001`, `The Daily Nodes #002`, `The Daily Nodes #003`, ..., `The Daily Nodes #007`. All 7 dispatches are classified as `daily-node`.
4. **JPG Image Asset Standard**: All issue hero and inline illustration assets must strictly use **JPG (`.jpg`) format** stored in normalized directories (`public/assets/daily-node-N/`, `public/assets/deep-node-N/`, and `public/assets/issue-N/`).
5. **No ASCII / Mermaid Pipeline Diagrams in Dispatches**: Crude ASCII box/arrow charts and Mermaid diagrams must never be embedded in dispatch MDX content. Complex workflows must be communicated through high-resolution editorial JPG imagery or clean typographic callouts and structured step lists.
6. **Link & Asset Integrity**: Every link (internal navigation, source references, TOC anchors) and image asset path (`/assets/...`) must resolve cleanly. Never introduce dummy `#` links.
7. **Theme Discipline**: All UI components must use CSS custom properties (`var(--bg)`, `var(--text-primary)`, `var(--accent)`, `var(--border-color)`, `var(--surface)`) to guarantee compatibility across all 16 themes (7 Editorial + 9 AMOLED Pure Black `#000000` themes).
8. **Left Sidebar Sticky Layout**: The Table of Contents and Share Actions sidebar lives on the **left side** of the article layout and remains permanently accessible while reading.
9. **Sources & Provenance**: Every dispatch must include the exact Substack post URL (`https://xrcodex.substack.com/p/...`) and `node-wiki (My Knowledge Base)`.
10. **Compilation Verification**: Never declare a task resolved without running `npx tsc --noEmit` and verifying `npm run build` static generation.

---

## 2. Platform Architecture & Directory Map

```text
C:\Users\offic\OneDrive\Desktop\newsletter\
├── content\issues\       # Authentic MDX newsletter issue content (DAILY-NODES #001 to #007)
├── public\
│   └── assets\           # JPG image assets for issues (/assets/daily-node-7/*.jpg, /assets/issue-7/*.jpg)
├── src\
│   ├── app\              # Next.js 15 App Router pages & layouts
│   │   ├── globals.css   # 15-theme CSS variables & GPU hardware acceleration
│   │   ├── page.tsx      # Streamlined Homepage (Hero, Today's Issue, Archive, Subscribe)
│   │   ├── issues\       # Issue reader (`[slug]/page.tsx`) & archive routes
│   │   ├── topics\       # Topic directory routes
│   │   ├── search\       # Search route with useDeferredValue
│   │   ├── subscribe\    # Subscription route
│   │   └── about\        # About author page
│   ├── components\       # Modular UI components (Header, Footer, ArticleTOC, ShareActions, SourceList, MDXContent)
│   ├── lib\              # O(1) Hash map slug index, marked renderer, site config
│   └── types\            # TypeScript definitions (Issue, Topic, Source, Heading)
├── scripts\              # Substack sync, link audit, node-wiki, and renumbering utility scripts
├── memory.md             # Operational Memory & Performance Architecture Vault
├── GEMINI.md             # Governance Operating Contract (this file)
└── AGENT.md              # Agent Operating Instructions
```

---

## 3. Maintenance & Verification Checklist

Before completing any task:
1. Run `npx tsc --noEmit` ➔ 0 errors required.
2. Run `node scripts/audit-links.js` ➔ 0 broken/dummy links required.
3. Run `npm run build` ➔ 36 static pages prerendered successfully in ~3 seconds.
4. Ensure dev server runs cleanly on `http://localhost:3000`.
