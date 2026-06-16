using CMS.Data.Entities;
using CMS.Backend.Models.DTOs;

namespace CMS.Backend.Services.Interfaces
{
    public interface ICategoryService
    {
        // Entity methods (for MVC)
        Task<IEnumerable<Category>> GetAll();
        Task<Category?> GetById(int id);
        Task<Category> Create(Category category);
        Task<bool> Update(int id, Category category);
        Task<bool> Delete(int id);

        // DTO methods (for API)
        Task<IEnumerable<CategoryDTO>> GetAllDTO();
        Task<CategoryDTO?> GetByIdDTO(int id);
        Task<CategoryDTO> CreateDTO(CreateCategoryDTO dto);
        Task<bool> UpdateDTO(int id, UpdateCategoryDTO dto);
    }
}
