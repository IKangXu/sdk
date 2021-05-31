const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// The path to the cesium source code
const cesiumSource = './thirdParty/Cesium.js'; 

module.exports = {
    devtool: 'cheap-source-map',
    stats: {
        colors: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        modules: false,
        warnings: false
    },
    devServer: {
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false,
            warnings: false
        },
    },
    entry: [
        'webpack-hot-middleware/client?reload=true',
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
        }]
    },
    resolve: {
        extensions: ['', '.js', '.json'] 
        
        
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(), 

        
       new webpack.DefinePlugin({
        // Define relative base path in cesium for loading assets
       // CESIUM_BASE_URL: JSON.stringify('')
    }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ]
};
