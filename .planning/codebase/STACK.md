# Technology Stack

**Analysis Date:** 2026-02-14

## Languages

**Primary:**
- JavaScript (ES modules) - Eleventy configuration and filters
- Nunjucks - Template engine for layouts and components
- Markdown (YAML frontmatter) - Content authoring

**Secondary:**
- Liquid - Markdown template engine
- HTML - Passthrough templates

## Runtime

**Environment:**
- Node.js v24 (specified in `.nvmrc`)
- Runtime mode detection: `ELEVENTY_RUN_MODE` (build or serve)
- Environment variant: `NODE_ENV` (production or development)

**Package Manager:**
- npm (v11.9.0)
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Eleventy v3.1.2 - Static site generator
  - Configuration: `eleventy.config.js` (ES module format)
  - Build command: `npx @11ty/eleventy`
  - Serve command: `npx @11ty/eleventy --serve`

**Build & Processing:**
- clean-css v5.3.2 - CSS minification
- html-minifier-terser v7.2.0 - HTML minification
- uglify-js v3.17.4 - JavaScript minification
- cross-env v7.0.3 - Cross-platform environment variables

**Template Engines & Utilities:**
- luxon v3.6.1 - Date formatting and manipulation
- prismjs v1.30.0 - Syntax highlighting for code blocks

## Key Dependencies

**Critical:**
- @11ty/eleventy v3.1.2 - Core SSG framework
- @11ty/eleventy-img v6.0.4 - Image optimization and transformation
- @11ty/eleventy-navigation v1.0.4 - Navigation plugin for menu generation
- @11ty/eleventy-plugin-rss v2.0.4 - RSS/Atom feed generation
- @11ty/eleventy-plugin-syntaxhighlight v5.0.2 - Code syntax highlighting

**Image Processing:**
- @11ty/eleventy-img v6.0.4
  - Formats: AVIF, WebP, auto-fallback
  - Widths: 330px, 660px, 990px, 1320px
  - Lazy loading enabled by default
  - Integration: Netlify Image CDN in production (see `eleventy.config.js` line 100-106)

## Configuration

**Environment:**
- Development: `npm start` - Watch mode with live reload
- Production: `npm run build` - Optimized production build
- Debug modes available:
  - `npm run debug` - Verbose Eleventy output
  - `npm run debugstart` - Debug with serve
  - `npm run benchmark` - Performance benchmarking

**Key Environment Variables:**
- `ELEVENTY_RUN_MODE` - "build" (production) or "serve" (development)
  - Controls: Draft filtering, image optimization strategy
- `NODE_ENV` - "production" or "development"
  - Affects: CDN image URL transformation
- `DEBUG` - Set to "Eleventy*" or "Eleventy:Benchmark*" for debug output

**Build Targets:**
- Input directory: `content/` (Markdown, HTML, templates)
- Output directory: `_site/` (generated static HTML)
- Passthrough directories: `public/` → `/` (static assets)
- Admin files: `admin/` → `/admin/` (Pages CMS)

## Platform Requirements

**Development:**
- Node.js v24+
- npm (v6+ minimum, v11.9.0+ recommended)
- Git (for version control and Pages CMS integration)

**Production:**
- Netlify hosting
- Build command: `npm run build` (as specified in `netlify.toml`)
- Publish directory: `_site/`
- Node.js runtime available during build

**Cache Management:**
- Eleventy image cache: `.cache/` directory
- Netlify cache plugin: `netlify-plugin-cache` caches `.cache/` and `_site/img/`

## Build Configuration

**Eleventy Config Files:**
- `eleventy.config.js` - Main configuration (ES modules)
  - Template formats: md, njk, html, liquid
  - Output path: `_site/`
  - Includes path: `_includes/`
  - Data path: `_data/`

**Netlify Config:**
- `netlify.toml` - Deployment and build settings
  - Build command: `eleventy`
  - Publish directory: `_site`
  - Plugin: `netlify-plugin-cache` for build acceleration
  - Remote image whitelist: Backblaze B2 CDN (`https://f001.backblazeb2.com/file/harperfamily-media/.*`)

**CMS Configuration:**
- `.pages.yml` - Pages CMS integration
  - Media storage: `content/img/` → published to `/img`
  - Collections: posts (markdown files), site settings
  - Handles: Content editing, image uploads, metadata

## Asset Processing Pipeline

**CSS:**
- Inline CSS in layout files (`_includes/`)
- Minified via clean-css filter: `{{ content | cssmin }}`
- Per-page CSS bundling via `eleventyConfig.addBundle("css")`

**JavaScript:**
- Minimal vanilla JS (inlined in templates)
- Minified via uglify-js filter: `{{ content | jsmin }}`
- Per-page JS bundling via `eleventyConfig.addBundle("js")`

**HTML:**
- Minified via html-minifier-terser transform
- Doctype shortened, comments removed, whitespace collapsed

**Images:**
- Automatic HTML transform for `<img>` and `<picture>` tags
- Responsive widths: 330, 660, 990, 1320px
- Formats: AVIF (primary), WebP (fallback), auto (final fallback)
- Production: Netlify Image CDN URL transformation at `/.netlify/images?url=...&w=...&fm=...`
- Development: Local processing with fallback metadata

---

*Stack analysis: 2026-02-14*
