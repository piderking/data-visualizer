//Ensure html-webpack-plugin is pre-installed via npm.
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.txt$/,
        use: [
          {
            loader: 'html-loader',
            options: {minimise: true}
          }
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: "./index.html"
    }),
  ]
};