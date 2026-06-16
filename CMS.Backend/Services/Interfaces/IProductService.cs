using System.Collections.Generic;
using System.Threading.Tasks;
using CMS.Backend.Models.DTOs;

namespace CMS.Backend.Services.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDTO>> GetAll();
        Task<IEnumerable<ProductDTO>> GetByCategoryProduct(int categoryProductId);
        Task<ProductDTO?> GetDetail(int id);
        Task<ProductDTO> Create(CreateProductDTO dto);
        Task<bool> Update(int id, UpdateProductDTO dto);
        Task<bool> Delete(int id);
    }
}
