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
      self.$deadLinks.find('.scan-modal-dead-links__results > .scan-modal__result').remove();
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
      var $deadLinks = self.$el.find('.scan-modal-dead-links');
      var $container = $deadLinks.find('.scan-modal-dead-links__results.internal');

      if (type === 'external') {
        $container = $deadLinks.find('.scan-modal-dead-links__results.external');
      }

      var $list = $container.find('ul');

      if (links.length) {
        $container.prepend(
          '<div class="scan-modal__result error"><span>Fail</span><p>One or more <strong>' + type +
          '</strong> urls on this page are linking to missing pages.</p></div>'
        );

        links.forEach(function (link) {
          $list.append('<li><a href="' + link + '" target="_blank">' + link + '</a></li>');
        });
      } else {
        $container.prepend(
          '<div class="scan-modal__result"><span>Pass</span><p>No <strong>' + type + '</strong> urls are linking to missing pages.</p></div>'
        );
      }

      $container.addClass('filled');
      $deadLinks.find('> button').text('Rescan');
    };

    self.scanImagesAlt = function () {
      var $images = self.$body.find('img').not('.apos-ui a');
      var $scanImages = self.$el.find('.scan-modal-images');
      var $emptyAltsContainer = $scanImages.find('.scan-modal-images__results.empty-alts');
      var $noAltsContainer = $scanImages.find('.scan-modal-images__results.no-alts');
      var emptyAlts = [];
      var noAlts = [];

      $scanImages.find('.scan-modal-images__results > ul').empty();
      $scanImages.find('.scan-modal-images__results > .scan-modal__result').remove();

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
        $emptyAltsContainer.prepend(
          '<div class="scan-modal__result"><span>Pass</span><p>There are no empty alt attributes in your images.</p></div>'
        );
      } else {
        $emptyAltsContainer.prepend(
          '<div class="scan-modal__result warning"><span>Warning</span><p> ' +
          'One or more images on this page have empty <span>alt</span> attributes. It is ok only if ' +
          'the image is purely decorative or not central to understanding the content of the page.</p></div>'
        );
        emptyAlts.forEach(function (src) {
          $emptyAltsContainer.find('ul').append('<li style="background-image: url(' + src + ')"></li>');
        });
      }

      if (!noAlts.length) {
        $noAltsContainer.prepend(
          '<div class="scan-modal__result"><span>Pass</span><p>All images on the page have at least ' +
          'an empty value for the alt attribute (example: <span>alt=""</span>).</p></div>'
        );
      } else {
        $noAltsContainer.prepend(
          '<div class="scan-modal__result error"><span>Fail</span> ' +
          '<p>One or more images on this page are missing a <span>alt</span> attribute. ' +
          'All images must have at least an empty value for the <span>alt</span> attribute (example: <span>alt=""</span>). ' +
          'If the image is decorative, or not central to understanding the content of the page, an empty value is recommended. ' +
          'When the image is the subject of the content, the <span>alt</span> attribute should contain relevant information ' +
          'for unsighted users and users for visual difficulties.</p></div>'
        );
        noAlts.forEach(function (src) {
          $noAltsContainer.find('ul').append('<li style="background-image: url(' + src + ')"></li>');
        });
      }

      $scanImages.find('.scan-modal-images__results').addClass('filled');
      $scanImages.find('> button').text('Rescan');
      $scanImages.removeClass('loading');
    };
  }
});
