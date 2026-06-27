using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    public class ExchangeRate
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(3)]
        public string FromCurrency { get; set; } = "USD";

        [Required]
        [MaxLength(3)]
        public string ToCurrency { get; set; } = "VND";

        [Required]
        [Column(TypeName = "decimal(18,6)")]
        public decimal Rate { get; set; }

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public bool IsAutoUpdated { get; set; } = true;
    }
}
