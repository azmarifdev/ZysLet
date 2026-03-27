'use client';

import { useEffect } from 'react';
import {
    trackProductView,
    trackSearch,
    trackAddToCart,
    trackRemoveFromCart,
    trackBundleSelection,
    trackProductClick,
    trackEngagement,
} from '@/lib/gtm';

/**
 * Custom hook to track product views in Google Tag Manager
 * @param product - The product to track
 * @param isReady - Optional flag to determine if the tracking should occur
 */
export const useProductViewTracking = (product: any, isReady: boolean = true) => {
    useEffect(() => {
        // Only track the view if the product is valid and ready flag is true
        if (isReady && product && (product.id || product._id)) {
            trackProductView(product);
        }
    }, [product, isReady]);
};

/**
 * Custom hook to track search queries in Google Tag Manager
 * @param searchQuery - The search query string
 * @param resultCount - The number of search results
 * @param isReady - Optional flag to determine if the tracking should occur
 */
export const useSearchTracking = (searchQuery: string, resultCount: number, isReady: boolean = true) => {
    useEffect(() => {
        // Only track the search if there's a query and ready flag is true
        if (isReady && searchQuery && searchQuery.trim().length > 0) {
            trackSearch(searchQuery, resultCount);
        }
    }, [searchQuery, resultCount, isReady]);
};

/**
 * Custom hook to track filter usage in Google Tag Manager
 * @param filterName - Name of the filter (category, price, etc.)
 * @param filterValue - Value selected
 * @param isApplied - Whether the filter is applied or removed
 */
export const useFilterTracking = (
    filterName: string,
    filterValue: string | number | Array<string | number>,
    isApplied: boolean,
) => {
    useEffect(() => {
        if (filterName && filterValue !== undefined && isApplied) {
            trackEngagement('apply_filter', {
                filter_name: filterName,
                filter_value: filterValue,
                filter_applied: true,
            });
        }
    }, [filterName, filterValue, isApplied]);
};

/**
 * Custom hook to track bundle selection in Google Tag Manager
 * @param bundleProducts - Array of products in the bundle
 * @param hasFreeShipping - Whether the bundle has free shipping
 * @param totalPrice - Total price of the bundle
 * @param isSelected - Whether the bundle is selected
 */
export const useBundleSelectionTracking = (
    bundleProducts: any[],
    hasFreeShipping: boolean,
    totalPrice: number,
    isSelected: boolean,
) => {
    useEffect(() => {
        if (isSelected && bundleProducts && bundleProducts.length > 0) {
            trackBundleSelection(bundleProducts, hasFreeShipping, totalPrice);
        }
    }, [bundleProducts, hasFreeShipping, totalPrice, isSelected]);
};

/**
 * Custom hook to create add to cart tracking functions
 * @returns Object with addToCart and removeFromCart functions
 */
export const useCartTracking = () => {
    const addToCart = (product: any, quantity: number = 1) => {
        trackAddToCart(product, quantity);
    };

    const removeFromCart = (product: any, quantity: number = 1) => {
        trackRemoveFromCart(product, quantity);
    };

    return {
        addToCart,
        removeFromCart,
    };
};

/**
 * Wrapper function to track product clicks
 * @param product - The product being clicked
 * @param position - The position of the product in the list
 * @param listName - The name of the list containing the product
 */
export const trackProductClickEvent = (product: any, position: number, listName: string = 'Product List') => {
    trackProductClick(product, position, listName);
};
