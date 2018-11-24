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
RUN yarn run build
EXPOSE 4000
CMD [ "yarn", "run", "start"  ]
