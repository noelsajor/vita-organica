# UI/UX & Accessibility Standards

## 1. Responsive Breakpoints
We employ a fluid-first design approach managed via `styles.css`.
*   **Desktop:** Base layout scales up to `--container-max: 1240px`.
*   **Tablet/Mobile:** Breakpoints trigger predominantly at `768px` and `1100px`. Avoid creating excessive micro-breakpoints.

## 2. Font Scaling & Typography
*   Never hardcode `font-size` inside components.
*   Always use predefined CSS variables: `var(--text-xs)` up to `var(--text-6xl)`.
*   Line-height for body copy should remain `1.65` for optimal readability.
*   Heading line-height is locked tighter at `1.15` to `1.2`.

## 3. Accessibility (a11y)
*   **Color Contrast:** Ensure a minimum WCAG AA contrast ratio of 4.5:1 for normal text and 3:1 for large text.
*   **Interactive Elements:** All `<button>`, `<a>`, and custom interactive components must have visible `:focus-visible` states.
*   **Alt Tags:** Images *must* include descriptive `alt` attributes. Decorative graphics should use `alt=""` so screen readers skip them.
*   **ARIA Labels:** For icon-only buttons or ambiguous action elements (like the `.mobile-menu-toggle`), use `aria-label` or `aria-expanded` attributes.
