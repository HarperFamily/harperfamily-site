# Architecture

**Analysis Date:** 2026-02-14

## Pattern Overview

**Overall:** Static Site Generator (SSG) with Content Management System (CMS) integration

**Key Characteristics:**
- Eleventy-based 11ty static site generator (v3.1.2)
- Content-driven architecture with markdown and Nunjucks templating
- Pages CMS integration for content management via git-based workflow
- Progressive enhancement with inline CSS/JS bundling
- Netlify Forms for server-side form handling (contact form)
- Image optimization pipeline via Netlify Image CDN (production) or local processing (dev)

## Layers

**Data Layer:**
- Purpose: Centralized metadata and configuration
- Location: `_data/metadata.json`
- Contains: Site-wide configuration (title, description, URL, author info)
- Depends on: Static JSON files
- Used by: All templates via global `metadata` object

**Template/Layout Layer:**
- Purpose: Define page structure and presentation
- Location: `_includes/layouts/` (base, post, page, home, blog, contact)
- Contains: Nunjucks (njk) template files with HTML structure
- Depends on: Components, filters, data layer
- Used by: Content files (markdown pages) and individual posts

**Component Layer:**
- Purpose: Reusable UI building blocks
- Location: `_includes/components/` (head, nav, footer, form, postslist, latestposts, subscribe)
- Contains: Partial Nunjucks templates for specific UI sections
- Depends on: Layout layer, assets
- Used by: Layout files and other components

**Asset Layer:**
- Purpose: Styling, scripting, and font delivery
- Location: `_includes/assets/` (css/inline.css, js/inline.js)
- Contains: Inline CSS (bundled and minified) and inline JS (Netlify Identity widget)
- Depends on: clean-css, uglify-js minification
- Used by: head component for inline delivery
- Note: Public fonts and static assets in `public/` directory

**Content Layer:**
- Purpose: Markdown source content that gets transformed to HTML
- Location: `content/posts/` (blog posts), `content/pages/` (static pages), `content/feed/` (RSS)
- Contains: Markdown files with YAML frontmatter
- Depends on: Post/page JSON configuration files, layout assignments
- Used by: Eleventy to generate static HTML files

**Configuration Layer:**
- Purpose: Eleventy configuration, plugins, and custom filters
- Location: `eleventy.config.js`, `_config/filters.js`
- Contains: Plugin setup (navigation, RSS feed, image transform, syntax highlighting), collections, filters, transforms
- Depends on: Eleventy plugins, external packages
- Used by: Build process to configure SSG behavior

**CMS Configuration Layer:**
- Purpose: Define content editing interface and workflow
- Location: `.pages.yml`
- Contains: Pages CMS configuration for posts collection and site settings
- Depends on: Media configuration pointing to `content/img`
- Used by: Pages CMS UI for git-based content editing

## Data Flow

**Page Build Flow:**

1. Content files (markdown in `content/posts/` or `content/pages/`) are read
2. Frontmatter (YAML) extracted and parsed (layout, title, date, author, tags, etc.)
3. Markdown body converted to HTML
4. Assigned layout template loaded from `_includes/layouts/`
5. Layout includes reusable components from `_includes/components/`
6. Global data from `_data/metadata.json` merged into template context
7. Eleventy filters applied (date formatting, CSS minification, etc.)
8. Image transform plugin processes `<img>` and `<picture>` tags
  - Dev: Local image processing with AVIF/WebP/auto formats
  - Prod: Metadata-only (stats) with Netlify Image CDN URL transformation
9. Syntax highlighting applied via prismjs plugin
10. HTML minified via transform (clean whitespace, remove comments)
11. Static files from `public/` copied to output
12. Final HTML written to `_site/` output directory

**Collection Processing:**

- Posts collection: All files in `content/posts/` matching posts.json layout
- Authors collection: Dynamically built from post author frontmatter field
- Tags collection: Auto-generated from post tags field
- RSS feed: Generated from posts collection (Atom format, limit 10)
- Navigation: Built from eleventyNavigation frontmatter keys with ordering

**State Management:**

- No client-side state management (static HTML output)
- Netlify Forms handles form submissions server-side
- Netlify Identity widget manages authentication for admin access
- Umami analytics tracks client-side page views and interactions
- Service of content is read-only (no dynamic database queries at runtime)

## Key Abstractions

**Template Inheritance:**

- `layouts/base.njk`: Root HTML document structure (doctype, head, body, scripts)
- `layouts/post.njk`: Extends base, adds article metadata (date, author, tags)
- `layouts/page.njk`: Extends base, simple page wrapper with title
- `layouts/home.njk`: Extends base, featured content, latest posts, tags
- `layouts/blog.njk`: Extends base, posts list, search form
- `layouts/contact.njk`: Extends base, form component inclusion

