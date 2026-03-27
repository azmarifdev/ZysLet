import React from 'react';

interface ProductInfoProps {
    quantity?: number;
    isFreeShipping?: boolean;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ quantity = 0, isFreeShipping = false }) => {
    const isInStock = quantity > 0;

    return (
        <div className="flex flex-col space-y-1 mb-5 text-sm">
            {isInStock ? (
                <div className="flex items-center text-green-600">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="font-medium">In Stock</span>
                </div>
            ) : (
                <div className="flex items-center text-red-600">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="font-medium">Out of Stock</span>
                </div>
            )}

            <div className="flex items-center text-gray-600">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <span>Order now, ships within 1-2 business days</span>
            </div>

            <div className="flex items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 mr-2 ${isFreeShipping ? 'text-green-600' : 'text-gray-600'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                </svg>
                {isFreeShipping ? (
                    <span className="font-medium text-green-600">
                        Free shipping{' '}
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded ml-1">Free</span>
                    </span>
                ) : (
                    <span className="text-gray-600">Standard shipping charges apply</span>
                )}
            </div>
        </div>
    );
};

export default ProductInfo;
