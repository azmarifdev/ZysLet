import Link from 'next/link';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Create a separate content component that doesn't rely on any client-side hooks
const NotFoundContent = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 max-w-md mb-8">
            We are sorry, but the page you are looking for does not exist or has been moved.
        </p>
        <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
            Return to Home
        </Link>
    </div>
);

// Import StaticPageClient dynamically to avoid SSR issues with useSearchParams
const StaticPageClient = dynamic(() => import('@/components/client/StaticPageClient'), {
    ssr: false,
    loading: () => <NotFoundContent />,
});

export default function NotFound() {
    return (
        <Suspense fallback={<NotFoundContent />}>
            <StaticPageClient>
                <NotFoundContent />
            </StaticPageClient>
        </Suspense>
    );
}
