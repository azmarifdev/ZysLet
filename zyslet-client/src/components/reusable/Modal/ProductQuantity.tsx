import React from 'react';

interface ProductQuantityProps {
    quantity: number;
    // eslint-disable-next-line no-unused-vars
    onQuantityChange: (quantity: number) => void;
}

const ProductQuantity: React.FC<ProductQuantityProps> = ({ quantity, onQuantityChange }) => {
    // Handle quantity decrease with minimum value check
    const handleDecrease = () => {
        if (quantity > 1) {
            onQuantityChange(quantity - 1);
        }
    };

    // Handle quantity increase
    const handleIncrease = () => {
        onQuantityChange(quantity + 1);
    };

    return (
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm">
            <button
                type="button"
                onClick={handleDecrease}
                disabled={quantity <= 1}
                className={`px-2 py-1 transition-colors ${
                    quantity <= 1 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-600'
                }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
            </button>
            <div className="px-3 py-1 font-medium text-sm bg-gray-50 border-x border-gray-300 min-w-[32px] text-center">
                {quantity}
            </div>
            <button
                type="button"
                onClick={handleIncrease}
                className="px-2 py-1 hover:bg-gray-100 transition-colors text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </div>
    );
};

export default ProductQuantity;
