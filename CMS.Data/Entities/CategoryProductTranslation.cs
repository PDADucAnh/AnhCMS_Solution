using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    public class CategoryProductTranslation
    {
        [Key]
        public int Id { get; set; }

        public int CategoryProductId { get; set; }

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

        [ForeignKey("CategoryProductId")]
        public virtual CategoryProduct CategoryProduct { get; set; }
    }
}
