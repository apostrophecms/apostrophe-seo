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
        const isDraft = req.locale.endsWith('-draft');
        const { href } = req.body;
        const headers = typeof options.headers === 'object'
          ? options.headers
          : {};

        const baseUrl = self.apos.pages.getBaseUrl(req);

        if (!href.includes(baseUrl)) {
          return res.status(400).send('You cannot scan a page from another domain');
        }

        const { data } = await axios.get(href, {
          headers: {
            cookie: req.headers.cookie,
            ...headers
          }
        });

        const scanResult = await self.scanPage(data);

        return self.renderAndSend(req, 'seoScanModal', {
          url: href,
          scanResult,
          isDraft
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
