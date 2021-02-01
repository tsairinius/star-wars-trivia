const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        test: /\.(svg|png|ico|webmanifest)$/,
        type: 'asset/resource',
        generator: {
            filename: 'img/[name][ext]'
        }
      },
      {
        test: /\.(mp3|wav)$/,
        type: 'asset/resource',
        generator: {
            filename: 'audio/[hash][ext][query]'
        }
      }
    ],
  },
  plugins: [new HtmlWebpackPlugin({
    template: "./src/template.html"
  })]
};

