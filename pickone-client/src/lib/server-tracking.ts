/**
 * Server-side Facebook Conversion API tracker
 *
 * This utility sends events to the server which then forwards them to Facebook's Conversion API.
 * This provides a more reliable way to track events even if client-side tracking is blocked.
 */

// Helper function to send tracking data to the server
export const sendServerTrackingEvent = async (data: any) => {
    try {
        // Get current URL for event source URL
        const sourceUrl = typeof window !== 'undefined' ? window.location.href : '';

        // Use server domain for API calls in production
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://server.zyslet.com';
        const endpoint = `${baseUrl}/api/v1/tracking/event`;

        // Send the event data to the server endpoint
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                sourceUrl,
            }),
            // Don't wait for the response to avoid blocking the UI
            // The tracking should happen in the background
            keepalive: true,
        });

        return response.ok;
    } catch (error) {
        // Silently fail to avoid disrupting user experience
        console.error('Error sending server-side tracking event:', error);
        return false;
    }
};

// Track product view
export const trackProductView = (product: any) => {
    if (!product) return;

    sendServerTrackingEvent({
        eventName: 'ViewContent',
        products: [
            {
                id: product.id || product._id,
                name: product.title || product.name,
                price: calculateProductPrice(product),
                quantity: 1,
            },
        ],
        value: calculateProductPrice(product),
        eventData: {
            eventId: `pv_${product.id || product._id}_${Date.now()}`,
        },
    });
};

// Track add to cart
export const trackAddToCart = (product: any, quantity: number) => {
    if (!product) return;

    sendServerTrackingEvent({
        eventName: 'AddToCart',
        products: [
            {
                id: product.id || product._id,
                name: product.title || product.name,
                price: calculateProductPrice(product),
                quantity: quantity,
            },
        ],
        value: calculateProductPrice(product) * quantity,
        eventData: {
            eventId: `cart_${product.id || product._id}_${Date.now()}`,
        },
    });
};

// Track search
export const trackSearch = (searchTerm: string) => {
    if (!searchTerm) return;

    sendServerTrackingEvent({
        eventName: 'Search',
        searchTerm: searchTerm,
        eventData: {
            eventId: `search_${Date.now()}`,
        },
    });
};

// Track filter usage
export const trackFilter = (filterData: any) => {
    if (!filterData) return;

    sendServerTrackingEvent({
        eventName: 'Filter',
        filterData: filterData,
        eventData: {
            eventId: `filter_${Date.now()}`,
        },
    });
};

// Track bundle selection
export const trackBundleSelection = (products: any[], totalValue: number) => {
    if (!products || !products.length) return;

    sendServerTrackingEvent({
        eventName: 'Bundle',
        products: products.map((product) => ({
            id: product.id || product._id,
            name: product.title || product.name,
            price: calculateProductPrice(product),
            quantity: product.quantity || 1,
        })),
        value: totalValue,
        eventData: {
            eventId: `bundle_${Date.now()}`,
        },
    });
};

// Track checkout initiation
export const trackInitiateCheckout = (cartItems: any[], total: number) => {
    if (!cartItems || !cartItems.length) return;

    sendServerTrackingEvent({
        eventName: 'InitiateCheckout',
        products: cartItems.map((item) => ({
            id: item.id || item._id,
            name: item.title || item.name,
            price: item.price,
            quantity: item.quantity,
        })),
        value: total,
        eventData: {
            eventId: `checkout_${Date.now()}`,
        },
    });
};

// Track product click
export const trackProductClick = (product: any) => {
    if (!product) return;

    sendServerTrackingEvent({
        eventName: 'ProductClick',
        products: [
            {
                id: product.id || product._id,
                name: product.title || product.name,
                price: calculateProductPrice(product),
                quantity: 1,
            },
        ],
        eventData: {
            eventId: `click_${product.id || product._id}_${Date.now()}`,
        },
    });
};

// Track purchase
export const trackPurchase = (orderId: string, totalValue: number, cartItems: any[]) => {
    if (!orderId || !totalValue || !cartItems || !cartItems.length) return;

    sendServerTrackingEvent({
        eventName: 'Purchase',
        products: cartItems.map((item) => ({
            id: item.id || item._id,
            name: item.title || item.name,
            price: item.price || 0,
            quantity: item.quantity || 1,
        })),
        value: totalValue,
        eventData: {
            eventId: `purchase_${orderId}_${Date.now()}`,
            orderId,
        },
    });
};

// Helper function to calculate product price (copy from your existing logic)
const calculateProductPrice = (product: any): number => {
    // This should match your existing price calculation logic
    if (!product) return 0;

    // If there's a discount, use the discounted price
    if (product.discount && product.discount > 0) {
        return product.price - product.price * (product.discount / 100);
    }

    return product.price || 0;
};
