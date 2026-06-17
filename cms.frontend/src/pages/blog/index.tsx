import React, { useState, useEffect } from 'react';
import BlogSidebar from './BlogSidebar';
import PostCard from '../../components/PostCard';
import postService from '../../services/postService';
import type { Post } from '../../types/post';

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        let data;
        if (selectedCategoryId) {
          // Assuming getPostsByCategory exists, if not we filter locally
          const all = await postService.getAllPosts();
          data = all.filter((p: Post) => p.categoryId === selectedCategoryId);
        } else {
          data = await postService.getAllPosts();
        }
        setPosts(data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách tin tức:", err);
        setError("Unable to retrieve editorial stories at this time.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [selectedCategoryId]);

  const handleCategoryChange = (id: number | null) => {
    setSelectedCategoryId(id);
  };

  return (
    <div className="bg-background text-on-background font-body-md antialiased pt-20">
      <main className="max-w-[1440px] mx-auto px-margin py-xl">
        <header className="mb-xl text-center space-y-md">
            <h3 className="text-label-sm uppercase tracking-[0.3em] text-secondary">Editorial Narrative</h3>
            <h2 className="font-display-xl text-display-xl uppercase tracking-tighter text-primary">The Fashion Journal</h2>
            <div className="w-12 h-0.5 bg-primary mx-auto"></div>
        </header>

        <div className="flex flex-col lg:flex-row gap-xl">
          <div className="flex-1 order-2 lg:order-1">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="size-12 bg-surface-container rounded-full mb-md"></div>
                    <p className="text-label-sm uppercase tracking-widest text-secondary">Retrieving Narratives...</p>
                </div>
              </div>
            ) : error ? (
              <div className="p-lg bg-error-container text-error text-label-sm uppercase tracking-widest font-bold text-center border border-error">{error}</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 bg-surface-container-low border border-dashed border-outline-variant">
                <span className="material-symbols-outlined text-4xl text-outline mb-md">article</span>
                <p className="text-label-sm uppercase tracking-widest text-secondary">No editorial stories found in this pillar.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
          
          <aside className="w-full lg:w-80 flex-shrink-0 order-1 lg:order-2">
            <BlogSidebar onCategoryChange={handleCategoryChange} activeId={selectedCategoryId} />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default BlogPage;
