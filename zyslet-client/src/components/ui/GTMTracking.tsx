'use client';

import { useEffect } from 'react';
import { trackProductClick } from '@/lib/gtm';

interface ProductCardWithTrackingProps {
  product: any;
  position: number;
  listName?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

/**
 * A wrapper component that adds GTM tracking to product card clicks
 * Used to track when users click on product cards to navigate to product pages
 */
export function ProductCardWithTracking({
  product,
  position,
  listName = 'Product List',
  children,
  onClick
}: ProductCardWithTrackingProps) {
  
  const handleClick = () => {
    // Track the product click in GTM
    trackProductClick(product, position, listName);
    
    // Call the original onClick handler if provided
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <div onClick={handleClick}>
      {children}
    </div>
  );
}

/**
 * A utility component to send page view events to GTM
 * This can be used on pages that don't automatically track page views
 */
export function PageViewTracker({ path, title }: { path?: string, title?: string }) {
  useEffect(() => {
    // Import dynamically to avoid SSR issues
    import('@/lib/gtm').then(({ pageView }) => {
      const url = path || window.location.pathname + window.location.search;
      pageView(url, title);
    });
  }, [path, title]);
  
  return null; // This component doesn't render anything
}

/**
 * A utility hook to track outbound link clicks
 * @param {string} label - A label for the outbound link
 * @returns {(url: string) => void} - A function to call when the link is clicked
 */
export function useOutboundLinkTracking(label: string) {
  return (url: string) => {
    import('@/lib/gtm').then(({ pushEvent }) => {
      pushEvent({
        event: 'outbound_link_click',
        link_url: url,
        link_label: label
      });
    });
  };
}
