import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import pluginFilters from "./_config/filters.js";

export default async function (eleventyConfig) {
  // Drafts, see also _data/eleventyDataSchema.js
  eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
    if (data.draft) {
      data.title = `${data.title} (draft)`;
    }

    if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
      return false;
    }
  });

  // Copy the contents of the `public` folder to the output folder
  // For example, `./public/css/` ends up in `_site/css/`
  eleventyConfig
    .addPassthroughCopy({
      "./public/": "/",
      "admin": "/admin",
      "./node_modules/lightgallery/lightgallery.umd.js": "/js/lightgallery.umd.js",
      "./node_modules/lightgallery/css/lightgallery-bundle.min.css": "/css/lightgallery.min.css",
      "./node_modules/lightgallery/plugins/zoom/lg-zoom.umd.js": "/js/lg-zoom.umd.js",
      "./node_modules/lightgallery/fonts": "/fonts"
    })
    .addPassthroughCopy("./content/feed/pretty-atom-feed.xsl");;

  // Run Eleventy when these files change:
  // https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets
  eleventyConfig.addWatchTarget("**/*.css");
  eleventyConfig.addWatchTarget("{public,pages,posts}/**/*.{svg,webp,png,jpg,jpeg,gif}");

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

  // Eleventy Navigation https://www.11ty.dev/docs/plugins/navigation/
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom", // or "rss", "json"
    outputPath: "/feed/feed.xml",
    stylesheet: "pretty-atom-feed.xsl",
    collection: {
      name: "posts",
      limit: 10,
    },
    metadata: {
      language: "en",
      title: "Harper Family",
      subtitle: "Family history and updates",
      base: "https://harperfamily.ie/",
      author: {
        name: "Harper Family",
      },
    },
  });

  // Image HTML Transform: all <img> and <picture> in output are optimized automatically
  // https://www.11ty.dev/docs/plugins/image/#html-transform
  // We use `urlFormat` to point images at Netlify Image CDN in production only.
  // const imgSizes = "(min-width: 712px) 712px, 100vw";
  const imagePluginOptions = {
    formats: ["avif", "webp", "auto"],
    widths: [330, 660, 990, 1320],
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async",
        sizes: "(min-width: 712px) 712px, 100vw",
      },
    },
    // Don’t fail build when remote images are unreachable (e.g. offline)
    failOnError: false,
  };

  // Only enable Netlify Image CDN URL transformation when deploying to Netlify
  // This ensures local builds work with actual generated images
  const isNetlify = process.env.NETLIFY === "true";
  if (isNetlify) {
    // Avoid local image processing on Netlify — only emit stats (metadata)
    imagePluginOptions.statsOnly = true;
    imagePluginOptions.remoteImageMetadata = {
      width: 1320,
      height: 1320,
      format: "jpeg",
    };
    imagePluginOptions.urlFormat = ({ src, width, format }) => {
      const fm = format === "jpeg" ? "jpg" : format;
      // Netlify Image CDN expects a `url` param for the source image and accepts
      // w and fm for width and format. Use a relative `/.netlify/images` path so
      // the CDN on the site domain handles the transform.
      return `/.netlify/images?url=${encodeURIComponent(src.replace("content", "").replace("public", ""))}&w=${width}&fm=${fm}`;
    };
  }

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, imagePluginOptions);

  // Configuration API: use eleventyConfig.addLayoutAlias(from, to) to add
  // layout aliases! Say you have a bunch of existing content using
  // layout: post. If you don’t want to rewrite all of those values, just map
  // post to a new file like this:
  // eleventyConfig.addLayoutAlias("post", "layouts/my_new_post_layout.njk");

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

  eleventyConfig.addPlugin(IdAttributePlugin);

  eleventyConfig.addShortcode("currentBuildDate", () => {
    return (new Date()).toISOString();
  });

  eleventyConfig.addShortcode("currentBuildYear", () => {
    return (new Date()).getFullYear();
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
  // pathPrefix: "/",

  markdownTemplateEngine: "liquid",
  htmlTemplateEngine: "njk",
  dataTemplateEngine: "njk",
  // These are all optional:
  dir: {
    input: "content",          // default: "."
    includes: "../_includes",  // default: "_includes" (`input` relative)
    data: "../_data",          // default: "_data" (`input` relative)
    output: "_site"
  },
};
