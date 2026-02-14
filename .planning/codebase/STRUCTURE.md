# Codebase Structure

**Analysis Date:** 2026-02-14

## Directory Layout

```
harperfamily-site/
├── _includes/              # Reusable templates and assets
│   ├── components/         # Partial templates for UI building blocks
│   ├── layouts/            # Page layout templates
│   └── assets/             # Inline CSS and JS
├── _config/                # Configuration modules
├── _data/                  # Global data files
├── content/                # Source content for SSG
│   ├── posts/              # Blog posts (markdown)
│   ├── pages/              # Static pages (markdown)
│   ├── img/                # Images for CMS
│   └── feed/               # Feed configuration
├── public/                 # Static assets (copied to _site)
│   ├── img/                # Static images
│   └── fonts/              # Web fonts
├── _site/                  # Generated output (build artifact, not committed)
├── .planning/              # GSD planning documents
├── .github/                # GitHub workflow configuration
├── .vscode/                # VS Code settings
├── eleventy.config.js      # Eleventy build configuration
├── .pages.yml              # Pages CMS configuration
├── package.json            # Node dependencies
├── netlify.toml            # Netlify deployment configuration
└── README.md               # Project documentation
```

## Directory Purposes

**`_includes/`:**
- Purpose: Reusable Nunjucks templates that don't generate output on their own
- Contains: Layouts, components, assets (CSS, JS)
- Key files: `layouts/base.njk` (root template), `components/*` (reusable partials)

**`_includes/components/`:**
- Purpose: Reusable UI partial templates
- Contains: Individual `.njk` files for specific sections
- Key files:
  - `head.njk`: Meta tags, stylesheets, tracking, fonts
  - `nav.njk`: Navigation menu with eleventyNavigation
  - `footer.njk`: Site footer with links
  - `form.njk`: Contact form with Netlify Forms integration
  - `postslist.njk`: Blog posts list template
  - `latestposts.njk`: Recent posts showcase
  - `subscribe.njk`: Newsletter subscription CTA

**`_includes/layouts/`:**
- Purpose: Page-level layout templates extending base.njk
- Contains: Template inheritance hierarchy
- Key files:
  - `base.njk`: Root HTML structure (header, main, footer, scripts)
  - `post.njk`: Blog post template with date, author, tags
  - `page.njk`: Simple page template
  - `home.njk`: Home page with featured content and latest posts
  - `blog.njk`: Blog index with posts list and search
  - `contact.njk`: Contact page with form

**`_includes/assets/`:**
- Purpose: Inline CSS and JavaScript (bundled into page)
- Contains: `.css` and `.js` files
- Key files:
  - `css/inline.css`: Core styles (inlined in head)
  - `js/inline.js`: Netlify Identity widget initialization

**`_config/`:**
- Purpose: Eleventy configuration modules
- Contains: Plugin setup and custom functions
- Key files:
  - `filters.js`: Eleventy filters (date formatting, minification, array operations)

**`_data/`:**
- Purpose: Global data available to all templates
- Contains: JSON data files
- Key files:
  - `metadata.json`: Site-wide configuration (title, URL, author)

**`content/`:**
- Purpose: Source content in markdown (input for Eleventy)
- Contains: Pages, posts, images, and feed configuration
- Note: All markdown files are processed and output to `_site/`

**`content/posts/`:**
- Purpose: Blog post collection
- Contains: Markdown files with YAML frontmatter (date, author, tags, title)
- Configuration: `posts.json` (layout: layouts/post.njk, permalink pattern)
- Auto-linked: `content/feed/feed.xml` generated from this collection

**`content/pages/`:**
- Purpose: Static page content
- Contains: Markdown files for main site pages (home, about, blog, contact)
- Configuration: `pages.json` (layout: layouts/page.njk)
- Special files:
  - `home.md`: Home page (permalink: /)
  - `blog.md`: Blog index (permalink: /blog/)
  - `contact.md`: Contact page (uses contact layout)
  - `about.md`: About page
  - `contact-success.md`: Form success confirmation page

**`content/img/`:**
- Purpose: Image source directory for CMS
- Contains: User-uploaded images via Pages CMS media management
- Output: Copied to `_site/img/` during build

**`content/feed/`:**
- Purpose: RSS/Atom feed configuration and styling
- Contains: XSL stylesheet for feed formatting
- Key files:
  - `pretty-atom-feed.xsl`: Feed display stylesheet

**`public/`:**
- Purpose: Static assets copied verbatim to `_site/`
- Contains: Images, fonts, favicons (not processed by Eleventy)
- Key files:
  - `favicon.ico`, `icon.svg`, `apple-touch-icon.png`: Favicons
  - `img/`: Static images (e.g., harper-family-2013.jpg)
  - `fonts/VeronaSerial/`: Custom font files (woff, woff2)
- Note: Contents copied to output root (public/ → _site/)

**`_site/`:**
- Purpose: Generated static HTML output
- Contains: Build artifacts (NOT committed to git)
- Structure mirrors content/ and includes public/ at root
- Generated via: `npm run build`

**`.planning/codebase/`:**
- Purpose: GSD mapping documents
- Contains: Architecture and structure analysis
- Key files: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md

**`.github/`:**
- Purpose: GitHub workflow configuration
- Contains: CI/CD workflows (if configured)

**`node_modules/`:**
- Purpose: NPM dependencies
- Contains: Eleventy, plugins, and utility packages
- Generated via: `npm install`
- Note: NOT committed to git (excluded by .gitignore)

## Key File Locations

