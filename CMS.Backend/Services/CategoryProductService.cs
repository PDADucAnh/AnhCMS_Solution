using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Services
{
    public class CategoryProductService : ICategoryProductService
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<object>> GetAll()
        {
            try
            {
                return await _context.CategoriesProducts
                    .Select(c => new
                    {
                        c.Id,
                        c.Name,
                        c.Description
                    })
                    .ToListAsync();
            }
            catch (System.Exception ex)
            {
                throw new Exception("Lỗi kết nối cơ sở dữ liệu hệ thống", ex);
            }
        }

        public async Task<CategoryProduct?> GetById(int id)
        {
            return await _context.CategoriesProducts.FindAsync(id);
        }

        public async Task<CategoryProduct> Create(CategoryProduct category)
        {
            _context.CategoriesProducts.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<bool> Update(int id, CategoryProduct category)
        {
            if (id != category.Id)
                return false;

            _context.Entry(category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.CategoriesProducts.AnyAsync(e => e.Id == id))
                    return false;
                throw;
            }
        }

        public async Task<bool> Delete(int id)
        {
            var category = await _context.CategoriesProducts.FindAsync(id);
            if (category == null)
                return false;

            _context.CategoriesProducts.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
