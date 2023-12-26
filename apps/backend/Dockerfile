FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app
COPY . .

WORKDIR /app/apps/backend
RUN dotnet publish -c Release -o out


FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

#RUN apk add --no-cache icu-libs

WORKDIR /app
COPY --from=build /app/apps/backend/out ./

ENV ASPNETCORE_URLS "http://0:5000"
ENV DOTNET_GCConserveMemory=5
ENV DOTNET_gcServer=1
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false
EXPOSE 5000
ENTRYPOINT ["dotnet", "Wowthing.Backend.dll"]
