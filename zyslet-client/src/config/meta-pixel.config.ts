/**
 * Meta Pixel (Facebook Pixel) configuration
 *
 * This file centralizes Meta Pixel settings for the application.
 * Set your actual Meta Pixel ID in the .env file as NEXT_PUBLIC_META_PIXEL_ID
 */

// Meta Pixel ID - uses environment variable NEXT_PUBLIC_META_PIXEL_ID
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

// Automatically track page views when routes change
export const AUTO_TRACK_PAGE_VIEWS = true;

// Debug mode: true during development to see pixel events in console
// Make sure this is false in production
export const META_PIXEL_DEBUG = process.env.NODE_ENV === 'development';

/**
 * Helper function to initialize debug mode for Meta Pixel
 */
export function initDebugMode() {
    if (typeof window !== 'undefined' && META_PIXEL_DEBUG) {
        // Log that debug mode is enabled
        console.log('Meta Pixel Debug Mode Enabled');

        // Add a listener to log all fbq calls
        const originalFbq = window.fbq;
        window.fbq = function (...args: any[]) {
            if (process.env.NODE_ENV === 'development') {
                console.group('Meta Pixel Event:');
                console.log(...args);
                console.groupEnd();
            }
            return originalFbq?.(...args);
        };
    }
}
