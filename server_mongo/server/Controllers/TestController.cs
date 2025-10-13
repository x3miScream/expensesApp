using Microsoft.AspNetCore.Mvc;
using Server.Entities;
using Server.Utils;

namespace Server.Controllers
{
    [Route("api/test")]
    [ApiController]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public IActionResult TestAttributeType()
        {
            string categoryDocType = MongoDocumentTypeAttributeReader.GetMongoDocumentType<Category>();
            string transactionDocType = MongoDocumentTypeAttributeReader.GetMongoDocumentType<Transaction>();

            return Ok();
        }
    }
}
