const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { resolve } = require('path');

const { path, publicPath } = process.env.BUILD_GITHUB_PAGES
  ? { path: resolve(__dirname, '..', '..', '..', '..', 'docs'), publicPath: '/webopoly/' }
  : { path: resolve(__dirname, '..', 'dist'), publicPath: '/' };

module.exports = {
  entry: './source/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: resolve(__dirname, '..', 'tsconfig.client.json'),
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  output: {
    path,
    publicPath,
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './source/index.html',
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
};
