const path = require('path');
const nodeExternals = require('webpack-node-externals');
const Dotenv = require('dotenv-webpack');


const environment = new Dotenv({
  path: './.env', // load this now instead of the ones in '.env'
  safe: false, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
  systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
  silent: true // hide any errors
});

const config = {
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
      extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve('dist')
  },
  externals: [nodeExternals()],
  plugins: [
    environment
  ]
};

module.exports = (env, argv) => {
  const envMode = environment.definitions['process.env.NODE_ENV'];

  if (argv.mode || envMode === '"development"') {
    config.devtool = 'source-map';
    config.mode = 'development';
  }

  if (argv.mode || envMode === '"production"') {
    config.mode = 'production';
  }

  return config;
};
