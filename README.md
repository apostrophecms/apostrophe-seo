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

Add the following to `layout.html` that all of your pages extend, or to `outerLayout.html` if you have one in `apostrophe-templates/views/`.

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
  <meta property="og:title" content="Penn Health-Tech - {{ title }}">
  {% if data.piece %}
    {% if data.piece.seoDescription %}
      {% set description = data.piece.seoDescription %}
    {% endif %}
  {% else %}
    {% if data.page.seoDescription %}
      {% set description = data.page.seoDescription %}
    {% endif %}
  {% endif %}
  {% if data.piece.seoDescription or
        data.page.seoDescription %}
    <meta name="description" content="{{ description }}" />
    <meta name="og:description" content="{{ description }}" />
  {% endif %}
{% endblock %}
```
