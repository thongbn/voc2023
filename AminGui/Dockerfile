FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --pure-lockfile

COPY . .

RUN yarn global add serve

RUN yarn run build

EXPOSE 3000

CMD ["serve", "-s", "build"]