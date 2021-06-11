module.exports = {
  name: 'apostrophe-seo',
  extend: 'apostrophe-module',
  moogBundle: {
    directory: 'lib/modules',
    modules: [
      'apostrophe-seo-doc-type-manager',
      'apostrophe-seo-custom-pages',
      'apostrophe-seo-files',
      'apostrophe-seo-images',
      'apostrophe-seo-global',
      'apostrophe-seo-groups',
      'apostrophe-seo-users',
      'apostrophe-seo-pages',
      'apostrophe-seo-pieces-pages'
    ]
  },
  construct: (self, options) => {
    require('./lib/api.js')(self, options);
    require('./lib/routes.js')(self, options);
    require('./lib/assets.js')(self);

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
    self.pushAssets();
    self.prependSnippets();
    self.addRoutes();
    self.pushCreateSingleton();
    self.addPermissions();
  }
};
