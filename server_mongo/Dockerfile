#FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS base

WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
ARG BUILD_CONFIGURATION=Development
WORKDIR /src
COPY ["ExpAppApiMongo.sln", "/"]
COPY ["server/Server.csproj", "/server/"]
RUN dotnet restore "/server/Server.csproj"
COPY . .
WORKDIR "/src/server"
RUN dotnet build "./Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Development
RUN dotnet publish "./Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false
ENTRYPOINT ["dir"]

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Server.dll"]