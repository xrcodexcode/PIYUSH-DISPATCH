# Product Documentation

## Overview
The **Newsletter** application is a Next.js-based web platform designed for publishing, archiving, and managing newsletter content.

## Key Features
- **Content Import & Processing**: Utility scripts (`import-content.ts`) to ingest external or static content into the application.
- **Substack Integration**: Synchronization script (`sync-substack.js`) to pull and sync articles directly from Substack feeds.
- **Markdown Rendering**: Article posts parsed via `gray-matter` and rendered using `marked`.
- **Modern UI**: Styled with Tailwind CSS v4 and responsive UI components.

## Target Audience
- Newsletter creators and curators looking for a custom web presence.
- Readers seeking an organized archive of articles and posts.

## Development Roadmap
- [ ] Enhancing Substack sync automation and scheduling.
- [ ] Improved search and categorization across archived issues.
- [ ] Newsletter subscription and email delivery integrations.
