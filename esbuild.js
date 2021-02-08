(async () => {
  const isDev = process.env.NODE_ENV === 'development';

  require('esbuild').build({
    entryPoints: [ 'public/js/user.js' ],
    bundle: true,
    target: 'es2016',
    outfile: 'public/js/bundle.js',
    minify: !isDev,
    sourcemap: isDev
  }).catch(() => process.exit(1));
})();
