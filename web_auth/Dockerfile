FROM node:16-bullseye-slim

WORKDIR /web

ADD . .

RUN yarn install

CMD bash bin/wait-for-it.sh ${API_HOST}:${API_PORT} -- yarn pm2:run:${NODE_ENV}