**Entry Points:**

- `eleventy.config.js`: Main build configuration; Eleventy reads this first
- `content/pages/home.md`: Home page entry (permalink: /)
- `content/pages/blog.md`: Blog index entry (permalink: /blog/)
- `content/posts/`: All blog posts (individual URLs generated from titles)

**Configuration:**

- `package.json`: Build scripts and dependencies
- `eleventy.config.js`: Eleventy plugin setup, filters, collections
- `.pages.yml`: Pages CMS content management configuration
- `netlify.toml`: Netlify deployment settings
- `_data/metadata.json`: Site title, description, URL, author

**Core Logic:**

- `_config/filters.js`: Nunjucks filters (date, CSS/JS minification, array operations)
- `_includes/layouts/base.njk`: Root HTML template with header, main, footer
- `_includes/components/*`: Reusable UI partials (nav, footer, form, posts list)

**Testing:**

- Not applicable (static site generator, no unit tests)

## Naming Conventions

**Files:**

- Markdown files: `YYYY-MM-DD-slug.md` for posts, `slug.md` for pages
- Nunjucks templates: `kebab-case.njk` (e.g., `base.njk`, `postslist.njk`)
- JavaScript modules: `camelCase.js` (e.g., `eleventy.config.js`, `filters.js`)
- CSS files: `inline.css` (single inlined stylesheet)
- Data files: `camelCase.json` (e.g., `metadata.json`)

**Directories:**

- Component directory: `components/` (plural)
- Layout directory: `layouts/` (plural)
- Asset subdirectories: `assets/css/`, `assets/js/` (plural)
- Content subdirectories: `posts/`, `pages/`, `img/`, `feed/` (plural)
- Config directory: `_config/` (singular, underscore prefix indicates private)
- Data directory: `_data/` (singular, underscore prefix indicates private)

**Collections and Variables:**

- Collection names: lowercase plural (`posts`, `authors`, `all`)
- Template frontmatter keys: camelCase (`title`, `eleventyNavigation`, `numberOfLatestPostsToShow`)
- Global variables: camelCase via plugins and filters

## Where to Add New Code

**New Blog Post:**

1. Create: `content/posts/YYYY-MM-DD-title.md`
2. Structure:
   ```markdown
   ---
   title: "Post Title"
   date: YYYY-MM-DD
   author: "Author Name"
   tags: ["tag1", "tag2"]
   ---

   Content in markdown...
   ```
3. Layout: Automatically uses `layouts/post.njk` (via posts.json)
4. Output: Generates `_site/blog/{title-slug}/index.html`

**New Static Page:**

1. Create: `content/pages/slug.md`
2. Structure:
   ```markdown
   ---
   layout: layouts/page.njk
   title: "Page Title"
   date: YYYY-MM-DD
   permalink: /page-slug/
   eleventyNavigation:
     key: "Nav Label"
     order: 3
   ---

   Content in markdown...
   ```
3. Navigation: Add `eleventyNavigation` frontmatter to appear in nav (see home.md, blog.md)
4. Output: Generates `_site/page-slug/index.html`

**New Layout:**

1. Create: `_includes/layouts/name.njk`
2. Structure:
   ```nunjucks
   ---
   layout: layouts/base.njk
   ---
   <h1>{{ title }}</h1>
   {{ content | safe }}
   ```
3. Extend: from `layouts/base.njk` to inherit header/footer/scripts
4. Use: Reference in page frontmatter `layout: layouts/name.njk`

**New Component:**

1. Create: `_includes/components/name.njk`
2. Structure: Reusable partial without frontmatter
3. Include: In layouts or other components via `{% include "components/name.njk" %}`
4. Pass data: Via template variables from parent context

**New Filter:**

1. Edit: `_config/filters.js`
2. Add: `eleventyConfig.addFilter("filterName", (input) => { return output; })`
3. Use: In templates via `{{ variable | filterName }}`

**New Style:**

1. Edit: `_includes/assets/css/inline.css` (single stylesheet)
2. Note: Minified via cssmin filter in build process
3. Impact: Inlined in every page `<head>`

**New JavaScript:**

1. Edit: `_includes/assets/js/inline.js` (single file, Netlify Identity only)
2. Or: Add to `<script>` tags in specific templates
3. Bundled: Via Eleventy bundle plugin into `/dist/bundle.js`

**New Global Data:**

1. Edit: `_data/metadata.json` or create `_data/custom.json`
2. Access: In templates via `metadata.property` or `custom.property`

## Special Directories

**`_site/` (Output):**
- Purpose: Generated static HTML output
- Generated: Via `npm run build`
- Committed: NO (in .gitignore)
- Contents: Mirror of content/ with public/ at root level
- Deployment: This directory pushed to Netlify for hosting

**`.cache/` (Build Cache):**
- Purpose: Eleventy dependency cache
- Generated: During build process
- Committed: NO (in .gitignore)
- Purpose: Speeds up subsequent builds by caching dependencies

**`node_modules/` (Dependencies):**
- Purpose: NPM installed packages
- Generated: Via `npm install`
- Committed: NO (in .gitignore)
- Contains: Eleventy, plugins, and utilities (e.g., clean-css, uglify-js, luxon)

**`admin/` (CMS Interface):**
- Purpose: Pages CMS admin interface
- Configured: In eleventy.config.js passthrough copy
- Copied to: `_site/admin/`
- Access: Via Netlify Identity authentication
- Management: Content defined in `.pages.yml`

---

*Structure analysis: 2026-02-14*
