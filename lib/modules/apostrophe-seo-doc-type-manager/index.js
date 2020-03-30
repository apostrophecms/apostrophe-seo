module.exports = {
  improve: 'apostrophe-doc-type-manager',
  beforeConstruct: (self, options) => {
    if (options.seo !== false) {
      options.addFields = [
        {
          name: 'seoTitle',
          label: 'Title',
          type: 'string',
          seoSoftMax: 60,
          htmlHelp: 'Defines the title of the page in search results or on the page\'s tab. It should be <a href="https://moz.com/learn/seo/title-tag" target="_blank">under 60 characters</a>.'
        },
        {
          name: 'seoDescription',
          label: 'Description',
          type: 'string',
          seoSoftMin: 50,
          seoSoftMax: 160,
          htmlHelp: 'A short and accurate summary of the content of the page used in search results. It should be <a href="https://moz.com/learn/seo/meta-description" target="_blank">between 50-160 characters</a>.'
        },
        {
          name: 'seoRobots',
          label: 'Robots Tag',
          htmlHelp: 'Search engine indexing setting. To let Google fully index and crawl your page, leave these UNCHECKED. <a href="https://moz.com/learn/seo/robots-meta-directives" data-toggle="tooltip" target="new_window" title="Learn More About Robots Meta Tag">Learn more about these options</a>',
          type: 'checkboxes',
          choices: [
            {
              label: 'Do not crawl links on page (No Follow)',
              value: 'nofollow'
            },
            {
              label: 'Stop Indexing Page (No Index)',
              value: 'noindex'
            }
          ]
        }
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
