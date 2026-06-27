import { useQuery } from '@tanstack/react-query';
import exchangeRateService from '../services/exchangeRateService';

export const useExchangeRate = () =>
  useQuery({
    queryKey: ['exchangeRate'],
    queryFn: () => exchangeRateService.getRate(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
