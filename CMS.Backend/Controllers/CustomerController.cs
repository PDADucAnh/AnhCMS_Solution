using CMS.Data.Entities;
using CMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    public class CustomerController : Controller
    {
        private readonly ICustomerService _customerService;

        // Constructor injection
        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        // Hiển thị danh sách khách hàng
        public async Task<IActionResult> Index()
        {
            var customers = await _customerService.GetAll();
            return View(customers);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(Customer model)
        {
            await _customerService.Create(model);
            return RedirectToAction("Index");
        }

        public async Task<IActionResult> Delete(int id)
        {
            await _customerService.Delete(id);
            return RedirectToAction("Index");
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var customer = await _customerService.GetById(id);
            if (customer == null) return NotFound();
            return View(customer);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(Customer model)
        {
            await _customerService.Update(model.Id, model);
            return RedirectToAction("Index");
        }
    }
}