FROM mcr.microsoft.com/dotnet/sdk:8.0

WORKDIR /app/apps/backend

# Required inside Docker, otherwise file-change events may not trigger
ENV DOTNET_USE_POLLING_FILE_WATCHER 1
# Skip the obnoxious .NET 6 reload prompt
ENV DOTNET_WATCH_RESTART_ON_RUDE_EDIT 1

ENV DOTNET_GCLOHThreshold 0x100000
ENV PATH "$PATH:/root/.dotnet/tools"

RUN dotnet tool install --global dotnet-counters
RUN dotnet tool install --global dotnet-dump
RUN dotnet tool install --global dotnet-ef
RUN dotnet tool install --global dotnet-gcdump

ENTRYPOINT dotnet watch run
