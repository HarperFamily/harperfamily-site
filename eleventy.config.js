import { DateTime } from "luxon";
import CleanCSS from "clean-css";
import UglifyJS from "uglify-js";
import htmlmin from "html-minifier-terser";
import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import pluginFilters from "./_config/filters.js";

const imgWidths = [330, 660, 990, 1320, 1980];
const imgSizes = "(min-width: 712px) 712px, 100vw";

export default async function(eleventyConfig) {
  // Drafts, see also _data/eleventyDataSchema.js
  eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
    if (data.draft) {
      data.title = `${data.title} (draft)`;
    }

    if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
      return false;
    }
  });

  // Eleventy Navigation https://www.11ty.dev/docs/plugins/navigation/
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

  // Run Eleventy when these files change:
  // https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets
  eleventyConfig.addWatchTarget("**/*.css");
  eleventyConfig.addWatchTarget("_includes/**/*.{svg,webp,png,jpg,jpeg,gif}");

  // Per-page bundles, see https://github.com/11ty/eleventy-plugin-bundle
  // Bundle <style> content and adds a {% css %} paired shortcode
  eleventyConfig.addBundle("css", {
    toFileDirectory: "dist",
    // Add all <style> content to `css` bundle (use <style eleventy:ignore> to opt-out)
    bundleHtmlContentFromSelector: "style",
  });

  // Bundle <script> content and adds a {% js %} paired shortcode
  eleventyConfig.addBundle("js", {
    toFileDirectory: "dist",
    // Add all <script> content to the `js` bundle (use <script eleventy:ignore> to opt-out)
    bundleHtmlContentFromSelector: "script",
  });

  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom", // or "rss", "json"
    outputPath: "/feed/feed.xml",
    collection: {
      name: "posts",
      limit: 10,
    },
    metadata: {
      language: "en",
      title: "Harper Family",
      subtitle: "Family history and updates",
      base: "https://harperfamily.com/",
      author: {
        name: "Harper Family",
      },
    },
  });

  // Image HTML Transform: all <img> and <picture> in output are optimized automatically
  // https://www.11ty.dev/docs/plugins/image/#html-transform
  // We use `urlFormat` to point images at Netlify Image CDN in production only.
  const imagePluginOptions = {
    formats: ["avif", "webp", "auto"],
    widths: imgWidths,
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async",
        sizes: imgSizes,
      },
    },
    // Don’t fail build when remote images are unreachable (e.g. offline)
    failOnError: false,
  };

  // Only enable Netlify Image CDN URL transformation in production builds
  const isProd = process.env.ELEVENTY_RUN_MODE === "build" || process.env.NODE_ENV === "production";
  if (isProd) {
    // Avoid local image processing in production — only emit stats (metadata)
    imagePluginOptions.statsOnly = true;
    imagePluginOptions.urlFormat = ({hash, src, width, format }) => {
      const fm = format === "jpeg" ? "jpg" : format;
      // Netlify Image CDN expects a `url` param for the source image and accepts
      // w and fm for width and format. Use a relative `/.netlify/images` path so
      // the CDN on the site domain handles the transform.
      return `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}&fm=${fm}`;
    };
  }

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, imagePluginOptions);

  // Configuration API: use eleventyConfig.addLayoutAlias(from, to) to add
  // layout aliases! Say you have a bunch of existing content using
  // layout: post. If you don’t want to rewrite all of those values, just map
  // post to a new file like this:
  // eleventyConfig.addLayoutAlias("post", "layouts/my_new_post_layout.njk");

  // Merge data instead of overriding
  // https://www.11ty.dev/docs/data-deep-merge/
  eleventyConfig.setDataDeepMerge(true);

  // Add support for maintenance-free post authors
  // Adds an authors collection using the author key in our post frontmatter
  // Thanks to @pdehaan: https://github.com/pdehaan
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

  // Copy static files
  eleventyConfig.addPassthroughCopy({
    "favicon.ico": "/favicon.ico",
    "icon.svg": "/icon.svg",
    "apple-touch-icon.png": "/apple-touch-icon.png",
    "static/uploads": "/uploads",
    "admin": "/admin",
    "fonts": "/fonts",
  });

  // Inline CSS file
  eleventyConfig.addPassthroughCopy("_includes/assets/css/inline.css");

  /* Markdown: images get sizes/loading/decoding so the Image HTML Transform can optimize them */
  const markdownIt = (await import("markdown-it")).default;
  const markdownItAnchor = (await import("markdown-it-anchor")).default;
  const options = {
    html: true,
    breaks: true,
    linkify: true,
  };
  const opts = { permalink: false };

  const md = markdownIt(options).use(markdownItAnchor, opts);

  // Override image rendering so markdown ![alt](url) outputs img with sizes (required by eleventy-img HTML Transform)
  const defaultImageRender =
    md.renderer.rules.image ||
    ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    token.attrSet("loading", "lazy");
    token.attrSet("decoding", "async");
    token.attrSet("sizes", imgSizes);
    return defaultImageRender(tokens, idx, options, env, self);
  };

  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addPlugin(IdAttributePlugin, {
    // Use Eleventy's built-in `slugify` filter
    slugify: eleventyConfig.getFilter("slugify"),
  });

  // Filters
  eleventyConfig.addPlugin(pluginFilters);
}

export const config = {
  templateFormats: ["md", "njk", "html", "liquid"],

  // If your site lives in a different subdirectory, change this.
  // Leading or trailing slashes are all normalized away, so don't worry about it.
  // If you don't have a subdirectory, use "" or "/" (they do the same thing)
  // This is only used for URLs (it does not affect your file structure)
  pathPrefix: "/",

  markdownTemplateEngine: "liquid",
  htmlTemplateEngine: "njk",
  dataTemplateEngine: "njk",
  dir: {
    input: ".",
    includes: "_includes",
    data: "_data",
    output: "_site",
  },
};
