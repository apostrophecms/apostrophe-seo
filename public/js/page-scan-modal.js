export default () => {
  apos.define('page-scan-modal', {
    extend: 'apostrophe-modal',
    source: 'page-scan-modal',

    construct: (self, options) => {
      const superBeforeShow = self.beforeShow;
      self.beforeShow = (callback) => {
        self.$deadLinks = self.$el.find('.dead-links');

        self.$el.on('click', '[data-apos-scan-dead-links]', function() {
          self.scanDeadLinks();
        });

        superBeforeShow(callback);
      };

      self.scanDeadLinks = async () => {
        const $body = $('body');
        const $links = $body.find('a').not('.apos-ui a');

        self.startScanning();
        const links = self.splitLinks($links);

        const { deadLinks: internalDeadLinks, corsError } = await self.checkInternalLinks(links.internal);
        self.injectDeadLinks(internalDeadLinks, 'internal', corsError);

        const externalDeadLinks = await self.checkExternalLinks(links.external);
        self.injectDeadLinks(externalDeadLinks, 'external');

        self.$deadLinks.removeClass('loading');
      };

      self.startScanning = () => {
        self.$deadLinks.find('.dead-links-results p').remove();
        self.$deadLinks.find('.dead-links-results ul').empty();

        self.$deadLinks.addClass('loading');
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
        let corsError = false;

        for (const link of links) {
          try {

            const deadLink = await self.requestHead(link);

            if (deadLink) {
              deadLinks.push(deadLink);
            }

          } catch (err) {
            if (err.status === 0) {
              corsError = true;
            }
          }
        }

        return {
          deadLinks,
          corsError
        };
      };

      self.requestHead = (link) => {
        return new Promise((resolve, reject) => {
          $.ajax(link, {
            method: 'HEAD',
            error: (err) => {
              reject(err);
            }
          }).done((msg, text, xhr) => {
            resolve(xhr.status === 404 && link);
          }); ;
        });
      };

      self.checkExternalLinks = async (links) => {
        const number = 10;
        const deadLinks = [];

        await request(links);

        return deadLinks;

        // Recursive function to request a certain amount of links at a time
        async function request (links) {
          try {
            const linksToRequest = links.splice(0, number);

            if (!linksToRequest.length) {
              return;
            }

            const items = await apos.utils.post(
              `${self.action}/check-dead-links`,
              { links: linksToRequest }
            );

            if (items) {
              items.forEach((item) => {
                deadLinks.push(item);
              });
            }
          } catch (err) {

          }

          await request(links);
        }
      };

      self.injectDeadLinks = (links, type, corsErr) => {
        const $container = type === 'internal'
          ? self.$el.find('.dead-links-results__internal')
          : self.$el.find('.dead-links-results__external');

        const $list = $container.find('ul');

        if (links.length) {
          $container.prepend(`<p class="data-seo-page-scan-modal__result error"> There are some ${type} dead links:</p>`);

          links.forEach(link => {
            $list.append(`<li><a href="${link}">${link}</a></li>`);
          });
        } else {
          $container.prepend(`<p class="data-seo-page-scan-modal__result"> There are no ${type} dead links</p>`);
          if (corsErr) {
            $container.prepend('<p class="data-seo-page-scan-modal__result error">Warning: you could have some CORS issues</p>');
          }
        }
      };
    }
  });
};
