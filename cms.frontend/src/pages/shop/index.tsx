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
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-desktop py-stack-lg flex flex-col md:flex-row gap-gutter">
      <aside className="w-full md:w-64 flex-shrink-0">
        <ShopSidebar onCategoryChange={handleCategoryChange} activeId={selectedCategoryId} />
      </aside>
      <section className="flex-grow">
        <ShopHeader count={filteredProducts.length} />
        <ProductList products={filteredProducts} isLoading={isLoading} error={error ? "Unable to curate the collection at this time." : null} />
      </section>
    </div>
  );
};

export default ShopPage;
