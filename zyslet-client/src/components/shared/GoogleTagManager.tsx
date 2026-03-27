// GTM (Google Tag Manager) component that loads the GTM script
'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { GTM_ID, AUTO_TRACK_PAGE_VIEWS } from '@/config/gtm.config';
import { initDataLayer, pageView } from '@/lib/gtm';

// This approach prevents useSearchParams from being called during static generation
export default function GoogleTagManager() {
    // Use state to ensure component only runs its logic on the client side
    const [isMounted, setIsMounted] = useState(false);

    // Only execute client-side code after mounting
    useEffect(() => {
        if (!GTM_ID) return;

        // Mark as mounted to enable client-side features
        setIsMounted(true);
        initDataLayer();

        // We'll track page views in a separate component to avoid SSR issues
        if (AUTO_TRACK_PAGE_VIEWS) {
            // Initial page view for the landing page
            pageView(window.location.pathname + window.location.search);
        }
    }, []);

    if (!GTM_ID || !isMounted) return null;

    return (
        <>
            {/* Google Tag Manager - Script (for head) */}
            <Script
                id="gtm-script"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            <!-- Google Tag Manager -->
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
            <!-- End Google Tag Manager -->
          `,
                }}
            />

            {/* Google Tag Manager - No Script (for body, for users with JavaScript disabled) */}
            <noscript
                dangerouslySetInnerHTML={{
                    __html: `
            <!-- Google Tag Manager (noscript) -->
            <iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>
            <!-- End Google Tag Manager (noscript) -->
          `,
                }}
            />
        </>
    );
}
