using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    public class CategoryProduct
    {
        [Key]
        public int Id { get; set; }

        public virtual ICollection<Product>? Products { get; set; }

        public virtual ICollection<CategoryProductTranslation> Translations { get; set; } = new List<CategoryProductTranslation>();
    }
}
