using System.Collections.Generic;
using System.Threading.Tasks;
using CMS.Backend.Models.DTOs;

namespace CMS.Backend.Services.Interfaces
{
    public interface IPostService
    {
        Task<IEnumerable<PostDTO>> GetAll(string? locale = "en");
        Task<PagedResult<PostDTO>> GetPaged(int page, int pageSize, string? locale = "en");
        Task<PostDTO?> GetById(int id, string? locale = "en");
        Task<PostDTO> Create(CreatePostDTO dto);
        Task<bool> Update(int id, UpdatePostDTO dto);
        Task<bool> Delete(int id);
        Task<IEnumerable<PostDTO>> GetByCategory(int categoryId, string? locale = "en");
    }
}
