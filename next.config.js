const withCSS = require('@zeit/next-css');
const withGraphql = require('next-plugin-graphql');
module.exports = withGraphql(
  withCSS({
    publicRuntimeConfig: {
      hasura: process.env.HASURA,
      cdn: process.env.CDN || '/',
      i18nHost: process.env.I18N_HOST || 'http://localhost:4000',
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
