using CMS.Data.Entities;

namespace CMS.Backend.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetAll();
        Task<Category?> GetById(int id);
        Task<Category> Create(Category category);
        Task<bool> Update(int id, Category category);
        Task<bool> Delete(int id);
    }
}
