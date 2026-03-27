'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import CartAnimation from './index';

interface Position {
    x: number;
    y: number;
}

interface CartAnimationItem {
    id: string;
    productImage: string;
    productName: string;
    startPosition: Position;
    endPosition: Position;
}

interface CartAnimationContextType {
    // eslint-disable-next-line no-unused-vars
    addAnimation: (productImage: string, productName: string, startPosition: Position) => void;
}

const CartAnimationContext = createContext<CartAnimationContextType | undefined>(undefined);

export const CartAnimationProvider = ({ children }: { children: ReactNode }) => {
    const [animations, setAnimations] = useState<CartAnimationItem[]>([]);
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const [cartButtonPosition, setCartButtonPosition] = useState<Position>({ x: 0, y: 0 });

    // Update cart button position whenever window is resized
    React.useEffect(() => {
        const updateCartButtonPosition = () => {
            // Find the cart button in the navbar
            const cartButton = document.querySelector('[aria-label="Shopping cart"]');
            if (cartButton) {
                const rect = cartButton.getBoundingClientRect();
                setCartButtonPosition({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                });
            }
        };

        // Initial position
        updateCartButtonPosition();

        // Update on resize
        window.addEventListener('resize', updateCartButtonPosition);
        return () => {
            window.removeEventListener('resize', updateCartButtonPosition);
        };
    }, []);

    // Function to add a new animation
    const addAnimation = useCallback((productImage: string, productName: string, startPosition: Position) => {
        // Update cart button position to ensure it's current
        const cartButton = document.querySelector('[aria-label="Shopping cart"]');
        if (cartButton) {
            const rect = cartButton.getBoundingClientRect();
            const endPosition = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
            };

            const newAnimation: CartAnimationItem = {
                id: Date.now().toString(),
                productImage: productImage || '', // Ensure we have a string
                productName: productName || 'Product',
                startPosition,
                endPosition,
            };

            setAnimations((prev) => [...prev, newAnimation]);
        }
    }, []);

    // Function to remove animation after completion
    const removeAnimation = useCallback((id: string) => {
        setAnimations((prev) => prev.filter((animation) => animation.id !== id));
    }, []);

    return (
        <CartAnimationContext.Provider value={{ addAnimation }}>
            {children}
            {animations.map((animation) => (
                <CartAnimation
                    key={animation.id}
                    productImage={animation.productImage}
                    productName={animation.productName}
                    startPosition={animation.startPosition}
                    endPosition={animation.endPosition}
                    onAnimationComplete={() => removeAnimation(animation.id)}
                />
            ))}
        </CartAnimationContext.Provider>
    );
};

export const useCartAnimation = () => {
    const context = useContext(CartAnimationContext);
    if (context === undefined) {
        throw new Error('useCartAnimation must be used within a CartAnimationProvider');
    }
    return context;
};
