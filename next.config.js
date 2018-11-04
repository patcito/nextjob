const withCSS = require('@zeit/next-css');
const withGraphql = require('next-plugin-graphql');
module.exports = withGraphql(
  withCSS({
    webpack: config => {
      // Fixes npm packages that depend on `fs` module
      config.node = {
        fs: 'empty',
      };

      return config;
    },
  }),
);
