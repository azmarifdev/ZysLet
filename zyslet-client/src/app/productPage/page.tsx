import { Suspense } from 'react';
import { SearchParamsProvider } from '@/components/client/SearchParamsProvider';
import ProductPageClient from '@/components/client/ProductPageClient';

// ProductPage server component with client content properly wrapped in Suspense
export default function ProductPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center h-screen">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </div>
            }>
            <SearchParamsProvider>
                <ProductPageClient />
            </SearchParamsProvider>
        </Suspense>
    );
}
