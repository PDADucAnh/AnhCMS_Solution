using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    public class Category
    {
        [Key]
        public int Id { get; set; }

        public virtual ICollection<Post> Posts { get; set; }

        public virtual ICollection<CategoryTranslation> Translations { get; set; } = new List<CategoryTranslation>();
    }
}
