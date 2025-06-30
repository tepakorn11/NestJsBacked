# base image
FROM node:18

# create app directory
WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm install

# copy source
COPY . .

# default command (override by docker-compose)
CMD ["npm", "run", "start:dev"]
