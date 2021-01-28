const axios = require('axios');

module.exports = function (self, options) {
  self.addRoutes = function() {
    self.route('get', 'seo-page-scan', async (req, res, next) => {
      if (!self.apos.permissions.can(req, 'admin')) {
        return res.status(403).send('forbidden');
      }

    });

    self.route('post', 'page-scan-modal', async (req, res) => {
      if (!self.apos.permissions.can(req, 'admin')) {
        return res.status(403).send('forbidden');
      }

      if (!req.body || !req.body.href) {
        return res.status(400).send('bad request');
      }

      try {
        const { data } = await axios.get(req.body.href);

        const scanResult = await self.scanPage(data, req.body.href);

        return self.renderAndSend(req, 'seoScanModal', {
          url: req.body.href,
          scanResult
        });
      } catch (err) {
        console.log('err ===> ', err);
        res.status(500).send(err);
      }
    });
  };
};
