# Frontend Development Framework

## 1. Component Architecture (Astro vs React)
This template utilizes the "Astro Island" architecture.
*   **Default to Astro (`.astro`)**: Any UI section that handles static content, SEO wrappers, or non-interactive layouts *must* be an Astro component.
*   **Use React (`.tsx`) sparingly:** Only create a React component if the element requires client-side state (e.g., forms, dynamic filtering, or heavy interactive animations).
*   **Hydration Directives:** When rendering a React component in Astro, always use the strictest hydration directive possible (e.g., `client:idle`, `client:visible`, or `client:load`) to reduce the JavaScript bundle size.

## 2. Asset Optimization
*   **Images:** Favor Astro's built-in `<Image />` and `<Picture />` components for local assets to automatically handle sizing, WebP conversion, and lazy loading.
*   **SVGs:** Inline smaller SVGs for critical icons (like the main logo or Lucide React icons) to save HTTP requests.

## 3. Styling Rules
*   **No Tailwind/Inline Styles:** Use the Vanilla CSS framework outlined in `styles.css` / `global.css`.
*   **Component Encapsulation:** If using `.astro` components, leverage `<style>` tags for scoped component styling.
*   **CSS Variables:** Access global theme variables rather than raw hex colors or pixel sizes.
