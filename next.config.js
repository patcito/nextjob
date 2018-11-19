const withCSS = require('@zeit/next-css');
const withGraphql = require('next-plugin-graphql');
require('dotenv').config();
module.exports = withGraphql(
  withCSS({
    publicRuntimeConfig: {
      hasura: process.env.HASURA,
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
