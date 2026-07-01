using System.Collections.Generic;
using System.Threading.Tasks;
using CMS.Backend.Models.DTOs;

namespace CMS.Backend.Services.Interfaces
{
    public interface IPostService
    {
        Task<IEnumerable<PostDTO>> GetAll();
        Task<PagedResult<PostDTO>> GetPaged(int page, int pageSize);
        Task<PostDTO?> GetById(int id);
        Task<IEnumerable<PostDTO>> GetByCategory(int categoryId);
        Task<PostDTO> Create(CreatePostDTO dto);
        Task<bool> Update(int id, UpdatePostDTO dto);
        Task<bool> Delete(int id);
    }
}
