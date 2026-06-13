import axiosClient from '../api/axiosClient';

const postService = {
    getAllPosts: () => {
        return axiosClient.get('/Posts');
    },
    getPostsByCategory: (categoryId) => {
        return axiosClient.get(`/Posts/category/${categoryId}`);
    },
    getPostDetail: (id) => {
        return axiosClient.get(`/Posts/${id}`);
    }
};

export default postService;
