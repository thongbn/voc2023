FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --pure-lockfile

COPY . .

EXPOSE 3001
CMD ["sh", "-c", "yarn run prod"]