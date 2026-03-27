import React from 'react';

interface ProductHeaderProps {
    productName: string;
    rating: number;
    reviewCount: number;
    isMobile: boolean;
    productCode?: string;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ productName, rating, reviewCount, isMobile, productCode }) => {
    return (
        <div className={isMobile ? 'md:hidden mb-6' : 'hidden md:block'}>
            <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-800 ${!isMobile && 'mb-4'}`}>
                {productName}
            </h1>
            <div className={`flex items-center ${isMobile ? 'mt-2 mb-3' : 'mb-5'}`}>
                <div className="flex items-center text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                        <svg
                            key={i}
                            className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`}
                            fill={i < Math.round(rating) ? 'currentColor' : 'gray'}
                            viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                    <span className={`${isMobile ? 'ml-1 text-xs' : 'ml-2 text-sm'} text-gray-600`}>
                        {rating.toFixed(1)} ({reviewCount} reviews)
                    </span>
                    {!isMobile && productCode && (
                        <span className="ml-3 inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                            Product Code: {productCode}
                        </span>
                    )}
                </div>
            </div>
            {isMobile && productCode && (
                <div className={isMobile ? 'mb-3' : 'mb-5'}>
                    <span className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                        Product Code: {productCode}
                    </span>
                </div>
            )}
        </div>
    );
};

export default ProductHeader;
