import React from 'react';
import { useLatestProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/ProductCard';

function LatestProducts() {
    const { data: products = [], isLoading } = useLatestProducts(3);

    if (isLoading) {
        return (
            <section className="px-margin mb-xl">
                <h2 className="font-display-xl text-headline-lg uppercase tracking-tight mb-lg">New Arrivals</h2>
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
                <h2 className="font-display-xl text-headline-lg uppercase tracking-tight">New Arrivals</h2>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">
                    Latest ({products.length}) Pieces
                </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                {products.map((product: any) => (
                    <ProductCard key={product.id} item={product} />
                ))}
                {products.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-surface-container-low border border-dashed border-outline-variant">
                        <span className="material-symbols-outlined text-4xl text-outline mb-md">inventory_2</span>
                        <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">No new arrivals yet</p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default LatestProducts;
