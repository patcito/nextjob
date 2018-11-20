FROM node:10.8.0
# Create app directory
WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn

# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 400
CMD [ "GITHUB_ID=$GITHUB_ID", "GITHUB_SECRET=$GITHUB_SECRET", "HASURA_SECRET=$HASURA_SECRET", "JWT_SECRET=$JWT_SECRET", "LINKEDIN_ID=$LINKEDIN_ID", "LINKEDIN_SECRET=$LINKEDIN_SECRET", "HASURA=$HASURA", "yarn", "run", "dev"  ]
