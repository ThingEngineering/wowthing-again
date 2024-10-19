export $(grep -v '^#' .env | xargs)
dotnet run all
