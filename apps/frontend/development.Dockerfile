FROM node:22-alpine

RUN if [ `arch` = 'aarch64' ]; then apk add --no-cache python3; fi
RUN if [ `arch` = 'aarch64' ]; then apk add --no-cache make; fi
RUN if [ `arch` = 'aarch64' ]; then apk add --no-cache build-base; fi

USER root
WORKDIR /app/apps/frontend

ENTRYPOINT sh ./run_dev.sh
