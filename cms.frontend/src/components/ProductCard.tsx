import React, { type MouseEvent } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/apiUtils';
import type { Product } from '../types/product';

interface ProductCardProps {
  item: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
    const { addToCart } = useCart();

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const imageUrl = getImageUrl(item.imageUrl);

    const handleAddToCart = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(item);
    };

    return (
        <article className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-[0px_4px_20px_rgba(171,44,93,0.02)] transition-shadow duration-300 hover:shadow-[0px_8px_30px_rgba(171,44,93,0.08)] group flex flex-col">
            <Link to={`/product/${item.id}`} className="no-underline">
                <div className="relative w-full h-80 overflow-hidden bg-surface-variant">
                    <img
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src={imageUrl}
                        alt={item.name}
                    />
                    {item.stockQuantity <= 5 && (
                        <div className="absolute top-2 left-2 bg-primary/90 text-on-primary px-2 py-1 rounded text-[10px] font-label-sm uppercase tracking-widest">
                            Only {item.stockQuantity} left
                        </div>
                    )}
                </div>
            </Link>
            <div className="p-4 flex flex-col items-center text-center flex-grow">
                <Link to={`/product/${item.id}`} className="no-underline">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">{item.name}</h3>
                </Link>
                <p className="font-body-md text-body-md text-on-surface-variant mb-4 flex-grow">
                    {item.description ? item.description.substring(0, 60) + (item.description.length > 60 ? '...' : '') : 'Premium floral arrangement'}
                </p>
                <p className="font-headline-sm text-headline-sm text-primary mb-4">{formatCurrency(item.price)}</p>
                <button
                    onClick={handleAddToCart}
                    className="w-full px-6 py-3 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center justify-center gap-2 border-0 cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                    Add to Cart
                </button>
            </div>
        </article>
    );
}

export default ProductCard;
