'use client';

import { Suspense, useState } from 'react';
import Navbar from '../shared/navbar';
import SearchParamsNavbarProvider from './SearchParamsNavbarProvider';

const NavbarWithSuspense = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <Suspense fallback={<NavbarFallback />}>
            <SearchParamsNavbarProvider setSearchQuery={setSearchQuery}>
                <NavbarInner searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </SearchParamsNavbarProvider>
        </Suspense>
    );
};

// This doesn't use search params and won't trigger prerendering errors
const NavbarInner = ({}: {
    searchQuery: string;
    // eslint-disable-next-line no-unused-vars
    setSearchQuery: (query: string) => void;
}) => {
    return <Navbar />;
};

// Simple fallback for the navbar while search params are loading
const NavbarFallback = () => {
    return (
        <div className="bg-white py-3 fixed w-full top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-8">{/* Simple loading state */}</div>
            </div>
        </div>
    );
};

export default NavbarWithSuspense;
