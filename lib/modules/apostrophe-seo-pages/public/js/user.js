apos.define('apostrophe-pages', {

  afterConstruct: (self) => {
    self.addSeoPageScanLink();
  },

  construct: (self, options) => {
    self.addSeoPageScanLink = () => {
      $('body').on('click', '[data-apos-seo-page-scan]', () => {
        return apos.modules['apostrophe-seo'].scan();
      });
    };
  }
});
