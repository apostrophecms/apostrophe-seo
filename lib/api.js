const cheerio = require('cheerio');
const axios = require('axios');

module.exports = (self, options) => {
  self.scanPage = async (pageContent, url) => {
    const $ = cheerio.load(pageContent);

    const seoResults = {
      meta: {
        title: {
          msg: 'The meta title is filled',
          error: false
        },
        description: {
          msg: 'The meta description is filled',
          error: false
        }
      },
      h1: {
        number: {
          msg: 'There is one <h1> on this page',
          error: false
        },
        length: {
          msg: '<h1> tag is the proper length',
          list: [],
          error: false
        }
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

    const h1 = $('h1');
    // const h2 = $('h2');
    // const h3 = $('h3');
    // const h4 = $('h4');

    const textNodes = $('h1, h2, h3, h4, h5, h6, p, span, a, button, em, li, i, u, sub');
    const links = $('a');
    const title = $('title');
    const description = $('description');

    // Looking for Meta title and description
    if (!title || !title.text()) {
      seoResults.meta.title.error = true;
      seoResults.meta.title.msg = 'The meta title does not exist or is not filled';
    }

    if (!description || !description.text()) {
      seoResults.meta.description.error = true;
      seoResults.meta.description.msg = 'The meta description does not exist or is not filled';
    }

    // Loiking for H1
    if (h1.length > 1) {
      seoResults.h1.number.msg = 'There shouldn\'t be more than one <h1> tag in the page';
      seoResults.h1.number.error = true;
    } else if (!h1.length) {
      seoResults.h1.number.msg = 'There should be one <h1> tag in the page';
      seoResults.h1.number.error = true;
    }

    h1.each(function (i, elem) {
      const titleContent = $(elem).text();

      if (titleContent.length > 60 || titleContent.length < 20) {
        seoResults.h1.length.error = true;
        seoResults.h1.length.msg = 'Some <h1> content are not the good length';
        seoResults.h1.length.list.push(titleContent);
      }
    });

    const texts = textNodes.not((i, el) => {
      const areParentsText = self.checkIfParentIsText($, el, textNodes);

      return true;
    });

    // Looking for page text length
    let totalWords = 0;
    textNodes.each((i, elem) => {
      const text = $(elem).text().replace(/\s+/g, ' ').trim();

      const numberOfWords = text.split(' ').length;

      totalWords += numberOfWords;
    });

    if (totalWords < 350) {
      seoResults.contentLength.error = true;
      seoResults.contentLength.msg = `
      There should be at least 350 words in the page,
      there are currently ${totalWords}`;
    }

    // Looking for dead links
    const linksToCheck = [];
    links.each(async (i, elem) => {
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
          console.log('err ===> ', require('util').inspect(err, {
            colors: true,
            depth: 0
          }));
        }
      }
    }

    return seoResults;
  };

  self.checkIfParentIsText = ($, el, textNodes) => {
    const $parent = $(el).parent();
    console.log('$(el).text() ===> ', $(el).html());
    const res = $.contains(textNodes, el);
    console.log('res ===> ', res);

    // console.log('$parent.has(textNodes) ===> ', $parent.attr());

  };
};
