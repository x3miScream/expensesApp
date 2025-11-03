FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5191
EXPOSE 7110

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["ExpAppApiMongo.sln", "/"]
COPY ["server/Server.csproj", "/server/"]
RUN dotnet restore "/server/Server.csproj"
COPY . .
WORKDIR "/src/server"
RUN dotnet build "./Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build as publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Server.dll"]