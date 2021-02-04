apos.define('page-scan-modal', {
  extend: 'apostrophe-modal',
  source: 'page-scan-modal',

  construct: (self, options) => {
    const superBeforeShow = self.beforeShow;
    self.beforeShow = (callback) => {
      self.$el.on('click', '[data-apos-scan-dead-links]', function() {
        self.scanDeadLinks();
      });

      superBeforeShow(callback);
    };

    self.scanDeadLinks = async () => {

      const $body = $('body');

      // .find('.apos-ui').remove().html();

      const $links = $body.find('a').not('.apos-ui a');

      const links = self.splitLinks($links);

      const internalDeadLinks = await self.checkInternalLinks(links.internal);

      const externalDeadLinks = await self.checkExternalLinks(links.external);

      self.injectDeadLinks(internalDeadLinks, externalDeadLinks);
    };

    self.splitLinks = ($links) => {
      const { origin, host } = window.location;
      const internal = [];
      const external = [];

      $links.each(function (i, el) {
        const link = $(el).attr('href');

        if (link) {
          const builtLink = link.startsWith('/')
            ? origin + link
            : link;

          if (builtLink.includes(host)) {
            internal.push(link);
          } else {
            external.push(link);
          }
        }
      });

      return {
        internal,
        external
      };
    };

    self.checkInternalLinks = async (links) => {
      const deadLinks = [];

      for (const link of links) {
        await $.ajax(link, {
          method: 'HEAD',
          error: (err) => {
            console.log('err ===> ', err);
          }
        }).done((msg, text, xhr) => {
          if (xhr.status === 404) {
            deadLinks.push(link);
          }
        });
      }

      return deadLinks;
    };

    self.checkExternalLinks = async (links) => {
      // const deadLinks = [];

      const response = await apos.utils.post(`${self.action}/check-dead-links`, { links });

      return response;
    };

    self.injectDeadLinks = (internal, external) => {
      const $internal = self.$el.find('.dead-links-results__internal');
      const $external = self.$el.find('.dead-links-results__external');

      const $internalResults = $internal.find('ul');
      const $externalResults = $external.find('ul');

      internal.forEach(link => {
        $internalResults.append(`<a href="${link}">${link}</a>`);
      });

      if (internal.length) {
        $internal.css('display', 'block');
      }

      external.forEach(link => {
        $externalResults.append(`<a href="${link}">${link}</a>`);
      });

      if (external.length) {
        $external.css('display', 'block');
      }
    };
  }
});
