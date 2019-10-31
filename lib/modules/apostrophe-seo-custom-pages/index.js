module.exports = {
  improve: 'apostrophe-custom-pages',
  beforeConstruct: (self, options) => {
    if (options.seo !== false) {
      options.addFields = [
        {
          name: 'seoTitle',
          label: 'Title',
          type: 'string',
          max: 60,
          htmlHelp: 'Defines the title of the page in search results or on the page\'s tab. It should be <a href="https://moz.com/learn/seo/title-tag" target="_blank">under 60 characters</a>.'
        },
        {
          name: 'seoDescription',
          label: 'Description',
          type: 'string',
          min: 50,
          max: 300,
          htmlHelp: 'A short and accurate summary of the content of the page used in search results. It should be <a href="https://moz.com/learn/seo/meta-description" target="_blank">between 50-160 characters</a>.'
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
              slug: 1,
              _url: 1
            }
          }
        },
        {
          name: 'seoRobots',
          label: 'Robots Tag',
          htmlHelp: 'Search engine indexing setting <a href=https://moz.com/learn/seo/robots-meta-directives data-toggle="tooltip" target="new_window" title="Learn More About Robots Meta Tag">Learn more about these options</a>',
          type: 'checkboxes',
          def: 'index,follow',
          choices: [
            {
              label: 'Default (Index,Follow)',
              value: 'index,follow'
            },
            {
              label: 'Do not crawl links on page (No Follow)',
              value: 'nofollow'
            },
            {
              label: 'Stop Indexing Page (No Index)',
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
            '_seoCanonical',
            'seoRobots'
          ],
          last: true
        }
      ].concat(options.arrangeFields || []);
    }
  }
};
