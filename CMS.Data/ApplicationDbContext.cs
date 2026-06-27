using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Data.Entities;
using Microsoft.EntityFrameworkCore;
namespace CMS.Data
{
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        // Khai báo các bảng dữ liệu
        public DbSet<Category> Categories { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<CategoryProduct> CategoriesProducts { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<ExchangeRate> ExchangeRates { get; set; }
        public DbSet<ProductTranslation> ProductTranslations { get; set; }
        public DbSet<CategoryProductTranslation> CategoryProductTranslations { get; set; }
        public DbSet<CategoryTranslation> CategoryTranslations { get; set; }
        public DbSet<PostTranslation> PostTranslations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Customer>()
                .HasIndex(c => c.Email)
                .IsUnique();

            modelBuilder.Entity<ProductTranslation>()
                .HasIndex(pt => new { pt.ProductId, pt.Locale })
                .IsUnique();

            modelBuilder.Entity<CategoryProductTranslation>()
                .HasIndex(cpt => new { cpt.CategoryProductId, cpt.Locale })
                .IsUnique();

            modelBuilder.Entity<CategoryTranslation>()
                .HasIndex(ct => new { ct.CategoryId, ct.Locale })
                .IsUnique();

            modelBuilder.Entity<PostTranslation>()
                .HasIndex(pt => new { pt.PostId, pt.Locale })
                .IsUnique();
        }
    }
}
