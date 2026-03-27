import React from 'react';

interface CartItemQuantityProps {
    id: string;
    quantity: number;
    // eslint-disable-next-line no-unused-vars
    updateQuantity: (id: string, quantity: number) => void;
}

const CartItemQuantity: React.FC<CartItemQuantityProps> = ({ id, quantity, updateQuantity }) => {
    return (
        <div className="flex items-center bg-gray-50 rounded-md border border-gray-200 overflow-hidden">
            <button
                type="button"
                onClick={() => quantity > 1 && updateQuantity(id, quantity - 1)}
                disabled={quantity <= 1}
                className={`px-1.5 py-0.5 flex items-center justify-center transition-colors ${
                    quantity <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100 active:bg-gray-200'
                }`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
            </button>
            <span className="text-sm font-medium px-2 py-0.5 min-w-[24px] text-center">{quantity}</span>
            <button
                type="button"
                onClick={() => updateQuantity(id, quantity + 1)}
                className="px-1.5 py-0.5 flex items-center justify-center text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </div>
    );
};

export default CartItemQuantity;
