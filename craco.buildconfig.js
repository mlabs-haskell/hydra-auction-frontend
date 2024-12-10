const craco_config = require('./craco.config')
const webpack_config = craco_config.webpack.configure

module.exports = {
  ...exports,
  webpack: {
    configure: (webpackConfig) => {
      let config = webpack_config(webpackConfig);
      config.plugins.push(
        {
          apply: (compiler) => {
            compiler.hooks.done.tap('DonePlugin', (stats) => {
              console.log('Compile is done !');
              setTimeout(() => {
                process.exit(0);
              });
            });
          }
        })
      return config;
    }
  }
}
