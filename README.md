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
    'apostrophe-seo': {}
  }
```

Add to `outerLayout.html` in `apostrophe-templates/views/`.

```nunjucks
{% if data.piece %}
  {% if data.piece.seoPageTitle %}
    {% set title = data.piece.seoPageTitle %}
  {% else %}
    {% set title = data.piece.title %}  
  {% endif %}
{% else %}
  {% if data.page.seoPageTitle %}
    {% set title = data.page.seoPageTitle %}
  {% elif data.global.seoPageTitle %}
    {% set title = data.global.seoPageTitle %}
  {% else %}
    {% set title = data.page.title %}
  {% endif %}
{% endif %}

{% block title %}{{ title }}{% endblock %}

{% block extraHead %}
  {% if data.piece %}
    {% if data.piece.seoPageDescription %}
      {% set description = data.piece.seoPageDescription %}
    {% elif data.global.seoPageDescription %}
      {% set description = data.global.seoPageDescription %}
    {% endif %}
  {% else %}
    {% if data.page.seoPageDescription %}
      {% set description = data.page.seoPageDescription %}
    {% elif data.global.seoPageDescription %}
      {% set description = data.global.seoPageDescription %}
    {% endif %}
  {% endif %}
  {% if data.piece.seoPageDescription or
        data.page.seoPageDescription or 
        data.global.seoPageDescription %}
    <meta name="description" content="{{ description }}" />
  {% endif %}
{% endblock %}
```