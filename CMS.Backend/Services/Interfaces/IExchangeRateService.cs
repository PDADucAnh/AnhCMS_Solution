using CMS.Backend.Models.DTOs;
using System.Threading.Tasks;

namespace CMS.Backend.Services.Interfaces
{
    public interface IExchangeRateService
    {
        Task<ExchangeRateDTO> GetUsdToVndRate();
        Task<ExchangeRateDTO> UpdateRate(UpdateExchangeRateDTO dto);
        Task<ExchangeRateDTO> FetchLatestRate();
    }
}
