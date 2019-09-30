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
          name: 'seoRobots',
          label: 'Robots Tag',
          type: 'checkboxes',
          def: ['index, follow'],
          choices: [
            {
              label: 'Follow',
              value: 'follow'
            },
            {
              label: 'Index',
              value: 'index'
            },
            {
              label: 'No-Follow',
              value: 'nofollow'
            },
            {
              label: 'No-Index',
              value: 'noindex'
            }
          ]
        },
      ].concat(options.addFields || []);

      options.arrangeFields = [
        {
          name: 'seo',
          label: 'SEO',
          fields: [
            'seoTitle',
            'seoDescription',
            'seoRobots'
          ],
          last: true
        }
      ].concat(options.arrangeFields || []);
    }
  }
};
