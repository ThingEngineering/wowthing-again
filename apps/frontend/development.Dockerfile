FROM node:16-alpine

RUN npm i -g npm

USER node
WORKDIR /app
ENTRYPOINT sh bin/run_dev.sh
