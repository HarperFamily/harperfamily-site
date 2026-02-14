# Harper Family Site — Image Features

## What This Is

A set of image-focused enhancements for the existing Harper Family Site (an Eleventy static site). Adds a site-wide lightbox viewer for all images, a justified-row gallery layout component for blog posts, and a new Gallery page that aggregates all images from across the site into one place.

## Core Value

Users can view any image on the site in a full-viewport lightbox with navigation, captions, and touch gestures — making the site's photography a first-class experience.

## Requirements

### Validated

- ✓ Eleventy v3 static site with Nunjucks templates — existing
- ✓ Image optimization pipeline (AVIF/WebP, responsive widths, Netlify Image CDN) — existing
- ✓ Navigation system via eleventy-navigation plugin — existing
- ✓ Blog posts with inline images — existing
- ✓ CSS/JS inline bundling and minification — existing

### Active

- [ ] Lightbox viewer that opens when any image on the site is clicked
- [ ] Lightbox displays caption/alt text as an overlay
- [ ] Lightbox supports keyboard navigation (arrow keys, escape to close)
- [ ] Lightbox supports swipe gestures and pinch-to-zoom on mobile
- [ ] Lightbox supports prev/next arrow button navigation
- [ ] Lightbox groups images by page so users can navigate between images without leaving the lightbox
- [ ] Justified-row gallery layout component (equal-height rows, edge-to-edge, no empty spaces)
- [ ] Gallery component usable in blog posts via shortcode or include
- [ ] New "Gallery" page added to main site navigation
- [ ] Gallery page auto-aggregates all images from all posts/pages at build time
- [ ] Gallery page renders images using the justified-row gallery layout component
- [ ] Gallery page images open in the lightbox viewer

### Out of Scope

- React or framework-dependent libraries — site is vanilla JS, keep it lightweight
- Image upload/management UI — handled by Pages CMS
- Image editing or cropping — not needed
- Filtering or search on the Gallery page — flat grid is sufficient for v1
- Masonry layout — justified rows chosen deliberately

## Context

- The site is built with Eleventy v3.1.2, deployed on Netlify
- Images already go through `@11ty/eleventy-img` for responsive formats (AVIF, WebP) at multiple widths (330–1320px)
- Production uses Netlify Image CDN for serving optimized images
- CSS and JS are inlined and minified via clean-css and uglify-js filters
- Templates use Nunjucks; content is Markdown with YAML frontmatter
- Navigation is built from `eleventyNavigation` frontmatter keys
- Existing codebase map available at `.planning/codebase/`

## Constraints

- **Libraries**: Use lightweight vanilla JS libraries — no React, Vue, or framework dependencies
- **Build system**: Must integrate with existing Eleventy build pipeline and image optimization
- **Performance**: Libraries should be small; images already lazy-load, maintain that behavior
- **Compatibility**: Must work with existing responsive image markup (`<picture>` tags with multiple sources)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vanilla JS libraries only | Site has no framework; adding one would be heavy and unnecessary | — Pending |
| Justified rows over masonry | Better fit for photography — clean, edge-to-edge rows like Flickr/Google Photos | — Pending |
| Lightbox on all images site-wide | Consistent experience; every image becomes viewable full-screen | — Pending |
| Auto-aggregate for Gallery page | Low maintenance; new post images appear automatically | — Pending |
| Caption overlay in lightbox | Shows context for images without cluttering the view | — Pending |

---
*Last updated: 2026-02-14 after initialization*
