using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    public class CategoryTranslation
    {
        [Key]
        public int Id { get; set; }

        public int CategoryId { get; set; }

        [Required]
        [MaxLength(10)]
        public string Locale { get; set; } = "en";

        [Required(ErrorMessage = "Tên danh mục không được để trống")]
        [MaxLength(200)]
        public string Name { get; set; }

        [MaxLength(2000)]
        public string? Description { get; set; }

        [MaxLength(300)]
        public string? Slug { get; set; }

        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; }
    }
}
