const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const pkg = require('./package.json');

// eslint-disable-next-line no-console
console.log(
    '\n==========================================\n\n => Node is in mode : ',
    process.env.NODE_ENV,
    '\n\n==========================================\n',
);
const nodeEnv = process.env.NODE_ENV;

module.exports = {
    mode: nodeEnv,
    entry: { main: './src/index.js' },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader', {
                    loader: 'eslint-loader',
                    options: {
                        emitWarning: true,
                    }
                }],
            },
            {
                test: /\.scss$/,
                use: [
                    // TODO: Add sourcemaps
                    {
                        loader: 'style-loader',
                        options: {
                            hmr: true,
                        },
                    },
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    {
                        // Postcss loader config based on
                        // https://github.com/postcss/postcss-loader#context-ctx
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            config: {
                                ctx: {
                                    mode: nodeEnv,
                                    'postcss-preset-env': {
                                        browsers: ['> 1%', 'last 2 versions'],
                                    },
                                    cssnano: {},
                                },
                            },
                        },
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                    },
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin('dist', {}),
        new CopyWebpackPlugin([
            { from: path.resolve(__dirname, './public'), to: 'public' },
        ]),
        new MiniCssExtractPlugin({
            filename: 'style.[hash].css',
        }),
        new HtmlWebpackPlugin({
            pkg,
            inject: false,
            //           hash: true,
            template: './src/index.ejs',
            filename: 'index.html',
        }),
        new WebpackMd5Hash(),
    ],
};
