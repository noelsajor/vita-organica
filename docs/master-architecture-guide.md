# Master Architecture Guide

This blueprint documents the routing map, styling strategy, and architectural design of the Agency Master Operation Template. Future developers and AI assistants should refer to this guide to understand the codebase structure without confusion.

## 1. Purpose & Optimal Use Cases

**Purpose:** 
This template serves as an "Agency Master" — a robust, highly-documented, and fully automated foundation designed to be cloned instantly for new client deployments. It eliminates the repetitive setup phase of an agency workflow, guaranteeing that every new project starts with 100% compliance to SEO, accessibility, and performance best practices.

**Optimized Use Cases:**
*   **High-Converting Marketing Sites:** Specifically tailored for B2B or B2C brands that require lightning-fast landing pages, lead funnels, and optimized forms.
*   **Content-Heavy Platforms:** Pre-configured for Sanity headless CMS integration, making it ideal for blogs, case study portfolios, and resource centers.
*   **Performance-Critical SEO:** Uses Astro Static Site Generation to guarantee near-perfect Lighthouse scores and immediate indexing without heavy JavaScript bloat.

## 2. Technology Stack
*   **Core Framework**: Astro (v6.x) with SSG (Static Site Generation)
*   **UI Components**: React (v19.x) integrated via `@astrojs/react` for interactive UI Islands.
*   **CMS / Data layer**: Sanity with `groq` queries mapping to Astro content.
*   **Icons**: Lucide React.
*   **CSS**: Vanilla CSS utilizing robust CSS Variables for a highly flexible design system.

## 3. Directory Structure & Routing

This template uses Astro's file-based routing system.

### `src/pages/`
*Every `.astro` file inside this directory translates directly to a public, optimized HTML route.*
- **`index.astro`**: The main landing page.
- *(Add any dynamic routes like `blog/[slug].astro` as they are created)*

### `src/components/`
*Houses our reusable, modular UI logic.*
- **React Components (`.tsx`)**: Used for interactive sections, typically hydrated on the client via `client:load` or `client:idle`.
- **Astro Components (`.astro`)**: Used for static UI elements that don't need client-side JavaScript.

### `src/layouts/`
*Global wrapper components used by pages to ensure consistent framing and `<head>` data.*
- **`Layout.astro` or `BaseLayout.astro`**: Defines the document shell (`<html>`, `<head>`, `<body>`), global metadata, and imports the global stylesheet.

## 4. The Design System & Styling (CSS)

We avoid ad-hoc styling and Tailwind by strictly following a Vanilla CSS custom property (variable) system.

**Location of Truth:**
Global variables are defined at the root in `styles.css` (and/or `src/styles/global.css`).

**How to Scale Styles:**
1. **Colors**: All colors operate on variables (`--color-ink`, `--color-magenta`, `--color-green`). Never hardcode hex codes in components.
2. **Typography**: Fonts scale uniformly using `var(--text-xs)` through `var(--text-6xl)`.
3. **Spacing**: Adhere strictly to the spacing scale (`var(--sp-1)` to `var(--sp-32)`).
4. **Responsive Strategy**: Breakpoints are defined in media queries at the root CSS level, cascading variable changes (e.g., re-assigning `--text-6xl` size at `--max-width: 768px`).

## 5. CMS (Sanity) Integration

Data fetching occurs server-side inside the standard Astro frontmatter (`---`).
1. **Client Setup:** Sanity configuration logic resides in `src/lib/` or `src/sanity/`.
2. **Querying:** Use `groq` to query Sanity inside an `.astro` page's frontmatter.
3. **Schema (Current State):** *Note:* As of V1, Sanity schemas are managed externally or will be implemented via dedicated backend deployments. The `.env` variables `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` must map correctly.

## 6. Build & Deployment Rules

*   **Build Command**: `astro build` exports a purely static site to the `/dist` directory.
*   **Hosting**: The project is optimized for deployment via Vercel or similar static hosting. `astro.config.mjs` is set to `output: 'static'`.
*   **Sitemaps**: Powered dynamically by `@astrojs/sitemap`. Make sure the `site` property in `astro.config.mjs` accurately matches the live production domain for SEO validation.
