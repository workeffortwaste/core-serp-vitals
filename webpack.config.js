const FileManagerPlugin = require('filemanager-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  },
  output: {
    path: __dirname + '/',
    publicPath: '/',
    filename: './dist/bundle.js'
  },
  plugins: [
    new FileManagerPlugin({
      onEnd: {
        copy: [
          { source: './src/*', destination: './dist/' }
        ]
      }
    })
  ]
}
