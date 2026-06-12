import axiosClient from '../api/axiosClient';

const blogService = {
    // Lấy toàn bộ danh sách bài viết từ API /api/Posts
    getAllPosts: () => {
        return axiosClient.get('/Posts');
    },

    // Lấy danh mục blog từ API /api/Categories
    getBlogCategories: () => {
        return axiosClient.get('/Categories');
    }
};

export default blogService;
