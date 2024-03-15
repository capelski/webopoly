const { merge } = require('webpack-merge');
const baseConfig = require('./base.config');

module.exports = merge(baseConfig, {
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    open: true,
    proxy: {
      '/api': 'http://localhost:3000',
      '/ws/socket.io': {
        target: 'ws://localhost:3000',
        ws: true,
      },
    },
  },
});
