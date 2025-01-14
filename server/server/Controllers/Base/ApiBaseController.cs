using Microsoft.AspNetCore.Mvc;
using Server.Models;

namespace Server.Controllers.Base;

public class ApiBaseController : ControllerBase{
    protected readonly ApplicationDBContext _context;
    protected IServiceProvider _serviceProvider;

    public ApiBaseController(ApplicationDBContext context, IServiceProvider serviceProvider){
        _context = context;
        _serviceProvider = serviceProvider;
    }
}