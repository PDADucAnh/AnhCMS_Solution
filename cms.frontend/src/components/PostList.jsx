import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllPosts();
                setPosts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách bài viết:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải bài viết...</span>
                </div>
                <p className="mt-2">Đang tải danh sách bài viết...</p>
            </div>
        );
    }

    return (
        <div className="row">
            {posts.length === 0 ? (
                <div className="col-12 text-center text-muted py-5">
                    Chưa có bài viết nào để hiển thị.
                </div>
            ) : (
                posts.map((item) => (
                    <div key={item.id} className="col-md-6 mb-4">
                        <div className="card h-100 shadow-sm border-0">
                            {item.imageUrl && (
                                <img 
                                    src={item.imageUrl} 
                                    className="card-img-top" 
                                    alt={item.title} 
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                            )}
                            <div className="card-body">
                                <h5 className="card-title font-weight-bold">{item.title}</h5>
                                <p className="card-text text-secondary" style={{ fontSize: '0.9rem' }}>
                                    {item.shortDescription || (item.content ? item.content.substring(0, 100) + '...' : 'Không có mô tả')}
                                </p>
                            </div>
                            <div className="card-footer bg-transparent border-top-0 d-flex justify-content-between align-items-center pb-3">
                                <small className="text-muted">
                                    <i className="far fa-calendar-alt mr-1"></i>
                                    {new Date(item.createdDate).toLocaleDateString('vi-VN')}
                                </small>
                                <a href={`/post/${item.id}`} className="btn btn-outline-primary btn-sm rounded-pill px-3">
                                    Xem chi tiết
                                </a>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default PostList;
