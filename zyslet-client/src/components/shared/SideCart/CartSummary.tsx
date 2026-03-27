import React from 'react';
import { useCart } from '@/components/context/CartContext';

interface CartSummaryProps {
    cartTotal: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ cartTotal }) => {
    const { originalTotal, totalSavings } = useCart();
    const hasSavings = totalSavings > 0;

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl shadow-sm border border-blue-100">
            {hasSavings && (
                <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600 font-medium">Original Total</span>
                    <span className="font-medium text-gray-500 line-through">৳{Math.round(originalTotal)}</span>
                </div>
            )}

            <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600 font-medium">Subtotal</span>
                <span className="font-medium">৳{Math.round(cartTotal)}</span>
            </div>

            {hasSavings && (
                <div className="flex justify-between items-center mb-3">
                    <span className="text-green-600 font-medium">You Save</span>
                    <span className="font-medium text-green-600">৳{Math.round(totalSavings)}</span>
                </div>
            )}

            <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600 font-medium">Delivery</span>
                <span className="font-medium text-gray-600">To be calculated</span>
            </div>

            <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-blue-200">
                <span className="text-gray-800">Total</span>
                <span className="text-blue-700">৳{Math.round(cartTotal)}</span>
            </div>
        </div>
    );
};

export default CartSummary;
