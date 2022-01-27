const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NewBuildDetectorPlugin = require('../plugin');

module.exports = {
    entry: [
        path.resolve(__dirname, './index.js')
    ],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'static/js/[name].[contenthash:8].js'
    },
    plugins: [
        new NewBuildDetectorPlugin(),
        new HtmlWebpackPlugin(
            {
              inject: true,
              template: path.resolve(__dirname, './index.html')
            },
        )
    ]
}