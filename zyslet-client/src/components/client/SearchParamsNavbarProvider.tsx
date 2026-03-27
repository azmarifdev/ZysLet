'use client';

import { useSearchParams } from 'next/navigation';
import { FC, useEffect, ReactNode } from 'react';

interface SearchParamsNavbarProviderProps {
    // eslint-disable-next-line no-unused-vars
    setSearchQuery: (query: string) => void;
    children: ReactNode;
}

const SearchParamsNavbarProvider: FC<SearchParamsNavbarProviderProps> = ({ setSearchQuery, children }) => {
    const searchParams = useSearchParams();

    useEffect(() => {
        const queryFromUrl = searchParams?.get('search') || '';
        setSearchQuery(queryFromUrl);
    }, [searchParams, setSearchQuery]);

    return <>{children}</>;
};

export default SearchParamsNavbarProvider;
