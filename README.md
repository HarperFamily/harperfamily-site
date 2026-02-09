# Harper Family Site

[![Netlify Status](https://api.netlify.com/api/v1/badges/410a429e-6cb4-4d8f-bce0-d9312047f6bb/deploy-status)](https://app.netlify.com/sites/harperfamily/deploys)

The Harper Family website - a family history blog featuring posts about family history, events, and updates.

**Live Site**: [harperfamily.ie](https://harperfamily.ie)

## Architecture

This is a static website built with:

- **Static Site Generator**: [Eleventy](https://www.11ty.dev/) v3.x
- **Template Engine**: Nunjucks (with Liquid for markdown content)
- **Styling**: Vanilla CSS (inlined and minified, ~2kb)
- **JavaScript**: Vanilla JS (minimal, inlined)
- **Content Management**: [Pages CMS](https://pagescms.org/)
- **Hosting**: Netlify with automatic deployment, CDN, and image optimization
- **Content Format**: Markdown files with YAML frontmatter

### Key Features

- Fast, pre-rendered HTML pages
- Automatic image optimization (AVIF, WebP formats)
- RSS/Atom feed
- Tag-based post organization
- 100% JavaScript framework free
- Responsive design

## Local Development

### Prerequisites

- Node.js (ES modules support)
- npm

### Setup

1. Clone the repository:
```bash
git clone https://github.com/HarperFamily/harperfamily-site.git
cd harperfamily-site
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The site will be available at `http://localhost:8080` with live reloading.

### Available Commands

```bash
npm start              # Start dev server with watch mode
npm run build          # Production build
npm run debug          # Debug mode with verbose logging
```

### Project Structure

```
.
├── content/              # All site content (markdown files)
│   ├── pages/           # Static pages
│   └── posts/           # Blog posts
├── _includes/           # Templates, layouts, and components
├── _data/               # Site metadata and data files
├── public/              # Static assets (images, fonts, etc.)
├── _site/               # Build output (generated)
└── eleventy.config.js   # Eleventy configuration
```

## Content Editing

Content is managed through **Pages CMS**, a Git-based CMS that commits directly to the repository.

**Edit Content**: [Pages CMS Dashboard](https://app.pagescms.org/harperfamily/harperfamily-site/master/collection/posts)

Changes made through Pages CMS automatically trigger a new build and deployment.

## Deployment

- Automatic deployment to Netlify on push to `master` branch
- Build command: `npm run build`
- Publish directory: `_site`

**Deployment Status**: [Netlify Dashboard](https://app.netlify.com/sites/harperfamily/deploys)

## Contributing

For development guidelines and coding standards, see [AGENTS.md](AGENTS.md).

## License

MIT
