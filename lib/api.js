const cheerio = require('cheerio');
const axios = require('axios');

module.exports = (self, options) => {
  self.scanPage = (pageContent, url) => {
    const $ = cheerio.load(pageContent);
    const seoWarnings = [];

    const h1 = $('h1');
    // const h2 = $('h2');
    // const h3 = $('h3');
    // const h4 = $('h4');

    const textNodes = $('h1, h2, h3, h4, h5, h6, p, span, a, button, em, li');
    const links = $('a');

    if (h1.length > 1) {
      seoWarnings.push('You shouldn\'t have more than one <h1> tag in your page');
    } else if (!h1.length) {
      seoWarnings.push('You should have one <h1> tag in you page');
    }

    h1.each(function (i, elem) {
      if (elem.length > 60 || elem.length < 20) {
        seoWarnings.push('<h1> tags text should not be longer than 60 characters or shorter than 20');
        return false;
      }
    });

    let totalWords = 0;

    textNodes.each((i, elem) => {
      const text = $(elem).text().replace(/\s+/g, ' ').trim();
      const numberOfWords = text.split(' ').length;

      totalWords += numberOfWords;
    });

    if (totalWords < 350) {
      seoWarnings.push('You should have at least 350 words in you page');
    }

    links.each(async (i, elem) => {
      // const { status } = await
      console.log('$(elem) ===> ', $(elem).attr());
    });

    return seoWarnings;
  };
};
