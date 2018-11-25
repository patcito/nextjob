exports.getHasuraHost = function(process, request, publicRuntimeConfig) {
  if (!request) {
    return publicRuntimeConfig.hasuraClient;
  } else {
    return publicRuntimeConfig.hasura;
  }
};
