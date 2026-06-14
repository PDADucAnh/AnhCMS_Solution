using CMS.Data.Entities;

namespace CMS.Backend.Services.Interfaces
{
    public interface IPostService
    {
        Task<IEnumerable<object>> GetAll();
        Task<IEnumerable<object>> GetByCategory(int categoryId);
        Task<Post?> GetDetail(int id);
        Task<Post> Create(Post post);
        Task<bool> Update(int id, Post post);
        Task<bool> Delete(int id);
    }
}
