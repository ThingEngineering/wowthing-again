#!/usr/bin/env bash

export PATH=$PATH:/root/.dotnet/tools

dotnet tool install --global dotnet-ef
dotnet ef "$@" --project src/Wowthing.Lib --msbuildprojectextensionspath src/Wowthing.Lib/obj/container
