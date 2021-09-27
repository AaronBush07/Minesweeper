const path = require("path");
const webpack = require('webpack').default;

module.exports = {
  devtool: false,
  entry: __dirname + "/src/js/sketch.ts",
  output: {
    path: path.resolve(__dirname,"/dist/"),
    publicPath: "/",
    filename: "js/sketch.ts",
    library: { name: "sketch", type: "umd" },
  },
  devServer: {
    hot: true,
    port: 3333,
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "ts-loader"
      },
      {
        test: /\.scss$/,
        loader: "sass-loader",
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
        },
      },
    ],
  },
};
