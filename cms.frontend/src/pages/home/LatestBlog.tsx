import React, { useState, useEffect } from 'react';
import blogService from '../../services/postService';
import PostCard from '../../components/PostCard';

function LatestBlog() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllPosts();
                const topThreePosts = [...data].sort((a: any, b: any) => b.id - a.id).slice(0, 3);
                setPosts(topThreePosts);
            } catch (error) {
                console.error("Lỗi hệ thống khi tải tin tức thời trang:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestPosts();
    }, []);

    if (loading) return null;

    return (
        <section className="px-margin mb-xl py-xl bg-surface">
            <div className="text-center mb-xl">
                <h2 className="font-display-xl text-headline-lg uppercase tracking-tight mb-sm">XU HƯỚNG THỜI TRANG</h2>
                <p className="text-secondary font-body-md max-w-xl mx-auto italic serif">Cập nhật những mẹo phối đồ và tin tức phong cách mới nhất cùng AnhCMS.Fashion</p>
                <div className="w-12 h-0.5 bg-primary mx-auto mt-md"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                {posts.map((item) => (
                    <PostCard key={item.id} post={item} />
                ))}
            </div>
        </section>
    );
}

export default LatestBlog;
