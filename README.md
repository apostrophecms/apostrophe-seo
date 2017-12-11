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

```