const cheerio = require('cheerio');
const axios = require('axios');

module.exports = (self, { scanRules }) => {
  // Defining default values for rules, or getting them from config
  const MIN_WORDS_NUMBER = (scanRules && scanRules.minWordsNumber) || 350;
  const MIN_TITLE_LENGTH = (scanRules && scanRules.titleLength && scanRules.titleLength.min) || 30;
  const MAX_TITLE_LENGTH = (scanRules && scanRules.titleLength && scanRules.titleLength.max) || 90;
  const MIN_DESCRIPTION_LENGTH = (scanRules && scanRules.descriptionLength &&
    scanRules.descriptionLength.min) || 70;
  const MAX_DESCRIPTION_LENGTH = (scanRules && scanRules.descriptionLength &&
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
      h1: self.checkH1($),
      contentSize: self.checkContentSize($)
    };

    return seoResults;
  };

  // Looking for meta title and description
  self.checkMeta = ($, type) => {
    const {
      $elem, elemText, min, max
    } = getMetaInfos(type);

    if ($elem.length > 1) {
      return {
        error: true,
        msg: `There should be one meta ${type} in your <head>`
      };
    } else if (!$elem.length || !elemText) {
      return {
        error: true,
        msg: `The meta ${type} does not exist or is not filled`
      };
    } else if (elemText.length < min || elemText.length > max) {
      return {
        error: true,
        msg: `The meta ${type} is not the right length: ${elemText.length}.
        It should be between ${min} and ${max} characters`
      };
    }

    return {
      msg: `The meta ${type} is filled and is the right length`,
      error: false
    };

    function getMetaInfos (type) {
      if (type === 'title') {
        const $elem = $('head').find('title');

        return {
          $elem,
          elemText: $elem.text(),
          min: MIN_TITLE_LENGTH,
          max: MAX_TITLE_LENGTH
        };
      } else {
        const $elem = $('head').find('meta[name=description]');

        return {
          $elem,
          elemText: $elem.attr('content'),
          min: MIN_DESCRIPTION_LENGTH,
          max: MAX_DESCRIPTION_LENGTH
        };
      }
    }
  };

  // Looking for proper H1
  self.checkH1 = ($) => {
    const $h1 = $('h1');

    if ($h1.length > 1) {
      return {
        error: true,
        msg: 'There shouldn\'t be more than one <h1> tag in the page'
      };
    } else if (!$h1.length) {
      return {
        error: true,
        msg: 'There should be one <h1> tag in the page'
      };
    }

    return {
      msg: 'There is one <h1> on this page',
      error: false
    };
  };

  // Looking for page words number
  self.checkContentSize = ($) => {
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();

    const totalWords = bodyText ? bodyText.split(' ').length : 0;

    if (totalWords < MIN_WORDS_NUMBER) {
      return {
        error: true,
        msg: `There should be at least ${MIN_WORDS_NUMBER} words in the page,
        there are currently ${totalWords}`
      };
    }
    return {
      error: false,
      msg: `There are enough content on this page: ${totalWords} words`
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
