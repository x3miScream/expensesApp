using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Dtos;
using Server.Controllers.Base;
using Server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/Menus")]
public class MenuController: ApiBaseController{
    public MenuController(ApplicationDBContext context, IServiceProvider serviceProvider, IConfiguration appSettings, IHttpContextAccessor httpContextAccessor)
        : base(context, serviceProvider, appSettings, httpContextAccessor){
    }

    [HttpGet(Name = "GetMenus")]
    [AllowAnonymous]
    public async Task<ActionResult<List<MenuReadDto>>> Get()
    {
        List<MenuReadDto> menus = new List<MenuReadDto>(){
            new MenuReadDto(){Title = "Categories", Path = "categories", IsShowAtMenu = true},
            new MenuReadDto(){Title = "Transactions", Path = "transactions", IsShowAtMenu = true}
        };

        return Ok(menus);
    }
}