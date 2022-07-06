#!/bin/sh

npm i --no-audit --no-fund

cd apps/frontend/
mkdir node_modules/.vite/

pwd
whoami

npm run dev -d
