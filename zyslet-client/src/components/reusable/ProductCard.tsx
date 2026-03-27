'use client';
import { FC, useState, memo, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/context/CartContext';
import { useCartAnimation } from '@/components/ui/CartAnimation/CartAnimationProvider';
import { calculatePrice } from '@/lib/calculatePrice';
import { Product } from '@/app/product/types';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imageUtils';

const ProductCard: FC<Product> = ({
    id,
    thumbnail,
    title,
    price,
    discount,
    is_free_shipping,
    slug,
    attributes,
    attribute,
}) => {
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const { addToCart } = useCart();
    const { addAnimation } = useCartAnimation();

    // Handle different data formats - use calculatePrice to normalize pricing data
    const priceDetails = calculatePrice(price || 0, discount || 0);

    const { originalPrice, salePrice, discountPercentage, hasDiscount, savingsAmount } = priceDetails;

    // Always use ID for navigation, ignore slug completely
    const productUrl = `/product/${slug}`;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsAddingToCart(true);

        // Get the button's position for the animation start point
        if (buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const startPosition = {
                x: buttonRect.left + buttonRect.width / 2,
                y: buttonRect.top + buttonRect.height / 2,
            };

            // Trigger the flying animation
            addAnimation(thumbnail, title, startPosition);
        }

        // Process attributes to ensure they're properly formatted with default values
        let formattedAttributes: { title: string; value: string }[] = [];

        // Handle different attribute formats that could come from various API endpoints

        // Case 1: attributes array from normal product listing
        if (attributes && Array.isArray(attributes) && attributes.length > 0) {
            formattedAttributes = attributes
                .map((attr) => {
                    if (attr.title && Array.isArray(attr.values) && attr.values.length > 0 && attr.values?.[0]) {
                        return {
                            title: attr.title,
                            value: attr.values?.[0],
                        };
                    }
                    return null;
                })
                .filter((attr) => attr !== null) as { title: string; value: string }[];
        }
        // Case 2: single attribute object format (might come from some API endpoints)
        else if (attribute && typeof attribute === 'object' && !Array.isArray(attribute)) {
            // Handle single attribute object
            if (
                'title' in attribute &&
                'values' in attribute &&
                Array.isArray(attribute.values) &&
                attribute.values.length > 0
            ) {
                formattedAttributes = [
                    {
                        title: attribute.title,
                        value: attribute.values?.[0],
                    },
                ];
            }
        }
        // Case 3: Best Sales API format (might have different structure)
        else if (attribute && Array.isArray(attribute)) {
            formattedAttributes = attribute;
        }

        const cartData = {
            id,
            name: title,
            price: salePrice, // Use salePrice instead of originalPrice for consistency
            originalPrice: originalPrice, // Add original price for savings calculation
            discount: discount,
            image: thumbnail,
            attribute: formattedAttributes,
            is_free_shipping: is_free_shipping || false,
        };
        addToCart(cartData, 1);

        // Reset button state after animation
        setTimeout(() => {
            setIsAddingToCart(false);
        }, 700);
    };

    return (
        <div
            className="flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <Link href={productUrl} className="block">
                <div className="relative aspect-[4/3] w-full">
                    {/* Discount badge */}
                    {hasDiscount && (
                        <div className="absolute top-1 right-1 bg-red-500/80 text-white text-xs font-bold px-1 py-1 rounded-full z-10">
                            {discountPercentage}% OFF
                        </div>
                    )}

                    {/* Free shipping badge */}
                    {is_free_shipping && (
                        <div className="absolute top-1 left-1 bg-blue-500/80 text-white text-xs font-bold px-1 py-1 rounded-full z-10">
                            Free Shipping
                        </div>
                    )}

                    {/* Skeleton loader */}
                    <div className={`absolute inset-0 bg-gray-200 rounded-t-lg ${imageLoaded ? 'hidden' : 'block'}`}></div>

                    <div className="absolute inset-0 overflow-hidden">
                        <Image
                            src={getImageUrl(thumbnail)}
                            alt={title}
                            className={`w-full h-[300px] object-cover transition-all duration-500 ${
                                imageLoaded ? 'opacity-100' : 'opacity-0'
                            } ${isHovered ? 'transform scale-105' : 'scale-100'}`}
                            onLoad={() => setImageLoaded(true)}
                            height={300}
                            width={300}
                        />

                        {/* Hover overlay */}
                        <div
                            className={`absolute inset-0 bg-black bg-opacity-0 ${
                                isHovered ? 'bg-opacity-10' : ''
                            } transition-all duration-300`}></div>
                    </div>
                </div>
            </Link>

            <div className="px-4 pt-2 flex-grow flex flex-col">
                <Link
                    href={productUrl}
                    className="block focus:outline-none focus:underline group mb-auto"
                    aria-label={`View details of ${title}`}>
                    <h3
                        className="text-sm font-semibold text-gray-700 line-clamp-2  group-hover:text-blue-600 transition-colors duration-200"
                        title={title}>
                        {title}
                    </h3>
                </Link>

                <div className="flex flex-wrap items-center mt-3">
                    <span className="text-lg font-bold text-gray-900">৳{salePrice}</span>
                    {hasDiscount && (
                        <>
                            <span className="text-sm text-gray-500 line-through ml-2">৳{originalPrice}</span>
                            <span className="text-xs text-green-600 ml-2 mt-0.5">Save ৳{savingsAmount}</span>
                        </>
                    )}
                </div>
            </div>

            <div className="px-4 pt-2 pb-1  md:pb-5">
                <button
                    ref={buttonRef}
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className={`w-full py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-sm
                    ${
                        isAddingToCart
                            ? 'bg-green-700 text-white scale-95'
                            : 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
                    }`}
                    aria-label={` ${title}`}>
                    {isAddingToCart ? (
                        <>
                            <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Adding...
                        </>
                    ) : (
                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add to cart
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

// Use memo to prevent unnecessary re-renders
export default memo(ProductCard);
