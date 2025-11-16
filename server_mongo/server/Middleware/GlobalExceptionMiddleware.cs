using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace Server.Middleware
{
    public class GlobalExceptionMiddleware: IMiddleware
    {
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(ILogger<GlobalExceptionMiddleware> logger)
        {
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                ProblemDetails problemDetails = new ProblemDetails
                {
                    Type = "Global Exception",
                    Status = (int)StatusCodes.Status400BadRequest,
                    Instance = context.Request.Path,
                    Detail = JsonSerializer.Serialize(ex),
                };

                _logger.LogError("Global Exception: {problemDetails}", problemDetails);

                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                await context.Response.WriteAsJsonAsync(problemDetails);
            }
        }
    }
}
