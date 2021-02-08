const axios = require('axios');

module.exports = function (self, options) {
  self.addRoutes = function() {
    self.route('post', 'page-scan-modal', async (req, res) => {
      if (!self.apos.permissions.can(req, 'admin')) {
        return res.status(403).send('forbidden');
      }

      if (!req.body || !req.body.href) {
        return res.status(400).send('bad request');
      }

      try {
        const { href } = req.body;

        if (!href.includes(req.baseUrl)) {
          return res.status(400).send('You cannot scan a page from another domain');
        }

        const { data } = await axios.get(href, {
          headers: {
            cookie: req.headers.cookie
          }
        });

        const scanResult = await self.scanPage(data);

        return self.renderAndSend(req, 'seoScanModal', {
          url: href,
          scanResult
        });
      } catch (err) {
        res.status(500).send(err);
      }
    });
  };
};
