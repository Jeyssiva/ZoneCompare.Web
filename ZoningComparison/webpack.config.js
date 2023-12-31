module.exports = {
    entry: {
          app: './static/jsx/app.js'
    },
    module: {
      loaders: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
      }]
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    output: {
      path: './static/js/dist/',
      publicPath: '/',
      filename: 'bundle.js'
    },
    devServer: {
      contentBase: './dist'
    }
  };
  