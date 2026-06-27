import axiosClient from '../api/axiosClient';

interface ProductQueryParams {
  locale?: string;
  currency?: string;
}

const buildProductUrl = (path: string, params?: ProductQueryParams): string => {
  const searchParams = new URLSearchParams();
  if (params?.locale) searchParams.set('locale', params.locale);
  if (params?.currency) searchParams.set('currency', params.currency);
  const qs = searchParams.toString();
  return qs ? `${path}?${qs}` : path;
};

const productService = {
    getAllProducts: async (params?: ProductQueryParams) => {
        try {
            const response = await axiosClient.get(buildProductUrl('/Products', params));
            return response.data || response;
        } catch (error) {
            console.error('API getAllProducts error:', error);
            throw error;
        }
    },

    getProductById: async (id: string | number, params?: ProductQueryParams) => {
        try {
            const response = await axiosClient.get(buildProductUrl(`/Products/${id}`, params));
            return response.data || response;
        } catch (error) {
            console.error(`API getProductById error for ID ${id}:`, error);
            throw error;
        }
    },

    getProductsByCategory: async (categoryProductId: number | null, params?: ProductQueryParams) => {
        try {
            const response = await axiosClient.get(buildProductUrl(`/Products/categoryproduct/${categoryProductId}`, params));
            return response.data || response;
        } catch (error) {
            console.error(`API getProductsByCategory error for ID ${categoryProductId}:`, error);
            throw error;
        }
    }
};

export default productService;
