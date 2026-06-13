import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import postService from '../../services/postService';

const IMAGE_BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7111";

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await postService.getPostById(id);
        setPost(data);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết bài viết:", err);
        setError("Không thể tải chi tiết bài viết này.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return (
    <>
      <Header />
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
      <Footer />
    </>
  );

  if (error || !post) return (
    <>
      <Header />
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error || "Không tìm thấy bài viết."}</div>
        <Link to="/blog" className="btn btn-primary">Quay lại Tin tức</Link>
      </div>
      <Footer />
    </>
  );

  const imageUrl = post.imageUrl?.startsWith('http') 
    ? post.imageUrl 
    : `${IMAGE_BASE_URL}${post.imageUrl || ''}`;

  return (
    <>
      <Header />
      <div className="container py-5 mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-transparent p-0 mb-4">
                <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Trang chủ</Link></li>
                <li className="breadcrumb-item"><Link to="/blog" className="text-decoration-none text-muted">Tin tức</Link></li>
                <li className="breadcrumb-item active" aria-current="page">{post.title}</li>
              </ol>
            </nav>

            <article className="blog-post">
              <h1 className="font-weight-bold mb-3" style={{ color: '#005088' }}>{post.title}</h1>
              <div className="d-flex align-items-center mb-4 text-muted small">
                <span className="mr-3"><i className="far fa-calendar-alt mr-1"></i> {post.createdDate ? new Date(post.createdDate).toLocaleDateString('vi-VN') : '13/06/2026'}</span>
                <span className="mr-3"><i className="far fa-folder mr-1"></i> {post.categoryName || 'Xu hướng thời trang'}</span>
                <span><i className="far fa-user mr-1"></i> Admin</span>
              </div>
              
              <div className="blog-content" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                <p className="font-italic font-weight-bold mb-4">{post.summary}</p>
                <img src={imageUrl} className="img-fluid rounded my-4 w-100" alt={post.title} style={{ maxHeight: '500px', objectFit: 'cover' }} />
                
                {/* Rendering HTML content safely from Backend (CKEditor) */}
                <div dangerouslySetInnerHTML={{ __html: post.content || '<p>Đang cập nhật nội dung chi tiết...</p>' }}></div>
              </div>
            </article>

            <div className="mt-5 pt-4 border-top">
              <h5 className="font-weight-bold mb-4">Bình luận</h5>
              <div className="alert alert-light border">Chưa có bình luận nào cho bài viết này.</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogDetail;
