FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build

#RUN apt-get update && apt-get install -y build-essential nodejs npm

WORKDIR /app

# Restore npm packages now so that this step is cached
#COPY src/OpenWoW.Web/package*.json /app/openwow.io/src/OpenWoW.Web/
#WORKDIR /app/openwow.io/src/OpenWoW.Web
#RUN npm install

COPY . .

WORKDIR /app/src/Wowthing.Backend
#RUN npm run build-prod
RUN dotnet publish -c Release -o out


FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-alpine AS runtime
WORKDIR /app
COPY --from=build /app/src/Wowthing.Backend/out ./

ENV ASPNETCORE_URLS "http://0:5000"
EXPOSE 5000
ENTRYPOINT ["dotnet", "Wowthing.Backend.dll"]
