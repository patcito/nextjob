const SimpleOauth2 = require('simple-oauth2');
const express = require('express');
const next = require('next');
const jwt = require('jsonwebtoken');
const port = parseInt(process.env.PORT, 10) || 4000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();
const bodyParser = require('body-parser');
const request = require('request');
const grequest = require('graphql-request');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const sharp = require('sharp');
const acceptWebp = require('accept-webp');
const createLocaleMiddleware = require('express-locale');
const {Storage} = require('@google-cloud/storage');
const projectId = process.env.GOOGLE_STORAGE_PROJECT_ID;
const fs = require('fs');
const sgMail = require('@sendgrid/mail');
const showdown = require('showdown');
const download = require('download-file');
const Sentry = require('@sentry/node');
const path = require('path');
const slugify = require('slugify');

Sentry.init({dsn: process.env.SENTRY_PUBLIC_DSN});

app.prepare().then(() => {
  const server = express();
  //const staticPath = __dirname + '/tmp';
  const staticPath = '/tmp';
  server.use(Sentry.Handlers.requestHandler());
  server.use(Sentry.Handlers.errorHandler());

  server.use(acceptWebp(staticPath, ['jpg', 'jpeg', 'png']));
  server.use(express.static(staticPath));

  server.use(bodyParser.json());
  server.use(cookieParser());
  server.use(fileUpload());
  server.use(createLocaleMiddleware());
  server.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );

  uploadToGCE = async (bucketName, filename) => {
    if (process.env.CDN) {
      console.log('lol');
      // [START storage_upload_file]
      // Imports the Google Cloud client library
      const {Storage} = require('@google-cloud/storage');

      // Creates a client
      let storageOpts = {};
      if (
        !process.env.GOOGLE_APPLICATION_CREDENTIALS ||
        process.env.GOOGLE_STORAGE_PRIVATE_KEY
      ) {
        storageOpts = {
          credentials: {
            private_key: process.env.GOOGLE_STORAGE_PRIVATE_KEY,
            client_email: process.env.GOOGLE_STORAGE_CLIENT_EMAIL,
          },
        };
      }
      const storage = new Storage(storageOpts);

      /**
       * TODO(developer): Uncomment the following lines before running the sample.
       */
      // const bucketName = 'Name of a bucket, e.g. my-bucket';
      // const filename = 'Local file to upload, e.g. ./local/path/to/file.txt';
      console.log(bucketName, filename);
      // Uploads a local file to the bucket
      let assetsDir = '/assets/';
      if (process.env.DEV === 'true') {
        assetsDir = '/assetsdev/';
      }
      await storage.bucket(bucketName).upload(filename, {
        destination: assetsDir + filename.split('/').pop(),
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        gzip: true,
        public: true,
        metadata: {
          // Enable long-lived HTTP caching headers
          // Use only if the contents of the file will never change
          // (If the contents will change, use cacheControl: 'no-cache')
          //cacheControl: 'public, max-age=31536000',
          cacheControl: 'no-cache',
        },
      });

      console.log(`${filename} uploaded to ${bucketName}.`);
      fs.unlink(filename, () => {
        console.log(`${filename} deleted from ${bucketName}.`);
      });
      // [END storage_upload_file]
    }
  };
  checkToken = (req, res, next) => {
    //console.log('cookies', req.cookies);
    const token = req.cookies.token;
    if (!token) {
      //console.log('no token');
      req.userId = null;
      req.token = null;
      req.github = null;
      req.linkedin = null;
      next();
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) {
        console.log('token not ok', err);
        req.userId = null;
        req.token = null;
        req.github = null;
        req.linkedin = null;
        next();
        return;
      } else {
        req.userId = decoded.userId;
        req.token = token;
        req.github = decoded.github;
        req.linkedin = decoded.linkedin;
        req.githubEmail = decoded.githubEmail;
        next();
        return;
      }
    });
  };
  server.use(checkToken);

  auth = async (req, res, next) => {
    const originalRes = res;
    if (req && req.query && req.query.code) {
      if (req.query.code.length < 30) {
        //github oauth
        const oauth2 = SimpleOauth2.create({
          client: {
            id: process.env.GITHUB_ID,
            secret: process.env.GITHUB_SECRET,
          },
          auth: {
            tokenHost: 'https://github.com',
            tokenPath: '/login/oauth/access_token',
            authorizePath: '/login/oauth/authorize',
          },
        });
        const options = {code: req.query.code};

        try {
          const result = await oauth2.authorizationCode.getToken(options);

          const otoken = oauth2.accessToken.create(result);
          const githubToken = result.access_token;
          var opts = {
            uri: 'https://api.github.com/graphql',
            json: true,
            headers: {
              Authorization: 'bearer ' + githubToken,
            },
            query: `
              query getUser {
                viewer {
                  login
                  name
                  bio
                  email
                  databaseId
                  avatarUrl
                  url
                  websiteUrl
                  followers {
                    totalCount
                  }
                  pullRequests(
                    last: 100
                    states: MERGED
                    orderBy: {direction: DESC, field: CREATED_AT}
                  ) {
                    nodes {
                      url
                      title
                      repository {
                        url
                        nameWithOwner
                        owner {
                          avatarUrl
                        }
                        name
                        description
                        stargazers {
                          totalCount
                        }
                        primaryLanguage {
                          name
                          id
                        }
                        languages(first: 100) {
                          nodes {
                            name
                            id
                          }
                        }
                      }
                      mergedBy {
                        avatarUrl
                        login
                        url
                      }
                    }
                  }
                  repositoriesContributedTo(
                    first: 100
                    orderBy: {direction: DESC, field: STARGAZERS}
                  ) {
                    totalCount
                    nodes {
                      id
                      name
                      primaryLanguage {
                        name
                        id
                      }
                      owner {
                        avatarUrl
                      }
                      nameWithOwner
                      description
                      url
                      stargazers {
                        totalCount
                      }
                      viewerCanAdminister
                      languages(first: 25) {
                        totalCount
                        edges {
                          node {
                            id
                            name
                            color
                          }
                        }
                      }
                    }
                  }
                }
              }
            `,
          };
          const client = new grequest.GraphQLClient(opts.uri, {
            headers: opts.headers,
          });

          client
            .request(opts.query, {})
            .catch(err => {
              console.log(err, opts);
            })
            .then(data => {
              // now body and res.body both will contain decoded content.
              //
              console.log('viewerrrrrr', data);
              const bodyJson = data.viewer;

              const checkUserRequestopts = {
                uri: process.env.HASURA,
                json: true,
                query: `
                  mutation User(
                    $githubId: String!
                    $token: String!
                    $githubRepositories: jsonb
                    $pullRequests: jsonb
                    $bio: String
                    $githubBlogUrl: String
                  ) {
                    update_User(
                      where: {githubId: {_eq: $githubId}}
                      _set: {
                        bio: $bio
                        githubBlogUrl: $githubBlogUrl
                        githubAccessToken: $token
                        githubRepositories: $githubRepositories
                        pullRequests: $pullRequests
                      }
                    ) {
                      returning {
                        id
                        githubEmail
                        githubAvatarUrl
                        name
                        Companies {
                          id
                          name
                          description
                          url
                          Industry
                          yearFounded
                        }
                      }
                    }
                  }
                `,
                headers: {
                  'X-Hasura-Access-Key': process.env.HASURA_SECRET,
                },
              };
              const checkUserRequestVars = {
                githubId: bodyJson.databaseId + '',
                token: githubToken,
                githubRepositories: bodyJson.repositoriesContributedTo,
                pullRequests: bodyJson.pullRequests,
                bio: bodyJson.bio,
                githubBlogUrl: bodyJson.websiteUrl,
              };
              const client = new grequest.GraphQLClient(
                checkUserRequestopts.uri,
                {
                  headers: checkUserRequestopts.headers,
                },
              );
              console.log(checkUserRequestopts);
              console.log('gt vars', checkUserRequestVars);

              client
                .request(checkUserRequestopts.query, checkUserRequestVars)
                .then(ugdata => {
                  const currentUser = ugdata.update_User.returning[0];
                  if (currentUser && currentUser.id) {
                    currentUser.recruiter = true;
                    var token = jwt.sign(
                      {
                        token: otoken,
                        userId: currentUser.id,
                        github: true,
                        githubEmail: currentUser.githubEmail,
                        linkedin: false,
                      },
                      process.env.JWT_SECRET,
                      {
                        expiresIn: '365d', // expires in 24 hours
                      },
                    );
                    /*return originalRes.status(200).send({
                    auth: true,
                    token: token,
                    user: currentUser,
                  });*/

                    req.userId = currentUser.id;
                    req.token = token;
                    req.github = true;
                    req.linkedin = false;
                    req.currentUser = currentUser;
                    var url = currentUser.githubAvatarUrl;

                    var options = {
                      directory: '/tmp',
                      filename: `github-avatar-${req.userId}.jpeg`,
                    };

                    if (url) {
                      download(url, options, function(err) {
                        if (err) console.log(err);
                        console.log('meow');

                        sharp(
                          options.directory + '/' + options.filename,
                        ).toFile(
                          `/tmp/github-avatar-${req.userId}.webp`,
                          (err, info) => {
                            if (err) {
                              console.log(err);
                            }
                            sharp(
                              options.directory + '/' + options.filename,
                            ).toFile(
                              `/tmp/github-avatar-${req.userId}.png`,
                              (err, info) => {
                                if (err) {
                                  console.log(err, info);
                                }
                                uploadToGCE(
                                  process.env.GOOGLE_STORAGE_BUCKET,
                                  `/tmp/github-avatar-${req.userId}.webp`,
                                );

                                uploadToGCE(
                                  process.env.GOOGLE_STORAGE_BUCKET,
                                  `/tmp/github-avatar-${req.userId}.png`,
                                );
                                console.log(err, info);
                              },
                            );
                          },
                        );
                      });
                    }
                    next();
                    return;
                  }

                  var uopts = {
                    uri: process.env.HASURA,
                    json: true,
                    query: `
                      mutation insert_User(
                        $name: String
                        $githubEmail: String!
                        $githubId: String
                        $githubAvatarUrl: String
                        $githubUsername: String
                        $githubAccessToken: String
                        $githubBlogUrl: String
                        $githubRepositories: jsonb
                        $githubFollowers: Int
                        $pullRequests: jsonb
                        $bio: String
                      ) {
                        insert_User(
                          objects: {
                            name: $name
                            githubEmail: $githubEmail
                            githubId: $githubId
                            githubAvatarUrl: $githubAvatarUrl
                            githubUsername: $githubUsername
                            githubAccessToken: $githubAccessToken
                            githubBlogUrl: $githubBlogUrl
                            githubFollowers: $githubFollowers
                            githubRepositories: $githubRepositories
                            pullRequests: $pullRequests
                            bio: $bio
                          }
                        ) {
                          returning {
                            id
                            githubEmail
                            name
                            githubAvatarUrl
                          }
                        }
                      }
                    `,
                    headers: {
                      'X-Hasura-Access-Key': process.env.HASURA_SECRET,
                    },
                  };
                  const client = new grequest.GraphQLClient(uopts.uri, {
                    headers: uopts.headers,
                  });
                  bodyJson.id += '';
                  const variables = {
                    name: bodyJson.name,
                    githubEmail: bodyJson.email,
                    githubId: bodyJson.databaseId + '',
                    githubAvatarUrl: bodyJson.avatarUrl,
                    githubUsername: bodyJson.login,
                    githubAccessToken: githubToken,
                    githubBlogUrl: bodyJson.websiteUrl,
                    pullRequests: bodyJson.pullRequests,
                    bio: bodyJson.bio,
                    githubFollowers: bodyJson.followers.totalCount,
                    githubRepositories: bodyJson.repositoriesContributedTo,
                  };
                  console.log(uopts.query);
                  console.log('gt vars', variables);
                  try {
                    const opts = {
                      uri:
                        'https://api.github.com/user/emails?access_token=' +
                        githubToken,
                      headers: {'User-Agent': 'patcito'},
                    };

                    request(opts, function(err, res, body) {
                      console.log('github email', body);
                      const email = JSON.parse(body)[0].email;
                      variables.githubEmail = email;
                      client.request(uopts.query, variables).then(gdata => {
                        console.log('GDATA', gdata);
                        var token = jwt.sign(
                          {
                            token: otoken,
                            userId: gdata.insert_User.returning[0].id,
                            githubEmail: email,
                            github: true,
                            linkedin: false,
                          },
                          process.env.JWT_SECRET,
                          {
                            expiresIn: '365d', // expires in 24 hours
                          },
                        );
                        /*return originalRes.status(200).send({
                    auth: true,
                    token: token,
                    user: gdata.insert_User.returning[0],
                  });*/
                        req.userId = gdata.insert_User.returning[0].id;
                        req.token = token;
                        req.github = true;
                        req.linkedin = false;
                        req.currentUser = gdata.insert_User.returning[0];
                        var url =
                          gdata.insert_User.returning[0].githubAvatarUrl;

                        var options = {
                          directory: '/tmp',
                          filename: `github-avatar-${req.userId}.jpeg`,
                        };

                        if (url) {
                          download(url, options, function(err) {
                            if (err) throw err;
                            console.log('meow');

                            sharp(
                              options.directory + '/' + options.filename,
                            ).toFile(
                              `/tmp/github-avatar-${req.userId}.webp`,
                              (err, info) => {
                                if (err) {
                                  console.log(err);
                                }
                                sharp(
                                  options.directory + '/' + options.filename,
                                ).toFile(
                                  `/tmp/github-avatar-${req.userId}.png`,
                                  (err, info) => {
                                    if (err) {
                                      console.log(err, info);
                                    }
                                    uploadToGCE(
                                      process.env.GOOGLE_STORAGE_BUCKET,
                                      `/tmp/github-avatar-${req.userId}.webp`,
                                    );

                                    uploadToGCE(
                                      process.env.GOOGLE_STORAGE_BUCKET,
                                      `/tmp/github-avatar-${req.userId}.png`,
                                    );
                                    console.log(err, info);
                                  },
                                );
                              },
                            );
                          });
                        }
                        console.log('userid', req.userId);
                        next();
                        return;
                      });
                    });
                  } catch (err) {
                    console.log(err);
                    next();
                    return;
                  }
                  //end client request
                })
                .catch(err => {
                  console.log('err', err);
                });
            });
        } catch (error) {
          console.error('Access Token Error', error.message);
          next();
          return res.status(500).json('Authentication failed');
        }
      } else if (req.query.code.length > 30) {
        console.log('linkedin');
        //github oauth
        const oauth2 = SimpleOauth2.create({
          client: {
            id: process.env.LINKEDIN_ID,
            secret: process.env.LINKEDIN_SECRET,
          },
          auth: {
            tokenHost: 'https://api.linkedin.com',
            tokenPath: '/oauth/v2/accessToken',
            authorizePath: '/oauth/v2/authorization',
          },
        });
        const options = {code: req.query.code};

        try {
          const opts = {
            uri:
              'https://www.linkedin.com/oauth/v2/accessToken?code=' +
              options.code +
              `&grant_type=authorization_code&redirect_uri=${
                process.env.PUBLIC_HOSTNAME
              }&client_id=` +
              process.env.LINKEDIN_ID +
              '&client_secret=' +
              process.env.LINKEDIN_SECRET,
            headers: {
              'Content-Type': 'x-www-form-urlencoded',
            },
          };

          request(opts, function(err, res, body) {
            console.log('access token query', body);
            const otoken = JSON.parse(body).access_token;
            console.log(otoken);
            const aopts = {
              uri:
                'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))',
              headers: {
                Authorization: 'Bearer ' + otoken,
              },
            };
            request(aopts, function(aerr, ares, abody) {
              const bodyJson = JSON.parse(abody); //;
              console.log('bodyJson', bodyJson, abody);
              console.log('profile picture query', err, otoken);
              const eopts = {
                uri:
                  'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
                headers: {
                  Authorization: 'Bearer ' + otoken,
                },
              };
              request(eopts, function(eerr, eres, ebody) {
                console.log('email query', eerr);
                console.log('otoken email', otoken);
                // now body and res.body both will contain decoded content.
                //
                const ebodyJson = JSON.parse(ebody);
                console.log('linkedin', JSON.stringify(bodyJson));
                console.log('linkedin email', JSON.stringify(ebodyJson));
                if (req.github === true) {
                  console.log('userId!', req.userId);
                  const setLinkedinProfilopts = {
                    uri: process.env.HASURA,
                    json: true,
                    query: `mutation uu($id: Int, $linkedinProfile: jsonb!) {
				  update_User(where: {id: {_eq:
					  $id}}, _set: {linkedinProfile: $linkedinProfile}){
					  returning{
						        id
						        linkedinProfile

					  }

				  }

				}`,
                    headers: {
                      'X-Hasura-Access-Key': process.env.HASURA_SECRET,
                    },
                  };
                  const setLinkedinProfileVars = {
                    linkedinProfile: bodyJson,
                    id: req.userId,
                  };
                  const client = new grequest.GraphQLClient(
                    setLinkedinProfilopts.uri,
                    {
                      headers: setLinkedinProfilopts.headers,
                    },
                  );
                  client
                    .request(
                      setLinkedinProfilopts.query,
                      setLinkedinProfileVars,
                    )
                    .then(ugdata => {
                      next();
                      return;
                    });
                  return;
                } else {
                  console.log('insert hasura');
                  const checkUserRequestopts = {
                    uri: process.env.HASURA,
                    json: true,
                    query: `
                    query User($linkedinId: String!) {
                      Company(
                        where: {
                          _or: [
                            {Owner: {linkedinId: {_eq: $linkedinId}}}
                            {Moderators: {User: {linkedinId: {_eq: $linkedinId}}}}
                          ]
                        }
                      ) {
                        id
                        name
                        description
                        url
                        Industry
                        yearFounded
                      }
                      User(where: {linkedinId: {_eq: $linkedinId}}) {
                        id
                        linkedinEmail
                        name
                        linkedinAvatarUrl
                      }
                    }
                  `,
                    headers: {
                      'X-Hasura-Access-Key': process.env.HASURA_SECRET,
                    },
                  };
                  const checkUserRequestVars = {
                    linkedinId: bodyJson.id,
                  };
                  const client = new grequest.GraphQLClient(
                    checkUserRequestopts.uri,
                    {
                      headers: checkUserRequestopts.headers,
                    },
                  );
                  client
                    .request(checkUserRequestopts.query, checkUserRequestVars)
                    .then(ugdata => {
                      console.log('insert linkedin user query');
                      let currentUser = ugdata.User[0];
                      const companies = ugdata.Company;
                      if (currentUser && currentUser.id) {
                        console.log('current linkedin user exists');
                        currentUser.Companies = companies;
                        const token = jwt.sign(
                          {
                            token: otoken,
                            userId: currentUser.id,
                            github: false,
                            linkedin: true,
                          },
                          process.env.JWT_SECRET,
                          {
                            expiresIn: '365d', // expires in 24 hours
                          },
                        );
                        currentUser.recruiter = true;
                        /*return originalRes.status(200).send({
                      auth: true,
                      token: token,
                      user: currentUser,
                    });*/
                        req.userId = currentUser.id;
                        req.token = token;
                        req.github = false;
                        req.linkedin = true;
                        req.currentUser = currentUser;
                        let url = currentUser.linkedinAvatarUrl;
                        console.log('current', currentUser);
                        console.log(url);
                        let options = {
                          directory: '/tmp',
                          filename: `linkedin-avatar-${req.userId}.jpeg`,
                        };

                        if (
                          bodyJson &&
                          bodyJson.pictureUrls &&
                          bodyJson.pictureUrls.values &&
                          bodyJson.pictureUrls.values[0]
                        ) {
                          download(
                            bodyJson.pictureUrls.values[0],
                            options,
                            function(err) {
                              if (err) console.log(err);
                              console.log('meow');

                              sharp(
                                options.directory + '/' + options.filename,
                              ).toFile(
                                `/tmp/linkedin-avatar-${req.userId}.webp`,
                                (err, info) => {
                                  if (err) {
                                    console.log(err);
                                  }
                                  sharp(
                                    options.directory + '/' + options.filename,
                                  ).toFile(
                                    `/tmp/linkedin-avatar-${req.userId}.png`,
                                    (err, info) => {
                                      if (err) {
                                        originalRes.status(500).json(err);
                                      }
                                      uploadToGCE(
                                        process.env.GOOGLE_STORAGE_BUCKET,
                                        `/tmp/linkedin-avatar-${
                                          req.userId
                                        }.webp`,
                                      );

                                      uploadToGCE(
                                        process.env.GOOGLE_STORAGE_BUCKET,
                                        `/tmp/linkedin-avatar-${
                                          req.userId
                                        }.png`,
                                      );
                                      console.log(err, info);
                                    },
                                  );
                                },
                              );
                            },
                          );
                        }
                        next();
                        return;
                      }
                      console.log('post check linkedin user');
                      const uopts = {
                        uri: process.env.HASURA,
                        json: true,
                        query: `
                        mutation insert_User(
                          $name: String
                          $linkedinEmail: String!
                          $linkedinId: String
                          $linkedinAvatarUrl: String
                          $linkedinAccessToken: String
                          $firstName: String
                          $lastName: String
                          $headlineLinkedin: String
                          $industryLinkedin: String
                          $companyLinkedin: String
                          $linkedinUrl: String
                        ) {
                          insert_User(
                            objects: {
                              name: $name
                              linkedinEmail: $linkedinEmail
                              linkedinId: $linkedinId
                              linkedinAvatarUrl: $linkedinAvatarUrl
                              linkedinAccessToken: $linkedinAccessToken
                              firstName: $firstName
                              lastName: $lastName
                              headlineLinkedin: $headlineLinkedin
                              industryLinkedin: $industryLinkedin
                              companyLinkedin: $companyLinkedin
                              linkedinUrl: $linkedinUrl
                            }
                          ) {
                            returning {
                              id
                              linkedinEmail
                              name
                              linkedinAvatarUrl
                            }
                          }
                        }
                      `,
                        headers: {
                          'X-Hasura-Access-Key': process.env.HASURA_SECRET,
                        },
                      };
                      let avatarUrl = '';
                      if (
                        bodyJson.profilePicture &&
                        bodyJson.profilePicture['displayImage~'] &&
                        bodyJson.profilePicture['displayImage~'].elements &&
                        bodyJson.profilePicture['displayImage~'].elements[
                          bodyJson.profilePicture['displayImage~'].elements
                            .length -
                            1 >=
                          0
                            ? bodyJson.profilePicture['displayImage~'].elements
                                .length - 1
                            : 0
                        ] &&
                        bodyJson.profilePicture['displayImage~'].elements[
                          bodyJson.profilePicture['displayImage~'].elements
                            .length - 1
                        ].identifiers &&
                        bodyJson.profilePicture['displayImage~'].elements[
                          bodyJson.profilePicture['displayImage~'].elements
                            .length - 1
                        ].identifiers[0]
                      ) {
                        avatarUrl =
                          bodyJson.profilePicture['displayImage~'].elements[
                            bodyJson.profilePicture['displayImage~'].elements
                              .length - 1
                          ].identifiers[0].identifier;
                      }
                      console.log('avatar url', avatarUrl, bodyJson);
                      console.log('ebodyJson', ebodyJson);
                      console.log(Object.keys(bodyJson.firstName.localized)[0]);
                      console.log(Object.keys(bodyJson.lastName.localized)[0]);
                      console.log(
                        ebodyJson.elements[0]['handle~'].emailAddress,
                      );
                      const variables = {
                        name: bodyJson.formattedName,
                        linkedinEmail:
                          ebodyJson.elements[0]['handle~'].emailAddress,
                        linkedinId: bodyJson.id,
                        linkedinAvatarUrl: avatarUrl,
                        linkedinAccessToken: otoken,
                        firstName:
                          bodyJson.firstName.localized[
                            Object.keys(bodyJson.firstName.localized)[0]
                          ],
                        lastName:
                          bodyJson.lastName.localized[
                            Object.keys(bodyJson.lastName.localized)[0]
                          ],
                        headlineLinkedin: '',
                        industryLinkedin: '',
                        companyLinkedin: '',
                        linkedinUrl: '',
                      };
                      console.log('variables:', variables);
                      client
                        .request(uopts.query, variables)
                        .then(gdata => {
                          console.log('gdata ok');
                          const currentUser = gdata.insert_User.returning[0];
                          currentUser.recruiter = true;
                          const token = jwt.sign(
                            {
                              token: otoken,
                              userId: currentUser.id,
                              github: false,
                              linkedin: true,
                            },
                            process.env.JWT_SECRET,
                            {
                              expiresIn: '365d', // expires in 24 hours
                            },
                          );

                          /*return originalRes.status(200).send({
                      auth: true,
                      token: token,
                      user: currentUser,
                    });*/
                          req.userId = currentUser.id;
                          req.token = token;
                          req.github = false;
                          req.linkedin = true;
                          req.currentUser = currentUser;
                          console.log('current', currentUser);
                          let url = currentUser.linkedinAvatarUrl;

                          let options = {
                            directory: '/tmp',
                            filename: `linkedin-avatar-${req.userId}.jpeg`,
                          };

                          if (url) {
                            download(url, options, function(err) {
                              if (err) console.log(err);
                              console.log('meow');

                              sharp(
                                options.directory + '/' + options.filename,
                              ).toFile(
                                `/tmp/linkedin-avatar-${req.userId}.webp`,
                                (err, info) => {
                                  if (err) {
                                    console.log(err);
                                  }
                                  sharp(
                                    options.directory + '/' + options.filename,
                                  ).toFile(
                                    `/tmp/linkedin-avatar-${req.userId}.png`,
                                    (err, info) => {
                                      if (err) {
                                        originalRes.status(500).json(err);
                                      }
                                      uploadToGCE(
                                        process.env.GOOGLE_STORAGE_BUCKET,
                                        `/tmp/linkedin-avatar-${
                                          req.userId
                                        }.webp`,
                                      );

                                      uploadToGCE(
                                        process.env.GOOGLE_STORAGE_BUCKET,
                                        `/tmp/linkedin-avatar-${
                                          req.userId
                                        }.png`,
                                      );
                                      console.log(err, info);
                                    },
                                  );
                                },
                              );
                            });
                          }

                          next();
                          return;
                        })
                        .catch(error => console.error(error));
                    });
                }
              });
            });
            //    return originalRes.status(500).json(body);
          });
        } catch (error) {
          console.error('Access Token Error Linkedin', error.message);
          next();
          return res.status(500).json('Authentication failed');
        }
      }
    } else {
      next();
      return;
    }
  };
  server.use(auth);
  server.get('/auth', (req, res) => {
    return originalRes.status(200).json({});
  });

  server.get('/checksession', (req, res) => {
    var token = req.headers['x-access-token'];
    if (!token)
      return res.status(401).send({auth: false, message: 'No token provided.'});
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) {
        return res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.',
          err: err,
          token: token,
          s: process.env.JWT_SECRET,
        });
      } else {
        return res.status(200).json('ok');
      }
    });
  });
  server.get('/apii', (req, res) => {
    return res.status(200).json('lol');
  });
  server.get('/api', (req, res) => {
    var token = req.headers['x-access-token'];
    if (!token) {
      console.log('anon');
      const x = {
        'X-Hasura-Role': 'anon',
      };
      return res.status(200).json(x);
    }

    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) {
        console.log('anon 2');
        const x = {
          'X-Hasura-Role': 'anon',
        };
        return res.status(200).send(x);
      } else {
        var role = req.headers['x-access-role'];
        if (!role) {
          role = decoded.userId ? 'user' : 'anon';
        } else if (role === 'userType') {
          if (decoded.github) {
            role = 'user-candidate';
          } else {
            role = 'user-hr';
          }
        }
        console.log('role', role);
        const x = {
          'X-Hasura-User-Id': decoded.userId + '',
          'X-Hasura-Role': role,
          'X-Hasura-Access-Key': process.env.JWT_SECRET,
          'X-Hasura-Custom': 'custom value',
        };
        return res.status(200).json(x);
      }
    });
  });

  server.get('/jobs/update/:id', (req, res) => {
    return app.render(req, res, '/newjob', {id: req.params.id});
  });

  server.get('/jobs/update/:id/fr', (req, res) => {
    return app.render(req, res, '/newjob', {id: req.params.id, fr: 1});
  });

  server.get('/newjob/fr', (req, res) => {
    return app.render(req, res, '/newjob', {fr: 1});
  });

  server.get('/jobs/companies/:companyId', (req, res) => {
    return app.render(req, res, '/', {companyId: req.params.companyId});
  });

  server.get('/jobs/companies/:companyId/team', (req, res) => {
    return app.render(req, res, '/', {
      companyId: req.params.companyId,
      team: true,
    });
  });

  server.get('/jobs/companies/:companyId/:slug', (req, res) => {
    return app.render(req, res, '/', {companyId: req.params.companyId});
  });

  server.get('/jobs/companies/:companyId/:slug/team', (req, res) => {
    return app.render(req, res, '/', {
      companyId: req.params.companyId,
      team: true,
    });
  });

  server.get('/companies', (req, res) => {
    return app.render(req, res, '/', {companies: true});
  });

  server.get('/me/companies', (req, res) => {
    return app.render(req, res, '/', {companies: true, me: true});
  });

  server.get('/me/jobs', (req, res) => {
    return app.render(req, res, '/', {mejobs: true});
  });

  server.get('/companies/:companyId', (req, res) => {
    return app.render(req, res, '/showcompany', {
      companyId: req.params.companyId,
      action: 'showCompany',
    });
  });

  server.get('/companies/:companyId/fr', (req, res) => {
    return app.render(req, res, '/showcompany', {
      companyId: req.params.companyId,
      action: 'showCompany',
      lang: 'fr',
    });
  });

  server.get('/companies/:companyId/edit', (req, res) => {
    return app.render(req, res, '/editcompany', {
      companyId: req.params.companyId,
      action: 'editCompany',
    });
  });

  server.get('/companies/:companyId/:slug', (req, res) => {
    return app.render(req, res, '/showcompany', {
      companyId: req.params.companyId,
      action: 'showCompany',
    });
  });

  server.get('/jobs/:jobId', (req, res) => {
    return app.render(req, res, '/showjob', {
      jobId: req.params.jobId,
      action: 'showJob',
    });
  });

  server.get('/jobs/:jobId/fr', (req, res) => {
    return app.render(req, res, '/showjob', {
      jobId: req.params.jobId,
      action: 'showJob',
      lang: 'fr',
    });
  });

  server.get('/jobs/:jobId/:slug', (req, res) => {
    return app.render(req, res, '/showjob', {
      jobId: req.params.jobId,
      action: 'showJob',
    });
  });

  server.get('/companies/:companyId/edit/fr', (req, res) => {
    return app.render(req, res, '/editcompany', {
      companyId: req.params.companyId,
      fr: 1,
      action: 'editCompany',
    });
  });

  server.get('/profile/:userProfileId', (req, res) => {
    return app.render(req, res, '/profile', {
      userProfileId: req.params.userProfileId,
      action: 'userProfile',
    });
  });

  server.post('/uploadResume', function(req, res) {
    if (!req.files) return res.status(400).json('No files were uploaded.');
    let sampleFile = req.files.file;

    sampleFile = req.files.file;

    const path =
      '/tmp/' + req.get('jobId') + '-' + req.get('applicantId') + '-resume.pdf';

    sampleFile.mv(path, function(err) {
      if (err) {
        return res.status(500).json(err);
      }
      uploadToGCE(process.env.GOOGLE_STORAGE_BUCKET, path);
      res.send('ok');
    });
  });

  server.post('/messageCreateWebhook', function(req, res) {
    console.log('hook!', req.body.event.data.new.id);
    const getJobApplicationOwnerEmailopts = {
      uri: process.env.HASURA,
      json: true,
      query: `
        query Message($id: Int) {
          Message(where: {id: {_eq: $id}}) {
            id
            body
            User {
              githubEmail
              linkedinEmail
              name
            }
            JobApplication {
              Applicant {
                id
                name
                bio
                githubBlogUrl
                githubEmail
              }
              coverLetter
              Job {
                id
                JobTitle
                applicationEmail
                Company {
                  name
                  Owner {
                    linkedinEmail
                  }
                  Moderators {
                    userEmail
                  }
                }
              }
            }
          }
        }
      `,
      headers: {
        'X-Hasura-Access-Key': process.env.HASURA_SECRET,
      },
    };
    const getJobOwnerEmailVars = {
      id: req.body.event.data.new.id,
    };
    const client = new grequest.GraphQLClient(
      getJobApplicationOwnerEmailopts.uri,
      {
        headers: getJobApplicationOwnerEmailopts.headers,
      },
    );
    client
      .request(getJobApplicationOwnerEmailopts.query, getJobOwnerEmailVars)
      .then(data => {
        console.log('gql data', data);
        const converter = new showdown.Converter();
        const html = converter.makeHtml(data.Message[0].body);
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        console.log('gql data api key');
        let msg = {
          from: 'ReactEurope Jobs <jobs@react-europe.org>',
          subject: 'New message',
          text: `Hi there, \n
${data.Message[0].User.name}
 just sent you a message about the job ad "${
   data.Message[0].JobApplication.Job.JobTitle
 } at ${
            data.Message[0].JobApplication.Job.Company.name
          }". This is the full message:\n
${data.Message[0].body}
\n

You can read more about it here: ${process.env.PUBLIC_HOSTNAME}/applications.
\n\n
Best,\n\n

The ReactEurope jobs team
`,
          html: `Hi there, <br><p>
		${data.Message[0].User.name} just sent you a message about the job ad "<i>${
            data.Message[0].JobApplication.Job.JobTitle
          } at ${
            data.Message[0].JobApplication.Job.Company.name
          }</i>". This is the full message:</p>
${html}

<p>You can read more about it here: ${
            process.env.PUBLIC_HOSTNAME
          }/applications.</p>
Best,
<br>
<br>
The ReactEurope jobs team
			`,
        };
        console.log(msg);
        const authorEmail = data.Message[0].User.githubEmail
          ? data.Message[0].User.githubEmail
          : data.Message[0].User.EnkedinEmailmail;
        let emails = [];
        console.log(1);
        data.Message[0].JobApplication.Job.Company.Moderators.map(mod =>
          emails.push(mod.userEmail),
        );
        console.log(2);
        emails.push(
          data.Message[0].JobApplication.Job.Company.Owner.linkedinEmail,
        );
        console.log(3);
        emails = Array.from(new Set(emails));
        console.log(emails, authorEmail);
        emails.push('patrick@eventlama.com');
        emails.map(e => {
          console.log(e, authorEmail);
          if (e !== authorEmail) {
            console.log('sent! to', e);
            msg.to = e;
            sgMail.send(msg);
          }
        });
        res.json(data);
      })
      .catch(() => res.status(500));
  });

  server.post('/jobApplicationCreateWebhook', function(req, res) {
    console.log(req.body.event.data.new.id);
    const getJobApplicationOwnerEmailopts = {
      uri: process.env.HASURA,
      json: true,
      query: `
        query JobApplication($id: Int) {
          JobApplication(where: {id: {_eq: $id}}) {
            id
            Applicant {
			  id
              name
              bio
              githubBlogUrl
            }
            coverLetter
            Job {
              id
              JobTitle
              applicationEmail
              Company {
                name
              }
            }
          }
        }
      `,
      headers: {
        'X-Hasura-Access-Key': process.env.HASURA_SECRET,
      },
    };
    const getJobOwnerEmailVars = {
      id: req.body.event.data.new.id,
    };
    const client = new grequest.GraphQLClient(
      getJobApplicationOwnerEmailopts.uri,
      {
        headers: getJobApplicationOwnerEmailopts.headers,
      },
    );
    client
      .request(getJobApplicationOwnerEmailopts.query, getJobOwnerEmailVars)
      .then(data => {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const email = data.JobApplication[0].Job.applicationEmail;
        let msg = {
          to: email,
          from: 'ReactEurope Jobs <jobs@react-europe.org>',
          subject: 'New job application',
          text: `Hi there, \n
${data.JobApplication[0].Applicant.name}
 has just submitted an application to your job ad "${
   data.JobApplication[0].Job.JobTitle
 } at ${data.JobApplication[0].Job.Company.name}".\n\n

You can read more about it here: ${process.env.PUBLIC_HOSTNAME}/applications.
\n\n
Best,\n\n

The ReactEurope jobs team
`,
          html: `Hi there, <br><p>
		${
      data.JobApplication[0].Applicant.name
    } has just submitted an application to your job ad "<i>${
            data.JobApplication[0].Job.JobTitle
          } at ${data.JobApplication[0].Job.Company.name}</i>".</p>

<p>You can read more about it here: ${
            process.env.PUBLIC_HOSTNAME
          }/applications.</p>
Best,
<br>
<br>
The ReactEurope jobs team
			`,
        };
        sgMail.send(msg);
        msg.to = process.env.ADMIN_EMAIL;
        msg.subject = '[admin]: New job application';
        sgMail.send(msg);
        res.json(data);
      })
      .catch(() => res.status(500));
  });

  server.post('/jobCreateWebhook', function(req, res) {
    console.log('/jobCreateWebhook', req.body.event.data.new.id);
    const newJob = req.body.event.data.new;
    const oldJob = req.body.event.data.old;
    const x = {
      skill: 'React.js',
      remote: 'true',
      country: 'France',
      locality: 'Paris',
      description: 'KEYWORD',
      jobEmployementType: 'FullTime,Internship,Temporary,Contract,PartTime',
    };
    if (newJob.isPublished && (!oldJob || oldJob.isPublished !== true)) {
      const getJobApplicationOwnerEmailopts = {
        uri: process.env.HASURA,
        json: true,
        query: `
          query Users($companyId: Int, $id: Int!) {
            SearchNotification {
              id
              User {
                githubEmail
                notificationsUUID
              }
              query
            }
            Job(where: {id: {_eq: $id}}) {
              id
              Skills {
                Skill
              }
              EmployementType
              description
              country
              locality
              remote
            }
            User(
              where: {
                _and: {
                  getNotifications: {_eq: true}
                  githubEmail: {_is_null: false}
                }
              }
            ) {
              id
              githubEmail
              notificationsUUID
            }
            Company(where: {id: {_eq: $companyId}}) {
              id
              name
            }
          }
        `,
        headers: {
          'X-Hasura-Access-Key': process.env.HASURA_SECRET,
        },
      };
      console.log('/jobCreateWebhook 2', newJob.id);

      const getJobOwnerEmailVars = {
        companyId: newJob.companyId,
        id: newJob.id,
      };
      console.log('/jobCreateWebhook 3', newJob.id);

      const client = new grequest.GraphQLClient(
        getJobApplicationOwnerEmailopts.uri,
        {
          headers: getJobApplicationOwnerEmailopts.headers,
        },
      );
      let msg = {};
      client
        .request(getJobApplicationOwnerEmailopts.query, getJobOwnerEmailVars)
        .then(data => {
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          const users = data.User;
          const job = data.Job[0];
          const searches = data.SearchNotification;
          const company = data.Company[0];
          const subject = `${company.name} is looking for a ${newJob.JobTitle}`;
          console.log('/jobCreateWebhook 4', newJob.id);
          let emails = [];
          searches.map(search => {
            let user = search.User;
            msg = {
              from: 'ReactEurope Jobs <jobs@react-europe.org>',
              subject: subject,
              text: `Hi there, \n
${company.name} is looking for a ${newJob.JobTitle}".\n\n

You can read more about it here: ${process.env.PUBLIC_HOSTNAME}/jobs/${
                newJob.id
              }/${slugify(newJob.JobTitle + ' at ' + company.name)}
\n\n
Click here to stop receiving job offers from ReactEurope ${
                process.env.PUBLIC_HOSTNAME
              }/stop-notifications/${user.notificationsUUID}/
\n\n

Best,\n\n

The ReactEurope jobs team
`,
              html: `Hi there, <br><p>
${company.name} is looking for a ${newJob.JobTitle}.
</p>

<p>You can read more about it here:
${process.env.PUBLIC_HOSTNAME}/jobs/${newJob.id}/${slugify(
                newJob.JobTitle + ' at ' + company.name,
              )}

 </p>
<p>
Click here to stop receiving job offers from ReactEurope ${
                process.env.PUBLIC_HOSTNAME
              }/stop-notifications/${user.notificationsUUID}/
</p>
Best,
<br>
<br>
The ReactEurope jobs team
			`,
            };
            msg.to = user.githubEmail;
            let q = search.query;
            let skills = [];
            console.log('JOB', job);
            job.Skills.map(skill => {
              skills.push(skill.Skill);
            });
            console.log('0', !q.remote || q.remote === job.remote);
            console.log('1', !q.country || q.country === job.country);
            console.log('2', !q.locality || q.locality === job.locality);
            console.log(
              '3',
              !q.description || job.description.indexOf(q.description) !== -1,
            );
            console.log(
              '4',
              !q.jobEmployementType ||
                q.jobEmployementType.indexOf(job.EmployementType) >= 0,
            );
            console.log('5', !q.skill || skills.indexOf(q.skill) >= 0);

            if (
              (!q.remote || q.remote === job.remote) &&
              (!q.country || q.country === job.country) &&
              (!q.locality || q.locality === job.locality) &&
              (!q.description ||
                job.description.indexOf(q.description) !== -1) &&
              (!q.jobEmployementType ||
                q.jobEmployementType.indexOf(job.EmployementType) >= 0) &&
              (!q.skill || skills.indexOf(q.skill) >= 0)
            ) {
              if (
                emails.indexOf(user.githubEmail) === -1 &&
                user.getNotifications
              ) {
                emails.push(user.githubEmail);
                sgMail.send(msg);
              }
            }
          });
          res.json({sentTo: emails, msg: msg});
          return;
        })
        .catch(err => {
          console.log('/jobCreateWebhook 5', newJob.id);
          console.log(err);
          res.status(500);
          return;
        });
    } else {
      res.json('already published or not published yet so nothing sent');
      return;
    }
  });

  server.get('/stop-notifications/:uuid', function(req, res) {
    const checkUserRequestopts = {
      uri: process.env.HASURA,
      json: true,
      query: `
        mutation turnOffNotifications($uuid: uuid!) {
          update_User(
            _set: {getNotifications: false}
            where: {notificationsUUID: {_eq: $uuid}}
          ) {
            affected_rows
          }
        }
      `,
      headers: {
        'X-Hasura-Access-Key': process.env.HASURA_SECRET,
      },
    };
    const checkUserRequestVars = {
      uuid: req.params.uuid,
    };
    const client = new grequest.GraphQLClient(checkUserRequestopts.uri, {
      headers: checkUserRequestopts.headers,
    });
    console.log(checkUserRequestopts);
    console.log('gt vars', checkUserRequestVars);
    client
      .request(checkUserRequestopts.query, checkUserRequestVars)
      .then(ugdata => {
        return app.render(req, res, '/', {
          action: 'stop-notifications',
        });
      });
  });

  server.post('/upload', function(req, res) {
    if (!req.files) return res.status(400).json('No files were uploaded.');
    let sampleFile = req.files.file;
    const path = '/tmp/' + req.get('companyId') + '-logo';
    sharp(sampleFile.data).toFile(path + '.webp', (err, info) => {
      if (err) {
        res.status(500).json(err);
      }
      sharp(sampleFile.data).toFile(path + '.png', (err, info) => {
        if (err) {
          res.status(500).json(err);
        }
        uploadToGCE(process.env.GOOGLE_STORAGE_BUCKET, path + '.png');

        uploadToGCE(process.env.GOOGLE_STORAGE_BUCKET, path + '.webp');
        console.log(err, info);
        res.status(200).json('ok');
      });
    });
  });

  server.post('/uploadEmployee1Avatar', function(req, res) {
    if (!req.files) return res.status(400).json('No files were uploaded.');
    let sampleFile = req.files.file;
    const path = '/tmp/' + req.get('companyId') + '-employee1avatar';
    sharp(sampleFile.data).toFile(path + '.webp', (err, info) => {
      if (err) {
        res.status(500).json(err);
      }
      sharp(sampleFile.data).toFile(path + '.png', (err, info) => {
        if (err) {
          res.status(500).json(err);
        }
        uploadToGCE(process.env.GOOGLE_STORAGE_BUCKET, path + '.png');

        uploadToGCE(process.env.GOOGLE_STORAGE_BUCKET, path + '.webp');
        console.log(err, info);
        res.status(200).json('ok');
      });
    });
  });

  server.post('/uploadEmployee2Avatar', function(req, res) {
    if (!req.files) return res.status(400).json('No files were uploaded.');
    let sampleFile = req.files.file;
    const path = '/tmp/' + req.get('companyId') + '-employee2avatar';
    sharp(sampleFile.data).toFile(path + '.webp', (err, info) => {
      if (err) {
        res.status(500).json(err);
      }
      sharp(sampleFile.data).toFile(path + '.png', (err, info) => {
        if (err) {
          res.status(500).json(err);
        }
        uploadToGCE(process.env.GOOGLE_STORAGE_BUCKET, path + '.png');

        uploadToGCE(process.env.GOOGLE_STORAGE_BUCKET, path + '.webp');
        console.log(err, info);
        res.status(200).json('ok');
      });
    });
  });

  server.post('/uploadMedia1Image', function(req, res) {
    if (!req.files) return res.status(400).json('No files were uploaded.');
    let sampleFile = req.files.file;
    const path = '/tmp/' + req.get('companyId') + '-1media';
    sharp(sampleFile.data).toFile(path + '.webp', (err, info) => {
      if (err) {
        res.status(500).json(err);
      }
      sharp(sampleFile.data).toFile(path + '.png', (err, info) => {
        if (err) {
          res.status(500).json(err);
        }
        uploadToGCE(process.env.GOOGLE_STORAGE_BUCKET, path + '.png');

        uploadToGCE(process.env.GOOGLE_STORAGE_BUCKET, path + '.webp');
        console.log(err, info);
        res.status(200).json('ok');
      });
    });
  });

  server.post('/uploadMedia2Image', function(req, res) {
    if (!req.files) return res.status(400).json('No files were uploaded.');
    let sampleFile = req.files.file;
    const path = '/tmp/' + req.get('companyId') + '-2media';
    sharp(sampleFile.data).toFile(path + '.webp', (err, info) => {
      if (err) {
        res.status(500).json(err);
      }
      sharp(sampleFile.data).toFile(path + '.png', (err, info) => {
        if (err) {
          res.status(500).json(err);
        }
        uploadToGCE(process.env.GOOGLE_STORAGE_BUCKET, path + '.png');

        uploadToGCE(process.env.GOOGLE_STORAGE_BUCKET, path + '.webp');
        console.log(err, info);
        res.status(200).json('ok');
      });
    });
  });

  server.post('/uploadMedia3Image', function(req, res) {
    if (!req.files) return res.status(400).json('No files were uploaded.');
    let sampleFile = req.files.file;
    const path = '/tmp/' + req.get('companyId') + '-3media';
    sharp(sampleFile.data).toFile(path + '.webp', (err, info) => {
      if (err) {
        res.status(500).json(err);
      }
      sharp(sampleFile.data).toFile(path + '.png', (err, info) => {
        if (err) {
          res.status(500).json(err);
        }
        uploadToGCE(process.env.GOOGLE_STORAGE_BUCKET, path + '.png');

        uploadToGCE(process.env.GOOGLE_STORAGE_BUCKET, path + '.webp');
        console.log(err, info);
        res.status(200).json('ok');
      });
    });
  });
  server.get('/robots.txt', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(new Buffer('User-Agent: *\nDisallow: /*?*'));
  });

  server.get('/*logo.png', (req, res) => {
    res.sendFile(staticPath + '/defaultlogo.png');
  });

  server.get('/*avatar.png', (req, res) => {
    res.sendFile(staticPath + '/defaultavatar.png');
  });

  server.get('/*media.png', (req, res) => {
    res.sendFile(staticPath + '/defaultmedia.png');
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(process.env);
    console.log(`> Now ready on http://localhost:${port}`);
  });
});
