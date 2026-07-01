import axiosClient from '../api/axiosClient';

const productService = {
    getProductsPaged: async (page: number, pageSize: number) => {
        try {
            const searchParams = new URLSearchParams();
            searchParams.set('page', page.toString());
            searchParams.set('pageSize', pageSize.toString());
            const response = await axiosClient.get(`/Products/paged?${searchParams.toString()}`);
            return response.data || response;
        } catch (error) {
            console.error('API getProductsPaged error:', error);
            throw error;
        }
    },

    getAllProducts: async () => {
        try {
            const response = await axiosClient.get('/Products');
            return response.data || response;
        } catch (error) {
            console.error('API getAllProducts error:', error);
            throw error;
        }
    },

    getProductById: async (id: string | number) => {
        try {
            const response = await axiosClient.get(`/Products/${id}`);
            return response.data || response;
        } catch (error) {
            console.error(`API getProductById error for ID ${id}:`, error);
            throw error;
        }
    },

    getProductsByCategory: async (categoryProductId: number | null) => {
        try {
            const response = await axiosClient.get(`/Products/categoryproduct/${categoryProductId}`);
            return response.data || response;
        } catch (error) {
            console.error(`API getProductsByCategory error for ID ${categoryProductId}:`, error);
            throw error;
        }
    }
};

export default productService;
