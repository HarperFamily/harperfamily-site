// Initialize lightGallery for all images on the page
// Note: lightGallery is loaded as a global from a UMD script tag in base.njk
// This script uses ES5 syntax for compatibility with UglifyJS minifier

(function() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightGallery);
  } else {
    initLightGallery();
  }

  function initLightGallery() {
    // Check if lightGallery is available
    if (typeof lightGallery === 'undefined') {
      console.warn('lightGallery library not loaded');
      return;
    }

    // Initialize lightGallery on the body element
    // Images are wrapped with .lightgallery class and data-gallery/data-title attributes
    var gallery = lightGallery(document.body, {
      // Use selector mode - target links with lightgallery class
      selector: '.lightgallery',

      // Animation settings for smooth zoom effect
      speed: 500,
      mode: 'lg-zoom-in-big',

      // Enable zoom plugin for pinch-to-zoom
      plugins: [lgZoom],

      // UI settings
      download: false,
      counter: false,
      // Caption comes from data-title attribute (set by transform)
      subHtmlSelectorRelative: false,

      // Touch and keyboard support (lightGallery defaults are good)
      enableSwipe: true,
      enableDrag: true
    });
  }
})();
