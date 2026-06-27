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
    public class CategoryProductService : ICategoryProductService
    {
        private readonly IApplicationDbContext _context;

        public CategoryProductService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CategoryProductDTO>> GetAll(string? locale = "en")
        {
            var list = await _context.CategoriesProducts
                .Include(cp => cp.Translations.Where(t => t.Locale == locale))
                .ToListAsync();
            return list.Select(c => c.ToDTO(locale));
        }

        public async Task<PagedResult<CategoryProductDTO>> GetPaged(int page, int pageSize, string? locale = "en")
        {
            var query = _context.CategoriesProducts
                .Include(cp => cp.Translations.Where(t => t.Locale == locale))
                .OrderByDescending(cp => cp.Id);

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<CategoryProductDTO>
            {
                Items = items.Select(cp => cp.ToDTO(locale)).ToList(),
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<CategoryProductDTO?> GetById(int id, string? locale = "en")
        {
            var category = await _context.CategoriesProducts
                .Include(cp => cp.Translations.Where(t => t.Locale == locale))
                .FirstOrDefaultAsync(cp => cp.Id == id);
            return category?.ToDTO(locale);
        }

        public async Task<CategoryProductDTO> Create(CreateCategoryProductDTO dto)
        {
            var category = dto.ToEntity();
            _context.CategoriesProducts.Add(category);
            await _context.SaveChangesAsync();
            return category.ToDTO();
        }

        public async Task<bool> Update(int id, UpdateCategoryProductDTO dto)
        {
            if (id != dto.Id)
                return false;

            var category = await _context.CategoriesProducts
                .Include(cp => cp.Translations)
                .FirstOrDefaultAsync(cp => cp.Id == id);
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
