// filepath: /data/Code/code-encover/zyslet-client/src/components/pages-components/ProductViewSkeleton.tsx
'use client';

import React from 'react';

const ProductViewSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:space-x-6 mb-12 md:mb-16 animate-pulse">
            {/* Mobile product title skeleton - only visible on small screens */}
            <div className="md:hidden mb-6">
                <div className="h-8 bg-gray-200 rounded-md w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
            </div>

            {/* Product Image Section Skeleton */}
            <div className="lg:w-1/2 mb-6 lg:mb-0">
                <div className="bg-white p-2 md:p-4 rounded-2xl shadow-sm border border-gray-100">
                    {/* Main image skeleton */}
                    <div className="aspect-square w-full bg-gray-200 rounded-lg mb-2"></div>

                    {/* Thumbnails skeleton */}
                    <div className="flex space-x-2 mt-2 justify-center">
                        <div className="h-16 w-16 bg-gray-200 rounded-lg"></div>
                        <div className="h-16 w-16 bg-gray-200 rounded-lg"></div>
                        <div className="h-16 w-16 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            </div>

            {/* Product Info Section Skeleton */}
            <div className="lg:w-1/2">
                {/* Desktop product title skeleton - hidden on mobile */}
                <div className="hidden md:block">
                    <div className="h-10 bg-gray-200 rounded-md w-3/4 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded-md w-1/3 mb-5"></div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Price section skeleton */}
                    <div className="p-4 bg-gray-50">
                        <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-2"></div>
                        <div className="h-5 bg-gray-200 rounded-md w-1/4"></div>
                    </div>

                    <div className="p-5 md:p-6 border-t border-gray-100">
                        {/* Stock and delivery info skeleton */}
                        <div className="flex flex-col space-y-2 mb-4">
                            <div className="h-5 bg-gray-200 rounded-md w-1/3"></div>
                            <div className="h-5 bg-gray-200 rounded-md w-2/3"></div>
                            <div className="h-5 bg-gray-200 rounded-md w-1/2"></div>
                        </div>

                        {/* Quantity and buttons skeleton */}
                        <div className="my-4 h-10 bg-gray-200 rounded-md w-1/4"></div>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <div className="h-14 bg-gray-200 rounded-lg"></div>
                            <div className="h-14 bg-gray-200 rounded-lg"></div>
                        </div>
                    </div>
                </div>

                {/* Product highlights skeleton */}
                <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="h-6 bg-gray-200 rounded-md w-1/3 mb-3"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-4/6"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductViewSkeleton;
