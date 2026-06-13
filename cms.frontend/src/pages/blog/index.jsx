import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BlogSidebar from './BlogSidebar';
import PostCard from '../../components/PostCard';
import postService from '../../services/postService';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        let data;
        if (selectedCategoryId) {
          data = await postService.getPostsByCategory(selectedCategoryId);
        } else {
          data = await postService.getAllPosts();
        }
        setPosts(data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách tin tức:", err);
        setError("Không thể tải danh sách tin tức. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [selectedCategoryId]);

  const handleCategoryChange = (id) => {
    setSelectedCategoryId(id);
  };

  return (
    <>
      <Header />
      <div className="container py-5 mt-4">
        <h3 className="font-weight-bold mb-4 text-uppercase text-center" style={{ color: '#005088' }}>
          Tin tức thời trang
        </h3>
        <div className="row">
          <div className="col-lg-8">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3 text-muted">Đang tải tin tức...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-5">
                <i className="far fa-newspaper fa-4x text-light mb-3"></i>
                <p className="text-muted">Chưa có bài viết nào trong danh mục này.</p>
              </div>
            ) : (
              <div className="row">
                {posts.map((post) => (
                  <div className="col-md-6 mb-4" key={post.id}>
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="col-lg-4">
            <BlogSidebar onCategoryChange={handleCategoryChange} activeId={selectedCategoryId} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogPage;
