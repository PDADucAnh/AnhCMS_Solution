namespace CMS.Backend.Models.DTOs
{
    public class CategoryProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
    }

    public class CreateCategoryProductDTO
    {
        public string Name { get; set; }
        public string? Description { get; set; }
    }

    public class UpdateCategoryProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
    }
}
