FROM mcr.microsoft.com/dotnet/sdk:6.0

WORKDIR /app/src/Wowthing.Backend

# Required inside Docker, otherwise file-change events may not trigger
ENV DOTNET_USE_POLLING_FILE_WATCHER 1

ENV DOTNET_GCLOHThreshold 0x100000
ENV PATH "$PATH:/root/.dotnet/tools"

RUN dotnet tool install --global dotnet-counters
RUN dotnet tool install --global dotnet-dump
RUN dotnet tool install --global dotnet-ef
RUN dotnet tool install --global dotnet-gcdump

ENTRYPOINT dotnet watch run
