# Roadmap: Harper Family Site — Image Features

## Overview

This roadmap delivers a complete image viewing experience for the Harper Family Site. Phase 1 implements a site-wide lightbox viewer with keyboard and touch navigation. Phase 2 builds a justified-row gallery layout component. Phase 3 creates a new Gallery page that aggregates all site images and displays them using the gallery layout.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Lightbox Viewer** - Site-wide image lightbox with navigation and captions
- [ ] **Phase 2: Gallery Layout Component** - Justified-row gallery layout for image grids
- [ ] **Phase 3: Gallery Page** - Aggregated gallery of all site images

## Phase Details

### Phase 1: Lightbox Viewer
**Goal**: Users can view any image on the site in a full-viewport lightbox with keyboard, touch, and button navigation

**Depends on**: Nothing (first phase)

**Requirements**: LBOX-01, LBOX-02, LBOX-03, LBOX-04, LBOX-05, LBOX-06, LBOX-07, LBOX-08, LBOX-09

**Success Criteria** (what must be TRUE):
  1. User clicks any image on the site and it opens in a full-viewport lightbox
  2. User sees image captions/alt text displayed as an overlay at the bottom of the lightbox
  3. User can navigate between images on the same page using arrow buttons, arrow keys, or swipe gestures
  4. User can close the lightbox via X button, escape key, or backdrop click
  5. User can pinch-to-zoom on images in the lightbox on mobile devices

**Plans**: TBD

Plans:
- [ ] TBD

### Phase 2: Gallery Layout Component
**Goal**: Users see images in clean justified-row layout with equal-height rows and no empty spaces

**Depends on**: Nothing (independent component)

**Requirements**: GLAY-01, GLAY-02, GLAY-03, GLAY-04, GLAY-05

**Success Criteria** (what must be TRUE):
  1. Gallery component renders images in justified rows where all rows have equal height
  2. Gallery layout adapts responsively to different screen widths
  3. Gallery component works with existing responsive picture elements from eleventy-img
  4. Users can include gallery layout in blog posts via Nunjucks shortcode

**Plans**: TBD

Plans:
- [ ] TBD

### Phase 3: Gallery Page
**Goal**: Users can browse all site images in one centralized gallery page

**Depends on**: Phase 1 (lightbox), Phase 2 (gallery layout)

**Requirements**: GPAG-01, GPAG-02, GPAG-03, GPAG-04, GPAG-05, GPAG-06

**Success Criteria** (what must be TRUE):
  1. User can navigate to /gallery/ from the main site navigation
  2. Gallery page displays all images from all posts and pages in justified-row layout
  3. User clicks any image on the gallery page and it opens in the lightbox viewer
  4. Gallery page lazy-loads images to handle large image sets without performance degradation

**Plans**: TBD

Plans:
- [ ] TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Lightbox Viewer | 0/TBD | Not started | - |
| 2. Gallery Layout Component | 0/TBD | Not started | - |
| 3. Gallery Page | 0/TBD | Not started | - |

---
*Roadmap created: 2026-02-14*
