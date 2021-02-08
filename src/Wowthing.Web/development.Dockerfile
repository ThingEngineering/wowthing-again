FROM mcr.microsoft.com/dotnet/sdk:5.0

WORKDIR /app/src/Wowthing.Web

# Required inside Docker, otherwise file-change events may not trigger
ENV DOTNET_USE_POLLING_FILE_WATCHER 1

ENTRYPOINT dotnet watch run
