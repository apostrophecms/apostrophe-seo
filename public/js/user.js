apos.define('apostrophe-seo', {
  extend: 'apostrophe-context',
  construct: function (self) {
    self.scan = function () {
      apos.create('page-scan-modal', {
        action: self.action,
        body: {
          href: window.location.href
        }
      });
    };
  }
});
