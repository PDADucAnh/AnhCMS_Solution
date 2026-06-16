/*
    Tên: Phạm Đức Anh
    Mã SV: 2123110135
    Ngày tạo: 06/06/2026
    Mô tả:    1. Truy vấn dữ liệu LINQ OrderDetail Controller
              2. Tạo trang admin hiển thị danh sách chi tiết đơn hàng
              3. Thiết kế giao diện quản lý chi tiết đơn hàng (CRUD) trong OrderDetailController
              4. Sử dụng Entity Framework để kết nối và thao tác với cơ sở dữ liệu SQL Server trong OrderDetailController
              5. Áp dụng phân quyền truy cập cho các chức năng quản lý chi tiết đơn hàng trong OrderDetailController (chỉ Admin mới được phép xóa, Editor chỉ được phép xem và sửa) trong OrderDetailController
 */
using CMS.Data.Entities;
using CMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    public class OrderDetailController : Controller
    {
        private readonly IOrderDetailService _orderDetailService;
        private readonly IOrderService _orderService;
        private readonly IProductService _productService;

        // Constructor injection
        public OrderDetailController(IOrderDetailService orderDetailService, IOrderService orderService, IProductService productService)
        {
            _orderDetailService = orderDetailService;
            _orderService = orderService;
            _productService = productService;
        }

        // Hiển thị danh sách chi tiết đơn hàng (kèm thông tin Order và Product)
        public async Task<IActionResult> Index()
        {
            var orderDetails = await _orderDetailService.GetAll();
            return View(orderDetails);
        }

        [HttpGet]
        public async Task<IActionResult> Create()
        {
            var orders = await _orderService.GetAll();
            var products = await _productService.GetAll();
            ViewBag.OrderList = new SelectList(orders, "Id", "Id");
            ViewBag.ProductList = new SelectList(products, "Id", "Name");
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(OrderDetail model)
        {
            await _orderDetailService.Create(model);
            return RedirectToAction("Index");
        }

        public async Task<IActionResult> Delete(int id)
        {
            await _orderDetailService.Delete(id);
            return RedirectToAction("Index");
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var orderDetail = await _orderDetailService.GetById(id);
            if (orderDetail == null) return NotFound();

            var orders = await _orderService.GetAll();
            var products = await _productService.GetAll();

            ViewBag.OrderList = new SelectList(orders, "Id", "Id", orderDetail.OrderId);
            ViewBag.ProductList = new SelectList(products, "Id", "Name", orderDetail.ProductId);
            return View(orderDetail);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(OrderDetail model)
        {
            await _orderDetailService.Update(model.Id, model);
            return RedirectToAction("Index");
        }
    }
}