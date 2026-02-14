# Coding Conventions

**Analysis Date:** 2026-02-14

## Naming Patterns

**Files:**
- JavaScript/config files: `camelCase` with `.js` extension
  - Examples: `eleventy.config.js`, `filters.js`, `inline.js`
- Nunjucks template files: `kebab-case` with `.njk` extension
  - Layouts: `base.njk`, `post.njk`, `contact.njk` (in `_includes/layouts/`)
  - Components: `form.njk`, `nav.njk`, `footer.njk` (in `_includes/components/`)
- Markdown files: `kebab-case` with `.md` extension, prefixed with date for posts
  - Examples: `2013-03-25-nore-valley-park.md`, `markdown-demo.md`

**Functions:**
- camelCase for function names
  - Examples: `readableDate`, `machineDate`, `addFilter`, `addShortcode`
- Arrow functions and regular functions both used
- Filter names use camelCase: `readableDate`, `cssmin`, `jsmin`, `head`, `min`

**Variables:**
- camelCase for local variables and object properties
  - Examples: `numberOfLatestPostsToShow`, `postsCount`, `latestPostsCount`, `showTags`
- kebab-case for HTML attributes and data attributes
  - Examples: `data-current`, `data-netlify`, `data-netlify-honeypot`, `autocomplete`, `placeholder`
- UPPER_SNAKE_CASE for environment variables
  - Examples: `ELEVENTY_RUN_MODE`, `NODE_ENV`, `NODE_DISABLE_COLORS`

**Types:**
- Not applicable - codebase uses vanilla JavaScript without TypeScript

**Constants:**
- Uppercase with underscores where used
- Configuration values often declared as constants at top of functions
  - Example: `numberOfLatestPostsToShow = 3` (actually const in Nunjucks context)

## Code Style

**Formatting:**
- No explicit formatter configured (no `.prettierrc`, ESLint, or similar)
- Indentation: 2 spaces (observed throughout `.njk` files and `.js` files)
- Line length: No strict limit observed, but generally readable

**Linting:**
- No ESLint or linting configuration present
- Code is not linted - relies on developer discipline

**JavaScript Style:**
- ES6 modules: `import`/`export` syntax used throughout
  - Example: `import { DateTime } from "luxon"`
- Arrow functions preferred in some contexts, regular functions in others
  - Regular functions in filter definitions: `eleventyConfig.addFilter("readableDate", (dateObj) => { ... })`
- Ternary operators used for simple conditionals
  - Example: `fileFormat === "jpeg" ? "jpg" : format`

## Import Organization

**Order (in JavaScript files):**
1. Third-party library imports
2. Local configuration/plugin imports
3. Export statements

**Examples from codebase:**
```javascript
// eleventy.config.js
import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import pluginFilters from "./_config/filters.js";

export default async function (eleventyConfig) { ... }
export const config = { ... }
```

**Nunjucks Includes:**
- Relative paths with leading `./` or just the directory
- Examples: `{% include "components/head.njk" %}`, `{% include "assets/js/inline.js" %}`

**Path Aliases:**
- Not used; relative paths throughout

## Error Handling

**Patterns:**
- Try-catch not heavily used
- Inline null-coalescing: `post.data.title ? ... : "Untitled"`
- Safe property access: `this.page?.outputPath` (optional chaining)
- Return fallback values: `return code;` after error in jsmin filter
- Logging errors to console: `console.log("UglifyJS error: ", minified.error);`

**Philosophy:**
- Non-blocking failures allowed - errors logged but processing continues
- HTML minification failure returns unminified code instead of throwing

## Logging

**Framework:** `console` (native)

**Patterns:**
- Only used for development/build-time issues
  - Example: `console.log("UglifyJS error: ", minified.error);`
- No structured logging or log levels
- Build/debug output available via environment variables: `DEBUG=Eleventy* npm run debug`

## Comments

**When to Comment:**
- Sparse comments - code is mostly self-documenting
- Comments explain non-obvious decisions
  - Example: `// Netlify Image CDN expects a 'url' param for the source image...`
  - Example: `// Don't fail build when remote images are unreachable (e.g. offline)`
  - Example: `// Only enable Netlify Image CDN URL transformation in production builds`
- Configuration objects often have inline comments explaining options

