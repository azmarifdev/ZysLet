/* eslint-disable no-unused-vars */
'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { trackAddToCart as trackMetaPixelAddToCart } from '@/lib/meta-pixel';
import { trackAddToCart, trackRemoveFromCart } from '@/lib/gtm';
import { trackAddToCart as trackServerAddToCart } from '@/lib/server-tracking';

interface CartItem {
    id: string;
    name: string;
    price: number; // This should be the discounted/sale price
    originalPrice?: number; // Original price before discount
    discount?: number;
    quantity: number;
    image: string;
    attribute?: {
        title: string;
        value: string;
    }[];
    is_free_shipping?: boolean;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: any, quantity: number) => void;
    updateQuantity: (id: string, quantity: number) => void;
    removeItem: (id: string) => void;
    itemCount: number;
    cartTotal: number;
    originalTotal: number;
    totalSavings: number;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from localStorage on mount (only once)
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                if (Array.isArray(parsedCart)) {
                    setCartItems(parsedCart);
                }
            } catch (error) {
                console.error('Failed to parse cart from localStorage:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever cartItems change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product: any, quantity: number) => {
        if (!product || quantity < 1) return;

        trackMetaPixelAddToCart(product, quantity);
        trackAddToCart(product, quantity);
        trackServerAddToCart(product, quantity);

        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id);

            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === product.id
                        ? {
                              ...item,
                              quantity: item.quantity + quantity,
                              attribute: product.attribute || item.attribute, // update attribute if new one is passed
                          }
                        : item,
                );
            } else {
                // Use provided original price, or calculate it if not provided
                const originalPrice =
                    product.originalPrice ||
                    (product.discount && product.discount > 0
                        ? Math.round(product.price / (1 - product.discount / 100))
                        : product.price);

                const newItem: CartItem = {
                    id: product.id,
                    name: product.name,
                    price: product.price, // This is already the discounted price
                    originalPrice: originalPrice,
                    quantity,
                    discount: product.discount,
                    image: product.image || '',
                    attribute: product.attribute || [],
                    is_free_shipping: product.is_free_shipping || false,
                };
                return [...prevItems, newItem];
            }
        });
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return;

        setCartItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)));
    };

    const removeItem = (id: string) => {
        const item = cartItems.find((item) => item.id === id);
        if (item) {
            trackRemoveFromCart(item, item.quantity);
        }

        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const { itemCount, cartTotal, originalTotal, totalSavings } = useMemo(() => {
        const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const total = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0); // Using discounted price
        const originalSum = cartItems.reduce((sum, item) => {
            const itemOriginalPrice = item.originalPrice || item.price;
            return sum + item.quantity * itemOriginalPrice;
        }, 0);
        const savings = originalSum - total;

        return {
            itemCount: count,
            cartTotal: total,
            originalTotal: originalSum,
            totalSavings: savings,
        };
    }, [cartItems]);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                updateQuantity,
                removeItem,
                itemCount,
                cartTotal,
                originalTotal,
                totalSavings,
                isCartOpen,
                setIsCartOpen,
            }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
