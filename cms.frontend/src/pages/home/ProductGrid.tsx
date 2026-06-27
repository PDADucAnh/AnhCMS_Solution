import React, { useState } from 'react';
import { useProductsPaged } from '../../hooks/useProducts';
import ProductCard from '../../components/ProductCard';
import Pagination from '../../components/Pagination';

interface ProductGridProps {
  categoryId: number | null;
}

function ProductGrid({ categoryId }: ProductGridProps) {
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const { data: paged, isLoading } = useProductsPaged(page, pageSize);

  if (isLoading) {
    return (
      <div className="px-margin my-xl text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="size-12 bg-surface-container rounded-full mb-md"></div>
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">Curating Collection...</p>
        </div>
      </div>
    );
  }

  const displayProducts = categoryId
    ? (paged?.items ?? []).filter((p: any) => p.categoryProductId === categoryId)
    : (paged?.items ?? []);

  return (
    <section className="px-margin mb-xl">
      <div className="flex justify-between items-end mb-lg">
        <h2 className="font-display-xl text-headline-lg uppercase tracking-tight">Trending Now</h2>
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">
          Displaying ({paged?.totalCount ?? 0}) Pieces
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-gutter">
        {displayProducts.map((product: any) => (
          <ProductCard key={product.id} item={product} />
        ))}
        {displayProducts.length === 0 && (
          <div className="col-span-full text-center py-20 bg-surface-container-low border border-dashed border-outline-variant">
            <span className="material-symbols-outlined text-4xl text-outline mb-md">inventory_2</span>
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">No pieces found in this collection</p>
          </div>
        )}
      </div>

      {!categoryId && paged && (
        <Pagination
          page={paged.page}
          totalPages={paged.totalPages}
          onPageChange={setPage}
        />
      )}
    </section>
  );
}

export default ProductGrid;
