# nextjob

This project was bootstrapped with [Create Next App](https://github.com/segmentio/create-next-app).

Find the most recent version of this guide at [here](https://github.com/segmentio/create-next-app/blob/master/lib/templates/default/README.md). And check out [Next.js repo](https://github.com/zeit/next.js) for the most up-to-date info.

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)

## Installation

After cloning this repo, you need to run:
```bash
yarn install
```

Then you need to install Hasura, you can either run it from [Heroku](https://heroku.com/deploy?template=https://github.com/hasura/graphql-engine-heroku), [DigitalOcean](https://cloud.digitalocean.com/droplets/new?image=hasura-18-04&utm_source=hasura&utm_campaign=docs) or Docker.
If you run it from docker, you just need to do:

```bash
wget https://raw.githubusercontent.com/hasura/graphql-engine/master/install-manifests/docker-compose/docker-compose.yaml
```

Then start Hasura with the following:
```bash
docker-compose up -d
```

You can stop it with:
```bash
docker-compose stop

```

Connect to your postgresql and import `schema.sql`
Connect to the hasura dashboard and import `metadata.json`

## Getting Started

Make sure to create a github and linkedin app for signing in users. The oauth return to url is just http://yourdomain/. No additional path needed.

If you want to run the app, you just need to do:
```bash
SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY GITHUB_ID=GITHUB_ID GITHUB_SECRET=GITHUB_SECRET HASURA_SECRET=YOUR_HASURA_SECRET JWT_SECRET=SOME_RANDOM_UUID LINKEDIN_ID=YOUR_LINKEDIN_ID LINKEDIN_SECRET=YOUR_LINKEDIN_SECRET yarn start

```

Optional, you can also add these variables if you want to use Google Cloud Storage as CDN:
- GOOGLE_STORAGE_PROJECT_ID
- GOOGLE_STORAGE_BUCKET
- GOOGLE_STORAGE_CLIENT_EMAIL
- GOOGLE_APPLICATION_CREDENTIALS
- CDN (your cdn domain name)
