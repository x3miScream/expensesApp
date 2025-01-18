using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Interfaces;

namespace Server.Middleware;

public class AuthMiddleware : IMiddleware {
    private readonly IServiceProvider _serviceProvider;
    private readonly IConfiguration _appSettings;

    private IAuthService _authService;
    public IAuthService authService
    {
        get
        {
            if(_authService == null)
                _authService = _serviceProvider?.GetService<IAuthService>();

            return _authService;
        }
    }

    public AuthMiddleware(IServiceProvider serviceProvider, IConfiguration appSettings){
        _appSettings = appSettings;
        _serviceProvider = serviceProvider;
    }


    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try{
            bool isAllowAnonymous = false;
            var endpoint = context.GetEndpoint();
            string jwtToken = string.Empty;
            string errors = string.Empty;

            if(endpoint?.Metadata?.GetMetadata<IAllowAnonymous>() is object)
            {
                isAllowAnonymous = true;
            }

            if(context?.Request?.Cookies?[_appSettings["Authentication:AuthJWTTokenName"]?.ToString()] == null)
            {
                if(!isAllowAnonymous)    
                {
                    await ReturnUnAuthenticated(context);
                    return;
                }
            }
            else{
                jwtToken = context?.Request?.Cookies?[_appSettings["Authentication:AuthJWTTokenName"]?.ToString()].ToString();
            }
            Console.WriteLine($"Cookies : {context?.Request?.Cookies?.Count}");
            
            foreach(KeyValuePair<string, string> cookie in context?.Request?.Cookies)
            {
                Console.WriteLine($"Cookie [{cookie.Key}] : {cookie.Value}");
            }

            Console.WriteLine($"setting : { _appSettings["Authentication:AuthJWTTokenName"]}");
            Console.WriteLine($"endpoint : {endpoint}");
            Console.WriteLine($"jwtToken : {jwtToken}");
            if(!string.IsNullOrEmpty(jwtToken))
            {
                var claimsPrincipal = authService.ValidateJWTToken(jwtToken, out errors);
                Console.WriteLine(claimsPrincipal);
                Console.WriteLine(errors);
                if(!string.IsNullOrEmpty(errors) || claimsPrincipal == null)
                {
                    await ReturnUnAuthenticated(context);
                    return;
                }

                var userId = claimsPrincipal.FindFirst("UserId")?.Value;

                context.Items["UserId"] = userId;
                context.Items["ClientId"] = 0;
            }
            else
            {
                if(!isAllowAnonymous)
                {
                    await ReturnUnAuthenticated(context);
                    return;
                }
            }

            await next(context);
        }
        catch(Exception ex){
            await ReturnUnAuthenticated(context);
        }
    }

    private async Task ReturnUnAuthenticated(HttpContext context){
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;

        var problemDetails = new ProblemDetails{
            Type = "UnAuthenticated Access",
            Status = (int) StatusCodes.Status401Unauthorized,
            Instance = context.Request.Path
        };

        await context.Response.WriteAsJsonAsync(problemDetails);
    }
}