module.exports = {
  improve: 'apostrophe-doc-type-manager',
  beforeConstruct: function (self, options) {
    if (self.seo !== false) {
      options.addFields = [
        {
          name: 'seoTitle',
          label: 'Title',
          type: 'string'
        },
        {
          name: 'seoDescription',
          label: 'Description',
          type: 'string'
        }
      ].concat(options.addFields || []);

      options.arrangeFields = [
        {
          name: 'seo',
          label: 'SEO',
          fields: [
            'seoTitle',
            'seoDescription'
          ]
        }
      ].concat(options.arrangeFields || []);
    }
  }
};
