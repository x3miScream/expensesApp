using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Enums;
using Server.Controllers.Base;
using Server.Dtos.DropDownList;
using Server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/DropDownLists")]
public class DropDownListController: ApiBaseController{

    public DropDownListController(ApplicationDBContext context, IServiceProvider serviceProvider, IConfiguration appSettings, IHttpContextAccessor httpContextAccessor)
        : base(context, serviceProvider, appSettings, httpContextAccessor){
    }


    [HttpGet(Name = "GetCategoriesDropDownList")]
    [Route("{dropDownListType}")]
    public async Task<ActionResult<Dictionary<long, string>>> GetCategoriesDropDownList([FromRoute]DropDownListType dropDownListType)
    {
        List<DropDownListItemDto> dropDownListItems = new List<DropDownListItemDto>();
        
        switch(dropDownListType)
        {
            case DropDownListType.Category:
                dropDownListItems = await _context.Categories.Where(x => x.ClientId == _currentClientId).Select(x => new DropDownListItemDto(x.CategoryId, x.CategoryName)).ToListAsync();
            break;
            default:
                dropDownListItems = await _context.Categories.Where(x => x.ClientId == _currentClientId).Select(x => new DropDownListItemDto(x.CategoryId, x.CategoryName)).ToListAsync();
            break;
        }

        return Ok(dropDownListItems);
    }
}