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

  // Lightbox Transform: Auto-wrap content images with lightGallery markup
  // MUST run BEFORE htmlmin to avoid issues with minified HTML
  eleventyConfig.addTransform("lightbox-wrap", function (content) {
    const outputPath = this.page?.outputPath;

    // Only process HTML files
    if (typeof outputPath !== "string" || outputPath.indexOf(".html") === -1) {
      return content;
    }

    // Extract page slug from URL for gallery grouping
    // e.g., /blog/nore-valley-park/index.html -> nore-valley-park
    const url = this.page?.url || "";
    const slugMatch = url.match(/\/([^\/]+)\/?$/);
    const slug = slugMatch && slugMatch[1] !== "" ? slugMatch[1] : "page";
    const galleryId = `gallery-${slug}`;

    // Helper: Extract alt text from img tag
    const getAltText = (imgTag) => {
      const altMatch = imgTag.match(/\balt=["']([^"']*)["']/);
      return altMatch ? altMatch[1] : "";
    };

    // Helper: Get highest-res image URL from picture element or img
    const getHighResUrl = (htmlSnippet, existingHref) => {
      // If existing href points to an image URL (Backblaze pattern), keep it
      if (existingHref && /\.(jpe?g|png|gif|webp|avif)(\?|$)/i.test(existingHref)) {
        return existingHref;
      }

      // Look for jpeg/png source in picture element (prefer original format over webp/avif)
      const jpegSourceMatch = htmlSnippet.match(/<source[^>]+type=["']image\/(jpeg|png)["'][^>]*srcset=["']([^"'\s]+)/);
      if (jpegSourceMatch) {
        // Extract the largest width from srcset (last entry)
        const srcsetUrls = jpegSourceMatch[2].split(",").map(s => s.trim());
        const lastUrl = srcsetUrls[srcsetUrls.length - 1].split(" ")[0];
        return lastUrl;
      }

      // Fallback: extract img src attribute
      const imgSrcMatch = htmlSnippet.match(/<img[^>]+\bsrc=["']([^"']+)["']/);
      return imgSrcMatch ? imgSrcMatch[1] : "";
    };

    // Helper: Check if we should skip this image
    const shouldSkip = (fullContext, imgTag) => {
      // Skip if already has lightgallery class
      if (fullContext.match(/class=["'][^"']*lightgallery[^"']*["']/)) {
        return true;
      }
      // Skip if image or parent has no-lightbox class
      if (imgTag.match(/class=["'][^"']*no-lightbox[^"']*["']/) ||
          fullContext.match(/class=["'][^"']*no-lightbox[^"']*["']/)) {
        return true;
      }
      // Skip if no src attribute
      if (!imgTag.match(/\bsrc=["']/)) {
        return true;
      }
      // Skip if src contains favicon, icon, or logo
      const srcMatch = imgTag.match(/\bsrc=["']([^"']+)["']/);
      if (srcMatch) {
        const src = srcMatch[1].toLowerCase();
        if (src.includes("favicon") || src.includes("icon") || src.includes("logo")) {
          return true;
        }
      }
      return false;
    };

    // Helper: Check if context is inside header or nav
    const isInExcludedSection = (beforeContent) => {
      // Count opening and closing tags to determine if we're inside header or nav
      const headerOpen = (beforeContent.match(/<header[\s>]/g) || []).length;
      const headerClose = (beforeContent.match(/<\/header>/g) || []).length;
      const navOpen = (beforeContent.match(/<nav[\s>]/g) || []).length;
      const navClose = (beforeContent.match(/<\/nav>/g) || []).length;

      return (headerOpen > headerClose) || (navOpen > navClose);
    };

    // Single pass: Process all <a> tags that wrap images
    // This handles both existing links and creates new ones where needed
    content = content.replace(/<a\s+([^>]*href=["']([^"']+)["'][^>]*)>([\s\S]*?)<\/a>/gi, (match, aAttributes, href, innerContent, offset) => {
      // Check if this link wraps a picture or img
      if (!/<picture[\s>]/.test(innerContent) && !/<img[\s>]/.test(innerContent)) {
        return match; // Not an image link
      }

      // Extract img tag for checking
      const imgMatch = innerContent.match(/<img[^>]*>/i);
      if (!imgMatch) {
        return match; // No img found
      }

      // Check if we should skip
      const beforeContent = content.substring(0, offset);
      if (isInExcludedSection(beforeContent) || shouldSkip(match, imgMatch[0])) {
        return match;
      }

      // Get alt text and high-res URL
      const altText = getAltText(imgMatch[0]);
      const highResUrl = getHighResUrl(innerContent, href);

      if (!highResUrl) {
        return match; // No valid image URL found
      }

      // Build new attributes for the <a> tag
      let newAttributes = aAttributes;

      // Update href to point to high-res image (lightGallery prioritizes href over data-src)
      newAttributes = newAttributes.replace(/\bhref=["']([^"']*)["']/, `href="${highResUrl}"`);

      // Add or append to class attribute
      if (/\bclass=["']/.test(newAttributes)) {
        newAttributes = newAttributes.replace(/\bclass=["']([^"']*)["']/, (m, classes) => {
          return classes.includes("lightgallery")
            ? m
            : `class="${classes} lightgallery"`;
        });
      } else {
        newAttributes += ` class="lightgallery"`;
      }

      // Add data-src attribute (lightGallery uses this to determine which image to show)
      newAttributes += ` data-src="${highResUrl}"`;

      // Add data-gallery attribute
      newAttributes += ` data-gallery="${galleryId}"`;

      // Add data-sub-html for caption if alt text exists
      if (altText) {
        // Escape double quotes in alt text
        const escapedAlt = altText.replace(/"/g, "&quot;");
        newAttributes += ` data-sub-html="${escapedAlt}"`;
      }

      return `<a ${newAttributes}>${innerContent}</a>`;
    });

    return content;
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
