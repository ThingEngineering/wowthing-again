FROM mcr.microsoft.com/dotnet/core/sdk:3.1

WORKDIR /app/src/Wowthing.Backend

# Required inside Docker, otherwise file-change events may not trigger
ENV DOTNET_USE_POLLING_FILE_WATCHER 1

ENTRYPOINT dotnet watch run
