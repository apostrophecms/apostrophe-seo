module.exports = {
  improve: 'apostrophe-pieces-pages',

  construct: (self, options) => {
    const superShowPage = self.showPage;
    self.showPage = (req, callback) => {
      // Adding seo page scan button only if not already existing to avoid stacking
      if (!self.contextMenu.find((item) => item.action === 'seo-page-scan')) {
        self.contextMenu.push({
          action: 'seo-page-scan',
          label: 'SEO Page Scan'
        });
      }

      superShowPage(req, callback);
    };

    const superIndexPage = self.indexPage;
    self.indexPage = (req, callback) => {

      // Removing seo page scan of items menu, because on index pages it's added
      // to the basic pages menu items, so we avoid having twice seo page scan button
      self.contextMenu = self.contextMenu
        .filter((item) => item.action !== 'seo-page-scan');

      superIndexPage(req, callback);
    };
  }
};
