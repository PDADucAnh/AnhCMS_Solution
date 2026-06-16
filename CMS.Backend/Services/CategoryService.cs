using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services.Interfaces;
using CMS.Backend.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ApplicationDbContext _context;

        public CategoryService(ApplicationDbContext context)
        {
            _context = context;
        }

        // === Entity methods (MVC) ===
        public async Task<IEnumerable<Category>> GetAll()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task<Category?> GetById(int id)
        {
            return await _context.Categories
                .Include(c => c.Posts)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Category> Create(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<bool> Update(int id, Category category)
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
                if (!await _context.Categories.AnyAsync(e => e.Id == id))
                    return false;
                throw;
            }
        }

        public async Task<bool> Delete(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return false;

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }

        // === DTO methods (API) ===
        public async Task<IEnumerable<CategoryDTO>> GetAllDTO()
        {
            var categories = await _context.Categories.ToListAsync();
            return categories.Select(c => c.ToDTO());
        }

        public async Task<CategoryDTO?> GetByIdDTO(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            return category?.ToDTO();
        }

        public async Task<CategoryDTO> CreateDTO(CreateCategoryDTO dto)
        {
            var category = dto.ToEntity();
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category.ToDTO();
        }

        public async Task<bool> UpdateDTO(int id, UpdateCategoryDTO dto)
        {
            if (id != dto.Id)
                return false;

            var category = await _context.Categories.FindAsync(id);
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
                if (!await _context.Categories.AnyAsync(e => e.Id == id))
                    return false;
                throw;
            }
        }
    }
}
