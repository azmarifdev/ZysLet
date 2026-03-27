/**
 * Utility functions for handling image URLs in Admin Panel
 */

const isAbsoluteUrl = (value: string) =>
    value.startsWith('http://') || value.startsWith('https://');

const optimizeCloudinaryUrl = (url: string): string => {
    if (!url.includes('res.cloudinary.com')) return url;
    if (url.includes('/upload/f_auto,q_auto/')) return url;
    return url.replace('/upload/', '/upload/f_auto,q_auto/');
};

/**
 * Convert relative image URL to absolute URL
 * Handles both relative and absolute URLs
 */
export const getImageUrl = (imageUrl: string | undefined | null): string => {
    // Return empty string for null/undefined or non-string values
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
        return '';
    }

    // Get base URL from environment with production fallback
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://server.zyslet.com';

    const trimmedImageUrl = imageUrl.trim();

    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    // For external absolute URLs (Cloudinary/CDN), keep the original host.
    if (isAbsoluteUrl(trimmedImageUrl)) {
        try {
            const parsedUrl = new URL(trimmedImageUrl);
            if (parsedUrl.hostname.includes('res.cloudinary.com')) {
                return optimizeCloudinaryUrl(trimmedImageUrl);
            }
            if (parsedUrl.hostname !== new URL(cleanBaseUrl || parsedUrl.origin).hostname) {
                return trimmedImageUrl;
            }
            return trimmedImageUrl;
        } catch {
            return trimmedImageUrl;
        }
    }

    // Clean up legacy local path formats
    let cleanImageUrl = trimmedImageUrl.startsWith('/') ? trimmedImageUrl : `/${trimmedImageUrl}`;

    // 🔧 FIX: Handle legacy wrong URLs with double /tmp/
    // Replace "server-tmp/tmp/" with "server-tmp/" to fix old database records
    cleanImageUrl = cleanImageUrl.replace('/server-tmp/tmp/', '/server-tmp/');

    // 🔧 FIX: Ensure proper nginx route for file serving
    if (cleanImageUrl.startsWith('/tmp/') && !cleanImageUrl.startsWith('/server-tmp/')) {
        cleanImageUrl = cleanImageUrl.replace('/tmp/', '/server-tmp/');
    }

    // Handle raw filename values from legacy records
    if (!trimmedImageUrl.includes('/') && !trimmedImageUrl.startsWith('http')) {
        cleanImageUrl = `/server-tmp/products/${trimmedImageUrl}`;
    }

    return optimizeCloudinaryUrl(`${cleanBaseUrl}${cleanImageUrl}`);
};

/**
 * Get image URL with fallback
 */
export const getImageUrlWithFallback = (
    imageUrl: string | undefined | null,
    fallback: string = '/placeholder.jpg',
): string => {
    const processedUrl = getImageUrl(imageUrl);
    return processedUrl || fallback;
};
