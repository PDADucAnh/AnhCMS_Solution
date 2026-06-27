using System.Collections.Generic;
using System.Threading.Tasks;
using CMS.Backend.Models.DTOs;

namespace CMS.Backend.Services.Interfaces
{
    public interface ICategoryProductService
    {
        Task<IEnumerable<CategoryProductDTO>> GetAll(string? locale = "en");
        Task<PagedResult<CategoryProductDTO>> GetPaged(int page, int pageSize, string? locale = "en");
        Task<CategoryProductDTO?> GetById(int id, string? locale = "en");
        Task<CategoryProductDTO> Create(CreateCategoryProductDTO dto);
        Task<bool> Update(int id, UpdateCategoryProductDTO dto);
        Task<bool> Delete(int id);
    }
}
