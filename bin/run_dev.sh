#!/bin/sh

npm i --no-audit --no-fund

cd apps/frontend/

npm run dev -d
