using System.IO.Compression;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.EntityFrameworkCore;
using server.Dtos.Transaction;
using Server.Controllers.Base;
using Server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/Transactions")]
public class TransactionController : ApiBaseController
{
    public TransactionController(ApplicationDBContext context, IServiceProvider serviceProvider, IConfiguration appSettings, IHttpContextAccessor httpContextAccessor)
        : base(context, serviceProvider, appSettings, httpContextAccessor){
    }



    [HttpGet(Name = "GetTransactions")]
    public async Task<ActionResult<List<TransactionReadDto>>> Get()
    {
        List<Transaction> transactions = await _context.Transactions.Where(x => x.ClientId == _currentClientId && x.UserId == _currentUserId).ToListAsync();
        Dictionary<long, Category> categoriesDict = await _context.Categories.ToDictionaryAsync(x => x.CategoryId, x => x);

        return Ok(transactions.Select(x => new TransactionReadDto(){
            TransactionId = x.TransactionId,
            CategoryId = x.CategoryId,
            Amount = x.Amount,
            Note = x.Note,
            TransactionDate = x.TransactionDate,
            CategoryCode = categoriesDict[x.CategoryId].CategoryCode,
            CategoryName = categoriesDict[x.CategoryId].CategoryName,
            CategoryType = categoriesDict[x.CategoryId].CategoryType
        }).ToList());
    }


    
    public async Task<ActionResult<TransactionReadDto>> Post([FromBody]TransactionCreateDto createDto)
    {
        if(createDto != null)
        {
            Transaction newTransaction = new Transaction(){
                CategoryId = createDto.CategoryId,
                SubCategoryId = createDto.SubCategoryId,
                Amount = createDto.Amount,
                Note = createDto.Note,
                TransactionDate = createDto.TransactionDate,
                ClientId = _currentClientId,
                UserId = _currentUserId,
                CreatedBy = _currentUserId,
                CreatedDate = DateTime.Now,
                UpdatedBy = _currentUserId,
                UpdatedDate = DateTime.Now
            };

            await _context.Transactions.AddAsync(newTransaction);
            _context.SaveChanges();

            TransactionReadDto readDto = new TransactionReadDto(){
                TransactionId = newTransaction.TransactionId,
                CategoryId = newTransaction.CategoryId,
                Amount = newTransaction.Amount,
                Note = newTransaction.Note,
                // Category = newTransaction.Category
            };

            return Ok(readDto);
        }
        else{
            return BadRequest("No Data Provided");
        }
    }


    [Route("{transactionId}")]
    [HttpPut(Name = "PutTransaction`")]
    public async Task<ActionResult<TransactionReadDto>> Put([FromRoute] long transactionId, [FromBody]TransactionCreateDto createDto)
    {
        Console.WriteLine(transactionId);
        Console.WriteLine(createDto);

        if(createDto != null)
        {
            Transaction foundTransaction = await _context.Transactions.FirstOrDefaultAsync(x => x.ClientId == _currentClientId && x.UserId == _currentUserId && x.TransactionId == transactionId);

            if(foundTransaction == null)
                return BadRequest("No Transaction Found");

            foundTransaction.Amount = createDto.Amount;
            foundTransaction.Note = createDto.Note;
            foundTransaction.TransactionDate = createDto.TransactionDate;
            foundTransaction.CategoryId = createDto.CategoryId;
            foundTransaction.SubCategoryId = createDto.SubCategoryId;
            foundTransaction.UpdatedBy = _currentUserId;
            foundTransaction.UpdatedDate = DateTime.Now;

            _context.Transactions.Update(foundTransaction);
            _context.SaveChanges();

            TransactionReadDto readDto = new TransactionReadDto(){
                TransactionId = foundTransaction.TransactionId,
                CategoryId = foundTransaction.CategoryId,
                Amount = foundTransaction.Amount,
                Note = foundTransaction.Note,
                // Category = newTransaction.Category
            };

            return Ok(readDto);
        }
        else{
            return BadRequest("No Data Provided");
        }
    }


    [Route("{transactionId}")]
    [HttpGet]
    public async Task<ActionResult<TransactionReadDto>> Get([FromRoute]long transactionId)
    {
        if(transactionId != null)
        {
            Transaction foundTransaction = await _context.Transactions.FirstOrDefaultAsync(x => x.ClientId == _currentClientId && x.UserId == _currentUserId && x.TransactionId == transactionId);

            if(foundTransaction == null)
            {
                return BadRequest("No Transaction Found");
            }

            Category category = await _context.Categories.FirstOrDefaultAsync(x => x.ClientId == _currentClientId && x.CategoryId == foundTransaction.CategoryId);

            if(category == null)
            {
                return BadRequest("Transaction with no category found");
            }

            TransactionReadDto readDto = new TransactionReadDto(){
                TransactionId = foundTransaction.TransactionId,
                CategoryId = foundTransaction.CategoryId,
                CategoryCode = category.CategoryCode,
                CategoryName = category.CategoryName,
                CategoryType = category.CategoryType,
                Amount = foundTransaction.Amount,
                Note = foundTransaction.Note,
                TransactionDate = foundTransaction.TransactionDate
            };

            return Ok(readDto);
        }
        else{
            return BadRequest("No Data Provided");
        }
    }


    [HttpDelete]
    [Route("{transactionId}")]
    public async Task<ActionResult<bool>> Delete([FromRoute]long transactionId)
    {
        if(transactionId != null)
        {
            Transaction foundTransaction = await _context.Transactions.FirstOrDefaultAsync(x => x.ClientId == _currentClientId && x.UserId == _currentUserId && x.TransactionId == transactionId);

            if(foundTransaction == null)
            {
                return BadRequest("No Transaction Found");
            }

            _context.Transactions.Remove(foundTransaction);
            _context.SaveChanges();


            return Ok(true);
        }
        else{
            return BadRequest("No Data Provided");
        }
    }



}
