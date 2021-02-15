module.exports = {
  improve: 'apostrophe-pages',

  construct: (self, options) => {

    options.contextMenu.push({
      action: 'seo-page-scan',
      label: 'SEO Page Scan'
    });
  },
  afterConstruct: (self) => {
    self.pushAsset('script', 'user', { when: 'user' });
  }
};
