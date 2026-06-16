using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services.Interfaces;
using CMS.Backend.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace CMS.Backend.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ApplicationDbContext _context;
        private readonly PasswordHasher<Customer> _passwordHasher;

        public CustomerService(ApplicationDbContext context)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<Customer>();
        }

        // === Entity methods (MVC) ===
        public async Task<IEnumerable<Customer>> GetAll()
        {
            return await _context.Customers.ToListAsync();
        }

        public async Task<Customer?> GetById(int id)
        {
            return await _context.Customers.FindAsync(id);
        }

        public async Task<Customer> Create(Customer customer)
        {
            customer.Password = _passwordHasher.HashPassword(customer, customer.Password);
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return customer;
        }

        public async Task<bool> Update(int id, Customer customer)
        {
            if (id != customer.Id)
                return false;

            var existingCustomer = await _context.Customers.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);
            if (existingCustomer == null)
                return false;

            if (customer.Password != existingCustomer.Password)
            {
                customer.Password = _passwordHasher.HashPassword(customer, customer.Password);
            }

            _context.Entry(customer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Customers.AnyAsync(e => e.Id == id))
                    return false;
                throw;
            }
        }

        public async Task<bool> Delete(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
                return false;

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();
            return true;
        }

        // === DTO methods (API) ===
        public async Task<IEnumerable<CustomerDTO>> GetAllDTO()
        {
            var list = await _context.Customers.ToListAsync();
            return list.Select(c => c.ToDTO());
        }

        public async Task<CustomerDTO?> GetByIdDTO(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            return customer?.ToDTO();
        }

        public async Task<CustomerDTO> CreateDTO(CreateCustomerDTO dto)
        {
            var customer = dto.ToEntity();
            customer.Password = _passwordHasher.HashPassword(customer, customer.Password);
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return customer.ToDTO();
        }

        public async Task<bool> UpdateDTO(int id, UpdateCustomerDTO dto)
        {
            if (id != dto.Id)
                return false;

            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
                return false;

            dto.UpdateEntity(customer);

            if (!string.IsNullOrEmpty(dto.Password))
            {
                customer.Password = _passwordHasher.HashPassword(customer, dto.Password);
            }

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Customers.AnyAsync(e => e.Id == id))
                    return false;
                throw;
            }
        }
    }
}
