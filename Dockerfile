# Use an official Node runtime as a parent image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY src ./src
COPY .env.example .env.example

EXPOSE 5000
CMD [ "node", "src/app.js" ]
