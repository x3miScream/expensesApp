
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace server.Middleware{
    public class GlobalExceptionMiddleware : IMiddleware
    {
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try{
                await next(context);
            }
            catch(Exception ex){
                ProblemDetails pd = new ProblemDetails{
                    Type = "Global Exception",
                    Status = (int) StatusCodes.Status400BadRequest,
                    Instance = context.Request.Path,
                    Detail = JsonSerializer.Serialize(ex),
                };
            }
        }
    }
}