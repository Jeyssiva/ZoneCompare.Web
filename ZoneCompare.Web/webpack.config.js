const path = require('path');
var HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
  template: "template.html",
  filename: "index.html"
});

module.exports = {
    watch : true,
    watchOptions : {
      aggregateTimeout : 1000,
      poll:true
    },
    entry: {
        app: './src/index.js'
    },
    output: {
      path: path.resolve(__dirname, "../ZoningComparison/static/js/"),
      publicPath: 'static/js',
      filename: 'bulkfile.bundle.js'
    },
    devServer: {
      contentBase: "./dist"
    },
    module: {
      rules: [{
          test: /\.js(x?)$/,
          exclude: /node_modules/,
          use: [{
            loader: "babel-loader",
            options:{
              presets:["react", "stage-0"]
          }
          }],     
        },
        { 
          test: /\.css$/,
          include: /node_modules/,
          use: ['style-loader', 'css-loader'],
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    plugins: [

      htmlPlugin
    ]
  };
  