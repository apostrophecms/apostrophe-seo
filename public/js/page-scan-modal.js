apos.define('page-scan-modal', {
  extend: 'apostrophe-modal',
  source: 'page-scan-modal',
  construct: function (self, options) {
    var superBeforeShow = self.beforeShow;
    self.beforeShow = function (callback) {
      self.$deadLinks = self.$el.find('.scan-modal-dead-links');
      self.canceled = false;

      self.$el.on('click', '[data-apos-scan-dead-links]', function() {
        self.scanDeadLinks();
      });

      superBeforeShow(callback);
    };

    // Checked in each loop, to avoid continuing the scan if the modal is closed
    self.afterHide = function (e) {
      self.canceled = true;
    };

    self.scanDeadLinks = function () {
      var $body = $('body');
      var $links = $body.find('a').not('.apos-ui a');

      self.startScanning();
      var links = self.splitLinks($links);

      self.checkInternalLinks(links);
    };

    self.startScanning = function () {
      self.$deadLinks.find('.scan-modal-dead-links__results p, .scan-modal__warning').remove();
      self.$deadLinks.find('.scan-modal-dead-links__results ul').empty();

      self.$deadLinks.addClass('loading');
    };

    self.splitLinks = function ($links) {
      var origin = window.location.origin;
      var host = window.location.host;
      var internal = [];
      var external = [];

      $links.each(function (i, el) {
        if (self.canceled) {
          return;
        };
        var link = $(el).attr('href');

        if (link) {
          var builtLink = link;

          if (link.startsWith('/')) {
            builtLink = origin + link;
          }

          if (builtLink.includes(host)) {
            internal.push(link);
          } else {
            external.push(link);
          }
        }
      });

      return {
        internal: internal,
        external: external
      };
    };

    self.checkInternalLinks = function (links) {
      var deadLinks = [];
      var corsError = false;
      var iterations = 1;

      links.internal.forEach(function (link) {
        if (self.canceled) {
          return;
        };
        $.ajax(link, {
          method: 'HEAD',
          complete: function (res) {
            if (res.status === 404) {
              deadLinks.push(link);
            }

            if (res.status === 0) {
              corsError = true;
            }

            if (iterations === links.internal.length) {
              self.injectDeadLinks(deadLinks, 'internal', corsError);
              self.checkExternalLinks(links.external);
            } else {
              iterations += 1;
            }
          }
        });
      });
    };

    self.checkExternalLinks = function (externalLinks) {
      var numberByRequest = 10;
      var deadLinks = [];

      request(externalLinks);

      // Recursive function to request a certain amount of links at a time
      function request (links) {
        if (self.canceled) {
          return;
        };
        var linksToRequest = links.splice(0, numberByRequest);

        if (!linksToRequest.length) {
          return;
        }

        apos.utils.post(
          self.action + '/check-dead-links',
          { links: linksToRequest },
          function (_, items) {
            if (items) {
              items.forEach(function (item) {
                deadLinks.push(item);
              });
            }

            if (!links.length) {
              self.injectDeadLinks(deadLinks, 'external');
              self.$deadLinks.removeClass('loading');
            } else {
              request(links);
            }
          }
        );

      }
    };

    self.injectDeadLinks = function (links, type, corsErr) {
      var $container = self.$el.find('.scan-modal-dead-links__results.internal');

      if (type === 'external') {
        $container = self.$el.find('.scan-modal-dead-links__results.external');
      }

      var $list = $container.find('ul');

      if (links.length) {
        $container.prepend(
          '<p class="scan-modal__result error">There are some ' + type + ' dead links:</p>'
        );

        links.forEach(function (link) {
          $list.append('<li><a href="' + link + '" target="_blank">' + link + '</a></li>');
        });
      } else {
        $container.prepend(
          '<p class="scan-modal__result">There are no ' + type + ' dead links.</p>'
        );
      }

      if (corsErr && type === 'internal') {
        $container.parent().prepend(
          '<p class="scan-modal__warning">It looks like you have CORS issues, make sure to be on the right domain</p>'
        );
      }
    };
  }
});
