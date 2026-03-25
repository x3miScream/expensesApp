using Microsoft.AspNetCore.HostFiltering;
using Server.Configurations;
using Server.Data;
using Server.Interfaces;
using Server.Middleware;
using Server.Services;

const string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<HostFilteringOptions>(options => {
    options.AllowedHosts.Add("localhost");
    options.AllowedHosts.Add("127.0.0.1");
});

builder.Services.AddCors(options =>
    options.AddPolicy(name: MyAllowSpecificOrigins,
    policy =>
    {
        policy.WithOrigins(builder.Configuration["AllowedHosts"]?.ToString() ?? string.Empty)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    }));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<ConnectionStringsConfigurations>(builder.Configuration.GetSection("ConnectionStrings"));

builder.Services.AddSingleton<MongoDBService>();
builder.Services.AddSingleton<MongoDbSeeder>();

builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddScoped<GlobalExceptionMiddleware>();
builder.Services.AddScoped<AuthMiddleware>();

builder.Services.AddHttpContextAccessor();

var app = builder.Build();

app.UseRouting();

//if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseMiddleware<AuthMiddleware>();

app.MapControllers();

app.Run();
