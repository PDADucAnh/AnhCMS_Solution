import React from 'react';
import { useBestSellingProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/ProductCard';

function BestSellingProducts() {
    const { data: products = [], isLoading } = useBestSellingProducts(3);

    if (isLoading) {
        return (
            <section className="px-margin mb-xl">
                <h2 className="font-display-xl text-headline-lg uppercase tracking-tight mb-lg">Bán chạy</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse bg-surface-container rounded-lg h-96" />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="px-margin mb-xl">
            <div className="flex justify-between items-end mb-lg">
                <div className="flex items-center gap-3">
                    <h2 className="font-display-xl text-headline-lg uppercase tracking-tight">Bán chạy</h2>
                    <span className="bg-error/10 text-error px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-widest animate-pulse">Bán chạy</span>
                </div>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">
                    Top ({products.length}) Sản phẩm
                </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                {products.map((product: any) => (
                    <ProductCard key={product.id} item={product} />
                ))}
                {products.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-surface-container-low border border-dashed border-outline-variant">
                        <span className="material-symbols-outlined text-4xl text-outline mb-md">whatshot</span>
                        <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">Chưa có dữ liệu bán chạy</p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default BestSellingProducts;
