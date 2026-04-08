# GitHub & Version Control Workflows

## 1. Branch Naming Conventions
Follow a strict, descriptive branch naming pattern to keep the repository map clean:
*   `feat/` - for new features or substantial layout changes (e.g., `feat/add-blog-integration`).
*   `fix/` - for bug fixes or resolving visual bugs (e.g., `fix/mobile-nav-overflow`).
*   `chore/` - for routine tasks, dependency updates, or documentation (e.g., `chore/update-readme`).

## 2. Conventional Commits
All commit messages must prefix their purpose to ensure automated changelogs remain meaningful:
*   `feat: added animated hero section`
*   `fix: resolved contrast issue on primary button`
*   `docs: updated First Kick prompt template`
*   `refactor: migrated React components to Astro`

## 3. Pull Request Guidelines
*   Never push directly to `main` or `master`.
*   Branches must be updated against `main` before submitting a PR.
*   PR descriptions should be brief but explicit on what visual or data changes occurred.
