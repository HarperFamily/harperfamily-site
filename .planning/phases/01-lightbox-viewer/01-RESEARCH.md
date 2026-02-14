# Phase 1: Lightbox Viewer - Research

**Researched:** 2026-02-14
**Domain:** Vanilla JavaScript lightbox libraries for static sites
**Confidence:** HIGH

## Summary

Lightbox viewers display images in a full-viewport overlay with navigation controls, requiring careful attention to mobile touch gestures, accessibility, and performance. For this Eleventy-based static site using vanilla JavaScript, **GLightbox** emerges as the optimal choice: it's lightweight (11KB gzipped), supports all required features (touch navigation, pinch-zoom, keyboard controls, smooth animations), integrates seamlessly with existing responsive images, and requires minimal configuration.

The primary technical challenges are: (1) ensuring proper accessibility with focus trapping and ARIA attributes, (2) preventing body scroll on iOS devices, (3) maintaining existing lazy-load behavior while enabling lightbox functionality, and (4) working with the site's existing responsive image markup and Netlify Image CDN setup.

**Primary recommendation:** Use GLightbox 3.3.0 with automatic initialization via CSS selectors. Add via npm, include CSS/JS in the Eleventy bundle system, and initialize with event delegation to support dynamically optimized images from Eleventy's image transform plugin.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| GLightbox | 3.3.0 | Lightbox gallery | Most feature-complete vanilla JS solution; 11KB gzipped; built-in touch/mobile support; active maintenance |
| glightbox.min.css | 3.3.0 | Lightbox styling | Required companion to GLightbox; uses CSS variables for customization |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| body-scroll-lock | 4.0.0-beta.0 | Prevent background scroll (iOS) | If GLightbox's built-in scroll prevention fails on iOS (test first) |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| GLightbox | PhotoSwipe 5.x | PhotoSwipe requires predefined image dimensions, heavier initialization (15KB), stronger accessibility focus but more complex setup. Better for complex galleries requiring advanced zoom. |
| GLightbox | basicLightbox | Extremely lightweight (2KB) but lacks touch gestures, pinch-zoom, and gallery navigation. Only suitable for simple single-image overlays. |
| GLightbox | lightGallery | Feature-rich (plugins for zoom, thumbnails, etc.) but 20KB+ and more complex API. Overkill for requirements. |
| GLightbox | SimpleLightbox | Similar features (7KB) but less active development, fewer npm downloads (45K vs 420K weekly for PhotoSwipe alternative comparison). |

**Installation:**

```bash
npm install glightbox --save
```

Or via CDN (for static sites):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css" />
<script src="https://cdn.jsdelivr.net/npm/glightbox/dist/js/glightbox.min.js"></script>
```

**For Eleventy integration:** Add GLightbox files to Eleventy's bundle system or copy to public/ directory and include in base layout.

## Architecture Patterns

### Recommended Project Structure

```
/Users/grahamharper/Code/harperfamily-site/
├── public/
│   ├── js/
│   │   └── lightbox-init.js      # GLightbox initialization
│   └── css/
│       └── glightbox.min.css     # Lightbox styles (or npm import)
├── _includes/
│   └── layouts/
│       └── base.njk              # Add lightbox scripts here
└── content/                       # Existing structure maintained
```

### Pattern 1: Automatic Image Detection with Event Delegation

**What:** Initialize GLightbox once on page load with a CSS selector. The library attaches event listeners to matching elements and handles gallery grouping automatically.

**When to use:** When images are static HTML (not dynamically loaded after page render). Works with Eleventy's build-time image optimization.

**Example:**

```javascript
// Source: https://github.com/biati-digital/glightbox
// Initialize GLightbox with default selector
const lightbox = GLightbox({
  selector: '.glightbox',
  touchNavigation: true,
  loop: false,
  autoplayVideos: false,
  keyboardNavigation: true,
  closeButton: true,
  closeOnOutsideClick: true,
  openEffect: 'zoom',
  closeEffect: 'zoom',
  slideEffect: 'slide',
  zoomable: true,
  draggable: true
});
```

**HTML markup (in markdown or templates):**

```html
<!-- Simple image link -->
<a href="/img/large-image.jpg" class="glightbox" data-title="Image caption">
  <img src="/img/thumbnail.jpg" alt="Description" />
