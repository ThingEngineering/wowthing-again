FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build

WORKDIR /app
COPY . .

WORKDIR /app/src/Wowthing.Backend
RUN dotnet publish -c Release -o out


FROM mcr.microsoft.com/dotnet/aspnet:5.0-alpine AS runtime
WORKDIR /app
COPY --from=build /app/data/ ./data/
COPY --from=build /app/src/Wowthing.Backend/out ./
RUN ls -l

ENV ASPNETCORE_URLS "http://0:5000"
EXPOSE 5000
ENTRYPOINT ["dotnet", "Wowthing.Backend.dll"]
