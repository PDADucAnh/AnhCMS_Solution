import axiosClient from '../api/axiosClient';

const authService = {
    login: async (username, password) => {
        try {
            const response = await axiosClient.post('/Auth/login', { username, password });
            return response.data || response;
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            throw error;
        }
    },
    register: async (userData) => {
        try {
            const response = await axiosClient.post('/Auth/register', userData);
            return response.data || response;
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            throw error;
        }
    }
};

export default authService;
