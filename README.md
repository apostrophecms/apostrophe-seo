[![CircleCI](https://circleci.com/gh/apostrophecms/apostrophe-seo/tree/master.svg?style=svg)](https://circleci.com/gh/apostrophecms/apostrophe-seo/tree/master)

# apostrophe-seo

SEO configuration for [ApostropheCMS](https://apostrophecms.com/).

Add useful meta fields to all pages and pieces.

## Installation

```bash
npm install apostrophe-seo --save
```

## Use

### 1. Initialization
Configure `apostrophe-seo` in `app.js`.

```js
const apos = require('apostrophe')({
  shortName: 'project',
  modules: {
    'apostrophe-seo': {}
  }
});
```

### 2. Module configuration
If you choose to disable fields for a piece or page you can do so by setting `seo: false` on the module. `apostrophe-files`, `apostrophe-global`, `apostrophe-groups`, `apostrophe-images`, `apostrophe-users` have `seo: false` configured by default.

```js
module.exports = {
  name: 'person',
  label: 'Person',
  pluralLabel: 'People',
  seo: false
};
```

#### Adding global fields for analytics

If you would like to configure additional fields to allow an editor to add a Google Analytics tracking ID and a Google site verification ID you can do so by setting `seoGoogleFields: true` in `apostrophe-global` in your project. Add `seoGoogleTagManager: true` to also add a field for the Google Tag Manager ID (`seoGoogleFields` must also be `true` in this case).

Finally, you may only want to use Google Tag Manager for all analytics and site verification needs. Set `seoTagMangerOnly: true` in `apostrophe-global` to do this. Doing so will override the other options, making their presence irrelevant if also set.

### 3. Updating views

Add the following `include`  to your `<head></head>` in `layout.html` that all of your pages extend, or to `outerLayout.html` if you have one in `apostrophe-templates/views/`. This will output the meta tags needed for SEO and Google Analytics/Verification configuration.

```nunjucks
{% if data.piece %}
  {% if data.piece.seoTitle %}
    {% set title = data.piece.seoTitle %}
  {% else %}
    {% set title = data.piece.title %}
  {% endif %}
{% else %}
  {% if data.page.seoTitle %}
    {% set title = data.page.seoTitle %}
  {% else %}
    {% set title = data.page.title %}
  {% endif %}
{% endif %}

{% block title %}{{ title }}{% endblock %}

{% block extraHead %}
  {% include "apostrophe-seo:view.html" %}
{% endblock %}
```

**The canonical link field** on a page or piece allows an editor to select another page that search engines should understand to be the primary version of that page or piece. [As described on Moz.com](https://moz.com/learn/seo/canonicalization):

> A canonical tag (aka "rel canonical") is a way of telling search engines that a specific URL represents the master copy of a page. Using the canonical tag prevents problems caused by identical or "duplicate" content appearing on multiple URLs. Practically speaking, the canonical tag tells search engines which version of a URL you want to appear in search results.

**Optionally add the following include to your `notFound.html` view.** If the app has a Google Tracking ID value entered, this will send an event to Google Analytics tracking the 404 response, the URL on which it happened, and, if applicable, the page on which the bad URL was triggered (helping you identify where bad links are located).

```nunjucks
{% block extraBody %}
  {{ super() }}
  {% include "apostrophe-seo:notFound.html" %}
{% endblock %}
```

If you already have an `extraBody` block in the `notFound.html` view file, you'll only need to add the `{% include "apostrophe-seo:notFound.html" %}` statement somewhere in that.
