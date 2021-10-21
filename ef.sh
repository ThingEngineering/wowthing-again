#!/usr/bin/env bash

export PATH=$PATH:/root/.dotnet/tools

dotnet ef "$@" --project src/Wowthing.Lib --msbuildprojectextensionspath src/Wowthing.Lib/obj/container
