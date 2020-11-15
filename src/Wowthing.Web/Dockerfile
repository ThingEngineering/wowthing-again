FROM wafflefred/dotnet-sdk-nodejs:latest AS build

WORKDIR /app

# Restore npm packages now so that this step is cached
COPY src/Wowthing.Web/package*.json ./src/Wowthing.Web/
WORKDIR /app/src/Wowthing.Web
RUN npm install

WORKDIR /app
COPY . .

WORKDIR /app/src/Wowthing.Web
RUN npm run build
RUN dotnet publish -c Release -o out


FROM mcr.microsoft.com/dotnet/aspnet:3.1-alpine AS runtime
WORKDIR /app
COPY --from=build /app/src/Wowthing.Web/out ./

ENV ASPNETCORE_URLS "http://0:5000"
EXPOSE 5000
ENTRYPOINT ["dotnet", "Wowthing.Web.dll"]
