# SEO & GEO (Generative Engine Optimization) Guidelines

## 1. Core SEO Requirements
*   **Unique Titles & Descriptions:** Every route (`src/pages/*.astro`) must output a unique `<title>` and `<meta name="description">` within its `<head>`.
*   **Canonical URLs:** A primary canonical URL must exist on every page to prevent duplicate content indexing. Use Astro's `Astro.url` to dynamically generate self-referencing canonicals.
*   **Sitemap & Robots.txt:** The project uses `@astrojs/sitemap`. Ensure `astro.config.mjs` defines the `site` property correctly. A robust `public/robots.txt` must always be present.

## 2. Meta Tags & Open Graph
Pages must include robust social sharing cards:
*   `og:title` and `og:description`
*   `og:image` (Min 1200x630px, compressed WebP or JPEG)
*   `twitter:card` (Use `summary_large_image`)

## 3. Generative Engine Optimization (GEO)
To ensure AI Overviews (Google) and Copilot can summarize content accurately:
*   **Semantic HTML:** Strict adherence to `<header>`, `<body>`, `<main>`, `<article>`, `<section>`, and `<footer>`.
*   **Heading Hierarchy:** Strictly one `<h1>` per page. `<h2>` through `<h6>` must never skip levels.
*   **Schema.org / JSON-LD:** Include dynamic context models inside a `<script type="application/ld+json">` tag for local business data, articles, or products.
*   **Direct Answers:** Write core value propositions clearly, targeting direct AI summarization (e.g., bulleted lists for "How we work").
