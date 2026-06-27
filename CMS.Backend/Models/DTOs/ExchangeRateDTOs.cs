using System;
using System.ComponentModel.DataAnnotations;

namespace CMS.Backend.Models.DTOs
{
    public class ExchangeRateDTO
    {
        public int Id { get; set; }
        public string FromCurrency { get; set; } = "USD";
        public string ToCurrency { get; set; } = "VND";
        public decimal Rate { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsAutoUpdated { get; set; }
    }

    public class UpdateExchangeRateDTO
    {
        [Required]
        [Range(0, double.MaxValue)]
        public decimal Rate { get; set; }
    }
}
