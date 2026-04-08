# First Kick AI Prompt Template

> **Purpose:** Copy and paste the prompt below into any AI agent (Cursor, ChatGPT, Claude, etc.) when cloning this template for a new client/brand. It establishes the baseline context, routing structure, and aesthetic variables the AI needs to correctly modify the codebase.

---

## The Prompt

**Role Setup:**
You are an elite, expert AI software engineer and technical architect. I have just cloned an "Agency Master Operation Template" (built with Astro, React, and Sanity) and I need you to adapt it for a new client project.

**Your Goal:** 
Read this prompt carefully to understand the architecture, then execute the customization tasks sequentially. Do not start coding blindly. 

**Context & Tech Stack:**
- **Framework:** Astro (v6.x) with Static Site Generation (`output: 'static'`)
- **Frontend Components:** React (v19.x) via `@astrojs/react` for interactive components (Islands)
- **Styling:** Vanilla Custom CSS (`styles.css` at the root and/or `src/styles/global.css`). 
- **Icons:** Lucide React (`lucide-react`)
- **Routing:** Astro's file-based routing in `src/pages/`
- **CMS (Future Integration):** Sanity (`@sanity/client` and `groq`) - Schema definitions will be added eventually, but for now we connect via `src/lib/`.

---

**Step 1: Global Branding & Styling Swaps**
The entire design system relies on CSS variables defined in `:root` inside `styles.css` and `src/styles/global.css`. 
1. Open the CSS files and replace the following CSS variables with the new client's brand palette:
   - Primary Accent: `var(--color-magenta)` -> `[INSERT_CLIENT_PRIMARY_COLOR_HEX]`
   - Secondary Accent: `var(--color-green)` -> `[INSERT_CLIENT_SECONDARY_COLOR_HEX]`
   - Background/Surface Colors: (Adjust `var(--color-surface)` and `var(--color-ink)` if client needs a light/dark mode shift).
2. Update the Typography scale: 
   - Change `var(--font-display)` to `[INSERT_CLIENT_HEADING_FONT]`
   - Change `var(--font-body)` to `[INSERT_CLIENT_BODY_FONT]`
   - Note: Update the `@import url(...)` at the top of the CSS file to load the new Google Fonts.

**Step 2: Core Configuration Updates**
1. Check `astro.config.mjs` and update the `site` property to the new production URL: `[INSERT_CLIENT_PRODUCTION_URL]`
2. Check `package.json` and change the project `"name"` to `[INSERT_CLIENT_PROJECT_NAME]`
3. Go to `src/pages/` and open `index.astro` (or layout files holding `<title>`). Update the meta titles and descriptions to reflect the new client.

**Step 3: CMS & Content Connection (If Applicable)**
1. In `src/lib/` or the `.env` file, update the following variables for the client's new Sanity project:
   - `PUBLIC_SANITY_PROJECT_ID` = `[INSERT_SANITY_PROJECT_ID]`
   - `PUBLIC_SANITY_DATASET` = `[INSERT_SANITY_DATASET]`
2. Generate or update any required Sanity schemas to match the new client's content model.

**Step 4: Image & Asset Swaps**
1. Navigate to `public/` and replace `favicon.svg` / `favicon.ico` with the client's favicon.
2. In the navigation components (`src/components/Navigation.tsx` or similar), replace the inline SVG logo or logo image src with the client's logo asset.

**Please confirm you understand these instructions, summarize the current state of the new branch, and begin Step 1.**
