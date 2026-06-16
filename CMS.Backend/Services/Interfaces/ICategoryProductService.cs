using CMS.Data.Entities;
using CMS.Backend.Models.DTOs;

namespace CMS.Backend.Services.Interfaces
{
    public interface ICategoryProductService
    {
        // Entity methods (MVC & legacy)
        Task<CategoryProduct?> GetById(int id);
        Task<CategoryProduct> Create(CategoryProduct category);
        Task<bool> Update(int id, CategoryProduct category);
        Task<bool> Delete(int id);
        
        // Phương thức bổ sung phục vụ MVC Controller
        Task<IEnumerable<CategoryProduct>> GetCategoriesProductsAsync();

        // DTO methods (API)
        Task<IEnumerable<CategoryProductDTO>> GetAllDTO();
        Task<CategoryProductDTO?> GetByIdDTO(int id);
        Task<CategoryProductDTO> CreateDTO(CreateCategoryProductDTO dto);
        Task<bool> UpdateDTO(int id, UpdateCategoryProductDTO dto);
    }
}
