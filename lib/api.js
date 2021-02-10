const cheerio = require('cheerio');
const axios = require('axios');

module.exports = (self, { scanRules }) => {
  // Defining default values for rules, or getting them from config
  const minWordsNumber = (scanRules && scanRules.minWordsNumber) || 350;
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
      $elem, elemText, elemHtml, min, max
    } = getMetaInfos(type);

    if ($elem.length > 1) {
      return {
        error: true,
        msg: `There should be one meta ${type} in your <head>.`
      };
    } else if (!$elem.length || !elemText) {
      return {
        error: true,
        msg: `You haven't included a meta ${type} for the page.`
      };
    } else if (elemText.length < min || elemText.length > max) {
      return {
        error: true,
        msg: `Your meta ${type} is ${elemText.length} characters.
        It should be between ${min} and ${max} characters.`,
        elemHtml
      };
    }

    return {
      msg: `You have a meta ${type} and it's the right length.`,
      error: false
    };

    function getMetaInfos (type) {
      const $head = $('head');
      switch (type) {
        case 'title': {
          const $elem = $head.find('title');
          return {
            $elem,
            elemText: $elem.text(),
            elemHtml: $.html($elem).replace(/\s+/g, ' '),
            min: minTitleLength,
            max: maxTitleLength
          };
        }
        case 'description': {
          const $elem = $head.find('meta[name=description]');

          return {
            $elem,
            elemText: $elem.attr('content'),
            elemHtml: $.html($elem).replace(/\s+/g, ' '),
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
            min: minOgDescriptionLength,
            max: maxOgDescriptionLength
          };
        }

      }

      if (type === 'title') {
        const $elem = $('head').find('title');

        return {
          $elem,
          elemText: $elem.text(),
          elemHtml: $.html($elem).replace(/\s+/g, ' '),
          min: minTitleLength,
          max: maxTitleLength
        };
      } else if ('description') {
        const $elem = $('head').find('meta[name=description]');

        return {
          $elem,
          elemText: $elem.attr('content'),
          elemHtml: $.html($elem).replace(/\s+/g, ' '),
          min: minDescriptionLength,
          max: maxDescriptionLength
        };
      }
    }
  };

  self.checkOgMeta = () => {

  };

  // Looking for proper H1
  self.checkH1 = ($) => {
    const $h1 = $('h1');

    if ($h1.length > 1) {
      return {
        error: true,
        msg: 'There should not be more than one <h1> tag on the page.'
      };
    } else if (!$h1.length) {
      return {
        error: true,
        msg: 'You should include an <h1> tag on the page (just one).'
      };
    }

    return {
      msg: 'There is one <h1> on this page.',
      error: false
    };
  };

  // Looking for page words number
  self.checkContentSize = ($) => {
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();

    const totalWords = bodyText ? bodyText.split(' ').length : 0;

    if (totalWords < minWordsNumber) {
      return {
        error: true,
        msg: `There should be at least ${minWordsNumber} words on the page,
        and there are currently ${totalWords}.`
      };
    }
    return {
      error: false,
      msg: `There are ${totalWords} words on the page, which is enough.`
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
};
