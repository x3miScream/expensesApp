using Microsoft.EntityFrameworkCore;

namespace Server.Models
{
    public class ApplicationDBContext: DbContext {
        public ApplicationDBContext(DbContextOptions options):base(options) {
            
        }

        public DbSet<Category> Categories {get;set;}
        public DbSet<Transaction> Transactions {get;set;}
    }
}