module.exports = {
  transpileDependencies: ['vuetify'],
  productionSourceMap: false, // Stop webpack from exposing front-end source code
  devServer: {
    proxy: 'http://localhost:3000'
  }
};
