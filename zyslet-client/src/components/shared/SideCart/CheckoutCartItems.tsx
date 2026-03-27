import React from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imageUtils';

interface CartItem {
    id: string;
    name: string;
    price: number; // This is the discounted price
    originalPrice?: number; // Original price before discount
    quantity: number;
    image: string;
    discount?: number;
    attribute?: {
        title: string;
        value: string;
    }[];
    is_free_shipping?: boolean;
}

interface CheckoutCartItemsProps {
    cartItems: CartItem[];
    // eslint-disable-next-line no-unused-vars
    updateQuantity: (id: string, quantity: number) => void;
}

const CheckoutCartItems: React.FC<CheckoutCartItemsProps> = ({ cartItems, updateQuantity }) => {
    return (
        <div className="space-y-4">
            {cartItems.map((item) => (
                <div
                    key={item.id}
                    className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-lg border border-blue-100 mb-3 shadow-sm">
                    <div className="flex items-center">
                        <div className="relative h-16 w-16 bg-white rounded-md overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm">
                            <Image src={getImageUrl(item.image)} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="ml-3 flex-1">
                            <h3 className="font-medium text-sm line-clamp-1 text-gray-800">{item.name}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-blue-600 font-bold text-sm">৳{Math.round(item.price)}</p>
                                {item.originalPrice && item.originalPrice > item.price && (
                                    <p className="text-gray-500 line-through text-xs">৳{Math.round(item.originalPrice)}</p>
                                )}
                                {item.originalPrice && item.originalPrice > item.price && (
                                    <span className="bg-rose-100 text-rose-700 text-xs px-1.5 py-0.5 rounded-full font-medium">
                                        {item.discount}% OFF
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <div className="flex flex-wrap gap-1">
                                    {/* Display attributes */}
                                    {item.attribute &&
                                        item.attribute.length > 0 &&
                                        item.attribute.map((attr, idx) => (
                                            <span
                                                key={idx}
                                                className="bg-purple-100 text-purple-700 text-xs px-1.5 py-0.5 rounded-full font-medium">
                                                {`${attr.title}: ${attr.value}`}
                                            </span>
                                        ))}
                                </div>

                                <div className="flex items-center bg-white rounded-md border border-gray-200 overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                        className={`px-1.5 py-0.5 flex items-center justify-center transition-colors ${
                                            item.quantity <= 1
                                                ? 'text-gray-300 cursor-not-allowed'
                                                : 'text-gray-500 hover:bg-gray-100 active:bg-gray-200'
                                        }`}>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M20 12H4"
                                            />
                                        </svg>
                                    </button>
                                    <span className="text-sm font-medium px-2 py-0.5 min-w-[24px] text-center">
                                        {item.quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="px-1.5 py-0.5 flex items-center justify-center text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4v16m8-8H4"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-1 text-xs text-gray-500">
                                Subtotal: <span className="font-medium">৳{(item.price * item.quantity)?.toFixed(0)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CheckoutCartItems;
