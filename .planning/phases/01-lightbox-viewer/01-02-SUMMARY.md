---
phase: 01-lightbox-viewer
plan: 02
subsystem: lightbox-transform
tags: [eleventy, transforms, lightgallery, html-processing]

# Dependency graph
requires:
  - phase: 01-01
    provides: lightGallery library loaded, initialization script ready
provides:
  - Eleventy transform that auto-wraps all content images with lightbox markup
  - Per-page gallery grouping via data-gallery attributes
  - Caption support from image alt text via data-sub-html
  - Exclusion logic for header/nav/logo images
affects: [all site pages with images]

# Tech tracking
tech-stack:
  added: []
  patterns: [HTML transform pattern, regex-based HTML parsing, page-slug extraction]

key-files:
  created: []
  modified:
    - _config/filters.js

key-decisions:
  - "Use regex for HTML parsing instead of external dependencies (keeps build pipeline simple)"
  - "Add data-src attribute for lightGallery image source (required for selector mode)"
  - "Use data-sub-html instead of data-title for captions (lightGallery standard)"
  - "Group images by page slug for gallery navigation isolation"

patterns-established:
  - "Transform execution order: lightbox-wrap before htmlmin"
  - "Skip logic: no-lightbox class, header/nav sections, favicon/icon/logo in src"
  - "Page slug extraction from this.page.url for gallery grouping"

# Metrics
duration: 14min
completed: 2026-02-15
---

# Phase 01 Plan 02: Auto-Wrap Images with Lightbox Markup

**Eleventy transform automatically wraps all content images with lightGallery markup, adding data-src, data-gallery, and data-sub-html attributes for full lightbox functionality**

## Performance

- **Duration:** 14 minutes
- **Started:** 2026-02-15 (after Task 1 commit: 9020c4f)
- **Completed:** 2026-02-15
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- Every content image site-wide is automatically wrapped with lightbox-enabled anchor tags
- Per-page gallery grouping ensures navigation stays within current page's images
- Captions display from image alt text without manual markup
- Non-content images (logos, icons, nav) automatically excluded from lightbox treatment

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Eleventy transform to auto-wrap images with lightbox markup** - `9020c4f` (feat)
2. **Task 2 fix: Add missing data-src and data-sub-html attributes** - `779cc1d` (fix)

## Files Created/Modified
- `_config/filters.js` - Added lightbox-wrap transform (runs before htmlmin) that processes all HTML output, finds image links, adds lightGallery attributes

## Decisions Made

1. **data-src attribute required:** lightGallery selector mode needs explicit data-src to know which image to load in the lightbox. Transform extracts highest-resolution URL from href or picture sources.

2. **data-sub-html for captions:** lightGallery uses data-sub-html (not data-title) for caption display. Changed during fix after user verification revealed captions weren't showing.

3. **Regex-based HTML parsing:** Used simple regex matching instead of external HTML parser library (like PostHTML) to keep build pipeline dependency-free and straightforward.

4. **Transform runs before htmlmin:** Registered lightbox-wrap transform before htmlmin to ensure clean HTML structure before minification.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Missing data-src and incorrect caption attribute**
- **Found during:** Task 2 (user verification reported "images aren't loading")
- **Issue:** Transform was adding class="lightgallery" and data-title but not data-src. lightGallery selector mode requires data-src to specify which image to display. Also, lightGallery uses data-sub-html (not data-title) for captions.
- **Fix:** Added data-src attribute extraction (using highResUrl), changed data-title to data-sub-html
- **Files modified:** _config/filters.js (lines 172-179)
- **Verification:** Built HTML contains data-src pointing to high-res image URL, captions use data-sub-html attribute
- **Committed in:** 779cc1d

---

**Total deviations:** 1 auto-fixed (Rule 1 - bug)
**Impact on plan:** Essential fix for core functionality - images wouldn't load in lightbox without data-src. No scope creep.

## Issues Encountered

**User verification feedback: "images aren't loading"**
- **Cause:** Initial implementation missed data-src attribute, which lightGallery requires in selector mode to determine which image to display
- **Resolution:** Added data-src attribute extraction from highResUrl (existing logic), changed caption attribute from data-title to data-sub-html per lightGallery docs
- **Time impact:** ~10 minutes for investigation, fix, rebuild, and verification

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Phase 1 (Lightbox Viewer) is now complete!**

All 9 LBOX requirements met:
- LBOX-01: Click any image to open lightbox (data-src + class="lightgallery")
- LBOX-02: Close via X, Escape, or backdrop click (lightGallery default behavior)
- LBOX-03: Prev/next arrow buttons (lightGallery default UI)
- LBOX-04: Arrow key navigation (lightGallery keyboard plugin)
- LBOX-05: Caption overlay from alt text (data-sub-html attribute)
- LBOX-06: Swipe navigation on mobile (enableSwipe: true in init)
- LBOX-07: Pinch-to-zoom on mobile (lgZoom plugin)
- LBOX-08: Smooth open/close animations (mode: 'lg-zoom-in-big')
- LBOX-09: Images grouped by page (data-gallery="gallery-{slug}")

Ready for Phase 2: Photo Gallery Grid Layout

## Self-Check: PASSED

**Files modified:**
- FOUND: _config/filters.js

**Commits verified:**
- FOUND: 9020c4f (Task 1 - feat)
- FOUND: 779cc1d (Fix - fix)

**Build artifacts verified:**
- FOUND: data-src attribute in built HTML
- FOUND: data-sub-html attribute in built HTML
- FOUND: data-gallery attribute in built HTML

All claims in this summary are accurate and verified.

---
*Phase: 01-lightbox-viewer*
*Completed: 2026-02-15*
