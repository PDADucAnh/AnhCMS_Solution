using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    public class ProductTranslation
    {
        [Key]
        public int Id { get; set; }

        public int ProductId { get; set; }

        [Required]
        [MaxLength(10)]
        public string Locale { get; set; } = "en";

        [Required(ErrorMessage = "Tên sản phẩm không được để trống")]
        [MaxLength(200)]
        public string Name { get; set; }

        public string? Description { get; set; }

        [MaxLength(300)]
        public string? Slug { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }
    }
}
