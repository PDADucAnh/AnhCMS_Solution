using CMS.Data.Entities;
using CMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesProductsController : ControllerBase
    {
        private readonly ICategoryProductService _categoryProductService;

        public CategoriesProductsController(ICategoryProductService categoryProductService)
        {
            _categoryProductService = categoryProductService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var categories = await _categoryProductService.GetAll();
                return Ok(categories);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Lỗi kết nối cơ sở dữ liệu hệ thống",
                    detail = ex.InnerException?.Message ?? ex.Message
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _categoryProductService.GetById(id);
            if (category == null)
                return NotFound();

            return Ok(category);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CategoryProduct category)
        {
            var created = await _categoryProductService.Create(category);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CategoryProduct category)
        {
            if (id != category.Id)
                return BadRequest();

            var updated = await _categoryProductService.Update(id, category);

            if (!updated)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _categoryProductService.Delete(id);

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
