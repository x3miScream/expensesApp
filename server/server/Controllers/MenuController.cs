using Microsoft.AspNetCore.Mvc;
using server.Dtos;
using Server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/Menus")]
public class MenuController: ControllerBase{
    private readonly ApplicationDBContext _context;

    public MenuController(ApplicationDBContext context) {
        _context = context;
    }

    [HttpGet(Name = "GetMenus")]
    public async Task<ActionResult<List<MenuReadDto>>> Get()
    {
        List<MenuReadDto> menus = new List<MenuReadDto>(){
            new MenuReadDto(){Title = "Categories", Path = "categories", IsShowAtMenu = true},
            new MenuReadDto(){Title = "Transactions", Path = "transactions", IsShowAtMenu = true}
        };

        return Ok(menus);
    }
}