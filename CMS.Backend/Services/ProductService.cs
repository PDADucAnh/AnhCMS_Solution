using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Services
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _context;

        public ProductService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetAll()
        {
            return await _context.Products
                .OrderByDescending(p => p.Id)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetByCategoryProduct(int categoryProductId)
        {
            return await _context.Products
                .Where(p => p.CategoryProductId == categoryProductId)
                .ToListAsync();
        }

        public async Task<Product?> GetDetail(int id)
        {
            return await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Product> Create(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<bool> Update(int id, Product product)
        {
            if (id != product.Id)
                return false;

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Products.AnyAsync(e => e.Id == id))
                    return false;
                throw;
            }
        }

        public async Task<bool> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
