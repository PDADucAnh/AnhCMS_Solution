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

    const IMAGE_BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7224";

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [postData, productsData] = await Promise.all([
                    postService.getPostById(id),
                    productService.getAllProducts()
                ]);
                setPost(postData);
                setProducts(productsData.slice(0, 4));
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
                <div className="animate-pulse flex flex-col items-center">
                    <div className="size-16 bg-surface-container rounded-full mb-md"></div>
                    <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">Retrieving Narrative...</p>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="bg-background min-vh-100 antialiased font-body-md pt-20">
                <Header />
                <div className="container py-20 text-center">
                    <h2 className="font-display-xl text-headline-lg uppercase tracking-tighter">Narrative Not Found</h2>
                    <Link to="/blog" className="text-primary font-label-sm uppercase tracking-widest border-b border-primary pb-1 mt-4 inline-block text-decoration-none">Back to Journal</Link>
                </div>
                <Footer />
            </div>
        );
    }

    const postImage = post.imageUrl?.startsWith('http') ? post.imageUrl : `${IMAGE_BASE_URL}${post.imageUrl}`;

    return (
        <div className="bg-background text-on-background antialiased selection:bg-primary selection:text-on-primary font-body-md pt-20">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="w-full relative h-[614px] md:h-[819px] flex items-end pb-xl px-margin bg-surface-variant overflow-hidden">
                    <img 
                        alt={post.title} 
                        className="absolute inset-0 w-full h-full object-cover z-0 grayscale" 
                        src={postImage || "https://via.placeholder.com/1920x1080"} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent z-10"></div>
                    <div className="relative z-20 max-w-4xl mx-auto text-center w-full">
                        <div className="mb-sm">
                            <span className="font-label-sm text-label-sm text-on-primary uppercase border border-white/30 px-sm py-1 rounded-none tracking-widest">
                                {post.categoryName || 'Editorial'}
                            </span>
                        </div>
                        <h1 className="font-display-xl text-display-xl-mobile md:text-display-xl text-on-primary mb-md uppercase tracking-tighter drop-shadow-lg">{post.title}</h1>
                        <p className="font-body-lg text-body-lg text-white/80 max-w-2xl mx-auto italic serif">{post.summary || 'A masterclass in texture and minimalist design.'}</p>
                        <div className="mt-lg flex items-center justify-center gap-xs text-white/60 font-label-sm text-[10px] uppercase tracking-[0.2em] font-bold">
                            <span>By AnhCMS Editorial Team</span>
                            <span className="mx-2">/</span>
                            <span>{new Date(post.createdDate || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>
                </section>

                {/* Article Body */}
                <div className="max-w-[1440px] mx-auto px-margin py-xl md:py-[120px] grid grid-cols-1 md:grid-cols-12 gap-gutter relative">
                    <aside className="md:col-span-1 hidden md:flex flex-col items-center gap-md sticky top-32 h-fit">
                        <button className="p-xs text-secondary hover:text-primary transition-colors duration-300 bg-transparent border-0"><span className="material-symbols-outlined">share</span></button>
                        <button className="p-xs text-secondary hover:text-primary transition-colors duration-300 bg-transparent border-0"><span className="material-symbols-outlined">bookmark</span></button>
                        <div className="w-px h-12 bg-outline-variant my-xs"></div>
                        <button className="p-xs text-secondary hover:text-primary transition-colors duration-300 bg-transparent border-0"><span className="material-symbols-outlined">print</span></button>
                    </aside>

                    <article className="md:col-span-8 lg:col-span-7 md:col-start-3 lg:col-start-4">
                        <div className="prose prose-lg max-w-none text-on-surface-variant leading-relaxed">
                            <div 
                                className="blog-detail-content serif italic text-2xl leading-loose first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-primary"
                                dangerouslySetInnerHTML={{ __html: post.content || '<p>Retrieving narrative content...</p>' }}
                            ></div>
                        </div>

                        <div className="flex flex-wrap gap-sm mt-xl pt-lg border-t border-outline-variant">
                            <span className="font-label-sm text-[10px] text-primary border border-outline px-sm py-1 uppercase tracking-widest font-bold">EDITORIAL</span>
                            <span className="font-label-sm text-[10px] text-primary border border-outline px-sm py-1 uppercase tracking-widest font-bold">ANHCMS FASHION</span>
                            <span className="font-label-sm text-[10px] text-primary border border-outline px-sm py-1 uppercase tracking-widest font-bold">STYLING</span>
                        </div>
                    </article>
                </div>

                {/* Shop The Editorial */}
                <section className="bg-surface-container-low py-[120px] px-margin border-y border-outline-variant">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-xl gap-md">
                            <div>
                                <h3 className="font-display-xl text-headline-lg text-primary mb-xs uppercase tracking-tighter">Shop The Editorial</h3>
                                <p className="font-body-md text-body-md text-secondary italic serif">Curated pieces to recreate the aesthetic.</p>
                            </div>
                            <Link className="font-label-sm text-label-sm text-primary uppercase tracking-widest border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-colors duration-300 text-decoration-none font-bold" to="/shop">View Full Collection</Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-gutter">
                            {products.map((p) => (
                                <Link className="group block text-decoration-none" to={`/product/${p.id}`} key={p.id}>
                                    <div className="aspect-[4/5] bg-surface mb-sm overflow-hidden relative">
                                        <img 
                                            alt={p.name} 
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-transform duration-700 ease-out" 
                                            src={p.imageUrl?.startsWith('http') ? p.imageUrl : `${IMAGE_BASE_URL}${p.imageUrl}`} 
                                        />
                                    </div>
                                    <h4 className="font-body-md text-sm text-primary font-bold uppercase tracking-tight mb-1">{p.name}</h4>
                                    <p className="font-body-md text-sm text-secondary">{(p.price).toLocaleString()} ₫</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default BlogDetail;
