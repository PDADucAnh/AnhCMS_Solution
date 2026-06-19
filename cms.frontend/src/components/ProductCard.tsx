import React, { type MouseEvent } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/apiUtils';
import type { Product } from '../types/product';

interface ProductCardProps {
  item: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const imageUrl = getImageUrl(item.imageUrl);

    const handleDirectBuy = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(item);
        navigate('/checkout');
    };

    const handleAddToCart = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(item);
    };

    return (
        <div className="group cursor-pointer pb-md flex flex-col h-full">
            <div className="relative aspect-[4/5] bg-surface-container mb-sm overflow-hidden">
                <Link to={`/product/${item.id}`}>
                    <img 
                        src={imageUrl}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        alt={item.name}
                    />
                </Link>
                
                {item.stockQuantity <= 5 && (
                    <div className="absolute top-xs left-xs bg-transparent border border-primary px-2 py-1">
                        <span className="font-label-sm text-[10px] text-primary uppercase tracking-widest font-medium">Limited / {item.stockQuantity} Left</span>
                    </div>
                )}

                <div className="absolute bottom-0 left-0 w-full p-sm flex flex-col gap-xs bg-gradient-to-t from-black/50 to-transparent opacity-0 translate-y-[10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
                    <div className="flex gap-xs">
                        <Link to={`/product/${item.id}`} className="flex-1 bg-surface text-primary py-2 font-label-sm text-[10px] text-center uppercase tracking-widest border border-transparent text-decoration-none btn-luxury btn-overlay-luxury">Quick View</Link>
                        <button 
                            className="bg-primary text-on-primary p-2 flex items-center justify-center border border-primary outline-none btn-luxury btn-overlay-luxury"
                            onClick={handleAddToCart}
                        >
                            <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                        </button>
                    </div>
                    <button 
                        onClick={handleDirectBuy}
                        className="w-full bg-white text-black py-2 font-label-sm text-[10px] uppercase tracking-widest border-0 outline-none btn-luxury btn-overlay-luxury"
                    >
                        Direct Buy
                    </button>
                </div>
            </div>
            <div className="flex justify-between items-start mt-2">
                <div className="space-y-1">
                    <h3 className="font-body-md text-sm text-primary font-bold uppercase tracking-tight leading-none truncate w-48">
                        <Link to={`/product/${item.id}`} className="text-primary text-decoration-none">{item.name}</Link>
                    </h3>
                    <p className="font-body-md text-sm text-secondary">{formatCurrency(item.price)}</p>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
