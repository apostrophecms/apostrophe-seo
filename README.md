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
  {% endif %}
{% endblock %}
```

If you would like to configure additional fields to allow an editor to add a Google Analytics tracking ID and a Google site verification ID you can do so by setting `seoGoogleFields: true` in `apostrophe-global` in your project.

Add the following to `layout.html` that all of your pages extend, or to `outerLayout.html` if you have one in `apostrophe-templates/views/` to add configurable Google Analytics and Google site verification.

```nunjucks
  {% block extraHead %}
    {% if data.global.seoGoogleVerificationId %}
      <meta name="google-site-verification" content="{{ data.global.seoGoogleVerificationId }}" />
    {% endif %}

    {% if data.global.seoGoogleTrackingId %}
     <!-- Global site tag (gtag.js) - Google Analytics -->
     <script async src="https://www.googletagmanager.com/gtag/js?id={{ data.global.seoGoogleTrackingId }}"></script>
     <script>
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', '{{ data.global.seoGoogleTrackingId }}');
     </script>
   {% endif %}
  {% endblock %}
```
