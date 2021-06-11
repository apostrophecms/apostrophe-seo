const cheerio = require('cheerio');
const axios = require('axios');

module.exports = (self, { scanRules }) => {
  // Defining default values for rules, or getting them from config
  const minWordsOnPage = (scanRules && scanRules.minWordsOnPage) || 350;
  const minTitleLength = (scanRules && scanRules.titleLength && scanRules.titleLength.min) || 30;
  const maxTitleLength = (scanRules && scanRules.titleLength && scanRules.titleLength.max) || 90;
  const minDescriptionLength = (scanRules && scanRules.descriptionLength &&
    scanRules.descriptionLength.min) || 70;
  const maxDescriptionLength = (scanRules && scanRules.descriptionLength &&
    scanRules.descriptionLength.max) || 200;
  const minOgTitleLength = (scanRules && scanRules.ogTitleLength && scanRules.ogTitleLength.min) || 30;
  const maxOgTitleLength = (scanRules && scanRules.ogTitleLength && scanRules.ogTitleLength.max) || 90;
  const minOgDescriptionLength = (scanRules && scanRules.ogDescriptionLength &&
      scanRules.descriptionLength.min) || 70;
  const maxOgDescriptionLength = (scanRules && scanRules.ogDescriptionLength &&
      scanRules.descriptionLength.max) || 200;

  self.scanPage = async (pageContent) => {
    const $ = cheerio.load(pageContent);

    // Empty all apos ui divs to avoid analyzing its content
    $('body').find('.apos-ui').empty().html();

    const seoResults = {
      meta: {
        title: self.checkMeta($, 'title'),
        description: self.checkMeta($, 'description')
      },
      ogMeta: {
        title: self.checkMeta($, 'og:title'),
        description: self.checkMeta($, 'og:description')
      },
      h1: self.checkH1($),
      contentSize: self.checkContentSize($)
    };

    return seoResults;
  };

  // Looking for meta title and description
  self.checkMeta = ($, type) => {
    const {
      $elem, elemText, elemHtml, tag, min, max
    } = getMetaInfos(type);

    if ($elem.length > 1) {
      return {
        error: true,
        msg: `Multiple <span>${tag}</span> tags have been found. There should be exactly one per page.`
      };
    } else if (!$elem.length || !elemText) {
      return {
        error: true,
        msg: `The <span>${tag}</span> tag is missing. Exactly one <span>${tag}</span> tag is required.
        The contents of this tag should be between <strong>${min}</strong> and <strong>${max}</strong> characters..`
      };
    } else if (elemText.length < min || elemText.length > max) {

      return {
        error: true,
        msg: `The content of the <span>${tag}</span> tag is <strong>${elemText.length}</strong> characters.
        It should be between <strong>${min}</strong> length and <strong>${max}</strong> characters.`,
        elemHtml
      };
    }

    return {
      msg: `The <span>${tag}</span> tag is present and
      is within recommended character length of <strong>${min}</strong> and <strong>${max}</strong> characters.`,
      error: false
    };

    function getMetaInfos (type) {
      const $head = $('head');
      switch (type) {
        case 'title': {
          const $elem = $head.find('title');
          const elemText = $elem.text().trim();

          return {
            $elem,
            elemText,
            elemHtml: `<title>${elemText}</title>`,
            tag: '&lt;title&gt;',
            min: minTitleLength,
            max: maxTitleLength
          };
        }
        case 'description': {
          const $elem = $head.find('meta[name=description]');

          return {
            $elem,
            elemText: $elem.attr('content'),
            elemHtml: $.html($elem).replace(/\s+/g, ''),
            tag: '&lt;meta name="description"&gt;',
            min: minDescriptionLength,
            max: maxDescriptionLength
          };
        }
        case 'og:title': {
          const $elem = $head.find('meta[property="og:title"]');

          return {
            $elem,
            elemText: $elem.attr('content'),
            elemHtml: $.html($elem).replace(/\s+/g, ' '),
            tag: '&lt;meta property="og:title"&gt;',
            min: minOgTitleLength,
            max: maxOgTitleLength
          };
        }
        case 'og:description': {
          const $elem = $head.find('meta[property="og:description"]');

          return {
            $elem,
            elemText: $elem.attr('content'),
            elemHtml: $.html($elem).replace(/\s+/g, ' '),
            tag: '&lt;meta property="og:description"&gt;',
            min: minOgDescriptionLength,
            max: maxOgDescriptionLength
          };
        }
      }
    }
  };

  // Looking for proper H1
  self.checkH1 = ($) => {
    const $h1 = $('h1');

    if ($h1.length > 1) {
      return {
        error: true,
        msg: 'Multiple <span>&lt;h1&gt;</span> tags have been found. There should be exactly one per page.'
      };
    } else if (!$h1.length) {
      return {
        error: true,
        msg: `The <span>&lt;h1&gt;</span> tag is missing. There is exactly one <span>&lt;h1&gt;</span>
        tag required (it is often the same or similar to the <span>&lt;title&gt;</span> tag).`
      };
    }

    return {
      msg: 'The <span>&lt;h1&gt;</span> tag is present.',
      error: false
    };
  };

  // Looking for page words number
  self.checkContentSize = ($) => {
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();

    const totalWords = bodyText ? bodyText.split(' ').length : 0;

    if (totalWords < minWordsOnPage) {
      return {
        error: true,
        msg: `There are <strong>${totalWords}</strong> words on the page,
        which does not meet the minimum requirement of <strong>${minWordsOnPage}</strong>.`
      };
    }
    return {
      error: false,
      msg: `There are <strong>${totalWords}</strong> words on the page, which meets the minimum requirement of <strong>${minWordsOnPage}</strong>.`

    };
  };
  // Looking for dead links
  self.scanLinks = async (links) => {
    const deadLinks = [];

    for (const link of links) {
      try {
        await axios.head(link);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          deadLinks.push(link);
        }
      }
    }

    return deadLinks;
  };

  self.addPermissions = function() {
    // only grants the ability to use the SEO scan button, not the ability to, say, edit just the SEO fields
    self.apos.permissions.add({
      value: 'admin-seo',
      label: 'SEO'
    });
  };
};
