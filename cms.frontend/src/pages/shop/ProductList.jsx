import React from 'react';
import LoadingOrEmpty from './LoadingOrEmpty';
import ProductCard from '../../components/ProductCard';

const ProductList = ({ products, isLoading, error }) => {
  if (isLoading) {
    return <LoadingOrEmpty isLoading={true} />;
  }

  if (error) {
    return (
        <div className="p-lg bg-error-container text-error text-label-sm uppercase tracking-widest font-bold text-center border border-error">
            {error}
        </div>
    );
  }

  if (!products || products.length === 0) {
    return <LoadingOrEmpty message="The curator has not yet added items to this division." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
      {products.map((product) => (
          <ProductCard key={product.id} item={product} />
      ))}
    </div>
  );
};

export default ProductList;