**Component Composition:**

- `components/head.njk`: Meta tags, stylesheets, tracking scripts, fonts
- `components/nav.njk`: Navigation built from eleventyNavigation metadata
- `components/footer.njk`: Copyright, footer links (blog, contact, RSS, stats)
- `components/form.njk`: Contact form with Netlify Forms integration and reCAPTCHA
- `components/postslist.njk`: Renders collection of posts with metadata
- `components/latestposts.njk`: Shows N recent posts (configured per page)
- `components/subscribe.njk`: Email subscription call-to-action

**Filter Functions:**

- `readableDate`: Formats dates as "d LLLL yyyy" (e.g., "14 February 2026") via Luxon
- `machineDate`: Formats dates as "yyyy-MM-dd" for machine-readable attributes
- `cssmin`: Minifies CSS using clean-css library
- `jsmin`: Minifies JavaScript using uglify-js library
- `head`: Gets first N elements from array
- `min`: Gets minimum number from arguments

**Transform Functions:**

- `htmlmin`: Minifies HTML output (doctype, comments, whitespace) for production
- `eleventyImageTransformPlugin`: Auto-transforms all `<img>` tags to responsive format

**Collections:**

- `posts`: All markdown files in content/posts/ with posts.json configuration
- `authors`: Dynamically derived from post author fields
- `all`: All pages and posts (used for navigation building)

## Entry Points

**Build Entry Point:**

- Location: `eleventy.config.js`
- Triggers: `npm run build`, `npm run start`, or git push to Netlify
- Responsibilities:
  - Configure Eleventy plugins (navigation, RSS, image, syntax highlighting)
  - Define directory structure (input: content, includes: _includes, data: _data, output: _site)
  - Register filters and transforms
  - Set up collections (posts, authors)
  - Configure image CDN behavior for production vs development
  - Add shortcodes for current date/year

**Content Entry Points:**

- `content/pages/home.md`: Home page (layout: home.njk, permalink: /)
- `content/pages/blog.md`: Blog index (layout: blog.njk, permalink: /blog/)
- `content/pages/about.md`: About page (layout: page.njk)
- `content/pages/contact.md`: Contact page (layout: contact.njk with form)
- `content/posts/*.md`: Individual blog posts (layout: post.njk, permalink: /blog/{slug}/)

**Admin Entry Point:**

- Location: `admin/` (configured in eleventy.config.js passthrough copy)
- Accessed via: Netlify Identity widget authentication
- Purpose: Pages CMS interface for editing content via `.pages.yml`

**Feed Entry Point:**

- Location: `content/feed/pretty-atom-feed.xsl`
- Generated to: `_site/feed/feed.xml` (Atom 1.0 format)
- Limit: 10 most recent posts from posts collection

## Error Handling

**Strategy:** Graceful degradation with fallbacks

**Patterns:**

- Image transforms fail non-blocking: `failOnError: false` in image plugin allows build to continue if remote images unavailable
- Form submissions handled by Netlify Forms (server-side validation and reCAPTCHA)
- Minification errors logged but non-fatal: UglifyJS errors log to console but return original code
- Navigation falls back to manually defined links if eleventyNavigation data missing
- Analytics and Netlify Identity are async-loaded, don't block page rendering

## Cross-Cutting Concerns

**Logging:**

- Console output via cross-env DEBUG flags for development
- Eleventy built-in logging with optional color disable via NODE_DISABLE_COLORS
- Debug modes: `DEBUG=Eleventy*` for full debug, `DEBUG=Eleventy:Benchmark*` for performance

**Validation:**

- Client-side form validation via HTML5 attributes (required, type, pattern)
- Email pattern validation with RFC-compliant regex
- Netlify Forms reCAPTCHA for spam prevention
- Netlify honeypot (bot-field) for bot detection

**Authentication:**

- Netlify Identity for admin access (widget in head.njk)
- Pages CMS reads/writes via git-based workflow
- No authentication for public-facing content (static HTML)

**Image Optimization:**

- Development: Local processing with clean-css and multiple formats (AVIF, WebP, auto)
- Production: Netlify Image CDN with URL transformation to `/.netlify/images` endpoint
- Responsive formats: 330px, 660px, 990px, 1320px widths
- Lazy loading: loading="lazy" and decoding="async" on all images

**Performance:**

- CSS bundled and inlined in `<head>` for critical path optimization
- JavaScript bundled and inlined (Netlify Identity widget only)
- HTML minified (whitespace collapse, comment removal)
- Image CDN URL transformation in production for edge caching
- Syntax highlighting via prismjs (loaded on demand for code blocks)

---

*Architecture analysis: 2026-02-14*
