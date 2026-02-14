# Requirements: Harper Family Site — Image Features

**Defined:** 2026-02-14
**Core Value:** Users can view any image on the site in a full-viewport lightbox with navigation, captions, and touch gestures

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Lightbox

- [ ] **LBOX-01**: User can click any image on the site to open it in a full-viewport lightbox
- [ ] **LBOX-02**: User can close the lightbox via X button, escape key, or clicking the backdrop
- [ ] **LBOX-03**: User can navigate between images on the same page using prev/next arrow buttons
- [ ] **LBOX-04**: User can navigate between images using left/right arrow keys
- [ ] **LBOX-05**: Lightbox displays image caption/alt text as an overlay at the bottom
- [ ] **LBOX-06**: User can swipe left/right to navigate between images on mobile
- [ ] **LBOX-07**: User can pinch-to-zoom on images in the lightbox on mobile
- [ ] **LBOX-08**: Lightbox opens and closes with smooth animations
- [ ] **LBOX-09**: Lightbox groups images by page so navigation stays within the current page's images

### Gallery Layout

- [ ] **GLAY-01**: Gallery component renders images in justified rows with equal-height rows and no empty spaces
- [ ] **GLAY-02**: Gallery layout is responsive and adapts to screen width
- [ ] **GLAY-03**: Gallery component works with existing responsive `<picture>` markup from eleventy-img
- [ ] **GLAY-04**: Gallery component supports configurable target row height
- [ ] **GLAY-05**: Gallery component is usable in blog posts via Nunjucks shortcode or include

### Gallery Page

- [ ] **GPAG-01**: New page exists at /gallery/ accessible from the site
- [ ] **GPAG-02**: Gallery page is added to the main site navigation
- [ ] **GPAG-03**: Gallery page auto-aggregates all images from all posts and pages at build time
- [ ] **GPAG-04**: Gallery page renders images using the justified-row gallery layout component
- [ ] **GPAG-05**: Images on the Gallery page open in the lightbox viewer
- [ ] **GPAG-06**: Gallery page uses lazy loading for images to handle large image sets

## v2 Requirements

### Gallery Page Enhancements

- **GPAG-07**: User can filter images by tag or source post
- **GPAG-08**: User can search images by caption/alt text

### Lightbox Enhancements

- **LBOX-10**: User can share a direct link to a specific image in the lightbox
- **LBOX-11**: User can download the original image from the lightbox

## Out of Scope

| Feature | Reason |
|---------|--------|
| Framework-dependent libraries (React, Vue) | Site is vanilla JS; no framework overhead |
| Image upload/management | Handled by Pages CMS |
| Image editing or cropping | Not needed for viewing experience |
| Masonry layout | Justified rows chosen for photography aesthetics |
| Video lightbox support | Only images for v1 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| LBOX-01 | Phase 1 | Pending |
| LBOX-02 | Phase 1 | Pending |
| LBOX-03 | Phase 1 | Pending |
| LBOX-04 | Phase 1 | Pending |
| LBOX-05 | Phase 1 | Pending |
| LBOX-06 | Phase 1 | Pending |
| LBOX-07 | Phase 1 | Pending |
| LBOX-08 | Phase 1 | Pending |
| LBOX-09 | Phase 1 | Pending |
| GLAY-01 | Phase 2 | Pending |
| GLAY-02 | Phase 2 | Pending |
| GLAY-03 | Phase 2 | Pending |
| GLAY-04 | Phase 2 | Pending |
| GLAY-05 | Phase 2 | Pending |
| GPAG-01 | Phase 3 | Pending |
| GPAG-02 | Phase 3 | Pending |
| GPAG-03 | Phase 3 | Pending |
| GPAG-04 | Phase 3 | Pending |
| GPAG-05 | Phase 3 | Pending |
| GPAG-06 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0

---
*Requirements defined: 2026-02-14*
*Last updated: 2026-02-14 after roadmap creation*
