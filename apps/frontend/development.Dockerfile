FROM node:14-alpine

WORKDIR /app/frontend

ENTRYPOINT yarn && yarn watch
