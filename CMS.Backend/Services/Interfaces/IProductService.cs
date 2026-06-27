using System.Collections.Generic;
using System.Threading.Tasks;
using CMS.Backend.Models.DTOs;

namespace CMS.Backend.Services.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDTO>> GetAll(string? locale = "en");
        Task<PagedResult<ProductDTO>> GetPaged(int page, int pageSize, string? locale = "en");
        Task<IEnumerable<ProductDTO>> GetByCategoryProduct(int categoryProductId, string? locale = "en");
        Task<ProductDTO?> GetDetail(int id, string? locale = "en");
        Task<ProductDTO> Create(CreateProductDTO dto, string? locale = "en");
        Task<bool> Update(int id, UpdateProductDTO dto);
        Task<bool> Delete(int id);
        Task<ProductDTO> ToCurrency(ProductDTO dto, string currency);
        Task<IEnumerable<ProductDTO>> ToCurrency(IEnumerable<ProductDTO> items, string currency);
    }
}
