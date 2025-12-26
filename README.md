# urban_planning_calc — GitHub Pages Setup

This repository is structured for a static site. Below are recommendations and steps to publish via GitHub Pages.

## Current Structure
- Entry point: `index.html` at repo root (main UI page).
- Shared UI parts: `main/` (header, footer, shared.js).
- Tools: `logic/PosPzuItnterp/` and `logic/rngp_2025_11_17_v.1/`.
- About page: `bio.html`.
- Legacy sandbox: `old/` (archived, not linked from main UI).

## Publish Options
You can publish GitHub Pages via repository **Settings → Pages**:

1. **Root (recommended for current layout)**
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/` (root)
   - The live site will be: `https://<user>.github.io/<repo>/`

2. **docs/** folder (alternative)
   - Move the UI under `docs/` and set Folder: `/docs`.
   - Update internal links accordingly.

## Setup Applied
- Single entry point: `index.html` as the main page.
- Added `.nojekyll` to avoid Jekyll processing.
- Added `404.html` with a link back to `index.html`.
- All paths are relative and case-consistent for GitHub Pages compatibility.

## Structure Cleanup
- Main UI now in root: `main/`, `logic/`, `bio.html`.
- Legacy `pubic/` folder moved to `old/pubic_backup/`.

## Deployment Notes
- Use **relative links** (already implemented) so the site works under the project base path.
- Paths are **case-sensitive** on GitHub Pages; keep naming consistent.
- `.nojekyll` prevents Jekyll from ignoring files with underscores.

## Quick Test Locally
Open `index.html` in your browser. You should see the main UI with links to:
- `logic/PosPzuItnterp/interpolation.html` (interpolation calculator)
- `logic/rngp_2025_11_17_v.1/parking.html` (parking calculator)
- `bio.html` (about page)

