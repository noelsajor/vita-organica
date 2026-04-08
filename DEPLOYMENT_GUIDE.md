# Deployment & Webhooks Integration

This guide outlines the proper deployment workflow for taking this Agency Master template into production, ensuring CI/CD flows and CMS synchronization.

## 1. Hosting Environment
We optimize out-of-the-box for **Vercel** or **Netlify**, given their excellent support for Astro and SSR features if needed.

### Steps to Deploy to Vercel
1. Push the customized repository to GitHub.
2. In the Vercel Dashboard, select "Add New Project" and import your repository.
3. **Framework Preset:** Select "Astro". (Vercel usually detects this automatically).
4. **Environment Variables:** Provide any necessary keys, specifically for Sanity:
   - `PUBLIC_SANITY_PROJECT_ID`
   - `PUBLIC_SANITY_DATASET`
5. Deploy. 

## 2. Security Headers (Vercel)
A `vercel.json` file is included in the root directory. This explicitly secures the frontend with `Content-Security-Policy` and `Strict-Transport-Security` headers. **DO NOT delete this file** unless migrating to a host that requires a different configuration format (like `netlify.toml`). Ensure the CSP settings match your image sources (see [Cybersecurity Standards](docs/best-practices/06-cybersecurity-standards.md)).

## 3. Webhook Integration (Sanity CMS)
Since this project uses Astro's Static Site Generation (`output: 'static'`), Sanity updates will not go live instantly unless you trigger a rebuild.

### How to set up the Rebuild Webhook:
1. **In Vercel:** Go to Project Settings -> Git -> Deploy Hooks. Create a hook named "Sanity Content Update" targeting your `main` branch. Copy the URL.
2. **In Sanity Dashboard:** Navigate to your project settings -> API -> Webhooks.
3. Click "Add Webhook".
4. **URL:** Paste the Vercel Hook URL.
5. **Dataset:** Your active dataset (usually `production`).
6. **Trigger on:** Create, Update, Delete.
7. Save the webhook.

Now, anytime a client presses "Publish" on an article in the Sanity Studio (see [Client Handoff Manual](docs/client-handoff-manual.md)), Vercel will automatically fetch the new data and rebuild the static site.

---
For pre-launch verification, always run through the [Testing & QA Checklist](docs/best-practices/04-testing-qa-checklist.md).
