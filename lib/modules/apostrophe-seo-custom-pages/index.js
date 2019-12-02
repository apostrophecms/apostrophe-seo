module.exports = {
  improve: 'apostrophe-custom-pages',
  construct: (self, options) => {
    if (options.seo !== false) {
      options.addFields = [
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
              slug: 1,
              _url: 1
            }
          }
        }
      ].concat(options.addFields || []);

      options.arrangeFields = options.arrangeFields || [];
      options.arrangeFields = options.arrangeFields.map(function (group) {
        if (group.name === 'seo') {
          group.fields.push('_seoCanonical');
        }
        return group;
      });
    }
  }
};
