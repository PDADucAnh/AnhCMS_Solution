using System.Collections.Generic;
using System.Threading.Tasks;
using CMS.Backend.Models.DTOs;

namespace CMS.Backend.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDTO>> GetAll(string? locale = "en");
        Task<PagedResult<CategoryDTO>> GetPaged(int page, int pageSize, string? locale = "en");
        Task<CategoryDTO?> GetById(int id, string? locale = "en");
        Task<CategoryDTO> Create(CreateCategoryDTO dto);
        Task<bool> Update(int id, UpdateCategoryDTO dto);
        Task<bool> Delete(int id);
    }
}
