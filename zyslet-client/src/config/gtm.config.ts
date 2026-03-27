/**
 * Google Tag Manager configuration
 *
 * This file centralizes GTM settings for the application.
 * When deploying to production, update the GTM_ID with your actual GTM container ID.
 */

// GTM container ID - uses environment variable NEXT_PUBLIC_GTM_ID
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';

// Automatically track page views when routes change
export const AUTO_TRACK_PAGE_VIEWS = true;

// Enhanced ecommerce settings
export const ECOMMERCE_SETTINGS = {
    // Currency used across the application
    currency: 'BDT',

    // Product list identifiers - used to categorize where users are viewing products
    productLists: {
        HOME_PAGE: 'Home Page Products',
        CATEGORY_PAGE: 'Category Page',
        SEARCH_RESULTS: 'Search Results',
        RELATED_PRODUCTS: 'Related Products',
        BUNDLE_PRODUCTS: 'Bundle Products',
    },

    // Custom dimensions and metrics
    customDimensions: {
        CUSTOMER_TYPE: 'customer_type',
        USER_REGION: 'user_region',
    },
};

// Debug mode: set to true during development to see data layer events in console
// Make sure this is false in production
export const GTM_DEBUG = process.env.NODE_ENV === 'development';

/**
 * Helper function to initialize debug mode for GTM
 */
export function initDebugMode() {
    if (typeof window !== 'undefined' && GTM_DEBUG) {
        // Add dataLayer event listener for debugging
        window.dataLayer = window.dataLayer || [];
        const originalPush = Array.prototype.push;

        window.dataLayer.push = function (...args: any[]) {
            if (process.env.NODE_ENV === 'development') {
                console.group('GTM Data Layer Event:');
                console.log(...args);
                console.groupEnd();
            }
            return originalPush.apply(this, args);
        };

        console.info('GTM Debug Mode: Enabled');
    }
}
