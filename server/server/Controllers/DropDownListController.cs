using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Enums;
using Server.Controllers.Base;
using Server.Dtos.DropDownList;
using Server.Enums;
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
    public async Task<ActionResult<Dictionary<long, string>>> GetCategoriesDropDownList([FromRoute]DropDownListType dropDownListType, long? parentId)
    {
        List<DropDownListItemDto> dropDownListItems = new List<DropDownListItemDto>();
        
        switch(dropDownListType)
        {
            case DropDownListType.Category:
                dropDownListItems = await _context.Categories.Where(x => x.ClientId == _currentClientId).Select(x => new DropDownListItemDto(x.CategoryId, x.CategoryName)).ToListAsync();
            break;
            case DropDownListType.SubCategory:
                dropDownListItems = await _context.SubCategories.Where(x => x.ClientId == _currentClientId && x.CategoryId == parentId.GetValueOrDefault()).Select(x => new DropDownListItemDto(x.SubCategoryId, x.SubCategoryName)).ToListAsync();
            break;
            case DropDownListType.CategoryType:
                dropDownListItems.Add(new DropDownListItemDto(CategoryType.Expense.ToString(), CategoryType.Expense.GetEnumDescription()));
                dropDownListItems.Add(new DropDownListItemDto(CategoryType.Income.ToString(), CategoryType.Income.GetEnumDescription()));
            break;            
            default:
                dropDownListItems = await _context.Categories.Where(x => x.ClientId == _currentClientId).Select(x => new DropDownListItemDto(x.CategoryId, x.CategoryName)).ToListAsync();
            break;
        }

        return Ok(dropDownListItems);
    }
}