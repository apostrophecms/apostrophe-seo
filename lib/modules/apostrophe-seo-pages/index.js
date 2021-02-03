module.exports = {
  improve: 'apostrophe-pages',

  construct: (self, options) => {

    options.contextMenu.push({
      action: 'scan-page-seo',
      label: 'Scan Page SEO'
    });
  },
  afterConstruct: (self) => {
    self.pushAsset('script', 'user', { when: 'user' });
  }
};
