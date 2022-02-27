FROM mcr.microsoft.com/dotnet/sdk:6.0

WORKDIR /app/src/Wowthing.Web

RUN dotnet dev-certs https

# Required inside Docker, otherwise file-change events may not trigger
ENV DOTNET_USE_POLLING_FILE_WATCHER 1

ENTRYPOINT dotnet watch run
