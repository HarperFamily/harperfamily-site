# AI Agent Guidelines for Harper Family Site

This document provides context and guidelines for AI coding agents working on this project.

## Project Overview

The Harper Family Site is a static website built with [Eleventy](https://www.11ty.dev/) (11ty) and deployed to Netlify. It serves as a family history blog and information hub, featuring posts about family history, events, and updates.

### Key Technologies

- **Static Site Generator**: Eleventy v3.x
- **Template Engine**: Nunjucks (with Liquid for markdown)
- **Styling**: Vanilla CSS (no preprocessors, no frameworks)
- **JavaScript**: Vanilla JS (no frontend frameworks like React, Vue, etc.)
- **Content Management**: Pages CMS
- **Hosting**: Netlify with CDN and image optimization
- **Content Format**: Markdown with YAML frontmatter

## Project Structure

```
.
├── content/              # All site content (markdown files)
│   ├── pages/           # Static pages
│   └── posts/           # Blog posts
├── _includes/           # Templates and layouts
│   ├── layouts/         # Page layouts (Nunjucks)
│   ├── components/      # Reusable components (Nunjucks)
│   └── assets/          # CSS and JS
│       ├── css/
│       └── js/
├── _data/               # Data files (metadata.json, etc.)
├── public/              # Static assets (images, fonts, favicon)
├── admin/               # Pages CMS admin interface
├── _site/               # Build output (generated, don't edit)
├── eleventy.config.js   # Eleventy configuration
└── _config/             # Additional config files
```

## Core Principles

### 1. Keep It Simple
- **No Over-Engineering**: Avoid adding unnecessary abstractions, utilities, or features
- **Vanilla Everything**: Prefer plain CSS and JavaScript over frameworks or libraries
- **Minimal Dependencies**: Only add npm packages when truly necessary
- **Progressive Enhancement**: Build features that work without JavaScript first

### 2. Respect Existing Patterns
- Study existing code before making changes
- Match the existing code style and structure
- Don't refactor code that isn't related to your task
- Preserve the site's visual consistency

### 3. Content-First Approach
- Content is managed via Pages CMS - respect the CMS schema
- Don't break existing frontmatter fields that Pages CMS relies on
- Test content changes through the CMS admin interface when possible

## Development Guidelines

### HTML & Templates

- Use Nunjucks for layouts and components
- Keep templates semantic and accessible
- Use Eleventy's built-in features (shortcodes, filters, collections) over custom solutions
- Template files use `.njk` extension
- Markdown content uses Liquid for template logic

### CSS Guidelines

**Location**: `_includes/assets/css/inline.css`

- Write vanilla CSS - no Sass, Less, PostCSS, or CSS-in-JS
- CSS is inlined and minified automatically - keep it lean
- Use semantic class names
- Follow existing naming conventions
- Mobile-first responsive design
- Use CSS custom properties (variables) for theming
- Keep specificity low - avoid deep nesting
- Support modern browsers (no IE11 required)

### JavaScript Guidelines

**Location**: `_includes/assets/js/inline.js`

- Write vanilla JavaScript - no jQuery, React, Vue, etc.
- JS is inlined and minified automatically - keep it minimal
- Use modern ES6+ syntax (the site uses type: "module")
- Progressive enhancement - site should work without JS
- Keep dependencies minimal
- Avoid heavy libraries - prefer native browser APIs

### Content & Markdown

**Location**: `content/posts/*.md` and `content/pages/*.md`

- All content is markdown with YAML frontmatter
- Common frontmatter fields:
  - `title`: Post/page title
  - `date`: Publication date (YYYY-MM-DD)
  - `author`: Author name
  - `tags`: Array of tags
  - `draft`: Boolean for draft status
- Images should be placed in `public/img/`
- Use relative paths for images: `/img/filename.jpg`
- Pages CMS manages content - changes should be compatible with CMS

### Images & Assets

- Images go in `public/img/`
- Eleventy automatically optimizes images in production
- Output formats: AVIF, WebP, and fallback to original
- Widths generated: 330px, 660px, 990px, 1320px
- Netlify Image CDN handles transformations in production
- Use descriptive filenames for images
- Provide meaningful alt text for accessibility

### Eleventy Configuration

**Location**: `eleventy.config.js`

- Uses ES modules (not CommonJS)
- Content lives in `content/` directory
- Templates in `_includes/`
- Data in `_data/`
- Output to `_site/`
- Uses Eleventy bundles for CSS/JS optimization
- Draft posts are excluded from production builds

### Plugins in Use

- `@11ty/eleventy-navigation` - Site navigation
- `@11ty/eleventy-plugin-rss` - RSS/Atom feeds
- `@11ty/eleventy-img` - Image optimization
- `@11ty/eleventy-plugin-syntaxhighlight` - Code syntax highlighting
- Built-in HTML minification and CSS/JS optimization

## Common Tasks

### Adding a New Post

1. Create markdown file in `content/posts/YYYY-MM-DD-slug.md`
2. Add required frontmatter (title, date, author, tags)
3. Write content in markdown
4. Add images to `public/img/` if needed
5. Test locally with `npm start`

### Adding a New Page

1. Create markdown file in `content/pages/page-name.md`
2. Add frontmatter with `layout` and `title`
3. Add to navigation if needed (via frontmatter `eleventyNavigation`)

### Modifying Templates

1. Locate template in `_includes/layouts/` or `_includes/components/`
2. Edit Nunjucks template
3. Test changes with `npm start`
4. Verify changes render correctly for all content types

### Styling Changes

1. Edit `_includes/assets/css/inline.css`
2. Keep CSS minimal - it's inlined on every page
3. Test responsive behavior (mobile, tablet, desktop)
4. Verify changes don't break existing layouts

### Adding JavaScript Features

1. Edit `_includes/assets/js/inline.js`
2. Keep JS minimal - it's inlined on every page
3. Use progressive enhancement
4. Test that site works without JS
5. Ensure no console errors

## Build & Deployment

### Development Commands

```bash
npm start              # Start dev server with watch mode
npm run build          # Production build
npm run debug          # Debug mode with verbose logging
npm run build-ghpages  # Build for GitHub Pages (with path prefix)
```

### Build Process

1. Eleventy processes markdown → HTML
2. CSS is inlined and minified (clean-css)
3. JS is inlined and minified (uglify-js)
4. HTML is minified (html-minifier-terser)
5. Images are optimized (11ty-img)
6. Output goes to `_site/`

### Deployment

- Automatic deployment to Netlify on push to `master`
- Netlify handles:
  - Build process (`npm run build`)
  - CDN distribution
  - Image optimization (Netlify Image CDN)
  - HTTPS
  - Form handling
- Check build status: [Netlify Dashboard](https://app.netlify.com/sites/harperfamily/deploys)

## Content Management

### Pages CMS

- Configuration: `.pages.yml`
- Admin interface: `/admin/`
- CMS handles:
  - Content editing via web interface
  - File creation and updates
  - Git commits from the CMS
  - Preview templates
- **Important**: Don't break CMS schema when modifying frontmatter

### Adding CMS Fields

1. Edit `.pages.yml` to add fields
2. Update preview templates in `admin/preview-templates/` if needed
3. Test in CMS admin interface

## Things to Avoid

### ❌ Don't Do This

- Don't add React, Vue, Angular, or similar frameworks
- Don't add CSS frameworks like Bootstrap or Tailwind
- Don't add build tools like Webpack or Vite (Eleventy handles builds)
- Don't add unnecessary npm dependencies
- Don't refactor code unrelated to your task
- Don't add TypeScript (project uses vanilla JS)
- Don't modify `_site/` directory (it's generated)
- Don't break existing frontmatter fields used by Pages CMS
- Don't add heavy JavaScript libraries
- Don't add CSS preprocessors (Sass, Less, etc.)

### ⚠️ Be Careful With

- Changes to `eleventy.config.js` - test thoroughly
- Modifying `.pages.yml` - validate CMS still works
- Changes to base layouts - affects all pages
- CSS changes - keep file size minimal (it's inlined)
- JavaScript changes - keep file size minimal (it's inlined)
- Image optimization settings - affects performance

## Testing Checklist

Before considering work complete:

- [ ] Site builds without errors (`npm run build`)
- [ ] Dev server runs without errors (`npm start`)
- [ ] Changes render correctly on all relevant pages
- [ ] Responsive design works (mobile, tablet, desktop)
- [ ] Images load and are optimized
- [ ] No console errors in browser
- [ ] Links work correctly
- [ ] Pages CMS admin interface still functions (if CMS-related changes)
- [ ] No broken internal links
- [ ] Accessibility not degraded (semantic HTML, alt text, etc.)

## Performance Considerations

- CSS is inlined → keep it minimal
- JS is inlined → keep it minimal
- Images are optimized automatically
- HTML is minified in production
- Netlify CDN handles caching
- Target: < 2kb CSS, minimal inline JS
- Use Netlify Image CDN in production (automatic)

## Accessibility

- Use semantic HTML elements
- Provide alt text for all images
- Ensure sufficient color contrast
- Support keyboard navigation
- Test with screen readers when adding interactive features
- Don't rely solely on color to convey information

## Browser Support

- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- No IE11 support required
- Use modern JavaScript (ES6+)
- Use modern CSS (Grid, Flexbox, Custom Properties)

## Resources

- [Eleventy Documentation](https://www.11ty.dev/)
- [Nunjucks Template Syntax](https://mozilla.github.io/nunjucks/)
- [Pages CMS](https://pagescms.org/)
- [Netlify Documentation](https://docs.netlify.com/)

## Getting Help

- Check existing code for patterns and examples
- Read Eleventy documentation for built-in features
- Test changes locally before committing
- Ask for clarification if requirements are unclear

## Version Information

- Eleventy: 3.1.2
- Node: ES Modules (type: "module")
- Deployment: Netlify
- CMS: Pages CMS

---

**Last Updated**: February 2026

*This document should be updated as the project evolves. Keep it concise and actionable.*
