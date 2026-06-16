using CMS.Backend.Models.DTOs;
using CMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.IO;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    public class ProductController : Controller
    {
        private readonly IProductService _productService;
        private readonly ICategoryProductService _categoryProductService;

        public ProductController(IProductService productService, ICategoryProductService categoryProductService)
        {
            _productService = productService;
            _categoryProductService = categoryProductService;
        }

        public async Task<IActionResult> Index()
        {
            var products = await _productService.GetAll();
            return View(products);
        }

        [HttpGet]
        public async Task<IActionResult> Create()
        {
            var categories = await _categoryProductService.GetAll();
            ViewBag.CategoryProductList = new SelectList(categories, "Id", "Name");
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateProductDTO model, IFormFile uploadImage)
        {
            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "products");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await uploadImage.CopyToAsync(stream);
                }

                model.ImageUrl = "/uploads/products/" + fileName;
            }

            if (!ModelState.IsValid)
            {
                var categories = await _categoryProductService.GetAll();
                ViewBag.CategoryProductList = new SelectList(categories, "Id", "Name", model.CategoryProductId);
                return View(model);
            }

            await _productService.Create(model);
            return RedirectToAction("Index");
        }

        public async Task<IActionResult> Delete(int id)
        {
            await _productService.Delete(id);
            return RedirectToAction("Index");
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var product = await _productService.GetDetail(id);
            if (product == null) return NotFound();

            var categories = await _categoryProductService.GetAll();
            ViewBag.CategoryProductList = new SelectList(categories, "Id", "Name", product.CategoryProductId);

            var model = new UpdateProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                ImageUrl = product.ImageUrl ?? string.Empty,
                CategoryProductId = product.CategoryProductId
            };

            return View(model);
        }

        public async Task<IActionResult> Details(int id)
        {
            var product = await _productService.GetDetail(id);
            if (product == null) return NotFound();
            return View(product);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(UpdateProductDTO model, IFormFile uploadImage)
        {
            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "products");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await uploadImage.CopyToAsync(stream);
                }

                model.ImageUrl = "/uploads/products/" + fileName;
            }
            else
            {
                var oldProduct = await _productService.GetDetail(model.Id);
                if (oldProduct != null && string.IsNullOrEmpty(model.ImageUrl))
                {
                    model.ImageUrl = oldProduct.ImageUrl ?? string.Empty;
                }
            }

            if (!ModelState.IsValid)
            {
                var categories = await _categoryProductService.GetAll();
                ViewBag.CategoryProductList = new SelectList(categories, "Id", "Name", model.CategoryProductId);
                return View(model);
            }

            await _productService.Update(model.Id, model);
            return RedirectToAction("Index");
        }
    }
}