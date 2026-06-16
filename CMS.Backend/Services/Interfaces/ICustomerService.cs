using CMS.Data.Entities;
using CMS.Backend.Models.DTOs;

namespace CMS.Backend.Services.Interfaces
{
    public interface ICustomerService
    {
        // Entity methods (for MVC)
        Task<IEnumerable<Customer>> GetAll();
        Task<Customer?> GetById(int id);
        Task<Customer> Create(Customer customer);
        Task<bool> Update(int id, Customer customer);
        Task<bool> Delete(int id);

        // DTO methods (for API)
        Task<IEnumerable<CustomerDTO>> GetAllDTO();
        Task<CustomerDTO?> GetByIdDTO(int id);
        Task<CustomerDTO> CreateDTO(CreateCustomerDTO dto);
        Task<bool> UpdateDTO(int id, UpdateCustomerDTO dto);
    }
}
