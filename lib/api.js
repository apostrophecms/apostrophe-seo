const cheerio = require('cheerio');
const axios = require('axios');

module.exports = (self, { scanRules }) => {
  const MIN_WORDS_NUMBER = (scanRules &&
    scanRules.minWordsNumber) || 350;
  const MIN_TITLE_LENGTH = (scanRules && scanRules.titleLength &&
    scanRules.titleLength.min) || 30;
  const MAX_TITLE_LENGTH = (scanRules && scanRules.titleLength &&
    scanRules.titleLength.max) || 90;
  const MIN_DESCRIPTION_LENGTH = (scanRules && scanRules.descriptionLength &&
    scanRules.descriptionLength.min) || 70;
  const MAX_DESCRIPTION_LENGTH = (scanRules && scanRules.descriptionLength &&
    scanRules.descriptionLength.max) || 200;

  self.scanPage = async (pageContent, url) => {
    const $ = cheerio.load(pageContent);

    // Empty all apos ui divs to avoid analyzing its text content
    $('body').find('.apos-ui').empty().html();

    const seoResults = {
      meta: {
        title: {
          msg: 'The meta title is filled and is the right length',
          error: false
        },
        description: {
          msg: 'The meta description is filled and is the right length',
          error: false
        }
      },
      h1: {
        msg: 'There is one <h1> on this page',
        error: false
      },
      contentLength: {
        msg: 'There are enough content on this page',
        error: false
      },
      deadLinks: {
        msg: 'There are no dead links on this page',
        list: [],
        error: false
      }
    };

    self.checkIfMeta = ($, seoResults);

    self.checkIfH1($, seoResults);

    self.checkIfEnoughWords($, seoResults);

    await self.checkIfDeadLinks($, url, seoResults);

    return seoResults;
  };

  // Looking for meta title and description
  self.checkIfMeta = ($, seoResults) => {
    const title = $('title');
    const description = $('description');
    // Looking for Meta title and description
    if (!title || !title.text()) {
      seoResults.meta.title.error = true;
      seoResults.meta.title.msg = 'The meta title does not exist or is not filled';
    } else if (isBadLength(title.text(), MIN_TITLE_LENGTH, MAX_TITLE_LENGTH)) {
      seoResults.meta.title.error = true;
      seoResults.meta.title.msg = `The meta title is not the right length: ${title.text()},
      it should be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters`;
    }

    if (!description || !description.text()) {
      seoResults.meta.description.error = true;
      seoResults.meta.description.msg = 'The meta description does not exist or is not filled';
    } else if (isBadLength(description.text(), MIN_DESCRIPTION_LENGTH, MAX_DESCRIPTION_LENGTH)) {
      seoResults.meta.description.error = true;
      seoResults.meta.description.msg = `The meta description is not the right length: ${title.text()},
      it should be between ${MIN_DESCRIPTION_LENGTH} and ${MAX_DESCRIPTION_LENGTH} characters`;
    }

    function isBadLength (text, min, max) {
      return text.length < min || text.length > max;
    }
  };

  // Looking for proper H1
  self.checkIfH1 = ($, seoResults) => {
    const $h1 = $('h1');

    if ($h1.length > 1) {
      seoResults.h1.msg = 'There shouldn\'t be more than one <h1> tag in the page';
      seoResults.h1.error = true;
    } else if (!$h1.length) {
      seoResults.h1.msg = 'There should be one <h1> tag in the page';
      seoResults.h1.error = true;
    }

  };

  // Looking for page text length
  self.checkIfEnoughWords = ($, seoResults) => {
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();

    const totalWords = bodyText ? bodyText.split(' ').length : 0;

    if (totalWords < MIN_WORDS_NUMBER) {
      seoResults.contentLength.error = true;
      seoResults.contentLength.msg = `
      There should be at least ${MIN_WORDS_NUMBER} words in the page,
      there are currently ${totalWords}`;
    }
  };

  // Looking for dead links
  self.checkIfDeadLinks = async ($, url, seoResults) => {
    const $links = $('a');

    const linksToCheck = [];
    $links.each(async (i, elem) => {
      const { href } = $(elem).attr();
      if (href) {
        linksToCheck.push(href);
      }
    });

    for (const link of linksToCheck) {
      try {
        const linkToBrowse = link.startsWith('/')
          ? `${url.endsWith('/') ? url.slice(0, -1) : url}${link}`
          : link;

        await axios.get(linkToBrowse);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          seoResults.deadLinks.error = true;
          seoResults.deadLinks.msg = 'There are some dead links on this page';
          seoResults.deadLinks.list.push(link);
        } else {
          console.log('TODO: Should we do nothing when other error than 404 ?');
          console.log('err ===> ', require('util').inspect(err, {
            colors: true,
            depth: 0
          }));
        }
      }
    }
  };
};
