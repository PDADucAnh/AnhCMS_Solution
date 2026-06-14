using CMS.Data.Entities;

namespace CMS.Backend.Services.Interfaces
{
    public interface ICategoryProductService
    {
        Task<IEnumerable<object>> GetAll();
        Task<CategoryProduct?> GetById(int id);
        Task<CategoryProduct> Create(CategoryProduct category);
        Task<bool> Update(int id, CategoryProduct category);
        Task<bool> Delete(int id);
    }
}
