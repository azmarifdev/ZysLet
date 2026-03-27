'use client';

import { useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';

interface StaticPageClientProps {
    children: ReactNode;
}

// This component safely handles search params for static pages
const StaticPageClient = ({ children }: StaticPageClientProps) => {
    // This line will cause the useSearchParams() to be used in a client component
    // within a Suspense boundary, which is what we need to fix the prerendering errors
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const searchParams = useSearchParams();
    // console.log(searchParams.toString() + ' from StaticPageClient');

    return <>{children}</>;
};

export default StaticPageClient;
