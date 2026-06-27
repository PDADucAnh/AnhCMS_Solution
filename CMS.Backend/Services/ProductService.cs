using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services.Interfaces;
using CMS.Backend.Models.DTOs;
using CMS.Backend.Utils;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Services
{
    public class ProductService : IProductService
    {
        private readonly IApplicationDbContext _context;
        private readonly IExchangeRateService _exchangeRateService;

        public ProductService(IApplicationDbContext context, IExchangeRateService exchangeRateService)
        {
            _context = context;
            _exchangeRateService = exchangeRateService;
        }

        public async Task<IEnumerable<ProductDTO>> GetAll()
        {
            var products = await _context.Products
                .Include(p => p.CategoryProduct)
                .OrderByDescending(p => p.Id)
                .ToListAsync();
            return products.Select(p => p.ToDTO());
        }

        public async Task<IEnumerable<ProductDTO>> GetByCategoryProduct(int categoryProductId)
        {
            var products = await _context.Products
                .Include(p => p.CategoryProduct)
                .Where(p => p.CategoryProductId == categoryProductId)
                .ToListAsync();
            return products.Select(p => p.ToDTO());
        }

        public async Task<ProductDTO?> GetDetail(int id)
        {
            var product = await _context.Products
                .Include(p => p.CategoryProduct)
                .FirstOrDefaultAsync(p => p.Id == id);
            return product?.ToDTO();
        }

        public async Task<ProductDTO> Create(CreateProductDTO dto)
        {
            var product = dto.ToEntity();
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            
            // Reload to include CategoryProduct if any
            await _context.Entry(product).Reference(p => p.CategoryProduct).LoadAsync();
            
            return product.ToDTO();
        }

        public async Task<bool> Update(int id, UpdateProductDTO dto)
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

        public async Task<bool> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<ProductDTO> ToCurrency(ProductDTO dto, string currency)
        {
            if (string.IsNullOrEmpty(currency) || currency.ToUpper() == "USD")
            {
                dto.PriceUsd = dto.Price;
                dto.PriceVnd = null;
                dto.Currency = "USD";
                return dto;
            }

            var rate = await _exchangeRateService.GetUsdToVndRate();
            dto.PriceUsd = dto.Price;
            dto.PriceVnd = PriceHelper.ConvertPrice(dto.Price, rate.Rate, "VND");
            dto.Currency = "VND";
            return dto;
        }

        public async Task<IEnumerable<ProductDTO>> ToCurrency(IEnumerable<ProductDTO> items, string currency)
        {
            if (string.IsNullOrEmpty(currency) || currency.ToUpper() == "USD")
            {
                foreach (var dto in items)
                {
                    dto.PriceUsd = dto.Price;
                    dto.PriceVnd = null;
                    dto.Currency = "USD";
                }
                return items;
            }

            var rate = await _exchangeRateService.GetUsdToVndRate();
            foreach (var dto in items)
            {
                dto.PriceUsd = dto.Price;
                dto.PriceVnd = PriceHelper.ConvertPrice(dto.Price, rate.Rate, "VND");
                dto.Currency = "VND";
            }
            return items;
        }
    }
}
