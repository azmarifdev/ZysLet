import React from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imageUtils';

interface CartItemProps {
    id: string;
    name: string;
    price: number; // This is the discounted price
    originalPrice?: number; // Original price before discount
    discount?: number;
    quantity: number;
    image: string;
    color?: string;
    // eslint-disable-next-line no-unused-vars
    updateQuantity: (id: string, newQuantity: number) => void;
    // eslint-disable-next-line no-unused-vars
    removeItem: (id: string) => void;
    attribute?: {
        title: string;
        value: string;
    }[];
    is_free_shipping?: boolean;
}

const CartItem: React.FC<CartItemProps> = ({
    id,
    name,
    price,
    originalPrice,
    discount,
    quantity,
    image,
    updateQuantity,
    removeItem,
    attribute,
    is_free_shipping,
}) => {
    const hasDiscount = discount && discount > 0 && originalPrice && originalPrice > price;
    const itemSavings = hasDiscount ? (originalPrice! - price) * quantity : 0;

    return (
        <div className="flex p-4 border border-gray-100 rounded-xl shadow-sm bg-white hover:shadow-md transition-all duration-200 relative overflow-hidden">
            {/* Product Image with Enhanced Shadow */}
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg shadow-sm relative">
                <Image
                    src={getImageUrl(image)}
                    alt={name}
                    className="object-cover transition-transform hover:scale-105"
                    fill
                    sizes="80px"
                />
            </div>

            {/* Free shipping badge */}
            {is_free_shipping && (
                <div className="absolute top-2 right-2 bg-green-50 text-green-600 text-[10px] font-bold py-0.5 px-1.5 rounded-full border border-green-100">
                    FREE SHIPPING
                </div>
            )}

            <div className="ml-4 flex-1">
                {/* Product Name */}
                <p className="text-sm font-medium text-gray-800 line-clamp-1">{name}</p>

                {/* Attributes with enhanced styling */}
                {attribute && attribute.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                        {attribute.map((attr, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full border border-blue-100">
                                <span className="font-medium mr-1">{attr.title}:</span> {attr.value}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between mt-3">
                    {/* Price with discount information */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-emerald-600">৳{Math.round(price)}</span>
                            {hasDiscount && (
                                <span className="text-xs text-gray-500 line-through">৳{Math.round(originalPrice!)}</span>
                            )}
                        </div>
                        {hasDiscount && itemSavings > 0 && (
                            <span className="text-xs text-green-600 font-medium">Save ৳{Math.round(itemSavings)}</span>
                        )}
                    </div>

                    <div className="flex items-center">
                        {/* Quantity controls with improved styling */}
                        <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                            <button
                                onClick={() => quantity > 1 && updateQuantity(id, quantity - 1)}
                                disabled={quantity <= 1}
                                className={`p-1.5 flex items-center justify-center transition-colors ${
                                    quantity <= 1
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
                                }`}>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                            </button>
                            <span className="text-sm font-medium px-2.5 min-w-[24px] text-center">{quantity}</span>
                            <button
                                onClick={() => updateQuantity(id, quantity + 1)}
                                className="p-1.5 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>

                        {/* Remove button with improved styling */}
                        <button
                            onClick={() => removeItem(id)}
                            className="ml-2 text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Remove item">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
