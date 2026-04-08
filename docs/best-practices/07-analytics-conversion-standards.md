# Analytics & Conversion Tracking

## 1. Event Dispatching
*   **Standard Naming:** For buttons and CTA clicks that trigger analytics (e.g., Google Tag Manager, Plausible, or custom endpoints), use standard data attributes like `data-track="cta-click"`.
*   **Script Injection:** Analytics scripts must be injected optimally in the `<head>` or at the end of the `<body>` using Astro's `is:inline` directive if necessary, ensuring they do not block initial rendering.

## 2. GDPR Compliance & Consent
*   No analytics cookies or intrusive trackers may be instantiated without user consent if the target audience resides within GDPR/CCPA jurisdictions.
*   Cookie banners (e.g., Cookiebot or custom consent managers) must block loading of third-party tracking scripts until explicitly acknowledged.

## 3. Form Conversions
*   Conversion pages ("Thank You" pages) should be strictly defined and excluded from `robots.txt` indexing to prevent false analytics data from natural crawler traffic.
