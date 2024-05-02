const path = require('path');

module.exports = {
  entry: './src/index.js', // Ajusta esto a la entrada de tu aplicación
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  devServer: {
    disableHostCheck: true,
    contentBase: './dist',
    hot: true,
  },
};
