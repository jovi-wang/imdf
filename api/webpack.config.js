const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

const path = require('path');

module.exports = {
  target: 'node',
  entry: slsw.lib.entries,
  mode: 'none',
  externals: [nodeExternals({
    modulesDir: path.join(__dirname, 'node_modules')
  })]
};
