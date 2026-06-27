using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services.Interfaces;
using CMS.Backend.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IApplicationDbContext _context;

        public CategoryService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CategoryDTO>> GetAll(string? locale = "en")
        {
            var categories = await _context.Categories
                .Include(c => c.Translations.Where(t => t.Locale == locale))
                .ToListAsync();
            return categories.Select(c => c.ToDTO(locale));
        }

        public async Task<PagedResult<CategoryDTO>> GetPaged(int page, int pageSize, string? locale = "en")
        {
            var query = _context.Categories
                .Include(c => c.Translations.Where(t => t.Locale == locale))
                .OrderByDescending(c => c.Id);

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<CategoryDTO>
            {
                Items = items.Select(c => c.ToDTO(locale)).ToList(),
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<CategoryDTO?> GetById(int id, string? locale = "en")
        {
            var category = await _context.Categories
                .Include(c => c.Translations.Where(t => t.Locale == locale))
                .Include(c => c.Posts)
                    .ThenInclude(p => p.Translations.Where(t => t.Locale == locale))
                .FirstOrDefaultAsync(c => c.Id == id);
            return category?.ToDTO(locale);
        }

        public async Task<CategoryDTO> Create(CreateCategoryDTO dto)
        {
            var category = dto.ToEntity();
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category.ToDTO();
        }

        public async Task<bool> Update(int id, UpdateCategoryDTO dto)
        {
            if (id != dto.Id)
                return false;

            var category = await _context.Categories
                .Include(c => c.Translations)
                .FirstOrDefaultAsync(c => c.Id == id);
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

        public async Task<bool> Delete(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return false;

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
