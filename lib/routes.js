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

    self.route('post', 'check-dead-links', async (req, res) => {
      try {
        const { links } = req.body;

        if (!links || !links.length) {
          return res.status(400).send('You must provide links to scan');
        }

        const deadLinks = await self.scanLinks(links);

        res.status(200).send(deadLinks);
      } catch (err) {
        res.status(500).send(err);
      }
    });
  };
};
