using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services.Interfaces;
using CMS.Backend.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Services
{
    public class CategoryProductService : ICategoryProductService
    {
        private readonly IApplicationDbContext _context;

        public CategoryProductService(IApplicationDbContext context)
        {
            _context = context;
        }

        // === Entity methods (MVC) ===
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

        public async Task<IEnumerable<CategoryProduct>> GetCategoriesProductsAsync()
        {
            return await _context.CategoriesProducts.ToListAsync();
        }

        // === DTO methods (API) ===
        public async Task<IEnumerable<CategoryProductDTO>> GetAllDTO()
        {
            var list = await _context.CategoriesProducts.ToListAsync();
            return list.Select(c => c.ToDTO());
        }

        public async Task<CategoryProductDTO?> GetByIdDTO(int id)
        {
            var category = await _context.CategoriesProducts.FindAsync(id);
            return category?.ToDTO();
        }

        public async Task<CategoryProductDTO> CreateDTO(CreateCategoryProductDTO dto)
        {
            var category = dto.ToEntity();
            _context.CategoriesProducts.Add(category);
            await _context.SaveChangesAsync();
            return category.ToDTO();
        }

        public async Task<bool> UpdateDTO(int id, UpdateCategoryProductDTO dto)
        {
            if (id != dto.Id)
                return false;

            var category = await _context.CategoriesProducts.FindAsync(id);
            if (category == null)
                return false;

            dto.UpdateEntity(category);

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
    }
}
