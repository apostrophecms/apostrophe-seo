module.exports = {
  improve: 'apostrophe-pages',

  construct: function (self, options) {
    self.pushAsset('script', 'user', { when: 'user' });

    options.contextMenu.push({
      action: 'scan-page-seo',
      label: 'Scan Page SEO'
    });
  }
};
