const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.options({
    postCss: [
        require('autoprefixer'),
    ],
});

mix.setPublicPath('public');
mix.webpackConfig({
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            '@': __dirname + 'resources'
        }
    },
    output: {
        chunkFilename: 'js/chunks/[name].js',
    },
}).react();

mix.js('resources/js/app.js', 'public/js');

mix.js('resources/pos/src/index.js', 'public/js/app.js').version();
mix.copyDirectory('resources/images',
    'public/images')

// fronted css
// mix.sass([
//     'resources/pos/src/frontend/assets/sass/bootstrap.scss',
//     'resources/pos/src/frontend/assets/sass/pos.scss'
// ], 'public/css/app.css').version();
