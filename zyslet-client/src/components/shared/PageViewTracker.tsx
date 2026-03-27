'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { GTM_ID, AUTO_TRACK_PAGE_VIEWS } from '@/config/gtm.config';
import { pageView } from '@/lib/gtm';

// This component handles page view tracking separate from the main GTM component
export default function PageViewTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!GTM_ID || !AUTO_TRACK_PAGE_VIEWS) return;

        // Track page views when the route changes
        const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
        pageView(url);
    }, [pathname, searchParams]);

    // This component doesn't render anything
    return null;
}
