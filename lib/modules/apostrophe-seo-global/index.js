module.exports = {
  improve: 'apostrophe-global',
  seo: false,
  construct: (self, options) => {
    const tagManagerFields = {
      name: 'seoGoogleTagManager',
      label: 'Google Tag Manager ID',
      type: 'string',
      help: 'Container ID provided in Google Tag Manager (e.g., GTM-RPCVDTN).'
    };

    let seoGoogleFields;

    if (options.seoTagMangerOnly) {
      seoGoogleFields = [tagManagerFields];
    } else if (options.seoGoogleFields) {
      seoGoogleFields = [
        {
          name: 'seoGoogleTrackingId',
          label: 'Google Tracking ID',
          type: 'string',
          help: 'Tracking ID provided by Google for Google Analytics.'
        },
        {
          name: 'seoGoogleVerificationId',
          label: 'Google Verification ID',
          type: 'string',
          help: 'Verification ID provided by Google for the HTML meta tag verification option.'
        }
      ];

      if (options.seoGoogleTagManager) {
        seoGoogleFields.push(tagManagerFields);
      }
    }

    options.addFields = options.addFields.concat(seoGoogleFields || []);

    options.arrangeFields = [
      {
        name: 'seoGoogleIds',
        label: 'Google IDs',
        fields: [
          'seoGoogleTrackingId',
          'seoGoogleVerificationId',
          'seoGoogleTagManager'
        ],
        last: true
      }
    ].concat(options.arrangeFields || []);
  }
};
