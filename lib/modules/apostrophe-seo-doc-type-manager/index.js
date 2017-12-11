module.exports = {
  improve: 'apostrophe-doc-type-manager',
  beforeConstruct: function (self, options) {
   if (self.seo !== false) {
      options.addFields = [
        {
          name: 'seoPageTitle',
          label: 'Title',
          type: 'string'
        },
        {
          name: 'seoPageDescription',
          label: 'Description',
          type: 'string'
        }
      ].concat(options.addFields || []);

      options.arrangeFields = [
        {
          name: 'seo',
          label: 'SEO',
          fields: [ 
            'seoPageTitle',
            'seoPageDescription' 
          ]
        }
      ].concat(options.arrangeFields || []);    
    }
  }
};