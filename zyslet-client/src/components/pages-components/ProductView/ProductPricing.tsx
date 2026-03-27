import React from 'react';

interface ProductPricingProps {
    salePrice: number;
    originalPrice: number;
    discountPercentage: number;
}

const ProductPricing: React.FC<ProductPricingProps> = ({ salePrice, originalPrice, discountPercentage }) => {
    // Calculate savings amount with proper rounding
    const savings = Math.round(originalPrice - salePrice);
    const hasDiscount = discountPercentage > 0;

    // Apply proper rounding to prices
    const roundedSalePrice = Math.round(salePrice);
    const roundedOriginalPrice = Math.round(originalPrice);

    return (
        <div className="p-2 md:p-2 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex flex-wrap items-center mb-4">
                <span className="text-2xl md:text-3xl font-bold text-gray-900">৳{roundedSalePrice}</span>
                {hasDiscount && <span className="ml-3 text-gray-500 line-through text-lg">৳{roundedOriginalPrice}</span>}

                {hasDiscount && (
                    <div className="flex items-center ml-auto">
                        <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                            {discountPercentage}% OFF
                        </span>
                    </div>
                )}
            </div>

            {hasDiscount && (
                <div className="mb-4 flex items-center text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1.5"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.414-9.707L10 9.586l3.707-3.707a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-2-2a1 1 111.414-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="font-medium text-sm">You save: ৳{savings}</span>
                </div>
            )}
        </div>
    );
};

export default ProductPricing;
