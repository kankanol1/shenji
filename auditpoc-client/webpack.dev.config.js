const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');

fs.open('./src/config/env.js', 'w', function (err, fd) {
    const buf = 'export default "development";';
    fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer) {
    });
});
//var baseUrl = 'http://20.28.1.110:8080';
//var baseUrl = "http://120.224.45.37:33333";
//var baseUrl = 'https://192.168.0.66:8083';

var baseUrl = 'http://127.0.0.1:8080';
module.exports = merge(webpackBaseConfig, {
    devtool: '#source-map',
    output: {
        publicPath: '/dist/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        stats: {colors: true},
        disableHostCheck: true,
        proxy: {
            '/api/*': {
                target: baseUrl,
                // pathRewrite: {'^/proxy': ''},
                changeOrigin: true,
                secure: false
            },
        }
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            filename: 'vendors.js'
        }),
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './src/template/index.ejs',
            inject: false
        })
    ]
});