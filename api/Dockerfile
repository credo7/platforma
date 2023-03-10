FROM node:16-bullseye-slim

WORKDIR /api

ADD . .

RUN yarn install

CMD bash bin/wait-for-it.sh ${POSTGRES_HOST}:${POSTGRES_PORT} -t 30 -- yarn pm2:run:${NODE_ENV}
