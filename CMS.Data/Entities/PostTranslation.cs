using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    public class PostTranslation
    {
        [Key]
        public int Id { get; set; }

        public int PostId { get; set; }

        [Required]
        [MaxLength(10)]
        public string Locale { get; set; } = "en";

        [Required(ErrorMessage = "Tiêu đề không được để trống")]
        [MaxLength(500)]
        public string Title { get; set; }

        [Required(ErrorMessage = "Nội dung không được để trống")]
        public string Content { get; set; }

        [MaxLength(500)]
        public string? Summary { get; set; }

        [MaxLength(300)]
        public string? Slug { get; set; }

        [ForeignKey("PostId")]
        public virtual Post Post { get; set; }
    }
}
