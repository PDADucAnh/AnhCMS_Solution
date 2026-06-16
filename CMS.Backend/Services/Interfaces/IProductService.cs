using CMS.Data.Entities;
using CMS.Backend.Models.DTOs;

namespace CMS.Backend.Services.Interfaces
{
    public interface IProductService
    {
        // Entity methods (for MVC)
        Task<IEnumerable<Product>> GetAll();
        Task<IEnumerable<Product>> GetByCategoryProduct(int categoryProductId);
        Task<Product?> GetDetail(int id);
        Task<Product> Create(Product product);
        Task<bool> Update(int id, Product product);
        Task<bool> Delete(int id);

        // DTO methods (for API)
        Task<IEnumerable<ProductDTO>> GetAllDTO();
        Task<IEnumerable<ProductDTO>> GetByCategoryProductDTO(int categoryProductId);
        Task<ProductDTO?> GetDetailDTO(int id);
        Task<ProductDTO> CreateDTO(CreateProductDTO dto);
        Task<bool> UpdateDTO(int id, UpdateProductDTO dto);
    }
}
