module.exports = {
  extend: 'apostrophe-module',
  moogBundle: {
    modules: [
      'apostrophe-seo-doc-type-manager',
      'apostrophe-seo-custom-pages',
      'apostrophe-seo-files',
      'apostrophe-seo-images',
      'apostrophe-seo-global',
      'apostrophe-seo-groups',
      'apostrophe-seo-users'
    ],
    directory: 'lib/modules'
  },
  construct: function (self, options) {
    self.prependSnippets = () => {
      self.apos.templates.prepend('body', (req) => {
        return self.partial('body-snippet', {});
      });
      self.apos.templates.append('head', (req) => {
        return self.partial('head-snippet', {});
      });
    };
  },
  afterConstruct: (self) => {
    self.prependSnippets();
  }
};
