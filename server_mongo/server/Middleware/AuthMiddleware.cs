
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Interfaces;
using Server.Services;

namespace Server.Middleware
{
    public class AuthMiddleware : IMiddleware
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IConfiguration _appSettings;
        private readonly IAuthService _authService;
        private readonly ILogger<AuthMiddleware> _logger;

        public AuthMiddleware(IServiceProvider serviceProvider, IConfiguration appSettings, IAuthService authService, ILogger<AuthMiddleware> logger)
        {
            _serviceProvider = serviceProvider;
            _appSettings = appSettings;
            _authService = authService;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                bool isAllowAnonymous = false;
                var endpoint = context.GetEndpoint();
                string jwtToken = string.Empty;
                string errors = string.Empty;

                if (endpoint?.Metadata?.GetMetadata<IAllowAnonymous>() is object)
                {
                    isAllowAnonymous = true;
                }

                if (context?.Request?.Cookies?[_appSettings["Authentication:AuthJWTTokenName"]?.ToString()] == null)
                {
                    if (!isAllowAnonymous)
                    {
                        await ReturnUnAuthenticated(context);
                        Console.WriteLine($"Error3");
                        return;
                    }
                }
                else
                {
                    jwtToken = context?.Request?.Cookies?[_appSettings["Authentication:AuthJWTTokenName"]?.ToString()].ToString();
                }


                if (!string.IsNullOrEmpty(jwtToken))
                {
                    var claimsPrincipal = _authService.ValidateJWTToken(jwtToken, out errors);
                    
                    if (!string.IsNullOrEmpty(errors) || claimsPrincipal == null)
                    {
                        await ReturnUnAuthenticated(context);
                        Console.WriteLine($"Error2");
                        return;
                    }

                    var userId = claimsPrincipal.FindFirst("UserId")?.Value;

                    context.Items["UserId"] = userId;
                    context.Items["ClientId"] = 0;
                }
                else
                {
                    if (!isAllowAnonymous)
                    {
                        await ReturnUnAuthenticated(context);
                        Console.WriteLine($"Error1");
                        return;
                    }
                }

                await next(context);
            }
            catch(Exception ex)
            {
                _logger.LogError("Error: {error}, StackTrace: {stackTrace}", ex.Message, ex.StackTrace);
                //Console.WriteLine($"Error: {ex.Message}");
                //await ReturnUnAuthenticated(context);
                throw;
            }
        }



        private async Task ReturnUnAuthenticated(HttpContext context)
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;

            var problemDetails = new ProblemDetails
            {
                Type = "UnAuthenticated Access",
                Status = (int)StatusCodes.Status401Unauthorized,
                Instance = context.Request.Path
            };

            await context.Response.WriteAsJsonAsync(problemDetails);
        }
    }
}
