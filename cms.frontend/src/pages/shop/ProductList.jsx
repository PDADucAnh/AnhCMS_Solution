import React from 'react';
import LoadingOrEmpty from './LoadingOrEmpty';
import ProductCard from '../../components/ProductCard';

const ProductList = ({ products, isLoading, error }) => {
  if (isLoading) {
    return <LoadingOrEmpty isLoading={true} />;
  }

  if (error) {
    return <div className="col-12 alert alert-danger">{error}</div>;
  }

  if (!products || products.length === 0) {
    return <LoadingOrEmpty message="Chưa có sản phẩm nào trong mục này." />;
  }

  return (
    <div className="row w-100">
      {products.map((product) => (
        <div className="col-xl-4 col-md-6 col-12 mb-4" key={product.id}>
          <ProductCard item={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductList;
