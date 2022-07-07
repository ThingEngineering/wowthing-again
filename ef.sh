#!/usr/bin/env bash

export PATH=$PATH:/root/.dotnet/tools

dotnet ef "$@" --project packages/csharp-lib --msbuildprojectextensionspath packages/csharp-lib/obj/container
