using System;
using System.ComponentModel.DataAnnotations;

namespace CMS.Backend.Models.DTOs
{
    public class PostDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Summary { get; set; }
        public string? Slug { get; set; }
        public string Locale { get; set; } = "en";
        public string ImageUrl { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public int CategoryId { get; set; }
        public string? CategoryName { get; set; }
    }

    public class CreatePostDTO
    {
        [Required(ErrorMessage = "Title (EN) is required")]
        public string TitleEn { get; set; } = string.Empty;

        [Required(ErrorMessage = "Title (VI) is required")]
        public string TitleVi { get; set; } = string.Empty;

        [Required(ErrorMessage = "Content (EN) is required")]
        public string ContentEn { get; set; } = string.Empty;

        [Required(ErrorMessage = "Content (VI) is required")]
        public string ContentVi { get; set; } = string.Empty;

        public string? SummaryEn { get; set; }
        public string? SummaryVi { get; set; }

        [MaxLength(300)]
        public string? SlugEn { get; set; }

        [MaxLength(300)]
        public string? SlugVi { get; set; }

        public string ImageUrl { get; set; } = string.Empty;

        [Required(ErrorMessage = "Category is required")]
        public int CategoryId { get; set; }
    }

    public class UpdatePostDTO
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Title (EN) is required")]
        public string TitleEn { get; set; } = string.Empty;

        [Required(ErrorMessage = "Title (VI) is required")]
        public string TitleVi { get; set; } = string.Empty;

        [Required(ErrorMessage = "Content (EN) is required")]
        public string ContentEn { get; set; } = string.Empty;

        [Required(ErrorMessage = "Content (VI) is required")]
        public string ContentVi { get; set; } = string.Empty;

        public string? SummaryEn { get; set; }
        public string? SummaryVi { get; set; }

        [MaxLength(300)]
        public string? SlugEn { get; set; }

        [MaxLength(300)]
        public string? SlugVi { get; set; }

        public string ImageUrl { get; set; } = string.Empty;

        [Required(ErrorMessage = "Category is required")]
        public int CategoryId { get; set; }
    }
}
