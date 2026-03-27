'use client';

import React from 'react';

interface QuantityProps {
    quantity: number;
    // eslint-disable-next-line no-unused-vars
    setQuantity: (quantity: number) => void;
}

const Quantity: React.FC<QuantityProps> = ({ quantity, setQuantity }) => {
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    return (
        <div className="mb-4">
            <div className="flex items-center">
                <button
                    className={`w-12 h-12 flex items-center justify-center border border-gray-300 rounded-l-lg transition-colors
                    ${
                        quantity <= 1
                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300'
                    }`}
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                </button>
                <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-16 h-12 text-center border-t border-b border-gray-300 text-lg font-medium"
                />
                <button
                    className="w-12 h-12 bg-gray-100 text-gray-600 rounded-r-lg flex items-center justify-center hover:bg-gray-200 active:bg-gray-300 border border-gray-300 transition-colors"
                    onClick={increaseQuantity}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Quantity;
