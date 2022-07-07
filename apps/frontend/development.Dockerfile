FROM node:16-alpine

USER root
WORKDIR /app

ENTRYPOINT sh bin/run_dev.sh
