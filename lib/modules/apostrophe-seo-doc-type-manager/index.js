module.exports = {
  improve: 'apostrophe-doc-type-manager',
  beforeConstruct: (self, options) => {
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
        },
        {
          name: '_seoCanonical',
          label: 'Canonical Link',
          type: 'joinByOne',
          withType: 'apostrophe-page',
          idField: 'pageId',
          help: 'Is there a main version of this page that search engines should direct to?',
          filters: {
            projection: {
              title: 1,
              slug: 1
            }
          }
        }
      ].concat(options.addFields || []);

      options.arrangeFields = [
        {
          name: 'seo',
          label: 'SEO',
          fields: [
            'seoTitle',
            'seoDescription',
            '_seoCanonical'
          ],
          last: true
        }
      ].concat(options.arrangeFields || []);
    }
  }
};
