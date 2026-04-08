# Testing & QA Pre-Launch Checklist

Before pushing any client project to production, the following checks are mandatory:

## 1. Automated Performance & Accessibility (Lighthouse)
*Run Lighthouse via Chrome DevTools in an Incognito window on the Production URL.*
*   **Performance:** Score must be **95+** on Mobile.
*   **Accessibility:** Score must be **100**.
*   **Best Practices:** Score must be **100**.
*   **SEO:** Score must be **100**.

## 2. Cross-Device/Browser Testing
*   Verify layout on iOS Safari, Android Chrome, Desktop Chrome/Firefox/Safari.
*   Check that hover effects degrade gracefully into tap events on mobile touchscreens.

## 3. Functionality Checks
*   **Forms:** Test all contact forms/inputs. Ensure honeypots block spam and success messages display correctly.
*   **Links:** Crawl the site to resolve any 404 dead links or redirect loops.
*   **404 Page:** Verify that `404.astro` exists and routes correctly when an unknown path is visited.

## 4. Visual QA
*   Ensure there is no horizontal scrolling on mobile viewports (`overflow-x: hidden`).
*   Verify the favicon appears in the browser tab.
*   Confirm social sharing cards display properly via Open Graph testing tools.
