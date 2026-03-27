'use client';

import { memo, useEffect, useState } from 'react';
import ProductPageClient from '@/components/client/ProductPageClient';
import { SearchParamsProvider } from '@/components/client/SearchParamsProvider';

// This component is dynamically imported with {ssr: false} to avoid SSR issues with useSearchParams
const DynamicProductPage = memo(function DynamicProductPage() {
    // This state ensures we only render the component with useSearchParams on the client
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Only render the component that uses useSearchParams on the client
    if (!isClient) {
        return <div>Loading product page...</div>;
    }

    return (
        <SearchParamsProvider>
            <ProductPageClient />
        </SearchParamsProvider>
    );
});

DynamicProductPage.displayName = 'DynamicProductPage';

export default DynamicProductPage;
