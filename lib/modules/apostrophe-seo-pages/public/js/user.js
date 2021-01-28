apos.define('apostrophe-pages', {

  afterConstruct: function(self) {
    self.addSeoPageScanLink();
  },

  construct: function(self, options) {
    self.addSeoPageScanLink = function() {
      $('body').on('click', '[data-apos-scan-page-seo]', function() {
        return apos.modules['apostrophe-seo'].scan();
      });
    };
  }
});
