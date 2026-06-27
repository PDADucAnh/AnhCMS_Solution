using System;

namespace CMS.Backend.Utils
{
    public static class PriceHelper
    {
        public static decimal RoundPrice(decimal price, string currency)
        {
            return currency?.ToUpper() switch
            {
                "VND" => Math.Round(price / 1000) * 1000,
                _ => Math.Round(price, 2)
            };
        }

        public static decimal ConvertPrice(decimal usdPrice, decimal exchangeRate, string currency)
        {
            if (currency?.ToUpper() == "VND")
                return RoundPrice(usdPrice * exchangeRate, "VND");
            return RoundPrice(usdPrice, "USD");
        }
    }
}
