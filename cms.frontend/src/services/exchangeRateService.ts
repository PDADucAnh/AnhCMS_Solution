import axiosClient from '../api/axiosClient';

export interface ExchangeRateDTO {
  id: number;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  updatedAt: string;
  isAutoUpdated: boolean;
}

const exchangeRateService = {
  getRate: async (): Promise<ExchangeRateDTO> => {
    const response = await axiosClient.get('/ExchangeRate');
    return response.data || response;
  },
};

export default exchangeRateService;
