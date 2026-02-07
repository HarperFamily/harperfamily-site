import { DateTime } from "luxon";
import CleanCSS from "clean-css";
import UglifyJS from "uglify-js";
import htmlmin from "html-minifier-terser";

export default function(eleventyConfig) {
  // Date formatting (human readable)
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat("d LLLL yyyy");
  });

  // Date formatting (machine readable)
  eleventyConfig.addFilter("machineDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat("yyyy-MM-dd");
  });

  // Minify CSS
  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Minify JS
  eleventyConfig.addFilter("jsmin", function (code) {
    let minified = UglifyJS.minify(code);
    if (minified.error) {
      console.log("UglifyJS error: ", minified.error);
      return code;
    }
    return minified.code;
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  // Return the smallest number argument
  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  // Minify HTML output (Eleventy v3: use this.page.outputPath)
  eleventyConfig.addTransform("htmlmin", function (content) {
    const outputPath = this.page?.outputPath;
    if (typeof outputPath === "string" && outputPath.indexOf(".html") > -1) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
    }
    return content;
  });
}
