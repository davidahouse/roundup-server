# Dockerfile

# Node version
FROM node:10
# Working directory
WORKDIR /var/roundup
# install app dependencies
COPY package*.json ./
RUN npm install
# copy the app into the container
COPY . .
# expose our web port
EXPOSE 7766
# run the server
CMD ["node", "bin/roundup-server.js"]