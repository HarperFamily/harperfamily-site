# Testing Patterns

**Analysis Date:** 2026-02-14

## Test Framework

**Status:** No testing framework configured

**Runner:**
- Not detected - no Jest, Vitest, Mocha, or similar test runner present
- No test scripts in `package.json`
- No test configuration files (jest.config.js, vitest.config.js, etc.)

**Assertion Library:**
- Not applicable

**Run Commands:**
```bash
npm run build              # Build site with Eleventy
npm run build-nocolor     # Build with colored output disabled
npm run start             # Start dev server with live reload
npm run debug             # Run with Eleventy debug output
```

## Test File Organization

**Current State:**
- No dedicated test files found in the codebase
- Test files exist only in `node_modules/` (dependency tests, not project tests)

**What Is Tested:**
- Build process relies on Eleventy's validation
- Output verification is manual (viewing built `_site/` directory)
- No automated testing of:
  - Filter functions
  - Template rendering
  - Build-time collections
  - Configuration logic

## Build-Time Validation

**Mechanisms in Place:**
1. **Eleventy Build Validation**
   - Markdown to HTML conversion
   - Nunjucks template compilation
   - JSON data loading

2. **Plugin Validation**
   - Eleventy plugins validate their own functionality
   - Image plugin: `failOnError: false` allows graceful failure for unreachable remote images
   - RSS feed plugin: Validates feed structure

3. **Minification Safety**
   - CSS minification in `_config/filters.js`: `cssmin` filter with error handling
   - HTML minification in `_config/filters.js`: `htmlmin` transform with options to preserve functionality
   - JS minification in `_config/filters.js`: `jsmin` filter returns original code if UglifyJS fails

## Filter Testing Approach

**Current Patterns in `_config/filters.js`:**

```javascript
// Date filters - tested implicitly by output
eleventyConfig.addFilter("readableDate", (dateObj) => {
  return DateTime.fromJSDate(dateObj).toFormat("d LLLL yyyy");
});

// Array filters with safeguards
eleventyConfig.addFilter("head", (array, n) => {
  if (!Array.isArray(array) || array.length === 0) {
    return [];
  }
  if (n < 0) {
    return array.slice(n);
  }
  return array.slice(0, n);
});

// Minification with error handling
eleventyConfig.addFilter("jsmin", function (code) {
  let minified = UglifyJS.minify(code);
  if (minified.error) {
    console.log("UglifyJS error: ", minified.error);
    return code;  // Return original on error
  }
  return minified.code;
});
```

**Testing Strategy:**
- No unit tests - filters tested through template rendering and output inspection
- Error handling ensures graceful degradation (returns original code if minification fails)
- Implicit testing via build success

## Collections Testing

**Collection Building in `eleventy.config.js`:**

```javascript
// Authors collection - tested by checking author archive pages
eleventyConfig.addCollection("authors", (collection) => {
  const blogs = collection.getFilteredByGlob("posts/*.md");
  return blogs.reduce((coll, post) => {
    const author = post.data.author;
    if (!author) {
      return coll;
    }
    if (!coll.hasOwnProperty(author)) {
      coll[author] = [];
    }
    coll[author].push(post.data);
    return coll;
  }, {});
});
```

**Validation Method:**
- Collection output verified by checking generated pages at `/authors/{author}/`
- Manual review of author archive pages

## Template Testing

**Approach:**
- Templates tested through rendered output
- No template unit tests

**Template Structure (`_includes/components/postslist.njk`):**
```nunjucks
<section>
	{% for post in postslist | reverse %}
		<article{% if post.url == url %} data-current="current item"{% endif %}>
			<h3>
				<a href="{{ post.url | url }}">
					{% if post.data.title %}
						{{ post.data.title }}
					{% else %}
						Untitled
					{% endif %}
				</a>
			</h3>
			{# ... more template #}
		</article>
	{% endfor %}
</section>
```

**Testing Method:**
- Verify fallback for missing title: `Untitled` renders if no title
- Verify `data-current` attribute appears on current post
- Verify tag filtering (tags != "posts")
- Tested manually by viewing blog pages

## Configuration Testing

**Eleventy Configuration (`eleventy.config.js`):**

**What's Tested:**
- Plugin loading and initialization
- Collection generation
- Image transformation configuration
- Passthrough copy operations
- Watch targets for file changes

**Manual Verification Steps:**
1. Build completes without errors: `npm run build`
2. Draft posts excluded from production builds: `ELEVENTY_RUN_MODE=build npm run build`
3. Images optimized with correct formats and sizes
4. RSS feed generated correctly
5. Navigation includes all pages
6. Files from `public/` directory copied to output

## Data Validation

**Data Files:**
- `_data/metadata.json` - manually validated for required fields (title, description, url, author)
- `content/posts/posts.json` - provides defaults, structure validated through post rendering
- `content/pages/pages.json` - provides defaults, structure validated through page rendering

**Markdown Validation:**
- YAML frontmatter validated by Eleventy during parsing
- Invalid YAML prevents page generation (Eleventy stops build)
- Schema validation: `_data/eleventyDataSchema.js` may exist (not found in exploration)

## Manual Testing Checklist

**Before Deployment:**
1. Build succeeds without errors: `npm run build`
2. All pages render in `_site/`:
   - Home page loads
   - Blog archive page loads
   - All post pages render
   - Contact page and form work
3. Images load and are optimized:
   - Check Network tab for image sizes
   - Verify AVIF/WebP formats served
4. Navigation links work
5. RSS feed is valid: Check `/feed/feed.xml` structure
6. Forms submit (contact form, subscribe form)
7. No console errors in browser DevTools
8. Site stats link works

## Coverage

**Current Coverage:** Not measured - no testing framework

**Areas Untested:**
- Filter edge cases (empty arrays, null values, extreme numbers)
- Minification edge cases for CSS/JS
- Image transformation failures and fallbacks
- Feed generation with different collection sizes
- Navigation generation with nested pages
- Author collection with no author metadata
- Mobile responsiveness (manual browser testing only)

**Why Tests Are Absent:**
- Static site generator - most validation happens at build time
- Eleventy plugins provide their own validation
- Small codebase (169 lines of config, 61 lines of filters)
- Manual testing sufficient for content-driven site
- No API or server-side logic requiring unit tests

## Recommendations for Testing

**If Testing Should Be Added:**

1. **Unit Tests for Filters** (Jest or Vitest)
   ```javascript
   // Test filter functions
   describe('readableDate', () => {
     it('formats date correctly', () => {
       const date = new Date('2025-02-14');
       const result = readableDateFilter(date);
       expect(result).toBe('14 February 2025');
     });
   });
   ```

2. **Build-Time Snapshot Tests**
   - Verify build output structure doesn't change unexpectedly
   - Check page counts, navigation structure

3. **End-to-End Tests** (Playwright/Cypress)
   - Verify rendered site functions correctly
   - Test form submissions
   - Test navigation links

4. **Template Tests**
   - Verify template rendering with different data
   - Test fallback values
   - Test conditional rendering

**Current Risk:** No automated testing means regressions discovered only through manual testing or user reports.

---

*Testing analysis: 2026-02-14*
