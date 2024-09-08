FROM node:16-alpine AS build-frontend

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/frontend/package.json ./apps/frontend/

RUN npm i --no-audit --no-fund

COPY tsconfig.base.json ./
COPY apps/frontend/ ./apps/frontend/

WORKDIR /app/apps/frontend

RUN npm run build


FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build-web

WORKDIR /app
COPY apps/web/ ./apps/web/
COPY packages/csharp-lib/ ./packages/csharp-lib/

WORKDIR /app/apps/web
RUN dotnet publish -c Release -o out


FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS runtime

WORKDIR /app
COPY --from=build-web /app/apps/web/out ./
COPY --from=build-frontend /app/apps/frontend/dist/dist/ ./wwwroot/dist/
COPY --from=build-frontend /app/apps/frontend/dist/.vite/manifest.json ./wwwroot/dist/

ENV ASPNETCORE_URLS "http://0:5000"
EXPOSE 5000

ENTRYPOINT ["dotnet", "Wowthing.Web.dll"]
