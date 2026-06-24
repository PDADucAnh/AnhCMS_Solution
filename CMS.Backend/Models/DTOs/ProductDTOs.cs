using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace CMS.Backend.Models.DTOs
{
    public class ProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public string? ImageUrl { get; set; }
        public int CategoryProductId { get; set; }
        public string? CategoryProductName { get; set; }
    }

    public class CreateProductDTO
    {
        [Required(ErrorMessage = "Tên sản phẩm không được để trống")]
        [MaxLength(200)]
        public string Name { get; set; }
        public string? Description { get; set; }
        [Required(ErrorMessage = "Giá sản phẩm không được để trống")]
        [Range(0, double.MaxValue, ErrorMessage = "Giá phải lớn hơn 0")]
        [DisplayFormat(NullDisplayText = "", DataFormatString = "{0:N0}")]
        public decimal Price { get; set; }
        [Range(0, int.MaxValue)]
        public int StockQuantity { get; set; }
        public string? ImageUrl { get; set; }
        public int CategoryProductId { get; set; }
    }

    public class UpdateProductDTO
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(200)]
        public string Name { get; set; }
        public string? Description { get; set; }
        [Required]
        [Range(0, double.MaxValue)]
        [DisplayFormat(NullDisplayText = "", DataFormatString = "{0:N0}")]
        public decimal Price { get; set; }
        [Range(0, int.MaxValue)]
        public int StockQuantity { get; set; }
        public string? ImageUrl { get; set; }
        public int CategoryProductId { get; set; }
    }
}
