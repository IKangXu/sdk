const webpack = require('webpack');
const path = require('path');
const cesiumBuild = "../thirdParty/Cesium/";

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: [
        './src/app.js',
    ],
    output: {
        path: path.join(__dirname, '../dist/'),
        filename: 'CTMap.js',
        publicPath: '/dist/'
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel'
        }, {
            test: /\.css$/,
            exclude: /node_modules/,
            loader: "style-loader!css-loader"
        }
    ]
    },
    resolve: {
        extensions: ['', '.js', '.json','.css'],
        alias: {
            //cesium:  path.resolve(__dirname,'./thirdParty/Cesium/Cesium.js'), 
        }
    },
    plugins: [
        // new webpack.ProvidePlugin({
        //     Cesium: path.resolve(__dirname,cesiumBuild+'Cesium.js'),   //webpack会检测模块代码有没有使用jq,有就会自动帮你import
        // }),

        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            // Define relative base path in cesium for loading assets
            // CESIUM_BASE_URL: JSON.stringify('')
        }),

        new CopyWebpackPlugin([{
            from: "src/Assets",
            to: 'Assets'
        }]),
    ]
};