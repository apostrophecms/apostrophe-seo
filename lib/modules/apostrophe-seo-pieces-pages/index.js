module.exports = {
  improve: 'apostrophe-pieces-pages',

  construct: (self, options) => {
    const superShowPage = self.showPage;
    self.showPage = (req, callback) => {
      // Adding seo page scan button only if not already existing to avoid stacking
      if (!self.contextMenu.find((item) => item.action === 'scan-page-seo')) {
        self.contextMenu.push({
          action: 'scan-page-seo',
          label: 'Scan Page SEO'
        });
      }

      superShowPage(req, callback);
    };

    const superIndexPage = self.indexPage;
    self.indexPage = (req, callback) => {

      self.contextMenu = self.contextMenu
        .filter((item) => item.action !== 'scan-page-seo');

      superIndexPage(req, callback);
    };
  }
};
