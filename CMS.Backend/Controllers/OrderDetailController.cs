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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize]
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

        // 1. Hàm GET: Dùng để hiển thị giao diện Form cho nhập
        [HttpGet]
        public IActionResult Create()
        {
            // Lấy danh sách đơn hàng và sản phẩm để dropdown
            ViewBag.Orders = new SelectList(_context.Orders, "Id", "Id");
            ViewBag.Products = new SelectList(_context.Products, "Id", "Name");
            return View();
        }

        // 2. Hàm POST: Dùng để đón dữ liệu từ Form gửi lên và lưu vào SQL
        [HttpPost]
        public IActionResult Create(OrderDetail model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    ViewBag.Orders = new SelectList(_context.Orders, "Id", "Id");
                    ViewBag.Products = new SelectList(_context.Products, "Id", "Name");
                    return View(model);
                }

                // Kiểm tra đơn hàng tồn tại
                var orderExists = _context.Orders.Any(o => o.Id == model.OrderId);
                if (!orderExists)
                {
                    ModelState.AddModelError("OrderId", "Đơn hàng không tồn tại");
                    ViewBag.Orders = new SelectList(_context.Orders, "Id", "Id");
                    ViewBag.Products = new SelectList(_context.Products, "Id", "Name");
                    return View(model);
                }

                // Kiểm tra sản phẩm tồn tại và có đủ tồn kho
                var product = _context.Products.Find(model.ProductId);
                if (product == null)
                {
                    ModelState.AddModelError("ProductId", "Sản phẩm không tồn tại");
                    ViewBag.Orders = new SelectList(_context.Orders, "Id", "Id");
                    ViewBag.Products = new SelectList(_context.Products, "Id", "Name");
                    return View(model);
                }

                if (product.StockQuantity < model.Quantity)
                {
                    ModelState.AddModelError("Quantity", $"Tồn kho không đủ. Chỉ còn {product.StockQuantity}");
                    ViewBag.Orders = new SelectList(_context.Orders, "Id", "Id");
                    ViewBag.Products = new SelectList(_context.Products, "Id", "Name");
                    return View(model);
                }

                // BƯỚC 1: Thêm dữ liệu vào bộ nhớ tạm của Entity Framework
                _context.OrderDetails.Add(model);

                // BƯỚC 2: Ra lệnh cho hệ thống ghi dữ liệu thật sự vào SQL Server
                _context.SaveChanges();

                // Sau khi lưu thành công, tự động quay về trang danh sách
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", "Lỗi: " + ex.Message);
                ViewBag.Orders = new SelectList(_context.Orders, "Id", "Id");
                ViewBag.Products = new SelectList(_context.Products, "Id", "Name");
                return View(model);
            }
        }

        // Action nhận vào Id của chi tiết đơn hàng cần xóa
        [Authorize(Roles = "Admin")]
        public IActionResult Delete(int id)
        {
            try
            {
                // Bước 1: Tìm chi tiết đơn hàng trong Database bằng Id
                var orderDetail = _context.OrderDetails.Find(id);

                // Kiểm tra nếu tìm thấy thì mới xóa
                if (orderDetail != null)
                {
                    // Bước 2: Lệnh xóa khỏi bộ nhớ tạm (Tracking)
                    _context.OrderDetails.Remove(orderDetail);

                    // Bước 3: Chốt phiên làm việc, xóa thực sự trong SQL Server
                    _context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                // Xử lý lỗi nếu cần
                ViewBag.Error = "Lỗi khi xóa: " + ex.Message;
            }

            // Sau khi xóa xong, quay lại trang danh sách để cập nhật giao diện
            return RedirectToAction("Index");
        }

        // 1. Hàm GET: Tìm dữ liệu cũ và đổ lên Form
        [HttpGet]
        public IActionResult Edit(int id)
        {
            try
            {
                var orderDetail = _context.OrderDetails
                    .Include(od => od.Order)
                    .Include(od => od.Product)
                    .FirstOrDefault(od => od.Id == id);

                if (orderDetail == null) return NotFound();

                // Lấy danh sách đơn hàng và sản phẩm để dropdown
                ViewBag.Orders = new SelectList(_context.Orders, "Id", "Id", orderDetail.OrderId);
                ViewBag.Products = new SelectList(_context.Products, "Id", "Name", orderDetail.ProductId);

                return View(orderDetail); // Gửi đối tượng tìm được sang giao diện Edit
            }
            catch (Exception ex)
            {
                return BadRequest("Lỗi: " + ex.Message);
            }
        }

        // 2. Hàm POST: Nhận dữ liệu mới từ người dùng và lưu lại
        [HttpPost]
        public IActionResult Edit(OrderDetail model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    ViewBag.Orders = new SelectList(_context.Orders, "Id", "Id");
                    ViewBag.Products = new SelectList(_context.Products, "Id", "Name");
                    return View(model);
                }

                var product = _context.Products.Find(model.ProductId);
                if (product == null)
                {
                    ModelState.AddModelError("ProductId", "Sản phẩm không tồn tại");
                    ViewBag.Orders = new SelectList(_context.Orders, "Id", "Id");
                    ViewBag.Products = new SelectList(_context.Products, "Id", "Name");
                    return View(model);
                }

                // Lệnh cập nhật đối tượng vào bộ nhớ tạm
                _context.OrderDetails.Update(model);

                // Lưu thay đổi thực sự xuống SQL Server 
                _context.SaveChanges();

                // Quay lại trang danh sách để xem kết quả
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", "Lỗi: " + ex.Message);
                ViewBag.Orders = new SelectList(_context.Orders, "Id", "Id");
                ViewBag.Products = new SelectList(_context.Products, "Id", "Name");
                return View(model);
            }
        }
    }
}