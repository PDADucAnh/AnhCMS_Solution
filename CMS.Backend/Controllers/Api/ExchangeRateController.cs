using CMS.Backend.Services.Interfaces;
using CMS.Backend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExchangeRateController : ControllerBase
    {
        private readonly IExchangeRateService _exchangeRateService;

        public ExchangeRateController(IExchangeRateService exchangeRateService)
        {
            _exchangeRateService = exchangeRateService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetRate()
        {
            var rate = await _exchangeRateService.GetUsdToVndRate();
            return Ok(rate);
        }

        [AllowAnonymous]
        [HttpPost("fetch-latest")]
        public async Task<IActionResult> FetchLatest()
        {
            var rate = await _exchangeRateService.FetchLatestRate();
            return Ok(rate);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPut]
        public async Task<IActionResult> UpdateRate([FromBody] UpdateExchangeRateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var rate = await _exchangeRateService.UpdateRate(dto);
            return Ok(rate);
        }
    }
}
