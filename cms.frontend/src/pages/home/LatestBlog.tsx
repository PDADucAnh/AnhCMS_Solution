import React from 'react';
import { usePosts } from '../../hooks/usePosts';
import PostCard from '../../components/PostCard';

function LatestBlog() {
    const { data: posts = [], isLoading } = usePosts();

    if (isLoading) return null;

    const topThreePosts = [...posts].sort((a: any, b: any) => b.id - a.id).slice(0, 3);

    return (
        <section className="px-margin mb-xl py-xl bg-surface">
            <div className="text-center mb-xl">
                <h2 className="font-display-xl text-headline-lg uppercase tracking-tight mb-sm">XU HƯỚNG THỜI TRANG</h2>
                <p className="text-secondary font-body-md max-w-xl mx-auto">Cập nhật mẹo phối đồ và tin tức thời trang mới nhất từ PDA FLOWER</p>
                <div className="w-12 h-0.5 bg-primary mx-auto mt-md"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                {topThreePosts.map((item) => (
                    <PostCard key={item.id} post={item} />
                ))}
            </div>
        </section>
    );
}

export default LatestBlog;
