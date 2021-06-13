FROM node:14-alpine

WORKDIR /app/src/frontend

ENTRYPOINT yarn && yarn watch
