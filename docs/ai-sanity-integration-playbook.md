# AI Developer Playbook: Multi-Tenant Sanity Architecture

**ATTN TO ALL FUTURE AI AGENTS OR DEVELOPERS:** 
This document defines the highly-specific, standardized patterns required to successfully build out new client repositories cloning this agency template. Do not deviate from these workflows or you will trigger silent build failures or SSR dropouts.

---

## 1. System Architecture Map

Below is the established mapping of how the unified Sanity Studio interacts identically with any given multi-tenant frontend client (e.g. `vita-organica` and `enhanced_labs`).

```text
├── ascent-web-test/studio/ (The Singular Source of Truth)
│   ├── sanity.config.ts    <-- Defines unified Workspaces dynamically via ENV
│   ├── schemas/            <-- Contains standard schema shared across ALL clients (e.g., post.js)
│   └── (Hosted on Vercel as an administrative dashboard)
│
├── vercel/vita-organica/   (Client A Frontend)
│   ├── astro.config.mjs    <-- Configured for SSG output
│   ├── src/
│   │   ├── components/
│   │   │   └── PortableTextWrapper.tsx  <-- CRITICAL: Wraps @portabletext/react for Astro SSR
│   │   ├── lib/sanity/
│   │   │   ├── client.ts   <-- Consumes client-specific PUBLIC_SANITY_PROJECT_ID
│   │   │   ├── queries.ts  
│   │   │   └── readTime.ts <-- Native typescript parser calculating wordCount / 200
│   │   └── pages/blog/
│   │       ├── index.astro <-- SSG feed parsing read time natively
│   │       └── [slug].astro<-- Dynamic routing + scoped <style is:global>
│   └── package.json        <-- @astrojs/react + @portabletext/react
│
└── vercel/enhanced_labs/   (Client B Frontend)
    └── [Identical cloned architecture to Client A]
```

---

## 2. Setting Up Sanity for a New Client Tenant

The agency uses a single Sanity project ID (`5lvwsg2s`) for all clients, and organizes clients specifically via **Sanity Datasets** or internal tagging. 

When deploying a new frontend for a client, you **must**:
1. Connect the Vercel project to GitHub.
2. Inject the central `PUBLIC_SANITY_PROJECT_ID` into the target Vercel project's Environment Variables.
3. Inject the specific dataset key via `PUBLIC_SANITY_DATASET` (e.g. `production` or `enhanced-production`).
4. Ensure `SANITY_API_VERSION` is set uniformly (e.g., `2023-05-03`).

---

## 3. Webhook Automation (Continuous Deployment)

To prevent clients from needing to manually trigger rebuilds when they formulate new content, we utilize Vercel Deploy Hooks tied directly to Sanity Webhooks.

**Execution Steps for New Clones:**
1.  Navigate to **Vercel -> Settings -> Git -> Deploy Hooks** for the new client project.
2.  Generate a hook named `Sanity Content Update` targeting the `main` branch.
3.  Navigate to **Sanity Manage Dashboard -> API -> Webhooks**.
4.  Create a webhook pointing to the Vercel Deploy Hook URL.
5.  **CRITICAL FILTER:** Set the Sanity trigger filter to `_type == "post"`. This prevents site rebuilds on unrelated metadata edits.
6.  Set Trigger Events to: `Create`, `Update`, `Delete`.

---

## 4. The Astro SSR PortableText Bug Framework

**WARNING:** Astro will consistently and silently drop rendering of `@portabletext/react` components if they are placed directly into `.astro` files without client directives because Sanity's component consumes deep React Contexts that Astro's SSG compiler struggles to trace natively.

### The Standard Fix
Every project MUST include `src/components/PortableTextWrapper.tsx`. Do not write custom logic.

```tsx
// src/components/PortableTextWrapper.tsx
import React from 'react';
import { PortableText } from '@portabletext/react';

export default function PortableTextWrapper({ content }: { content: any }) {
  if (!content) return null;
  return <PortableText value={content} />;
}
```

### 5. Rich Text Scope Stripping (Global CSS Styling)

Astro's `.astro` scoping will NOT apply internal `<style>` block resets dynamically to PortableText markup that trickles down from the `.tsx` wrapper. 

You MUST use Astro's `is:global` tag coupled with a localized parent wrapper class (like `.post-content`) to restore bullets, blockquotes, heading sizes, and bolding that modern CSS resets strip array.

**Required CSS Injection in `[slug].astro`:**
```astro
<style is:global>
  .post-content p { margin-bottom: var(--sp-6); }
  .post-content h2, .post-content h3 {
    margin: var(--sp-10) 0 var(--sp-4);
    font-weight: 700;
    color: var(--color-ink);
  }
  .post-content ul { list-style-type: disc; margin-bottom: var(--sp-6); padding-left: var(--sp-8); }
  .post-content ol { list-style-type: decimal; margin-bottom: var(--sp-6); padding-left: var(--sp-8); }
  .post-content li { margin-bottom: var(--sp-2); }
  .post-content blockquote {
    border-left: 4px solid var(--color-teal);
    padding-left: var(--sp-4);
    font-style: italic;
  }
</style>
```

---

## 6. Accessiblity & Read Time

The agency mandates accessible reading times on all blog cards and articles. 
Do not rely on complex GROQ map logic to calculate text. Use the standardized typescript parser:

```typescript
// /src/lib/sanity/readTime.ts
export function calculateReadTime(blocks: any[]): number {
  if (!blocks || !Array.isArray(blocks)) return 1;
  const text = blocks
    .filter((block) => block._type === 'block' && block.children)
    .map((block) => block.children.map((child: { text: string }) => child.text).join(''))
    .join(' ');
  
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
```
**Usage**: Inject `calculateReadTime(post.body)` onto the `index.astro` metadata cards and `[slug].astro` headers. Ensure `body` is explicitly fetched in the `allPostsQuery`.