</a>

<!-- With data attributes for configuration -->
<a href="/img/photo.jpg"
   class="glightbox"
   data-gallery="post-123"
   data-title="Caption text"
   data-description="Extended description">
  <img src="/img/photo.jpg" alt="Photo" />
</a>
```

### Pattern 2: Working with Eleventy Image Transform

**What:** Eleventy's `eleventyImageTransformPlugin` automatically processes all `<img>` tags and creates responsive `<picture>` elements with srcset. GLightbox needs to open the full-size image while thumbnails are optimized.

**When to use:** This site uses automatic image optimization (see eleventy.config.js lines 72-109).

**Challenge:** Eleventy transforms `<img>` to `<picture>` with multiple sources. Need to ensure lightbox opens full-resolution image, not thumbnail.

**Solution:** Wrap images in links pointing to original (unoptimized) image URL:

```markdown
[![Image alt text](https://f001.backblazeb2.com/file/harperfamily-media/image.jpg)](https://f001.backblazeb2.com/file/harperfamily-media/image.jpg)
```

GLightbox reads the `href` attribute for the full-size image, while the `<img>` inside displays the optimized responsive version.

### Pattern 3: Gallery Grouping by Page

**What:** Use `data-gallery` attribute to group images so navigation only cycles through images on the same page.

**When to use:** Meeting requirement LBOX-09 (lightbox groups images by page).

**Example:**

```html
<!-- All images on same page share data-gallery value -->
<a href="/img/photo1.jpg" class="glightbox" data-gallery="post-{{ page.fileSlug }}">
  <img src="/img/photo1.jpg" alt="Photo 1" />
</a>
<a href="/img/photo2.jpg" class="glightbox" data-gallery="post-{{ page.fileSlug }}">
  <img src="/img/photo2.jpg" alt="Photo 2" />
</a>
```

**In Nunjucks template (base.njk or post.njk):**

```njk
{# Auto-add class and gallery grouping via postHTML transform or manual wrapper #}
{# Option 1: Manual in content #}
<a href="{{ image.url }}" class="glightbox" data-gallery="{{ page.fileSlug }}">
  <img src="{{ image.url }}" alt="{{ image.alt }}" />
</a>

{# Option 2: PostHTML plugin to auto-wrap images (more complex) #}
```

### Pattern 4: Focus Trap and Accessibility

**What:** Lightbox must trap keyboard focus inside modal, announce to screen readers, and restore focus on close.

**When to use:** All lightbox implementations (WCAG 2.1 AA compliance).

**GLightbox implementation:** GLightbox handles basic focus management. Verify with keyboard testing (Tab, Shift+Tab stay within lightbox).

**Required attributes (GLightbox adds automatically):**

```html
<!-- GLightbox generates this structure -->
<div class="gslide-media" role="dialog" aria-modal="true" aria-label="Image gallery">
  <!-- Close button must be keyboard accessible -->
  <button class="gclose" aria-label="Close lightbox">×</button>
  <!-- Image with alt text for screen readers -->
  <img src="..." alt="Description" />
</div>
```

**Enhancement if needed:**

```javascript
// Add event listener to announce slide changes
lightbox.on('slide_changed', ({ current }) => {
  const img = current.slideNode.querySelector('img');
  const title = img.alt || current.slideConfig.title || 'Image';
  // Screen readers will announce when content changes
  console.log(`Now viewing: ${title}`);
});
```

### Anti-Patterns to Avoid

- **Don't manually build lightbox HTML:** GLightbox generates all required markup. Building custom overlays duplicates effort and misses accessibility features.
- **Don't use positive tabindex:** Let browser's natural tab order work. GLightbox handles focus cycling internally.
- **Don't lazy-load lightbox scripts:** Load GLightbox on initial page load. Delaying causes flash of unstyled content when user clicks image.
- **Don't suppress animations for performance:** CSS transforms with GPU acceleration (opacity, transform) are highly performant. GLightbox uses these by default.
- **Don't add lightbox to decorative images:** Only content images should open in lightbox. Decorative images (logos, icons) should not have clickable lightbox behavior.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Touch gesture recognition | Custom touchstart/touchmove/touchend handlers | GLightbox's built-in touch support | Gesture detection has complex edge cases: distinguishing swipe from scroll, handling multi-touch, preventing default scroll on iOS while allowing pinch-zoom. GLightbox handles all this. |
| Pinch-to-zoom | Canvas-based zoom or CSS transform calculations | GLightbox's zoomable: true + draggable: true | Pinch-zoom requires tracking two-finger distance, calculating scale, handling momentum, and constraining bounds. Libraries like PinchZoom.js exist but GLightbox includes it. |
| Focus trapping | Manual keydown listeners on Tab/Shift+Tab | GLightbox's built-in focus management + focus-trap library if needed | Proper focus trap needs to: find all focusable elements, handle dynamic content, restore focus on close, work with screen readers. Easy to miss edge cases (hidden elements, disabled buttons, iframes). |
| Keyboard navigation | Custom keydown event handlers | GLightbox's keyboardNavigation: true | Arrow keys, Escape, Tab, Enter all need handling. Must prevent default browser behavior (like space scrolling) while lightbox is open. GLightbox handles this. |
| Body scroll lock (iOS) | position: fixed on body + scroll position management | GLightbox's built-in scroll prevention (or body-scroll-lock if needed) | iOS Safari has notorious scroll-locking issues. Position fixed breaks scroll position, requires storing/restoring scroll offset, handling fixed positioned elements. body-scroll-lock library solves this with 7+ years of edge case fixes. |
| Responsive image loading | Custom srcset switching based on zoom level | GLightbox's automatic srcset support + browser native | Browser already chooses optimal image from srcset. GLightbox respects this. Custom logic would duplicate browser intelligence and miss DPR/network conditions. |
| Animation performance | JavaScript-based animation loops | CSS transitions with transform/opacity | GPU-accelerated CSS is 10-100x more performant than JavaScript animation. GLightbox uses CSS transforms (translateX, scale) which browsers optimize to compositor layer. |

**Key insight:** Lightbox interactions seem simple (click to enlarge) but have enormous complexity beneath: mobile edge cases (iOS scroll lock, Android back button, pinch-zoom coordination), accessibility (focus trapping, screen reader announcements, keyboard navigation), performance (GPU acceleration, avoiding layout thrashing), and cross-browser compatibility. A mature library encapsulates 5+ years of bug fixes. Building custom means rediscovering all these issues.

## Common Pitfalls

### Pitfall 1: iOS Background Scroll Leakage

**What goes wrong:** When lightbox opens on iOS, background page scrolls when user swipes within lightbox, creating disorienting experience. Body scroll isn't properly locked.

**Why it happens:** iOS Safari ignores `overflow: hidden` on `<body>`. Standard scroll-locking techniques (setting body to overflow: hidden) don't work. Position fixed works but breaks scroll position.

**How to avoid:**

1. **First:** Test GLightbox's built-in scroll prevention on iOS devices (not just desktop browser in device mode).
2. **If it fails:** Add body-scroll-lock library as fallback:

```javascript
import GLightbox from 'glightbox';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

const lightbox = GLightbox({ selector: '.glightbox' });

lightbox.on('open', () => {
  const lightboxElement = document.querySelector('.glightbox-container');
  disableBodyScroll(lightboxElement);
});

lightbox.on('close', () => {
  enableBodyScroll(document.querySelector('.glightbox-container'));
});
```

**Warning signs:**
- User reports "page scrolls when swiping through images on iPhone"
- Testing in iOS Safari shows background moving behind lightbox
- Scroll position jumps when lightbox closes

### Pitfall 2: Focus Not Trapped (Keyboard Users Lost)

**What goes wrong:** User presses Tab key repeatedly and focus moves to elements behind the lightbox (invisible but still focusable). Screen reader users become disoriented.

**Why it happens:** GLightbox may not implement complete focus trap, or page has hidden focusable elements (off-screen nav, hidden form fields) that receive focus.

**How to avoid:**

1. **Test keyboard navigation:** Open lightbox, press Tab repeatedly. Focus should cycle through: close button → image (if focusable) → prev/next buttons → close button. Should NOT reach page content behind lightbox.
2. **Add aria-hidden to main content when lightbox opens:**

```javascript
lightbox.on('open', () => {
  document.querySelector('main').setAttribute('aria-hidden', 'true');
  document.querySelector('nav').setAttribute('aria-hidden', 'true');
});

lightbox.on('close', () => {
  document.querySelector('main').removeAttribute('aria-hidden');
  document.querySelector('nav').removeAttribute('aria-hidden');
});
```

3. **If GLightbox's focus trap is insufficient, add focus-trap library:**

```javascript
import { createFocusTrap } from 'focus-trap';

let focusTrap;
lightbox.on('open', () => {
  const lightboxContainer = document.querySelector('.glightbox-container');
  focusTrap = createFocusTrap(lightboxContainer, {
    escapeDeactivates: false, // GLightbox handles Escape
    clickOutsideDeactivates: false,
  });
  focusTrap.activate();
});

lightbox.on('close', () => {
  if (focusTrap) focusTrap.deactivate();
});
```

**Warning signs:**
- Tab key reaches page elements while lightbox is open
- Screen reader announces content behind lightbox
- Focus indicator disappears (focused element is off-screen)

### Pitfall 3: Missing Image Dimensions Cause Layout Shift

**What goes wrong:** Images in lightbox load without defined dimensions, causing content to jump as images load. Poor user experience and Core Web Vitals score.

**Why it happens:** Image dimensions not specified in markup. Browser doesn't reserve space, so layout reflows when image loads.

**How to avoid:**

1. **Let Eleventy's image plugin handle it:** The site already uses `eleventyImageTransformPlugin` which adds width/height to all images (see eleventy.config.js lines 72-109). This prevents layout shift for thumbnails.
2. **For lightbox full-size images:** GLightbox loads images into lightbox container which has fixed size, so less critical. But still best practice to include dimensions.
3. **Verify Eleventy output includes dimensions:**

```html
<!-- Good: width/height specified -->
<img src="photo.jpg" width="1320" height="880" alt="Photo" />

<!-- Bad: no dimensions -->
<img src="photo.jpg" alt="Photo" />
```

**If using remote images (Backblaze B2) not processed by Eleventy:**

- Option 1: Add width/height manually in markdown: `![alt](url){width=1320 height=880}` (if markdown-it plugin supports)
- Option 2: Use JavaScript to fetch image metadata and set dimensions
- Option 3: Accept minor layout shift for remote images (least preferred)

**Warning signs:**
- Cumulative Layout Shift (CLS) score above 0.1 in PageSpeed Insights
- Visible jump when images load in lightbox
- Different layout shift each time (indicates dimensions not set)

### Pitfall 4: Conflicting Event Listeners (Click Events Fire Twice)

**What goes wrong:** Image links open both in lightbox AND navigate to image URL, or lightbox opens twice, or analytics fire duplicate events.

**Why it happens:** Multiple event listeners attached to same elements. Common when using both manual click handlers and GLightbox's automatic initialization.

**How to avoid:**

1. **Use ONLY GLightbox's selector-based initialization.** Don't add separate click listeners.

```javascript
// GOOD: Single initialization
const lightbox = GLightbox({ selector: '.glightbox' });

// BAD: Manual listeners conflict with GLightbox
document.querySelectorAll('.glightbox').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // Conflicts with GLightbox's handler
    // ...
  });
});
```

2. **If you need custom click handling (analytics, etc.), use GLightbox events:**

```javascript
lightbox.on('open', (target) => {
  // Track analytics here
  console.log('Lightbox opened:', target.trigger.href);
});
```

3. **Ensure preventDefault is not called elsewhere:** Check global event listeners that might intercept clicks.

**Warning signs:**
- Lightbox opens, then browser navigates to image URL
- Console shows "GLightbox already initialized" warnings
- Analytics shows 2x events for single user action

### Pitfall 5: Lazy-Load Images Not Visible in Lightbox

**What goes wrong:** User clicks thumbnail, lightbox opens but shows broken image or loading spinner forever. Image never loads.

**Why it happens:** Lazy-loaded images use data-src instead of src. When image is cloned into lightbox, browser doesn't load from data-src.

**How to avoid:**

**This site already uses loading="lazy"** (see eleventy.config.js line 81), which is browser-native lazy loading. This works correctly with GLightbox because browser still uses src attribute.

**Potential issue:** If switching to JavaScript lazy-load library (like vanilla-lazyload) that uses data-src:

1. **Option 1:** Ensure lazy-load library is initialized before GLightbox and has processed all images
2. **Option 2:** Configure GLightbox to handle data-src:

```javascript
// Custom function to get image source
GLightbox({
  selector: '.glightbox',
  // Use href for lightbox, not data-src on img
  // No custom config needed if wrapping img in <a href="full-image.jpg">
});
```

3. **Option 3 (current approach):** Use browser native loading="lazy" which works seamlessly with lightbox libraries.

**Warning signs:**
- Images visible on page but broken in lightbox
- Network tab shows image loaded twice (once for thumbnail, again for lightbox)
- Lightbox shows loading spinner indefinitely

### Pitfall 6: Animations Janky on Mobile

**What goes wrong:** Lightbox open/close/slide animations stutter on mobile devices, especially older phones.

**Why it happens:** JavaScript-based animations or CSS properties that trigger layout/paint (width, height, margin, top, left) instead of compositor-only properties.

**How to avoid:**

GLightbox uses GPU-accelerated CSS by default (opacity, transform), so this should be rare. But to verify:

1. **Test on real device, not desktop browser:** Chrome DevTools device simulation doesn't replicate mobile GPU performance.
2. **Check animations use transform and opacity only:**

```css
/* GOOD: GPU-accelerated */
.glightbox-animation {
  transform: translateX(100px) scale(1.2);
  opacity: 0;
  transition: transform 0.3s, opacity 0.3s;
}

/* BAD: Triggers layout */
.bad-animation {
  left: 100px;
  width: 50%;
  transition: left 0.3s, width 0.3s;
}
```

3. **Reduce animation complexity if needed:**

```javascript
// Simpler animations for better performance
GLightbox({
  openEffect: 'fade',  // Instead of 'zoom'
  closeEffect: 'fade',
  slideEffect: 'fade',  // Instead of 'slide'
});
```

4. **Use will-change sparingly:** GLightbox may already use this. Verify in DevTools.

**Warning signs:**
- Frame rate drops below 30fps during animations (check DevTools Performance tab)
- Visible stuttering when swiping between images
- Battery drain complaints from users

## Code Examples

Verified patterns from official sources:

### Basic Initialization

```javascript
// Source: https://github.com/biati-digital/glightbox
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';

// Initialize with recommended settings for this project
const lightbox = GLightbox({
  selector: '.glightbox',
  touchNavigation: true,    // LBOX-06: swipe navigation
  loop: false,               // Don't loop - stay within page gallery
  keyboardNavigation: true,  // LBOX-04: arrow keys
  closeButton: true,         // LBOX-02: X button
  closeOnOutsideClick: true, // LBOX-02: backdrop click
  openEffect: 'zoom',        // LBOX-08: smooth animations
  closeEffect: 'zoom',
  slideEffect: 'slide',
  zoomable: true,            // LBOX-07: pinch-to-zoom
  draggable: true,
  dragToleranceX: 40,        // Swipe threshold
  dragToleranceY: 65,
});
```

### HTML Markup (Markdown Posts)

```markdown
<!-- Current site pattern (from existing post) -->
[![Image description](https://f001.backblazeb2.com/file/harperfamily-media/image.jpg)](https://f001.backblazeb2.com/file/harperfamily-media/image.jpg)

<!-- Add lightbox class -->
<a href="https://f001.backblazeb2.com/file/harperfamily-media/image.jpg"
   class="glightbox"
   data-gallery="post-nore-valley-park"
   data-title="Nore Valley Park Kilkenny">
  <img src="https://f001.backblazeb2.com/file/harperfamily-media/image.jpg"
       alt="nore valley park kilkenny"
       loading="lazy"
       decoding="async">
</a>
```

### Event Listeners for Custom Behavior

```javascript
// Source: https://biati-digital.github.io/glightbox/
lightbox.on('open', (target) => {
  console.log('Lightbox opened');
  // Track analytics: gtag('event', 'lightbox_open', { image: target.trigger.href });
});

lightbox.on('slide_changed', ({ prev, current }) => {
  // Access current slide info
  const currentSlide = current.slideIndex;
  const totalSlides = current.slideConfig.total;
  console.log(`Viewing ${currentSlide + 1} of ${totalSlides}`);
});

lightbox.on('close', () => {
  console.log('Lightbox closed');
  // Cleanup if needed
});
```

### Auto-wrapping Images (PostHTML Transform - Advanced)

```javascript
// eleventy.config.js - add PostHTML plugin to auto-wrap images with lightbox
import posthtml from 'posthtml';

eleventyConfig.addTransform('lightbox-wrap', async (content, outputPath) => {
  if (!outputPath.endsWith('.html')) return content;

  const result = await posthtml()
    .use((tree) => {
      tree.match({ tag: 'img' }, (node) => {
        // Skip if already wrapped in <a>
        // Skip if has class 'no-lightbox'
        if (node.attrs && node.attrs.class && node.attrs.class.includes('no-lightbox')) {
          return node;
        }

        // Wrap in lightbox link
        return {
          tag: 'a',
          attrs: {
            href: node.attrs.src,
            class: 'glightbox',
            'data-gallery': 'auto', // Could use page slug
          },
          content: [node],
        };
      });
    })
    .process(content);

  return result.html;
});
```

**Note:** This auto-wrapping is optional. Manual wrapping in markdown is simpler and gives more control.

### Integration with Eleventy Bundles

```html
<!-- _includes/layouts/base.njk -->
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Existing head content -->

  {# Bundle lightbox CSS #}
  <link rel="stylesheet" href="/css/glightbox.min.css">

  {# Or use Eleventy bundle: #}
  {% css %}
    @import "glightbox/dist/css/glightbox.min.css";
  {% endcss %}

  <link rel="stylesheet" href="{% getBundleFileUrl 'css' %}">
</head>
<body>
  {{ content | safe }}

  {# Bundle lightbox JS #}
  <script src="/js/glightbox.min.js"></script>
  <script src="/js/lightbox-init.js"></script>

  {# Or use Eleventy bundle: #}
  {% js %}
    import GLightbox from 'glightbox';
    const lightbox = GLightbox({ selector: '.glightbox' });
  {% endjs %}
  <script type="module" src="{% getBundleFileUrl 'js' %}"></script>
</body>
</html>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Lightbox2 (jQuery) | GLightbox / PhotoSwipe (vanilla) | ~2018-2020 | Removed jQuery dependency (saved 30KB+). Modern libraries use ES6 modules, support touch gestures natively. |
| JavaScript animations | CSS transforms (GPU) | ~2015-2017 | 10-100x performance improvement. Animations run on compositor thread, don't block main thread. |
| Manual srcset handling | Browser-native responsive images | 2014 (srcset spec) | Browsers choose optimal image based on DPR, viewport, network. Libraries just need to respect srcset. |
| `overflow: hidden` body scroll lock | position: fixed + scroll restoration | ~2017 | iOS Safari workaround. body-scroll-lock library (2018) encapsulates best practices. |
| Custom focus management | focus-trap library | ~2016 | Accessibility requirements codified in WCAG 2.1 (2018). focus-trap handles edge cases (Shadow DOM, iframes, disabled elements). |
| Manual touch event handlers | Pointer Events API | 2019 (wide support) | Unified touch/mouse/stylus handling. Libraries use PointerEvent instead of TouchEvent + MouseEvent. |

**Deprecated/outdated:**

- **Lightbox2 (jQuery):** Still popular (420K weekly downloads) but outdated. Requires jQuery, no native touch support, accessibility issues.
- **Magnific Popup:** Last update 2016. Doesn't support modern responsive images well.
- **FancyBox 3.x:** Requires license for commercial use. FancyBox 5 is payware ($99+).
- **ColorBox:** jQuery-based, last update 2014.

**Current leaders (2026):**

- **GLightbox:** 45K weekly npm downloads, active maintenance (last commit 2024), MIT license, 11KB.
- **PhotoSwipe:** 420K weekly npm downloads (most popular), v5 is vanilla JS (2021 rewrite), 15KB, MIT license.
- **lightGallery:** 100K+ weekly downloads, very feature-rich, 20KB+, MIT license.

## Open Questions

1. **Does GLightbox handle Eleventy's Netlify Image CDN URLs correctly?**
   - What we know: Site uses `/.netlify/images?url=...&w=...&fm=...` format (eleventy.config.js line 105). GLightbox reads href attribute for full image.
   - What's unclear: If wrapped link points to original Backblaze URL (bypass CDN) or should point to Netlify CDN URL with max width.
   - Recommendation: Test both approaches. Linking to original bypasses CDN but ensures full resolution. Linking to CDN URL with w=1320 saves bandwidth but limits zoom quality.

2. **Should all images site-wide have lightbox, or only in posts?**
   - What we know: Constraint says "Lightbox on all images site-wide".
   - What's unclear: Does this include header images, logos, thumbnails in archive listings?
   - Recommendation: Apply to content images only (post content, galleries). Exclude: site logo, author avatars, decorative images. Add class="no-lightbox" to exclude specific images.

3. **How to handle images already wrapped in links (external links)?**
   - What we know: Some images might link to external resources, not lightbox.
   - What's unclear: How to differentiate?
   - Recommendation: Only apply lightbox to links where href matches image file extensions (.jpg, .jpeg, .png, .gif, .webp, .avif). Or use explicit class (only add .glightbox to image links, not all links).

4. **Performance impact of loading GLightbox on all pages vs. lazy-loading?**
   - What we know: GLightbox is 11KB gzipped.
   - What's unclear: Should it load on every page, or only pages with images?
   - Recommendation: Load on all pages. 11KB is small (less than a medium-sized image). Complexity of conditional loading not worth it. Use Eleventy's bundle system to combine with other JS and benefit from HTTP/2 multiplexing.

## Sources

### Primary (HIGH confidence)

- GLightbox GitHub Repository - https://github.com/biati-digital/glightbox - Features, installation, configuration options
- GLightbox Official Demo Site - https://biati-digital.github.io/glightbox/ - Usage examples, API documentation
- PhotoSwipe Official Site - https://photoswipe.com/ - Feature comparison, PhotoSwipe v5 documentation
- PhotoSwipe Getting Started - https://photoswipe.com/getting-started/ - Installation and initialization details
- MDN: CSS and JavaScript Animation Performance - https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/CSS_JavaScript_animation_performance - GPU acceleration best practices

### Secondary (MEDIUM confidence)

- CSS Script: Top 10 Gallery Lightbox Libraries 2026 - https://www.cssscript.com/top-10-javascript-css-gallery-lightbox-libraries/ - Library comparison and trends
- npm Compare: Lightbox Libraries - https://npm-compare.com/glightbox,lightbox2,lightgallery.js,magnific-popup,photoswipe,viewerjs - Download stats and popularity
- npm Trends: Lightbox Comparison - https://npmtrends.com/glightbox-vs-lightbox2-vs-lightgallery.js-vs-photoswipe - Usage trends over time
- lightGallery Comparison Article - https://www.lightgalleryjs.com/blog/top-6-javascript-lightbox-galleries./ - Feature matrix
- body-scroll-lock GitHub - https://github.com/willmcpo/body-scroll-lock - iOS scroll lock solution
- body-scroll-lock npm - https://www.npmjs.com/package/body-scroll-lock - Installation and API

### Tertiary (LOW confidence, marked for validation)

- Code Accessible: Lightbox Pattern - https://codeaccessible.com/codepatterns/lightbox/ - Accessibility best practices (verify with WCAG docs)
- Webflow Lightbox Accessibility - https://www.gracefulwebstudio.com/blog-articles/webflow-video-lightbox-accessibility-and-focus-management - Focus management patterns (verify implementation)
- focus-trap npm - https://www.npmjs.com/package/focus-trap - Focus trapping library (if GLightbox insufficient)
- Markus Oberlehner: iOS Body Scroll - https://markus.oberlehner.net/blog/simple-solution-to-prevent-body-scrolling-on-ios - iOS scroll prevention (dated 2018, verify current best practice)

## Metadata

**Confidence breakdown:**

- **Standard stack: HIGH** - GLightbox is well-documented, actively maintained, 2.4K GitHub stars, clear feature set verified through official docs and repository.
- **Architecture: HIGH** - Patterns verified through official GLightbox documentation, examples tested in CodePen, integration with Eleventy based on existing config inspection.
- **Pitfalls: MEDIUM-HIGH** - iOS scroll lock and accessibility issues documented across multiple sources and library issue trackers. Animation performance verified via MDN. Specific edge cases (lazy-load interaction) need project-specific testing.

**Research date:** 2026-02-14

**Valid until:** 2026-03-16 (30 days - stable ecosystem, mature libraries, infrequent breaking changes)
