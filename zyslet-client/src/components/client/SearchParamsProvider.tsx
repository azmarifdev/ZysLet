'use client';

import { useSearchParams as useNextSearchParams } from 'next/navigation';
import { createContext, useContext, ReactNode } from 'react';

// Create a context to store search params
const SearchParamsContext = createContext<URLSearchParams | null>(null);

export function useSearchParams() {
    const context = useContext(SearchParamsContext);
    if (context === null) {
        throw new Error('useSearchParams must be used within a SearchParamsProvider');
    }
    return context;
}

// This component should be used as a client component in a Suspense boundary
export function SearchParamsProvider({ children }: { children: ReactNode }) {
    // This is the hook that causes the server/client mismatch
    const searchParams = useNextSearchParams();

    return <SearchParamsContext.Provider value={searchParams}>{children}</SearchParamsContext.Provider>;
}
