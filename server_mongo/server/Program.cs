using Server.Data;
using Server.Interfaces;
using Server.Middleware;
using Server.Services;

const string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddCors(options =>
    options.AddPolicy(name: MyAllowSpecificOrigins,
    policy => {
        policy.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
    }));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<MongoDBService>();
builder.Services.AddSingleton<MongoDbSeeder>();

builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddScoped<GlobalExceptionMiddleware>();
builder.Services.AddScoped<AuthMiddleware>();

builder.Services.AddHttpContextAccessor();

var app = builder.Build();


// Seed data when the application starts
using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<MongoDbSeeder>();
    await seeder.SeedDataAsync();
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseCors(MyAllowSpecificOrigins);

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseMiddleware<AuthMiddleware>();

app.MapControllers();

app.Run();
