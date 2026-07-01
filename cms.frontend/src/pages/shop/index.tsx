import React, { useState } from 'react';
import ShopSidebar from './ShopSidebar';
import ShopHeader from './ShopHeader';
import ProductList from './ProductList';
import Pagination from '../../components/Pagination';
import { useProductsPaged } from '../../hooks/useProducts';

const ShopPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const { data: paged, isLoading, error } = useProductsPaged(page, pageSize);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const products = paged?.items ?? [];
  const filteredProducts = selectedCategoryId
    ? products.filter((p: any) => p.categoryProductId === selectedCategoryId)
    : products;

  const handleCategoryChange = (id: number | null) => {
    setSelectedCategoryId(id);
    setPage(1);
  };

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-desktop py-stack-lg flex flex-col md:flex-row gap-gutter">
      <aside className="w-full md:w-64 flex-shrink-0">
        <ShopSidebar onCategoryChange={handleCategoryChange} activeId={selectedCategoryId} />
      </aside>
      <section className="flex-grow">
        <ShopHeader count={paged?.totalCount ?? 0} page={paged?.page} pageSize={paged?.pageSize} />
        <ProductList products={filteredProducts} isLoading={isLoading} error={error ? "Không thể tải bộ sưu tập vào lúc này." : null} />
        {!selectedCategoryId && paged && paged.totalPages > 1 && (
          <Pagination
            page={paged.page}
            totalPages={paged.totalPages}
            onPageChange={setPage}
          />
        )}
      </section>
    </div>
  );
};

export default ShopPage;
