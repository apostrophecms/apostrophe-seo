module.exports = {
  improve: 'apostrophe-doc-type-manager',
  beforeConstruct: (self, options) => {
    if (options.seo !== false) {
      options.addFields = [
        {
          name: 'seoTitle',
          label: 'Title',
          type: 'string',
          max: 60,
          help: 'Defines the title of the page in search results or on the page\'s tab. It should be under 60 characters.'
        },
        {
          name: 'seoDescription',
          label: 'Description',
          type: 'string',
          min: 50,
          max: 300,
          help: 'A short and accurate summary of the content of the page used in search results. It should be between 50-300 characters.'
        }
      ].concat(options.addFields || []);

      options.arrangeFields = [
        {
          name: 'seo',
          label: 'SEO',
          fields: [
            'seoTitle',
            'seoDescription'
          ],
          last: true
        }
      ].concat(options.arrangeFields || []);
    }
  }
};
