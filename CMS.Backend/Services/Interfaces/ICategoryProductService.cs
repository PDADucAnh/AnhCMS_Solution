using System.Collections.Generic;
using System.Threading.Tasks;
using CMS.Backend.Models.DTOs;

namespace CMS.Backend.Services.Interfaces
{
    public interface ICategoryProductService
    {
        Task<IEnumerable<CategoryProductDTO>> GetAll();
        Task<PagedResult<CategoryProductDTO>> GetPaged(int page, int pageSize);
        Task<CategoryProductDTO?> GetById(int id);
        Task<CategoryProductDTO> Create(CreateCategoryProductDTO dto);
        Task<bool> Update(int id, UpdateCategoryProductDTO dto);
        Task<bool> Delete(int id);
    }
}
