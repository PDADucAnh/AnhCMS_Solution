using CMS.Data.Entities;

namespace CMS.Backend.Services.Interfaces
{
    public interface ICustomerService
    {
        Task<IEnumerable<Customer>> GetAll();
        Task<Customer?> GetById(int id);
        Task<Customer> Create(Customer customer);
        Task<bool> Update(int id, Customer customer);
        Task<bool> Delete(int id);
    }
}
