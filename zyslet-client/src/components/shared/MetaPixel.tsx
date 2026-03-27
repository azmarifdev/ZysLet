'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { META_PIXEL_ID, AUTO_TRACK_PAGE_VIEWS } from '@/config/meta-pixel.config';

export default function MetaPixel() {
    // Use state to ensure component only runs its logic on the client side
    const [isMounted, setIsMounted] = useState(false);

    // Only execute client-side code after mounting
    useEffect(() => {
        if (!META_PIXEL_ID) return;

        // Mark as mounted to enable client-side features
        setIsMounted(true);
        
        // Skip custom initialization as the official Meta Pixel snippet handles this
        // The official script sets up window.fbq properly
        
        // Setup route change tracking for Next.js apps
        const handleRouteChange = () => {
            if (AUTO_TRACK_PAGE_VIEWS && typeof window.fbq === 'function') {
                // Call fbq directly as it's defined by the official script
                window.fbq('track', 'PageView');
            }
        };

        // Add event listener for route change completion
        window.addEventListener('routeChangeComplete', handleRouteChange);
        
        // Clean up event listener
        return () => {
            window.removeEventListener('routeChangeComplete', handleRouteChange);
        };
    }, []);

    if (!META_PIXEL_ID || !isMounted) return null;

    return (
        <>
            {/* Meta Pixel Base Code */}
            <Script
                id="meta-pixel-script"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', '${META_PIXEL_ID}');
                        fbq('track', 'PageView');
                    `,
                }}
            />
            
            {/* Meta Pixel NoScript Code (for users with JavaScript disabled) */}
            <noscript>
                <img 
                    height="1" 
                    width="1" 
                    style={{ display: 'none' }}
                    src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                    alt="Meta Pixel"
                />
            </noscript>
        </>
    );
}
