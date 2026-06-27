using System.Collections.Generic;

namespace CMS.Backend.Models.DTOs
{
    public class OrderInputDTO
    {
        public int CustomerId { get; set; }
        public string? Notes { get; set; }
        public string? Currency { get; set; }
        public List<OrderItemDTO>? Items { get; set; }
    }
}
