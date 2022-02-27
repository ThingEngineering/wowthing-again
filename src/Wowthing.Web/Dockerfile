FROM ghcr.io/thingengineering/docker-dotnet-sdk-nodejs:latest AS build-frontend

WORKDIR /app/frontend

RUN npm i -g yarn

COPY frontend/.yarn/ ./.yarn/
COPY frontend/.yarnrc frontend/package.json frontend/yarn.lock ./

RUN yarn install --frozen-lockfile

COPY frontend/ ./
RUN yarn run build


FROM ghcr.io/thingengineering/docker-dotnet-sdk-nodejs:latest AS build-web

WORKDIR /app/src
COPY src/ ./

WORKDIR /app/src/Wowthing.Web
RUN dotnet publish -c Release -o out


FROM mcr.microsoft.com/dotnet/aspnet:6.0-alpine AS runtime

WORKDIR /app
COPY --from=build-web /app/src/Wowthing.Web/out ./
COPY --from=build-frontend /app/src/Wowthing.Web/wwwroot/dist/ ./wwwroot/dist/

ENV ASPNETCORE_URLS "http://0:5000"
EXPOSE 5000

ENTRYPOINT ["dotnet", "Wowthing.Web.dll"]
