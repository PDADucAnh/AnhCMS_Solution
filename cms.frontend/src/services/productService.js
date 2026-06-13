import axiosClient from '../api/axiosClient';

const productService = {
    getAllProducts: () => {
        return axiosClient.get('/Products');
    },
    getProductsByCategory: (categoryId) => {
        return axiosClient.get(`/Products/categoryproduct/${categoryId}`);
    },
    getProductDetail: (id) => {
        return axiosClient.get(`/Products/${id}`);
    }
};

export default productService;
