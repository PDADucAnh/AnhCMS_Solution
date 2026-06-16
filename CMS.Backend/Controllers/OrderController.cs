using CMS.Data.Entities;
using CMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    public class OrderController : Controller
    {
        private readonly IOrderService _orderService;
        private readonly ICustomerService _customerService;

        // Constructor injection
        public OrderController(IOrderService orderService, ICustomerService customerService)
        {
            _orderService = orderService;
            _customerService = customerService;
        }

        // Hiển thị danh sách đơn hàng (kèm tên khách hàng)
        public async Task<IActionResult> Index()
        {
            var orders = await _orderService.GetAll();
            return View(orders);
        }

        [HttpGet]
        public async Task<IActionResult> Create()
        {
            var customers = await _customerService.GetAll();
            ViewBag.CustomerList = new SelectList(customers, "Id", "FullName");
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(Order model)
        {
            await _orderService.Create(model);
            return RedirectToAction("Index");
        }

        public async Task<IActionResult> Delete(int id)
        {
            await _orderService.Delete(id);
            return RedirectToAction("Index");
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var order = await _orderService.GetDetail(id);
            if (order == null) return NotFound();
            var customers = await _customerService.GetAll();
            ViewBag.CustomerList = new SelectList(customers, "Id", "FullName", order.CustomerId);
            return View(order);
        }

        public async Task<IActionResult> Details(int id)
        {
            var order = await _orderService.GetDetail(id);

            if (order == null) return NotFound();
            return View(order);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(Order model)
        {
            await _orderService.Update(model.Id, model);
            return RedirectToAction("Index");
        }
    }
}