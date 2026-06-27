using System.ComponentModel.DataAnnotations;

namespace CMS.Backend.Models.DTOs
{
    public class CategoryDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public string? Slug { get; set; }
        public string Locale { get; set; } = "en";
        public System.Collections.Generic.List<PostDTO>? Posts { get; set; }
    }

    public class CreateCategoryDTO
    {
        [Required(ErrorMessage = "Tên danh mục (EN) không được để trống")]
        [MaxLength(200)]
        public string NameEn { get; set; }

        [Required(ErrorMessage = "Tên danh mục (VI) không được để trống")]
        [MaxLength(200)]
        public string NameVi { get; set; }

        [MaxLength(2000)]
        public string? DescriptionEn { get; set; }

        [MaxLength(2000)]
        public string? DescriptionVi { get; set; }

        [MaxLength(300)]
        public string? SlugEn { get; set; }

        [MaxLength(300)]
        public string? SlugVi { get; set; }
    }

    public class UpdateCategoryDTO
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string NameEn { get; set; }

        [Required]
        [MaxLength(200)]
        public string NameVi { get; set; }

        [MaxLength(2000)]
        public string? DescriptionEn { get; set; }

        [MaxLength(2000)]
        public string? DescriptionVi { get; set; }

        [MaxLength(300)]
        public string? SlugEn { get; set; }

        [MaxLength(300)]
        public string? SlugVi { get; set; }
    }
}
