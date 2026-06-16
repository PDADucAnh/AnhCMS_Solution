using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services.Interfaces;
using CMS.Backend.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Services
{
    public class ProductService : IProductService
    {
        private readonly IApplicationDbContext _context;

        public ProductService(IApplicationDbContext context)
        {
            _context = context;
        }

        // === Entity methods (MVC) ===
        public async Task<IEnumerable<Product>> GetAll()
        {
            return await _context.Products
                .Include(p => p.CategoryProduct)
                .OrderByDescending(p => p.Id)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetByCategoryProduct(int categoryProductId)
        {
            return await _context.Products
                .Include(p => p.CategoryProduct)
                .Where(p => p.CategoryProductId == categoryProductId)
                .ToListAsync();
        }

        public async Task<Product?> GetDetail(int id)
        {
            return await _context.Products
                .Include(p => p.CategoryProduct)
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

        // === DTO methods (API) ===
        public async Task<IEnumerable<ProductDTO>> GetAllDTO()
        {
            var products = await _context.Products
                .Include(p => p.CategoryProduct)
                .OrderByDescending(p => p.Id)
                .ToListAsync();
            return products.Select(p => p.ToDTO());
        }

        public async Task<IEnumerable<ProductDTO>> GetByCategoryProductDTO(int categoryProductId)
        {
            var products = await _context.Products
                .Include(p => p.CategoryProduct)
                .Where(p => p.CategoryProductId == categoryProductId)
                .ToListAsync();
            return products.Select(p => p.ToDTO());
        }

        public async Task<ProductDTO?> GetDetailDTO(int id)
        {
            var product = await _context.Products
                .Include(p => p.CategoryProduct)
                .FirstOrDefaultAsync(p => p.Id == id);
            return product?.ToDTO();
        }

        public async Task<ProductDTO> CreateDTO(CreateProductDTO dto)
        {
            var product = dto.ToEntity();
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            
            // Reload to include CategoryProduct if any
            await _context.Entry(product).Reference(p => p.CategoryProduct).LoadAsync();
            
            return product.ToDTO();
        }

        public async Task<bool> UpdateDTO(int id, UpdateProductDTO dto)
        {
            if (id != dto.Id)
                return false;

            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return false;

            dto.UpdateEntity(product);

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
    }
}