**JSDoc/TSDoc:**
- Not used in codebase
- No function documentation blocks observed

**Commented-Out Code:**
- Present in some files
  - Example in `_includes/components/postslist.njk`: `{# <small>{{ post.date | readableDate }} by ... #}` (Nunjucks comment syntax)
  - Example in `_includes/components/latestposts.njk`: `{# <p>{{ morePosts }} more post... #}`

## Function Design

**Size:**
- Filter functions: Very small (2-10 lines typical)
- Shortcodes: Small (1-5 lines)
- Configuration functions: Medium (5-30 lines)
- Main config: Larger (168 lines total in `eleventy.config.js`)

**Parameters:**
- Minimal parameters, typically just the data being processed
  - Example: `(dateObj)`, `(array, n)`, `(...numbers)`
- Configuration API uses chained method calls rather than large parameter objects

**Return Values:**
- Filters return transformed values (strings, arrays, objects)
- Some filters return `undefined` implicitly when no explicit return (e.g., `addFilter` calls)
- Safe returns: return empty arrays/objects rather than null
  - Example: `return [];` for empty head filter result

## Module Design

**Exports:**
- Two patterns observed:
  1. Default export of async function (main config): `export default async function(eleventyConfig) { ... }`
  2. Default export of regular function (filters): `export default function(eleventyConfig) { ... }`
  3. Named exports for data: `export const config = { ... }`

**Files per Concern:**
- `eleventy.config.js` - Main configuration (collections, plugins, passthrough copy)
- `_config/filters.js` - All Eleventy filters and transforms
- `_includes/assets/js/inline.js` - Inline client-side script
- Component layout split by responsibility:
  - `_includes/layouts/base.njk` - HTML structure, bundles, head/footer includes
  - `_includes/components/*.njk` - Reusable UI elements
  - `_includes/assets/css/inline.css` - Inline critical CSS

**Reusable Components:**
- Components designed as Nunjucks includes without parameters in most cases
- Example: `{% include "components/head.njk" %}` (accesses global metadata, page data)
- Some components use local Nunjucks variables set in parent templates
  - Example: `postslist.njk` uses variables from `latestposts.njk`: `postslist`, `postslistCounter`, `showTags`

## Nunjucks Template Conventions

**Whitespace Control:**
- `{%-` syntax used to strip whitespace
  - Example: `{%- for entry in navPages %}` and `{%- endif -%}`
  - Purpose: Prevent extra spaces in rendered HTML

**Comments:**
- Nunjucks comment syntax: `{# ... #}`
- Example: `{# <style> content and adds a {% css %} paired shortcode #}`

**Filters in Templates:**
- Pipe syntax: `{{ dateObj | readableDate }}`
- Multiple filters: `{{ collections.posts | head(-1 * numberOfLatestPostsToShow) }}`
- Local filters defined in `_config/filters.js` and registered with `eleventyConfig.addFilter()`

**Shortcodes:**
- One-line shortcodes:
  - `{% currentBuildDate %}` - Returns ISO date string
  - `{% currentBuildYear %}` - Returns current year
- Multi-line shortcodes: Paired shortcodes for CSS/JS bundling
  - `{% css %} ... {% endcss %}`
  - `{% js %} ... {% endjs %}`

## Data and Frontmatter

**JSON Configuration Files:**
- `_data/metadata.json` - Global metadata for site
- `content/posts/posts.json` - Default post properties (layout, permalink, author, tags)
- `content/pages/pages.json` - Default page properties

**Markdown Frontmatter:**
- YAML format in markdown files
- Example properties: `layout`, `title`, `author`, `tags`, `draft`, `summary`, `date`

## Performance Considerations

**Minification:**
- HTML, CSS, and JS minification built into build pipeline
- Filters: `cssmin`, `jsmin` in `_config/filters.js`
- Transform: `htmlmin` for all HTML output
- Inline critical CSS to `<style>` tags in head for fast rendering
- Bundle JavaScript to separate file loaded at end of body

**Lazy Loading:**
- Images use lazy loading: `loading="lazy"`
- Images use async decoding: `decoding="async"`
- Responsive images via Eleventy Image plugin with multiple formats and widths

---

*Convention analysis: 2026-02-14*
