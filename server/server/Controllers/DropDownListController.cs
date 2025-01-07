using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Enums;
using Server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/DropDownLists")]
public class DropDownListController: ControllerBase{
    private readonly ApplicationDBContext _context;

    public DropDownListController(ApplicationDBContext context) {
        _context = context;
    }


    [HttpGet(Name = "GetCategoriesDropDownList")]
    [Route("{dropDownListType}")]
    public async Task<ActionResult<Dictionary<long, string>>> GetCategoriesDropDownList([FromRoute]DropDownListType dropDownListType)
    {
        Dictionary<long, string> categoriesDDLDict = new Dictionary<long, string>();
        
        switch(dropDownListType)
        {
            case DropDownListType.Category:
                categoriesDDLDict = await _context.Categories.ToDictionaryAsync(x => x.CategoryId, x => x.CategoryName);
            break;
            default:
                categoriesDDLDict = await _context.Categories.ToDictionaryAsync(x => x.CategoryId, x => x.CategoryName);
            break;
        }

        return Ok(categoriesDDLDict);
    }
}