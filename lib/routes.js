const axios = require('axios');
const { userInfo } = require('os');

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
        const {
          slug, href, origin
        } = req.body;

        const page = await self.apos.pages.find(req, { slug }).toObject();

        const pageData = {
          edit: false,
          page,
          slug: page.slug,
          ...req.data
        };

        // console.log('pageData ===> ', require('util').inspect(pageData, {
        //   colors: true,
        //   depth: 0
        // }));

        const template = 'pages/' + page.type;

        const pageMarkup = self.apos.pages.renderPage(req, template, pageData);

        const scanResult = await self.scanPage(pageMarkup, href);

        return self.renderAndSend(req, 'seoScanModal', {
          url: href,
          scanResult
        });
      } catch (err) {
        console.log('err ===> ', err);
        res.status(500).send(err);
      }
    });
  };
};
