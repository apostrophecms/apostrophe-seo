# apostrophe-seo

SEO for [ApostropheCMS](http://apostrophecms.org/).

Add useful meta fields to all pages and pieces.

## Installation

```bash
npm install apostrophe-seo --save
```

## Use

Configure `apostrophe-seo` in `app.js`.

```js
const apos = require('apostrophe')({
  shortName: 'project',
  modules: {
    'apostrophe-seo': {}
  }
});
```

If you choose to disable fields for a piece or page you can do so by setting `seo: false` on the module. `apostrophe-files`, `apostrophe-global`, `apostrophe-groups`, `apostrophe-images`, `apostrophe-users` have `seo: false` configured by default.

```js
module.exports = {
  name: 'person',
  label: 'Person',
  pluralLabel: 'People',
  seo: false
};
```

### Adding global fields for analytics

If you would like to configure additional fields to allow an editor to add a Google Analytics tracking ID and a Google site verification ID you can do so by setting `seoGoogleFields: true` in `apostrophe-global` in your project. Add `seoGoogleTagManager: true` to also add a field for the Google Tag Manager ID (`seoGoogleFields` must also be `true` in this case).

Finally, you may only want to use Google Tag Manager for all analytics and site verification needs. Set `seoTagMangerOnly: true` in `apostrophe-global` to do this. Doing so will override the other options, making their presence irrelevant if also set.

### Implementing fields in the layout

Add the following include to your `<head></head>` in `layout.html` that all of your pages extend, or to `outerLayout.html` if you have one in `apostrophe-templates/views/`. This will output the meta tags needed for SEO and Google Analytics/Verification configuration.

```nunjucks
{% block extraHead %}
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

  {% include "apostrophe-seo:view.html" %}
{% endblock %}
```
