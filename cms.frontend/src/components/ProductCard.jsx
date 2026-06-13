import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const IMAGE_BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7224";

function ProductCard({ item }) {
    const { addToCart } = useCart();
    
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const imageUrl = item.imageUrl?.startsWith('http') 
        ? item.imageUrl 
        : `${IMAGE_BASE_URL}${item.imageUrl || ''}`;

    return (
        <div className="group cursor-pointer pb-md flex flex-col h-full">
            <div className="relative aspect-[4/5] bg-surface-container mb-sm overflow-hidden">
                <Link to={`/product/${item.id}`}>
                    <img 
                        src={imageUrl}
                        className="w-full h-full object-cover transition-transform duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105" 
                        alt={item.name}
                    />
                </Link>
                
                {item.stockQuantity <= 5 && (
                    <div className="absolute top-xs left-xs bg-transparent border border-error px-2 py-1">
                        <span className="font-label-sm text-[10px] text-error uppercase tracking-widest">Limited / {item.stockQuantity} Left</span>
                    </div>
                )}

                <div className="absolute bottom-0 left-0 w-full p-sm flex gap-xs bg-gradient-to-t from-black/50 to-transparent opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <Link to={`/product/${item.id}`} className="flex-1 bg-surface text-primary py-2 font-label-sm text-[10px] text-center uppercase tracking-widest hover:bg-primary hover:text-white transition-colors border border-transparent hover:border-primary text-decoration-none">Quick View</Link>
                    <button 
                        className="bg-primary text-on-primary p-2 flex items-center justify-center hover:bg-surface hover:text-primary transition-colors border border-primary outline-none"
                        onClick={() => {
                            addToCart(item);
                            // We could use a more elegant toast notification here
                        }}
                    >
                        <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
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
