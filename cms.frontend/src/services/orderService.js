import axiosClient from '../api/axiosClient';

const orderService = {
  submitOrder: async (orderData) => {
    try {
      const response = await axiosClient.post('/Orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error submitting order:', error);
      throw error;
    }
  }
};

export default orderService;
