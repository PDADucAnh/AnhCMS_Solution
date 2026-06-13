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
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Constructor injection
        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hiển thị danh sách chi tiết đơn hàng (kèm thông tin Order và Product)
        public IActionResult Index()
        {
            var orderDetails = _context.OrderDetails
                .Include(od => od.Order)
                    .ThenInclude(o => o.Customer)   // Lấy tên khách hàng qua Order
                .Include(od => od.Product)
                    .ThenInclude(p => p.CategoryProduct) // Lấy tên danh mục sản phẩm (nếu muốn)
                .ToList();
            return View(orderDetails);
        }

        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.OrderList = new SelectList(_context.Orders, "Id", "Id");
            ViewBag.ProductList = new SelectList(_context.Products, "Id", "Name");
            return View();
        }

        [HttpPost]
        public IActionResult Create(OrderDetail model)
        {
            _context.OrderDetails.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        public IActionResult Delete(int id)
        {
            var orderDetail = _context.OrderDetails.Find(id);
            if (orderDetail != null)
            {
                _context.OrderDetails.Remove(orderDetail);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var orderDetail = _context.OrderDetails.Find(id);
            if (orderDetail == null) return NotFound();
            ViewBag.OrderList = new SelectList(_context.Orders, "Id", "Id", orderDetail.OrderId);
            ViewBag.ProductList = new SelectList(_context.Products, "Id", "Name", orderDetail.ProductId);
            return View(orderDetail);
        }

        [HttpPost]
        public IActionResult Edit(OrderDetail model)
        {
            _context.OrderDetails.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }
    }
}