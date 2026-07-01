using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CMS.Backend.Models.DTOs
{
    public class CheckAvailabilityRequest
    {
        [Required]
        public string District { get; set; } = string.Empty;

        [Required]
        public List<CheckAvailabilityItem> Items { get; set; } = new List<CheckAvailabilityItem>();
    }

    public class CheckAvailabilityItem
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class AvailabilityResponse
    {
        public bool Available { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
