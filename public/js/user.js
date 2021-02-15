apos.define('apostrophe-seo', {
  extend: 'apostrophe-context',

  construct: (self, options) => {
    self.scan = () => {
      return apos.create('page-scan-modal', {
        action: self.action,
        body: {
          href: window.location.href
        }
      });
    };
  }
});
