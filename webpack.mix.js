const mix = require('laravel-mix');

mix.setPublicPath('public_html');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
mix.webpackConfig({
    /*plugins: [
        new BundleAnalyzerPlugin()
    ],*/
    output: {
        publicPath: '/',
        chunkFilename: 'js/chunks/[name].js?v=[chunkhash]',
    },
});

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public_html/js')
   .sass('resources/sass/app.scss', 'public_html/css');
