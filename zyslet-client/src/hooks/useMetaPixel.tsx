'use client';

import {
    trackProductView,
    trackAddToCart,
    trackInitiateCheckout,
    trackPurchase,
    trackSearch,
    trackRegistration
} from '@/lib/meta-pixel';

/**
 * Custom hook to use Meta Pixel tracking throughout the application
 * This hook exposes various Meta Pixel tracking functions
 */
export const useMetaPixel = () => {
    return {
        /**
         * Track when a user views a product
         */
        trackProductView: (product: any) => {
            trackProductView(product);
        },

        /**
         * Track when a user adds product to cart
         */
        trackAddToCart: (product: any, quantity: number = 1) => {
            trackAddToCart(product, quantity);
        },

        /**
         * Track when a user initiates checkout
         */
        trackInitiateCheckout: (cartItems: any[], totalValue: number) => {
            trackInitiateCheckout(cartItems, totalValue);
        },

        /**
         * Track when a user completes a purchase
         */
        trackPurchase: (orderId: string, totalValue: number, cartItems: any[]) => {
            trackPurchase(orderId, totalValue, cartItems);
        },

        /**
         * Track when a user performs a search
         */
        trackSearch: (searchTerm: string) => {
            trackSearch(searchTerm);
        },

        /**
         * Track when a user completes registration
         */
        trackRegistration: (data?: any) => {
            trackRegistration(data);
        }
    };
};
