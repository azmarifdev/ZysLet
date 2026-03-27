'use client';

import { trackEngagement } from '@/lib/gtm';

/**
 * This utility provides GTM tracking for various user actions across the site
 * Use this to track engagement metrics not covered by standard ecommerce events
 */
export const trackActions = {
    /**
     * Track when a user shares a product
     * @param product - Product being shared
     * @param method - Sharing method (facebook, twitter, whatsapp, etc.)
     */
    shareProduct: (product: any, method: string) => {
        trackEngagement('share_product', {
            product_id: product.id || product._id,
            product_name: product.name || product.title,
            share_method: method,
        });
    },

    /**
     * Track when a user applies a filter on product listing
     * @param filterName - Name of the filter (category, price, etc.)
     * @param filterValue - Value selected
     */
    applyFilter: (filterName: string, filterValue: string | number) => {
        trackEngagement('apply_filter', {
            filter_name: filterName,
            filter_value: filterValue,
        });
    },

    /**
     * Track when a user sorts products
     * @param sortMethod - Sort method applied
     */
    sortProducts: (sortMethod: string) => {
        trackEngagement('sort_products', {
            sort_method: sortMethod,
        });
    },

    /**
     * Track when a user views a product image gallery
     * @param productId - ID of the product
     */
    viewGallery: (productId: string) => {
        trackEngagement('view_product_gallery', {
            product_id: productId,
        });
    },

    /**
     * Track when a user watches a product video
     * @param productId - ID of the product
     * @param videoUrl - URL of the video
     */
    watchVideo: (productId: string, videoUrl: string) => {
        trackEngagement('watch_product_video', {
            product_id: productId,
            video_url: videoUrl,
        });
    },

    /**
     * Track when a user signs up for a newsletter
     * @param source - Where the user signed up from
     */
    newsletterSignup: (source: string) => {
        trackEngagement('newsletter_signup', {
            signup_source: source,
        });
    },
};
