import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import postService from '../../services/postService';
import productService from '../../services/productService';

const BlogDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [postData, productsData] = await Promise.all([
                    postService.getPostById(id),
                    productService.getAllProducts()
                ]);
                setPost(postData);
                setProducts(productsData.slice(0, 4)); // Get 4 products for "Shop The Editorial"
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="bg-background min-vh-100 flex items-center justify-center">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="bg-background min-vh-100">
                <Header />
                <div className="container py-20 text-center">
                    <h2 className="font-display-xl text-headline-lg">Bài viết không tồn tại</h2>
                    <Link to="/blog" className="text-primary underline mt-4 inline-block">Quay lại Tin tức</Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-background text-on-background antialiased selection:bg-primary selection:text-on-primary font-body-md">
            <Header />

            <main className="pt-20">
                {/* Hero Section */}
                <section className="w-full relative h-[614px] md:h-[819px] flex items-end pb-xl px-margin bg-surface-variant overflow-hidden">
                    <img 
                        alt={post.title} 
                        className="absolute inset-0 w-full h-full object-cover z-0" 
                        src={post.imageUrl || "https://via.placeholder.com/1920x1080"} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent z-10"></div>
                    <div className="relative z-20 max-w-4xl mx-auto text-center w-full">
                        <div className="mb-sm">
                            <span className="font-label-sm text-label-sm text-surface-container-highest uppercase border border-surface-container-highest px-xs py-[2px] rounded-DEFAULT">
                                {post.categoryName || 'Style Guide'}
                            </span>
                        </div>
                        <h1 className="font-display-xl text-display-xl-mobile md:text-display-xl text-on-primary mb-md">{post.title}</h1>
                        <p className="font-body-lg text-body-lg text-surface-container max-w-2xl mx-auto">{post.summary}</p>
                        <div className="mt-lg flex items-center justify-center gap-xs text-surface-dim font-label-sm text-label-sm">
                            <span>By AnhCMS Editorial Team</span>
                            <span>/</span>
                            <span>{new Date(post.createdAt || Date.now()).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>
                </section>

                {/* Article Body & Sidebar Container */}
                <div className="max-w-[1440px] mx-auto px-margin py-xl md:py-[120px] grid grid-cols-1 md:grid-cols-12 gap-gutter relative">
                    {/* Social Sharing (Floating Desktop) */}
                    <aside className="md:col-span-1 hidden md:flex flex-col items-center gap-md sticky top-32 h-fit">
                        <button aria-label="Share to Facebook" className="p-xs text-secondary hover:text-primary transition-colors duration-300 bg-transparent border-0">
                            <span className="material-symbols-outlined">share</span>
                        </button>
                        <button aria-label="Save Article" className="p-xs text-secondary hover:text-primary transition-colors duration-300 bg-transparent border-0">
                            <span className="material-symbols-outlined">bookmark</span>
                        </button>
                        <div className="w-px h-12 bg-outline-variant my-xs"></div>
                        <button aria-label="Print" className="p-xs text-secondary hover:text-primary transition-colors duration-300 bg-transparent border-0">
                            <span className="material-symbols-outlined">print</span>
                        </button>
                    </aside>

                    {/* Main Content */}
                    <article className="md:col-span-7 lg:col-span-6 md:col-start-3 lg:col-start-4">
                        <div className="prose prose-lg max-w-none text-on-surface-variant leading-relaxed">
                            {/* Rendering HTML content safely from Backend */}
                            <div 
                                className="blog-detail-content"
                                dangerouslySetInnerHTML={{ __html: post.content || '<p>Đang cập nhật nội dung chi tiết...</p>' }}
                            ></div>
                        </div>

                        {/* Article Tags */}
                        <div className="flex flex-wrap gap-sm mt-xl pt-lg border-t border-outline-variant">
                            <span className="font-label-sm text-label-sm text-primary border border-outline px-sm py-xs rounded-DEFAULT uppercase">EDITORIAL</span>
                            <span className="font-label-sm text-label-sm text-primary border border-outline px-sm py-xs rounded-DEFAULT uppercase">ANHCMS FASHION</span>
                            <span className="font-label-sm text-label-sm text-primary border border-outline px-sm py-xs rounded-DEFAULT uppercase">STYLING</span>
                        </div>
                    </article>
                </div>

                {/* Shop The Look (Bento Grid Style) */}
                <section className="bg-surface-container-low py-[120px] px-margin">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-xl gap-md">
                            <div>
                                <h3 className="font-display-xl text-headline-lg text-primary mb-xs">Shop The Editorial</h3>
                                <p className="font-body-md text-body-md text-secondary">Curated pieces to recreate the aesthetic.</p>
                            </div>
                            <Link className="font-label-sm text-label-sm text-primary uppercase tracking-widest border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-colors duration-300 text-decoration-none" to="/shop">View All</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
                            {products.map((p) => (
                                <Link className="group block text-decoration-none" to={`/product/${p.id}`} key={p.id}>
                                    <div className="aspect-[4/5] bg-surface mb-sm overflow-hidden relative">
                                        <img 
                                            alt={p.name} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                                            src={p.imageUrl || "https://via.placeholder.com/400x500"} 
                                        />
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    <h4 className="font-body-md text-body-md text-primary font-medium">{p.name}</h4>
                                    <p className="font-body-md text-body-md text-secondary">{(p.discountPrice || p.price).toLocaleString()} ₫</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Newsletter & Comments Section */}
                <div className="max-w-[1440px] mx-auto px-margin py-[120px] grid grid-cols-1 md:grid-cols-12 gap-gutter">
                    {/* Newsletter Block */}
                    <div className="md:col-span-5 lg:col-span-4 bg-surface p-xl border border-outline-variant flex flex-col justify-center">
                        <h3 className="font-display-xl text-headline-sm text-primary mb-sm">The Journal</h3>
                        <p className="font-body-md text-body-md text-secondary mb-lg">Subscribe to receive editorial updates, early access to collections, and styling insights.</p>
                        <form className="flex flex-col gap-md">
                            <div className="relative">
                                <input className="block w-full px-0 py-sm text-body-md bg-transparent border-0 border-b border-outline appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors" id="email" placeholder=" " type="email" />
                                <label className="absolute font-label-sm text-label-sm text-secondary duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6" htmlFor="email">Email Address</label>
                            </div>
                            <button className="w-full bg-primary text-on-primary font-label-sm text-label-sm uppercase py-sm rounded-none border border-primary hover:bg-transparent hover:text-primary transition-colors duration-300" type="button">Subscribe</button>
                        </form>
                    </div>

                    {/* Comments Area */}
                    <div className="md:col-span-7 lg:col-span-7 md:col-start-6 lg:col-start-6 mt-xl md:mt-0">
                        <h3 className="font-headline-sm text-headline-sm text-primary mb-lg border-b border-outline-variant pb-sm">Discussion</h3>
                        <div className="space-y-lg mb-xl text-muted italic">
                            Chưa có bình luận nào cho bài viết này. Hãy là người đầu tiên chia sẻ cảm nghĩ của bạn.
                        </div>
                        {/* Add Comment Form */}
                        <div>
                            <h4 className="font-body-md text-body-md font-medium text-primary mb-sm">Leave a comment</h4>
                            <form className="flex flex-col gap-md">
                                <div className="relative">
                                    <textarea className="block w-full px-0 py-sm text-body-md bg-transparent border-0 border-b border-outline appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors resize-none" id="comment" placeholder=" " rows="4"></textarea>
                                    <label className="absolute font-label-sm text-label-sm text-secondary duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6" htmlFor="comment">Your message</label>
                                </div>
                                <button className="self-start bg-transparent text-primary font-label-sm text-label-sm uppercase py-sm px-lg rounded-none border border-primary hover:bg-primary hover:text-on-primary transition-colors duration-300" type="button">Post Comment</button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BlogDetail;
