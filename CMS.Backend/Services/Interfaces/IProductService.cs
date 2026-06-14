using CMS.Data.Entities;

namespace CMS.Backend.Services.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetAll();
        Task<IEnumerable<Product>> GetByCategoryProduct(int categoryProductId);
        Task<Product?> GetDetail(int id);
        Task<Product> Create(Product product);
        Task<bool> Update(int id, Product product);
        Task<bool> Delete(int id);
    }
}
