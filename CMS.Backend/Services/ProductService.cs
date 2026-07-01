using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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


        private IQueryable<Product> BuildQuery()
        {
            return _context.Products
                .Include(p => p.CategoryProduct);
        }

        public async Task<IEnumerable<ProductDTO>> GetAll()
        {
            var products = await BuildQuery()
                .OrderByDescending(p => p.Id)
                .ToListAsync();
            return products.Select(p => p.ToDTO());
        }

        public async Task<PagedResult<ProductDTO>> GetPaged(int page, int pageSize)
        {
            var query = BuildQuery()
                .OrderByDescending(p => p.Id);

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<ProductDTO>
            {
                Items = items.Select(p => p.ToDTO()).ToList(),
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<IEnumerable<ProductDTO>> GetByCategoryProduct(int categoryProductId)
        {
            var products = await BuildQuery()
                .Where(p => p.CategoryProductId == categoryProductId)
                .ToListAsync();
            return products.Select(p => p.ToDTO());
        }

        public async Task<ProductDTO?> GetDetail(int id)
        {
            var product = await BuildQuery()
                .FirstOrDefaultAsync(p => p.Id == id);
            return product?.ToDTO();
        }

        public async Task<ProductDTO> Create(CreateProductDTO dto)
        {
            if (string.IsNullOrEmpty(dto.Slug))
            {
                dto.Slug = CMS.Backend.Utils.SlugHelper.GenerateSlug(dto.Name);
            }
            if (string.IsNullOrEmpty(dto.Sku))
            {
                dto.Sku = CMS.Backend.Utils.SlugHelper.GenerateSku(dto.Name);
            }

            var product = dto.ToEntity();
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            await _context.Entry(product)
                .Reference(p => p.CategoryProduct)
                .LoadAsync();

            return product.ToDTO();
        }

        public async Task<bool> Update(int id, UpdateProductDTO dto)
        {
            if (id != dto.Id)
                return false;

            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id);
            if (product == null)
                return false;

            if (string.IsNullOrEmpty(dto.ImageUrl))
            {
                dto.ImageUrl = product.ImageUrl;
            }

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
