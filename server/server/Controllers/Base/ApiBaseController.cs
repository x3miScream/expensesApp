using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Server.Models;

namespace Server.Controllers.Base;

public class ApiBaseController : ControllerBase{
    protected readonly ApplicationDBContext _context;
    protected IServiceProvider _serviceProvider;
    protected readonly IConfiguration _appsettings;
    private readonly IHttpContextAccessor _httpContextAccessor;
    protected long _currentUserId;
    protected long _currentClientId;

    public ApiBaseController(ApplicationDBContext context, IServiceProvider serviceProvider, IConfiguration appsettings, IHttpContextAccessor httpContextAccessor){
        _context = context;
        _serviceProvider = serviceProvider;
        _appsettings = appsettings;
        _httpContextAccessor = httpContextAccessor;
        SetAuthSessionData();
    }

    private void SetAuthSessionData(){
        _currentUserId = -1;
        _currentClientId = -1;

        if(_httpContextAccessor.HttpContext.Items.ContainsKey("UserId"))
        {
            _currentUserId = Convert.ToInt64(_httpContextAccessor?.HttpContext?.Items?["UserId"]?.ToString());
        }

        if(_httpContextAccessor.HttpContext.Items.ContainsKey("ClientId"))
        {
            _currentClientId = Convert.ToInt64(_httpContextAccessor?.HttpContext?.Items?["ClientId"]?.ToString());
        }
    }
}