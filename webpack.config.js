var webpack = require('webpack');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var path = require('path');

var plugins = [
	new ExtractTextPlugin("bundle.css"),
	new HtmlWebpackPlugin({
		title: "Tasky",
		hash: true
	})
];

if (process.env.NODE_ENV == "production") {
	plugins.push(new UglifyJsPlugin({
		uglifyOptions: {
			ie8: false
		}
	}));
	plugins.push(new webpack.DefinePlugin({
		'process.env.NODE_ENV': JSON.stringify('production')
	}));
}

module.exports = {
	entry: './app/main.js',

	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, "dist")
	},

	module: {
		rules: [
			{
				test: /.(js|jsx)$/,
				loaders: 'buble-loader',
				include: path.join(__dirname, 'app'),
				query: {
					jsx: "h"
				}
			},
			{
				test: /\.(styl)$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [ 'css-loader', 'stylus-loader' ]
				})
			},
			{
				test: /\.(css)$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [ 'css-loader' ]
				})
			},
			{
				test: /\.(png|jpg|gif|svg|otf|eot|ttf|woff|woff2)$/,
				loader: 'url-loader',
				options: {
					limit: 10000
				}
			}
		]
	},

	plugins: plugins,

	resolve: {
		modules: [
			path.resolve("./app"),
			path.resolve("./node_modules")
		]
	}
};