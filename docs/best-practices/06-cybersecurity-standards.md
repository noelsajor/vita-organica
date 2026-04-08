# Cybersecurity & Compliance Standards

## 1. HTTP Security Headers
Every deployment must be protected by HTTP security response headers. Manage these either in `vercel.json` or the hosting provider's configuration.
*   **Content Security Policy (CSP):** Restrict inline scripts (`script-src`) and strictly define allowed image/media sources.
*   **X-Frame-Options:** Set to `DENY` or `SAMEORIGIN` to prevent clickjacking.
*   **Strict-Transport-Security (HSTS):** Enforce HTTPS connections.

## 2. Environment Variables
*   **Frontend Leakage:** Keys prefixed with `PUBLIC_` (Astro) or `VITE_` are bundled into the client browser. *Never* prefix database passwords, secret access tokens, or private webhook keys with these tags.
*   **Fallback:** Assume standard `.env` processing during the SSR or Static Build phase.

## 3. Input Sanitization & Spam Defense
*   **Form Action:** Contact forms must never pass unsanitized data directly into databases.
*   **Honeypots:** Include a hidden field (visually hidden via CSS, but readable by screen readers via `aria-hidden="true"`) to trap bot submissions seamlessly without UX friction (e.g., no CAPTCHAs unless explicitly required).
