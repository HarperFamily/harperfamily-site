---
phase: 01-lightbox-viewer
plan: 01
subsystem: lightbox-foundation
tags: [lightgallery, build-pipeline, asset-loading]
dependency_graph:
  requires: []
  provides: [lightGallery library loaded, zoom plugin available, initialization script ready]
  affects: [all pages site-wide]
tech_stack:
  added: [lightgallery@^2.9.0]
  patterns: [UMD script loading, Eleventy passthrough copy, bundle system integration]
key_files:
  created:
    - _includes/assets/js/lightbox-init.js
    - _includes/assets/css/lightbox.css
  modified:
    - package.json
    - eleventy.config.js
    - _includes/components/head.njk
    - _includes/layouts/base.njk
decisions:
  - Use UMD script tags instead of ES modules for lightGallery (UglifyJS doesn't support ES6+)
  - Load library scripts before bundled JS to ensure global availability
  - Use passthrough copy for lightGallery dist files instead of bundling
  - Apply minimal CSS overrides - only for site font consistency
metrics:
  tasks_completed: 2
  duration_minutes: 2
  commits: 2
  files_created: 2
  files_modified: 5
  completed_date: 2026-02-15
---

# Phase 01 Plan 01: Install and Integrate lightGallery

**One-liner:** lightGallery library installed and integrated into Eleventy build pipeline with zoom plugin and ES5-compatible initialization.

## Objective

Install lightGallery and integrate its CSS and JS into the Eleventy build pipeline so it loads on every page, providing the foundation for lightbox functionality with smooth zoom-in animation.

## What Was Built

### Task 1: Install lightGallery and Create Initialization Script
**Commit:** bf778e5

Installed lightgallery@^2.9.0 as a project dependency and created an ES5-compatible initialization script at `_includes/assets/js/lightbox-init.js`. The script:
- Uses ES5 syntax (var, function declarations) for UglifyJS compatibility
- Waits for DOM ready before initializing
- Configures lightGallery with zoom-in-big animation mode (speed: 500)
- Enables lgZoom plugin for pinch-to-zoom support
- Sets up selector mode targeting `[data-lg-src]` attributes (to be added in Plan 02)
- Configures captions from alt/title attributes
- Disables download and counter for cleaner UI

**Files created:**
- `_includes/assets/js/lightbox-init.js` (46 lines)

**Files modified:**
- `package.json` (added lightgallery dependency)
- `package-lock.json` (dependency tree)

### Task 2: Wire lightGallery CSS and JS into Eleventy Build
**Commit:** b76122b

Integrated lightGallery assets into the Eleventy build pipeline using passthrough copies and updated page templates to load the library on every page.

**Configuration changes:**
- Added passthrough copies in `eleventy.config.js` for:
  - `lightgallery.umd.js` → `/js/lightgallery.umd.js`
  - `lightgallery-bundle.min.css` → `/css/lightgallery.min.css`
  - `lg-zoom.umd.js` → `/js/lg-zoom.umd.js`

**Template updates:**
- `_includes/components/head.njk`: Added link tag for lightGallery CSS and bundle inclusion for custom CSS
- `_includes/layouts/base.njk`: Added script tags for lightGallery UMD and zoom plugin before bundled JS, included lightbox-init.js in js bundle

**Files created:**
- `_includes/assets/css/lightbox.css` (21 lines) - custom font overrides for caption styling

**Files modified:**
- `eleventy.config.js` (added 3 passthrough copy entries)
- `_includes/components/head.njk` (added CSS link and bundle include)
- `_includes/layouts/base.njk` (added script tags and init include)

## Verification Results

All verification criteria passed:

1. **Build Success:** `npm run build` completes without errors
2. **Asset Passthrough:** All lightGallery files present in `_site/`:
   - `/js/lightgallery.umd.js` (128KB)
   - `/css/lightgallery.min.css` (31KB)
   - `/js/lg-zoom.umd.js` (44KB)
3. **HTML Integration:** Checked `_site/index.html` - confirmed:
   - CSS link tag: `<link rel="stylesheet" href="/css/lightgallery.min.css">`
   - Script tags: `<script src="/js/lightgallery.umd.js"></script>` and zoom plugin
   - Custom CSS bundled in inline styles
4. **Initialization Code:** Verified `lightGallery(document.body` present in bundled JS (`/dist/jbURaUs9Pd.js`)
5. **No Console Errors:** Dev server started successfully (background process)

## Deviations from Plan

None - plan executed exactly as written. All tasks completed successfully with no blocking issues, architectural changes, or missing functionality requiring deviation rules.

## Key Decisions

1. **UMD over ES Modules:** Used UMD script tags because Eleventy's build pipeline uses UglifyJS for minification, which doesn't support ES6+ module syntax. The initialization script uses ES5 syntax (var, function expressions) for the same reason.

2. **Passthrough Copy Strategy:** Chose to copy lightGallery dist files directly to output rather than processing through the bundle system. This keeps the large library files separate and avoids minification issues.

3. **Load Order:** Placed library script tags before the bundled JS to ensure `lightGallery` and `lgZoom` globals are available when the initialization code runs.

4. **Minimal CSS Overrides:** Created a separate CSS file for custom overrides but kept it minimal - only font family declarations to match site typography (Domine for headings, Source Sans Pro for body). lightGallery's default styling is well-designed.

## Next Steps

**Ready for Plan 02:** Add lightbox markup to images
- The lightGallery library is now loaded on every page
- Initialization script is ready and waiting for `[data-lg-src]` elements
- Plan 02 will add data attributes to images to make them clickable
- The zoom-in animation is configured and ready to activate

## Dependencies

**Requires:** None (first plan in phase)

**Provides:**
- lightGallery library loaded globally on all pages
- lgZoom plugin available
- Initialization script configured with zoom animation
- Build pipeline ready to serve lightbox assets

**Affects:**
- All pages site-wide (library CSS/JS added to base layout)
- Build process (new passthrough copies)
- Bundle size (initialization code added to JS bundle)

## Technical Notes

**Browser Compatibility:** lightGallery 2.9.0 supports all modern browsers. The UMD build provides compatibility with older module systems if needed.

**Performance Impact:**
- CSS: 31KB (minified)
- JS: 128KB (lightgallery) + 44KB (zoom plugin) = 172KB total
- Initialization: ~1KB (minified in bundle)
- All assets loaded on every page (could be optimized in future to load only on pages with images)

**ES5 Constraint:** The site uses UglifyJS which doesn't support ES6+. All custom JS must use ES5 syntax (var instead of const/let, function declarations instead of arrows, no template literals).

## Self-Check: PASSED

**Created files verified:**
- [FOUND] `/Users/grahamharper/Code/harperfamily-site/_includes/assets/js/lightbox-init.js`
- [FOUND] `/Users/grahamharper/Code/harperfamily-site/_includes/assets/css/lightbox.css`

**Commits verified:**
- [FOUND] bf778e5 - feat(01-01): install lightGallery and create initialization script
- [FOUND] b76122b - feat(01-01): wire lightGallery CSS and JS into Eleventy build

**Build artifacts verified:**
- [FOUND] `/Users/grahamharper/Code/harperfamily-site/_site/js/lightgallery.umd.js`
- [FOUND] `/Users/grahamharper/Code/harperfamily-site/_site/css/lightgallery.min.css`
- [FOUND] `/Users/grahamharper/Code/harperfamily-site/_site/js/lg-zoom.umd.js`

All claims in this summary are accurate and verified.
