'use client';

import { useSearchParams as useNextSearchParams } from 'next/navigation';
import { FC, useEffect } from 'react';

interface NavbarSearchParamsProps {
    // eslint-disable-next-line no-unused-vars
    setSearchQuery: (query: string) => void;
}

const NavbarSearchParams: FC<NavbarSearchParamsProps> = ({ setSearchQuery }) => {
    const searchParams = useNextSearchParams();

    useEffect(() => {
        const queryFromUrl = searchParams?.get('search') || '';
        setSearchQuery(queryFromUrl);
    }, [searchParams, setSearchQuery]);

    return null;
};

export default NavbarSearchParams;
