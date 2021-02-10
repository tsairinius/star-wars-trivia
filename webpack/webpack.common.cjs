const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
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
      },
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      }
    ],
  },
  plugins: [new HtmlWebpackPlugin({
    template: "./src/template.html"
  })]
};

