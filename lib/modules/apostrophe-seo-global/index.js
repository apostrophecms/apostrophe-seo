module.exports = {
  improve: 'apostrophe-global',
  seo: false,
  construct: (self, options) => {
    const seoGoogleFields = options.seoGoogleFields ? [
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
    ] : [];
    options.addFields = options.addFields.concat(seoGoogleFields || []);

    options.arrangeFields = [
      {
        name: 'seoGoogleIds',
        label: 'Google IDs',
        fields: [
          'seoGoogleTrackingId',
          'seoGoogleVerificationId'
        ]
      }
    ].concat(options.arrangeFields || []);
  }
};
