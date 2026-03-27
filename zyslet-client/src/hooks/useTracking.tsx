'use client';

import { useEffect } from 'react';
import { trackProductView, trackSearch } from '@/lib/gtm';

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
