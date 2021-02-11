apos.define('page-scan-modal', {
  extend: 'apostrophe-modal',
  source: 'page-scan-modal',
  construct: function (self, options) {
    var superBeforeShow = self.beforeShow;
    self.beforeShow = function (callback) {
      self.$deadLinks = self.$el.find('.scan-modal-dead-links');
      self.$body = $('body');
      self.canceled = false;

      self.$el.on('click', '[data-apos-scan-dead-links]', function() {
        self.scanDeadLinks();
      });

      self.$el.on('click', '[data-apos-scan-images]', function() {
        self.scanImagesAlt();
      });

      superBeforeShow(callback);
    };

    // Checked in each loop, to avoid continuing the scan if the modal is closed
    self.afterHide = function (e) {
      self.canceled = true;
    };

    self.scanDeadLinks = function () {
      var $links = self.$body.find('a').not('.apos-ui a');

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
      var host = window.location.host;
      var internal = [];
      var external = [];
      var linkRegex = /^http|^\//;

      $links.each(function (i, el) {
        if (self.canceled) {
          return;
        };
        var link = $(el).attr('href');

        // We verify that the link is not an anchor or a specific protocol
        if (link && linkRegex.test(link)) {
          var builtLink = link;

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
      var iterations = 1;

      if (!links.internal.length) {
        self.injectDeadLinks(deadLinks, 'internal');
        self.checkExternalLinks(links.external);
      }

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

            if (iterations >= links.internal.length) {
              self.injectDeadLinks(deadLinks, 'internal');
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

      if (!externalLinks.length) {
        self.injectDeadLinks(deadLinks, 'external');
        return self.$deadLinks.removeClass('loading');

      }

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

    self.injectDeadLinks = function (links, type) {
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
    };

    self.scanImagesAlt = function () {
      var $images = self.$body.find('img').not('.apos-ui a');
      var $scanImages = self.$el.find('.scan-modal-images');
      var $emptyAltsContainer = $scanImages.find('.scan-modal-images__results.empty-alts');
      var $noAltsContainer = $scanImages.find('.scan-modal-images__results.no-alts');
      var emptyAlts = [];
      var noAlts = [];

      $scanImages.find('.scan-modal-images__results > ul').empty();
      $scanImages.find('.scan-modal-images__results > p').remove();

      $scanImages.addClass('loading');

      $images.each(function (i, elem) {
        var $el = $(elem);
        var alt = $el.attr('alt');
        var src = $el.attr('src');

        if (!alt && src) {
          if (typeof alt === 'string') {
            emptyAlts.push(src);
          } else {
            noAlts.push(src);
          }
        }
      });

      if (!emptyAlts.length) {
        $emptyAltsContainer.prepend('<p class="scan-modal__result">There are no empty alt attributes in your images.</p>');
      } else {
        $emptyAltsContainer.prepend('<p class="scan-modal__result warning">There are empty alt attributes in some of your images:</p>');
        emptyAlts.forEach((src) => {
          $emptyAltsContainer.find('ul').append('<li style="background-image: url(' + src + ')"></li>');
        });
      }

      if (!noAlts.length) {
        $noAltsContainer.prepend('<p class="scan-modal__result">All images have alt attributes.</p>');
      } else {
        $noAltsContainer.prepend('<p class="scan-modal__result error">There are some images without alt attributes:</p>');
        noAlts.forEach((src) => {
          $noAltsContainer.find('ul').append('<li style="background-image: url(' + src + ')"></li>');
        });
      }

      $scanImages.removeClass('loading');
    };
  }
});
