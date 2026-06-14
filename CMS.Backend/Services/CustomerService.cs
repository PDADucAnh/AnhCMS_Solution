using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ApplicationDbContext _context;

        public CustomerService(ApplicationDbContext context)
        {
            _context = context;
        }

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
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return customer;
        }

        public async Task<bool> Update(int id, Customer customer)
        {
            if (id != customer.Id)
                return false;

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
    }
}
