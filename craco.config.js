const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const wasmExtensionRegExp = /\.wasm$/;
      webpackConfig.resolve.extensions.push('.wasm');
      webpackConfig.experiments = {
        asyncWebAssembly: true,
        syncWebAssembly: true,
        topLevelAwait: true,
      };
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        fs: false, // fs is not typically available in the browser
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util'),
        os: require.resolve('os-browserify/browser'),
        path: require.resolve('path-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        net: false, // net is not typically available in the browser
        tls: false, // tls is not typically available in the browser
        dns: require.resolve('dns.js'),
        zlib: require.resolve('browserify-zlib'),
        url: require.resolve('url'),
        buffer: require.resolve('buffer/'),
        assert: require.resolve('assert/'),
        dgram: false, // dgram is not typically available in the browser
        process: require.resolve('process'),
      };
      webpackConfig.module.rules.forEach((rule) => {
        (rule.oneOf || []).forEach((oneOf) => {
          if (oneOf.type === 'asset/resource') {
            oneOf.exclude.push(wasmExtensionRegExp);
          }
        });
      });
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process',
          Buffer: ['buffer', 'Buffer'],
        })
      );

      return webpackConfig;
    },
  },
  jest: {
    configure: {
      globals: {
        CONFIG: true,
      },
    },
  },
};
