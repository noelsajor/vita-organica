# Code Formatting & Quality Constraints

## 1. Strict Typing (TypeScript)
*   The project enforces TypeScript (`tsconfig.json`).
*   Avoid the `any` type at all costs. Utilize explicit interfaces for React components and Sanity data models.
*   Astro frontmatter variables should be typed appropriately when handling arrays or mapped component props.

## 2. Formatting & Linting
*   **Indentation:** Enforce consistent `tabWidth` (typically 2 or 4 spaces depending on the `.prettierrc` or VSCode settings).
*   **Quotation:** Prefer single quotes `'` for JavaScript strings, and double quotes `"` for JSX/HTML attributes.
*   **Trailing Commas:** Enforce consistent trailing commas in multi-line objects to reduce git diff noise.

## 3. Production Purity
*   **No Console Logs:** Ensure all testing logs (e.g., `console.log`, `console.debug`) are scrubbed before deployment.
*   **Dead Code:** Unused imports and commented-out experimental code blocks must be deleted, not simply commented out, prior to PR merging.
