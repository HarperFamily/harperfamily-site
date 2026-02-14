# External Integrations

**Analysis Date:** 2026-02-14

## APIs & External Services

**Content Management:**
- Pages CMS - Git-based CMS for content editing
  - Dashboard: https://app.pagescms.org/harperfamily/harperfamily-site/master/collection/posts
  - Configuration: `.pages.yml`
  - Authentication: GitHub token (required for CMS user access)
  - Integration type: Git commits directly to repository
  - Triggers: Automatic Netlify deploy on content changes

**Image CDN:**
- Netlify Image CDN - Dynamic image transformation
  - Service: Built into Netlify hosting
  - URL format: `/.netlify/images?url=[encoded-path]&w=[width]&fm=[format]`
  - Formats supported: jpg, webp, avif
  - Configuration: `eleventy.config.js` lines 100-106
  - Production only: `statsOnly: true` in production builds

## Data Storage

**Databases:**
- None - Static site with no database

**File Storage:**
- **Local:** Markdown files and assets in repository
  - Content: `content/` directory (posts, pages)
  - Images: `content/img/` and `public/` directories
  - Generated cache: `.cache/` (image metadata and remote asset cache)

- **Cloud (Backblaze B2):** Media hosting
  - Provider: Backblaze B2 (bucket storage)
  - Access: Via CDN URL `https://f001.backblazeb2.com/file/harperfamily-media/.*`
  - Configuration: Whitelisted in `netlify.toml` under `[images].remote_images`
  - Purpose: External media assets referenced in content
  - Client: Direct HTTPS URLs (no SDK, referenced in markdown)

**Caching:**
- Netlify build cache: `.cache/` and `_site/img/` directories
  - Plugin: `netlify-plugin-cache`
  - Purpose: Speed up rebuilds by caching image transformations and remote asset metadata

## Authentication & Identity

**Auth Provider:**
- GitHub - Repository and CMS authentication
  - GitHub Pages support (alternate deployment option)
  - Dependabot enabled for automated dependency updates
  - Configuration: `.github/dependabot.yml`

**Pages CMS Authentication:**
- Requires GitHub OAuth token for editorial access
- No environment variable configuration detected (handled by Pages CMS platform)

## Monitoring & Observability

**Error Tracking:**
- Not detected - No error tracking service integrated

**Logs:**
- Netlify build logs - Via Netlify dashboard
- Local development logging:
  - Debug flag: `DEBUG=Eleventy*` enables verbose output
  - Benchmark flag: `DEBUG=Eleventy:Benchmark*` for performance metrics
- No persistent log aggregation

**Deployment Status:**
- Netlify Status Badge - In README.md
  - Badge URL: `https://api.netlify.com/api/v1/badges/410a429e-6cb4-4d8f-bce0-d9312047f6bb/deploy-status`
  - Netlify Site ID: `harperfamily` (implicitly)

## CI/CD & Deployment

**Hosting:**
- Netlify (primary)
  - Site: https://harperfamily.ie/
  - Netlify Site ID: harperfamily
  - Configuration: `netlify.toml`
  - Build command: `eleventy`
  - Publish directory: `_site/`
  - Build status: https://app.netlify.com/sites/harperfamily/deploys

- GitHub Pages (alternate, supported)
  - Build script: `npm run build-ghpages` (sets pathprefix)
  - Serve script: `npm run start-ghpages`
  - Not currently active but maintained for flexibility

**CI Pipeline:**
- Netlify CI/CD (automatic)
  - Trigger: Push to `master` branch
  - Build: Automatic on every commit
  - Deployment: Automatic on successful build
  - No separate GitHub Actions workflows detected

**Dependency Management:**
- Dependabot - Automated dependency updates
  - Service: GitHub Dependabot
  - Package ecosystem: npm
  - Schedule: Monthly
  - Configuration: `.github/dependabot.yml`

## Environment Configuration

**Production Environment Variables:**
- `ELEVENTY_RUN_MODE=build` - Set by Netlify during production builds
- `NODE_ENV=production` - May be set by Netlify deployment environment

**Build-Time Variables:**
- `NODE_DISABLE_COLORS=1` - Used in `build-nocolor` script (cross-env)
- `DEBUG` - Set during debug builds (Eleventy:*)

**No Configuration Required:**
- Pages CMS credentials - Handled by platform authentication
- Netlify API tokens - Not exposed in code (platform-managed)
- GitHub tokens - Only needed for CMS editor access

## Webhooks & Callbacks

**Incoming Webhooks:**
- Netlify deploy notifications - Automatic on merge
- Pages CMS → GitHub → Netlify - Automatic content deployment flow
  1. Editor commits changes via Pages CMS
  2. GitHub receives push
  3. Netlify webhook triggered
  4. Site rebuilds and deploys
  5. Static HTML published to CDN

**Outgoing Webhooks:**
- Not detected - Static site does not make outbound requests

## Remote Assets & External Media

**Referenced Domains:**
- Backblaze B2: `https://f001.backblazeb2.com/file/harperfamily-media/*`
  - Status: Whitelisted in Netlify `netlify.toml`
  - Behavior: Netlify Image CDN will transform and cache

**Feed Generation:**
- RSS/Atom feed: `/feed/feed.xml`
  - Technology: @11ty/eleventy-plugin-rss v2.0.4
  - Type: Atom 1.0
  - Limit: Last 10 posts
  - Stylesheet: `content/feed/pretty-atom-feed.xsl`

## Content Delivery

**Primary Domain:**
- https://harperfamily.ie/ - Main website
- Netlify CDN - Automatic global distribution
- HTTPS: Automatic SSL via Netlify

**Static Assets Path:**
- `/` - Served from Netlify CDN (all files in `_site/`)

**Image Optimization Path:**
- `/.netlify/images` - Netlify Image CDN endpoint
- Transforms on-demand: format, width, quality

---

*Integration audit: 2026-02-14*
