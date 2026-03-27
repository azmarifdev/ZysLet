'use client';

import { useState, useEffect } from 'react';
import ProductDetails from './ProductDetails';
import { Product } from '../types';

interface ProductDetailsWrapperProps {
    product: Product;
}

// This is a client component that wraps ProductDetails to handle any client-side functionality
export default function ProductDetailsWrapper({ product }: ProductDetailsWrapperProps) {
    // Use state to ensure the component is only rendered on the client
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Show nothing until client-side rendering takes over
    if (!isMounted) {
        return null;
    }

    return <ProductDetails product={product} />;
}
