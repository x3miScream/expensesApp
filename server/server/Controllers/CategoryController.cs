using System.IO.Compression;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/Categories")]
public class CategoryController : ControllerBase
{
    private readonly ApplicationDBContext _context;

    public CategoryController(ApplicationDBContext context) {
        _context = context;
    }



    [HttpGet(Name = "GetCategories")]
    public async Task<ActionResult<List<CategoryReadDto>>> Get()
    {
        List<Category> categories = await _context.Categories.ToListAsync();

        return Ok(categories.Select(x => new CategoryReadDto(){
            CategoryId = x.CategoryId,
            CategoryCode = x.CategoryCode,
            CategoryName = x.CategoryName,
            Icon = x.Icon,
            CategoryType = x.CategoryType
        }).ToList());
    }


    
    public async Task<ActionResult<CategoryReadDto>> Post(CategoryCreateDto createDto)
    {
        if(createDto != null)
        {
            Category newCategory = new Category(){
                CategoryCode = createDto.CategoryCode,
                CategoryName = createDto.CategoryName,
                Icon = createDto.Icon,
                CategoryType = createDto.CategoryType
            };

            await _context.Categories.AddAsync(newCategory);
            _context.SaveChanges();

            CategoryReadDto readDto = new CategoryReadDto(){
                CategoryId = newCategory.CategoryId,
                CategoryCode = newCategory.CategoryCode,
                CategoryName = newCategory.CategoryName,
                Icon = newCategory.Icon,
                CategoryType = newCategory.CategoryType
            };

            return Ok(readDto);
        }
        else{
            return BadRequest("No Data Provided");
        }
    }


    [Route("{categoryId}")]
    public async Task<ActionResult<CategoryReadDto>> Get([FromRoute]long categoryId)
    {
        if(categoryId != null)
        {
            Category foundCategory =await _context.Categories.FindAsync(categoryId);

            if(foundCategory == null)
            {
                return BadRequest("No Category Found");
            }

            CategoryReadDto readDto = new CategoryReadDto(){
                CategoryId = foundCategory.CategoryId,
                CategoryCode = foundCategory.CategoryCode,
                CategoryName = foundCategory.CategoryName,
                Icon = foundCategory.Icon,
                CategoryType = foundCategory.CategoryType
            };

            return Ok(readDto);
        }
        else{
            return BadRequest("No Data Provided");
        }
    }


    [HttpDelete]
    [Route("{categoryId}")]
    public async Task<ActionResult<bool>> Delete([FromRoute]long categoryId)
    {
        if(categoryId != null)
        {
            Category foundCategory =await _context.Categories.FindAsync(categoryId);

            if(foundCategory == null)
            {
                return BadRequest("No Category Found");
            }

            _context.Categories.Remove(foundCategory);
            _context.SaveChanges();


            return Ok(true);
        }
        else{
            return BadRequest("No Data Provided");
        }
    }



}
