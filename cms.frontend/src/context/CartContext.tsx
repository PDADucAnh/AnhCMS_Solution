import React, { createContext, useState, useContext, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import type { Product } from '../types/product';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      const currentQty = existingItem ? existingItem.quantity : 0;
      const requestedQty = currentQty + quantity;
      const maxStock = product.stockQuantity;

      if (requestedQty > maxStock) {
        const cappedQty = Math.max(maxStock, 0);
        if (cappedQty <= 0) return prevItems;
        if (existingItem) {
          return prevItems.map((item) =>
            item.id === product.id ? { ...item, quantity: cappedQty } : item
          );
        }
        return [...prevItems, { ...product, quantity: cappedQty }];
      }

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: requestedQty } : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.discountPrice || item.price) * item.quantity, 0);
  }, [cartItems]);

  const contextValue = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
