using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace CMS.Backend.Models.DTOs
{
    public class ProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public string? Slug { get; set; }
        public string Locale { get; set; } = "en";
        public decimal Price { get; set; }
        public decimal PriceUsd { get; set; }
        public decimal? PriceVnd { get; set; }
        public string Currency { get; set; } = "USD";
        public int StockQuantity { get; set; }
        public string? ImageUrl { get; set; }
        public int CategoryProductId { get; set; }
        public string? CategoryProductName { get; set; }
    }

    public class CreateProductDTO
    {
        [Required(ErrorMessage = "Tên sản phẩm (EN) không được để trống")]
        [MaxLength(200)]
        public string NameEn { get; set; }

        [Required(ErrorMessage = "Tên sản phẩm (VI) không được để trống")]
        [MaxLength(200)]
        public string NameVi { get; set; }

        public string? DescriptionEn { get; set; }
        public string? DescriptionVi { get; set; }

        [MaxLength(300)]
        public string? SlugEn { get; set; }

        [MaxLength(300)]
        public string? SlugVi { get; set; }

        [Required(ErrorMessage = "Giá sản phẩm không được để trống")]
        [Range(0, double.MaxValue, ErrorMessage = "Giá phải lớn hơn 0")]
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
        public string NameEn { get; set; }

        [Required]
        [MaxLength(200)]
        public string NameVi { get; set; }

        public string? DescriptionEn { get; set; }
        public string? DescriptionVi { get; set; }

        [MaxLength(300)]
        public string? SlugEn { get; set; }

        [MaxLength(300)]
        public string? SlugVi { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        [Range(0, int.MaxValue)]
        public int StockQuantity { get; set; }

        public string? ImageUrl { get; set; }

        public int CategoryProductId { get; set; }
    }
}
