import React, { useState } from 'react';
import ShopSidebar from './ShopSidebar';
import ShopHeader from './ShopHeader';
import ProductList from './ProductList';
import { useProducts } from '../../hooks/useProducts';

const ShopPage: React.FC = () => {
  const { data: products = [], isLoading, error } = useProducts();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const filteredProducts = selectedCategoryId
    ? products.filter((p: any) => p.categoryProductId === selectedCategoryId)
    : products;

  const handleCategoryChange = (id: number | null) => {
    setSelectedCategoryId(id);
  };

  return (
    <div className="bg-background text-on-background font-body-md antialiased pt-20">
      <main className="max-w-[1440px] mx-auto px-margin py-xl">
        <header className="mb-xl text-center space-y-md">
            <h3 className="text-label-sm uppercase tracking-[0.3em] text-secondary">Curated Boutique</h3>
            <h2 className="font-display-xl text-display-xl uppercase tracking-tighter">The Collection</h2>
            <div className="w-12 h-0.5 bg-primary mx-auto"></div>
        </header>

        <div className="flex flex-col lg:flex-row gap-xl">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <ShopSidebar onCategoryChange={handleCategoryChange} activeId={selectedCategoryId} />
          </aside>

          <div className="flex-1 space-y-lg">
            <ShopHeader count={filteredProducts.length} />
            <ProductList products={filteredProducts} isLoading={isLoading} error={error ? "Unable to curate the collection at this time." : null} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShopPage;
