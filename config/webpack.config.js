const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: [
        './src/app.js',
    ],
    output: {
        path: path.join(__dirname, '../dist/'),
        filename: 'CTMap.min.js',
        publicPath: '/dist/'
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel'
        }],
        rules: [
            {
                test: /\.css$/,
                use: [ 
                    'style-loader', 
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true
                        }
                    }
                ]
            }  
        ]
    },
    resolve: {
        extensions: ['', '.js', '.json'],
        alias: {          
            // Cesium module name           
          //cesium: cesiumBuild+'Cesium.js',         
        }          
    },
    plugins: [
        // new webpack.HotModuleReplacementPlugin(),  
        //全局引入Cesium 
        new CopyWebpackPlugin([{from: "src/Assets", to: 'Assets'}]),
        new webpack.DefinePlugin({
        // Define relative base path in cesium for loading assets
       // CESIUM_BASE_URL: JSON.stringify('')
    }),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            output:{
                comments:false
            },
            compress: {
                warnings: false
            }
        })
    ]
};
