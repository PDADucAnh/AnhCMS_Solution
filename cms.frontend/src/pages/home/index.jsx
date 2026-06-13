import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import categoryProductService from '../../services/categoryProductService';
import productService from '../../services/productService';
import postService from '../../services/postService';
import { useCart } from '../../context/CartContext';

function Home() {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [categoriesData, productsData, postsData] = await Promise.all([
                    categoryProductService.getAllCategoryProducts(),
                    productService.getAllProducts(),
                    postService.getAllPosts()
                ]);
                setCategories(categoriesData.slice(0, 4)); // Get top 4 categories
                setProducts(productsData.slice(0, 8));    // Get top 8 products
                setPosts(postsData.slice(0, 3));         // Get top 3 blog posts
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu trang chủ:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleBuyNow = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
        navigate('/cart');
    };

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
        alert(`Đã thêm [${product.name}] vào giỏ hàng!`);
    };

    return (
        <div className="bg-background text-on-background font-body-md antialiased pt-20">
            <style>{`
                .product-card-hover:hover .product-actions {
                    opacity: 1;
                    transform: translateY(0);
                }
                .product-actions {
                    opacity: 0;
                    transform: translateY(10px);
                    transition: all 0.3s ease;
                }
                .hero-zoom {
                    transition: transform 10s ease;
                }
                .hero-zoom:hover {
                    transform: scale(1.05);
                }
            `}</style>

            <Header />

            <main className="max-w-[1440px] mx-auto">
                {/* Hero Section */}
                <section className="relative h-[819px] min-h-[600px] w-full overflow-hidden flex items-center justify-center mb-xl">
                    <div className="absolute inset-0 w-full h-full">
                        <img 
                            alt="Hero Background" 
                            className="w-full h-full object-cover hero-zoom" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqDI7Mz7K5BTIU02aNjpBEWhHAMWivU705BjuekjOzaWv5Ncq4RVM6FLqCQVDkxlst2xznDkIgv_u3I5fCM_COlDOuu5MLopgMKY7TLultFzoPfCdPyoPYgr1Xh6S2cppro04Fx_Bgmph_P3RLcr61NOUPmk3vn7Agh9O-c6znHdPWdT12btWMVa5SQz4029qFLcomV-MB3IUWQINEZLRJUkU2Vo5Q4dEjSJxTNR04fNUX5G4p8twxUkYYOpTk9KvSPxL0JIJVF3o" 
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                    <div className="relative z-10 text-center px-margin max-w-3xl">
                        <h1 className="font-display-xl text-display-xl md:text-display-xl text-white mb-md tracking-tighter uppercase drop-shadow-md">THE NEW ELEGANCE</h1>
                        <p className="font-body-lg text-body-lg text-white mb-lg drop-shadow-md max-w-xl mx-auto">Discover the latest collection of meticulously crafted garments designed for the modern minimalist.</p>
                        <div className="flex flex-col sm:flex-row gap-md justify-center">
                            <button className="bg-primary text-on-primary px-8 py-4 font-label-sm text-label-sm uppercase tracking-widest hover:bg-surface hover:text-primary transition-colors border border-primary">Shop Now</button>
                            <button className="bg-transparent text-white px-8 py-4 font-label-sm text-label-sm uppercase tracking-widest border border-white hover:bg-white hover:text-primary transition-colors">New Collection</button>
                        </div>
                    </div>
                </section>

                {/* Featured Categories Bento Grid */}
                <section className="px-margin mb-xl">
                    <div className="flex justify-between items-end mb-lg">
                        <h2 className="font-display-xl text-headline-lg uppercase tracking-tight">Explore Collections</h2>
                        <a className="font-label-sm text-label-sm uppercase tracking-widest hover:text-secondary transition-colors border-b border-primary pb-1 text-decoration-none" href="/shop">View All</a>
                    </div>
                    {loading ? (
                        <div className="text-center py-5">Đang tải danh mục...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-gutter h-auto md:h-[600px]">
                            {categories.map((cat, index) => {
                                let gridClass = "relative group overflow-hidden bg-surface-container ";
                                if (index === 0) gridClass += "md:col-span-2 md:row-span-2";
                                else if (index === 1) gridClass += "md:col-span-1 md:row-span-1";
                                else if (index === 2) gridClass += "md:col-span-1 md:row-span-1";
                                else if (index === 3) gridClass += "md:col-span-2 md:row-span-1";

                                const images = [
                                    "https://lh3.googleusercontent.com/aida-public/AB6AXuBGAMEUGyi7BAtYKtIN7mG7onW4n-a5PazJf-YaxZV9iBk44BOVkkv1XKQdoOtN3_g9hyvzG-Cv1dYlYmK-Szui4mQTGyAgmikP-w9lbLQvqHHCds7lfRef1cFv0xaYzeOV9ZYmJFPT5UPc8L_fwGsoOWFK5oKGQ1JCgTUWurRCvabzLVZ6t7AGBYuxVNOyYs2JJm2q3pMLls7s0YWKuqM2fFG3tNRZqkLGfnyUyogsMnIhoie2BPvih61gR5XjYXw37LY5_PQAJrg",
                                    "https://lh3.googleusercontent.com/aida-public/AB6AXuD7o83OdBSL00spRLB_PSxzTKGuETouzh_iep36GPNgDrTmXuzB4E31kwpk5cybYGABwMfT3JbX1ak5Skjnrx-5HUjXrlrg2jYWq7GjxXBidYaTTursLMTLIhRB1FcZ8tE3e5hX1afQGsNqsY8dOSZtQ0_KsKlWIz7lBJFEnsKcLL7m7Wo0UsLRTR3RxdtA_urgZyhvOYln59pdk2hJICXYwG7_ZsRBXKyGdYj1VhZYGFAgLY3RngCrBGsGA-j0E8qWRN93aSNuuNU",
                                    "https://lh3.googleusercontent.com/aida-public/AB6AXuDgijSvfgGKtrYidAhPb0Uq_AUOg9lYnPyld4jUMWJ6NF9l9nVOrh4SjDRk_5tsmVO3yc-AanICnNUukuGgjDP9N9r7IuIEKIPB6BnSqnSZDEzOcW7FKMPVYuPRvCdqDRaufC_jRYquJau4qG43d0Hf5hldqd8W386IChUyX_gekzNH4R3kSj4Q3LgP1WqW2wQtAQuOGOyW0dSKBIMpwexdnkaG2lUVGw7w-CFmxh1HOQygH5ZpquaZVNZJ8Prf4T8mQ0YJwFTQNAU",
                                    "https://lh3.googleusercontent.com/aida-public/AB6AXuA-NH48lrH3f0AztoNZXQjISK6l9oed5jcg8qYToPNcZXgvbZ6uAADXQAd91Rn_h6Rn6lmQRuNTIi4cjZW0ZV2EF2g42_QupKrCrbG9QDQLIEf9XZW6L0MTOWg7D-Ex2nrSVKfJIwLndEFb81PR6z_0Ix543Rqz6geopwVDyTrt95yhxvyNUoHIBAKDpfHKqCybVN2aTWCHbmifSXeVhFlFsfcV_2pc7Wg8Aq4qHJ7pfsLM0mcR5wI-iQUxUTlRKzbZzEmSwEVbT5c"
                                ];

                                return (
                                    <div className={gridClass} key={cat.id}>
                                        <img 
                                            alt={cat.name} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                            src={cat.imageUrl || images[index % 4]} 
                                        />
                                        <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:bg-black/20"></div>
                                        <div className="absolute bottom-margin left-margin">
                                            <h3 className="font-display-xl text-headline-sm text-white uppercase tracking-wider mb-xs">{cat.name}</h3>
                                            <Link to={`/shop?category=${cat.id}`} className="font-label-sm text-label-sm text-white uppercase tracking-widest border-b border-white pb-1 inline-block opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-decoration-none">Shop Category</Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* Trending Products */}
                <section className="px-margin mb-xl">
                    <div className="flex justify-between items-end mb-lg">
                        <h2 className="font-display-xl text-headline-lg uppercase tracking-tight">Trending Now</h2>
                    </div>
                    {loading ? (
                        <div className="text-center py-5">Đang tải sản phẩm...</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-gutter">
                            {products.map((product) => (
                                <Link to={`/product/${product.id}`} className="product-card-hover group cursor-pointer pb-md text-decoration-none block" key={product.id}>
                                    <div className="relative aspect-[4/5] bg-surface-container mb-sm overflow-hidden">
                                        <img 
                                            alt={product.name} 
                                            className="w-full h-full object-cover" 
                                            src={product.imageUrl || "https://via.placeholder.com/400x500"} 
                                        />
                                        {product.isNew && (
                                            <div className="absolute top-xs left-xs bg-transparent border border-primary px-2 py-1">
                                                <span className="font-label-sm text-label-sm text-primary uppercase">New</span>
                                            </div>
                                        )}
                                        {product.discountPrice > 0 && (
                                            <div className="absolute top-xs left-xs bg-transparent border border-primary px-2 py-1">
                                                <span className="font-label-sm text-label-sm text-primary uppercase">-{Math.round((1 - product.discountPrice / product.price) * 100)}%</span>
                                            </div>
                                        )}
                                        <div className="product-actions absolute bottom-0 left-0 w-full p-sm flex flex-col gap-xs bg-gradient-to-t from-black/80 to-transparent">
                                            <div className="flex gap-xs w-full">
                                                <button 
                                                    className="flex-1 bg-surface text-primary py-2 font-label-sm text-label-sm uppercase hover:bg-primary hover:text-white transition-colors border-0"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); /* Quick View Logic */ }}
                                                >
                                                    Quick View
                                                </button>
                                                <button 
                                                    className="bg-primary text-on-primary p-2 flex items-center justify-center hover:bg-surface hover:text-primary transition-colors border-0"
                                                    onClick={(e) => handleAddToCart(e, product)}
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                                                </button>
                                            </div>
                                            <button 
                                                className="w-full bg-white text-primary py-2 font-label-sm text-label-sm uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all duration-300 border-0"
                                                onClick={(e) => handleBuyNow(e, product)}
                                            >
                                                Mua ngay
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-body-md text-body-md text-primary font-medium">{product.name}</h3>
                                            <div className="flex gap-2 items-center mt-1">
                                                <p className="font-body-md text-body-md text-primary">
                                                    {(product.discountPrice || product.price).toLocaleString()} ₫
                                                </p>
                                                {product.discountPrice > 0 && (
                                                    <p className="font-body-md text-body-md text-secondary line-through text-sm">
                                                        {product.price.toLocaleString()} ₫
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* Fashion Trends Section (XU HƯỚNG THỜI TRANG) */}
                <section className="px-margin mb-xl py-xl bg-surface">
                    <div className="text-center mb-xl">
                        <h2 className="font-display-xl text-headline-lg uppercase tracking-tight mb-sm">XU HƯỚNG THỜI TRANG</h2>
                        <p className="text-secondary font-body-md max-w-xl mx-auto">Cập nhật những mẹo phối đồ và tin tức phong cách mới nhất cùng AnhCMS.Fashion</p>
                        <div className="w-12 h-0.5 bg-primary mx-auto mt-md"></div>
                    </div>
                    {loading ? (
                        <div className="text-center py-5">Đang tải tin tức...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                            {posts.map((post) => (
                                <Link to={`/blog/${post.id}`} className="group cursor-pointer text-decoration-none" key={post.id}>
                                    <div className="aspect-[4/3] overflow-hidden mb-md bg-surface-container">
                                        <img 
                                            alt={post.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                            src={post.imageUrl || "https://via.placeholder.com/600x450"} 
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 text-secondary text-xs mb-2">
                                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                                        <span className="font-label-sm">{new Date(post.createdAt || Date.now()).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <h3 className="font-display-xl text-headline-sm mb-sm group-hover:text-secondary transition-colors text-primary">{post.title}</h3>
                                    <p className="text-secondary text-sm line-clamp-2 mb-md">{post.summary || post.content?.replace(/<[^>]*>?/gm, '').slice(0, 150)}</p>
                                    <span className="font-label-sm text-label-sm uppercase tracking-widest border-b border-primary pb-1 hover:text-secondary transition-colors inline-block">Đọc bài viết →</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Home;
