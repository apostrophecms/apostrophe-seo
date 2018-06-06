module.exports = {
  improve: 'apostrophe-doc-type-manager',
  beforeConstruct: (self, options) => {
    var existingArrange = options.arrangeFields || [];

    if (options.seo !== false) {
      options.addFields = [
        {
          name: 'seoTitle',
          label: 'Title',
          type: 'string',
          help: 'Defines the title of the page in search results or on the page\'s tab.'
        },
        {
          name: 'seoDescription',
          label: 'Description',
          type: 'string',
          help: 'A short and accurate summary of the content of the page used in search results.'
        }
      ].concat(options.addFields || []);

      options.arrangeFields = existingArrange.concat([
        {
          name: 'seo',
          label: 'SEO',
          fields: [
            'seoTitle',
            'seoDescription'
          ]
        }
      ]);
    }
  }
};
