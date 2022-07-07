FROM mcr.microsoft.com/dotnet/sdk:6.0

WORKDIR /app/apps/web

RUN dotnet dev-certs https

# Required inside Docker, otherwise file-change events may not trigger
ENV DOTNET_USE_POLLING_FILE_WATCHER 1
# Skip the obnoxious .NET 6 reload prompt
ENV DOTNET_WATCH_RESTART_ON_RUDE_EDIT 1

ENTRYPOINT dotnet watch run
