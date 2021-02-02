apos.define('apostrophe-seo', {
  extend: 'apostrophe-context',

  construct: function(self, options) {
    self.scan = function(options) {

      return apos.create('page-scan-modal', {
        action: self.action,
        body: {
          href: window.location.href
        }
      });
    };
  }
});
