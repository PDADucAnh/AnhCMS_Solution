using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services.Interfaces;
using CMS.Backend.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace CMS.Backend.Services
{
    public class ExchangeRateService : IExchangeRateService
    {
        private readonly IApplicationDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly ILogger<ExchangeRateService> _logger;

        public ExchangeRateService(
            IApplicationDbContext context,
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration,
            ILogger<ExchangeRateService> logger)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<ExchangeRateDTO> GetUsdToVndRate()
        {
            var rate = await _context.ExchangeRates
                .Where(r => r.FromCurrency == "USD" && r.ToCurrency == "VND")
                .OrderByDescending(r => r.UpdatedAt)
                .FirstOrDefaultAsync();

            if (rate == null)
            {
                rate = new ExchangeRate
                {
                    FromCurrency = "USD",
                    ToCurrency = "VND",
                    Rate = 25400m,
                    UpdatedAt = DateTime.UtcNow,
                    IsAutoUpdated = false
                };
                _context.ExchangeRates.Add(rate);
                await _context.SaveChangesAsync();
            }

            return ToDTO(rate);
        }

        public async Task<ExchangeRateDTO> UpdateRate(UpdateExchangeRateDTO dto)
        {
            var rate = await _context.ExchangeRates
                .Where(r => r.FromCurrency == "USD" && r.ToCurrency == "VND")
                .OrderByDescending(r => r.UpdatedAt)
                .FirstOrDefaultAsync();

            if (rate == null)
            {
                rate = new ExchangeRate
                {
                    FromCurrency = "USD",
                    ToCurrency = "VND",
                    Rate = dto.Rate,
                    UpdatedAt = DateTime.UtcNow,
                    IsAutoUpdated = false
                };
                _context.ExchangeRates.Add(rate);
            }
            else
            {
                rate.Rate = dto.Rate;
                rate.UpdatedAt = DateTime.UtcNow;
                rate.IsAutoUpdated = false;
            }

            await _context.SaveChangesAsync();
            return ToDTO(rate);
        }

        public async Task<ExchangeRateDTO> FetchLatestRate()
        {
            try
            {
                var apiKey = _configuration["ExchangeRateApi:ApiKey"];
                if (string.IsNullOrEmpty(apiKey))
                {
                    _logger.LogWarning("ExchangeRateApi:ApiKey not configured, using default rate");
                    return await GetUsdToVndRate();
                }

                var client = _httpClientFactory.CreateClient();
                var response = await client.GetAsync(
                    $"https://v6.exchangerate-api.com/v6/{apiKey}/latest/USD");

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("ExchangeRate API returned {StatusCode}", response.StatusCode);
                    return await GetUsdToVndRate();
                }

                var json = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);
                var vndRate = doc.RootElement.GetProperty("conversion_rates").GetProperty("VND").GetDecimal();

                var rate = await _context.ExchangeRates
                    .Where(r => r.FromCurrency == "USD" && r.ToCurrency == "VND")
                    .OrderByDescending(r => r.UpdatedAt)
                    .FirstOrDefaultAsync();

                if (rate == null)
                {
                    rate = new ExchangeRate
                    {
                        FromCurrency = "USD",
                        ToCurrency = "VND",
                        Rate = vndRate,
                        UpdatedAt = DateTime.UtcNow,
                        IsAutoUpdated = true
                    };
                    _context.ExchangeRates.Add(rate);
                }
                else
                {
                    rate.Rate = vndRate;
                    rate.UpdatedAt = DateTime.UtcNow;
                    rate.IsAutoUpdated = true;
                }

                await _context.SaveChangesAsync();
                _logger.LogInformation("Exchange rate auto-updated: 1 USD = {Rate} VND", vndRate);

                return ToDTO(rate);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to fetch exchange rate from API");
                return await GetUsdToVndRate();
            }
        }

        private static ExchangeRateDTO ToDTO(ExchangeRate rate)
        {
            return new ExchangeRateDTO
            {
                Id = rate.Id,
                FromCurrency = rate.FromCurrency,
                ToCurrency = rate.ToCurrency,
                Rate = rate.Rate,
                UpdatedAt = rate.UpdatedAt,
                IsAutoUpdated = rate.IsAutoUpdated
            };
        }
    }
}
