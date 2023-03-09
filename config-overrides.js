const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = function override(config, env) {
  config.resolve = {
    fallback: {
      "fs": false,
      "tls": false,
      "net": false,
      "path": false,
      "zlib": false,
      "http": false,
      "https": false,
      "stream": false,
      "crypto": false,
      "crypto-browserify": require.resolve('crypto-browserify'),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  }
  config.plugins.push(new NodePolyfillPlugin())
  return config
}