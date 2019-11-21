const path = require(`path`);

module.exports = {
  mode: `development`,
  node: {
    __dirname: true,
  },
  entry: `./src/main.js`,
  output: {
    path: path.join(__dirname, `public`),
    filename: `bundle.js`,
  },
  devtool: `source-map`,
  devServer: {
    contentBase: path.join(__dirname, `public`),
    publicPath: `http:/localhost:8080/`,
    compress: true,
    watchContenBase: true,
    open: true,
  }
};
