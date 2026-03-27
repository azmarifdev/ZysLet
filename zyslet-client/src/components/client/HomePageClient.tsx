'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

// This component will handle the search params for the home page
const HomePageClient = ({ children }: { children: React.ReactNode }) => {
    const searchParams = useSearchParams();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const [query, setQuery] = useState('');
    // console.log(query + ' from HomePageClient');

    useEffect(() => {
        if (searchParams) {
            const searchQuery = searchParams.get('search') || '';
            setQuery(searchQuery);
        }
    }, [searchParams]);

    return (
        <>
            {/* We can pass the query to child components if needed */}
            {children}
        </>
    );
};

export default HomePageClient;
