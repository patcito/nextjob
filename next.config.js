const withCSS = require('@zeit/next-css');
const withGraphql = require('next-plugin-graphql');
module.exports = withGraphql(
  withCSS({
    publicRuntimeConfig: {
      hasura: process.env.HASURA,
      cdn: process.env.CDN || '/',
    },
    webpack: config => {
      // Fixes npm packages that depend on `fs` module
      config.node = {
        fs: 'empty',
      };
      return config;
    },
  }),
);
