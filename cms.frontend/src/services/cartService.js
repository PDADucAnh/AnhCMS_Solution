import axiosClient from '../api/axiosClient';

const cartService = {
    submitOrder: (orderData) => {
        return axiosClient.post('/Orders', orderData);
    }
};

export default cartService;
