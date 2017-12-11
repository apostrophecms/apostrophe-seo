# apostrophe-seo

SEO for [ApostropheCMS](http://apostrophecms.org/).

Add useful meta fields to `apostrophe-custom-pages`, `apostrophe-pieces`, and `apostrophe-global`.

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
    'apostostrophe-seo': {}
  }
```

Update `layout.html` in `apostrophe-templates/views/`.

```nunjucks
{% extends "outerLayoutBase.html" %}

{% if data.piece.seoPageTitle %}
  {% set title = data.piece.seoPageTitle %}
{% elif data.page.seoPageTitle %}
  {% set title = data.page.seoPageTitle %}
{% elif data.global.seoPageTitle %}
  {% set title = data.global.seoPageTitle %}
{% else %}
  {% set title = data.page.title %}
{% endif %}
{% block title %}{{ title }}{% endblock %}

{% block extraHead %}
{% if data.piece.seoPageDescription %}
  {% set description = data.piece.seoPageDescription %}
{% elif data.page.seoPageDescription %}
  {% set description = data.page.seoPageDescription %}
{% elif data.global.seoPageDescription %}
  {% set description = data.global.seoPageDescription%}
{% endif %}
{% if data.piece.seoPageDescription or
      data.page.seoPageDescription or 
      data.global.seoPageDescription %}
<meta name="description" content="{{ description }}" />
{% endif %}
{% endblock %}
```