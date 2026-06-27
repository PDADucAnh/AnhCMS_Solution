const STORAGE_KEY = 'locale_pref';

type Currency = 'usd' | 'vnd';

const getCurrency = (): Currency => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.currency === 'vnd' ? 'vnd' : 'usd';
    }
  } catch {}
  return 'usd';
};

export const formatCurrency = (value: number, currencyOverride?: Currency): string => {
  const currency = currencyOverride || getCurrency();

  if (currency === 'vnd') {
    const rounded = Math.round(value / 1000) * 1000;
    return new Intl.NumberFormat('vi-VN').format(rounded) + ' đ';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};
