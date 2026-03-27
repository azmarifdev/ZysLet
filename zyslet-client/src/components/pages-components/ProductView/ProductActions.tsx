import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '@/components/context/CartContext';
import { useCartAnimation } from '@/components/ui/CartAnimation/CartAnimationProvider';
import { calculatePrice } from '@/lib/calculatePrice';
import MultipleAttributesSelector, { Attribute } from './MultipleAttributesSelector';

interface ProductActionsProps {
    product: any;
    // eslint-disable-next-line no-unused-vars
    onBuyNow: (quantity: number) => void; // Updated to accept quantity parameter
    // eslint-disable-next-line no-unused-vars
    onAttributeChange?: (attributes: Record<string, string>) => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({ product, onBuyNow, onAttributeChange }) => {
    const [quantity, setQuantity] = useState<number>(1);
    const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [productAttributes, setProductAttributes] = useState<Attribute[]>([]);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const { addToCart } = useCart();
    const { addAnimation } = useCartAnimation();

    // Set default attributes when component mounts or product changes
    useEffect(() => {
        // Prepare product attributes based on API response
        const newProductAttributes: Attribute[] = [];

        // Handle the case where product.attributes is an array (multiple attributes)
        if (Array.isArray(product.attributes) && product.attributes.length > 0) {
            // Push each attribute from the array
            product.attributes.forEach((attr: any) => {
                if (attr.title && attr.values && attr.values.length > 0) {
                    newProductAttributes.push({
                        title: attr.title,
                        values: attr.values,
                    });
                }
            });
        }
        // Handle the legacy case where product.attribute is a single object
        else if (product.attribute?.title && product.attribute?.values?.length > 0) {
            newProductAttributes.push({
                title: product.attribute.title,
                values: product.attribute.values,
            });
        }

        setProductAttributes(newProductAttributes);

        const newSelectedAttributes: Record<string, string> = {};

        newProductAttributes.forEach((attr) => {
            if (attr.values.length > 0 && !selectedAttributes[attr.title]) {
                newSelectedAttributes[attr.title] = attr.values?.[0];
            }
        });

        // Only update if we have new attributes to set
        if (Object.keys(newSelectedAttributes).length > 0) {
            setSelectedAttributes((prev) => {
                const updated = { ...prev, ...newSelectedAttributes };

                // Notify parent component if needed
                if (onAttributeChange) {
                    onAttributeChange(updated);
                }

                return updated;
            });
        }
    }, [product, selectedAttributes, onAttributeChange]);

    const handleAttributeChange = (attributeTitle: string, value: string) => {
        setSelectedAttributes((prev) => {
            const updated = { ...prev, [attributeTitle]: value };

            // Notify parent component if needed
            if (onAttributeChange) {
                onAttributeChange(updated);
            }

            return updated;
        });
    };

    const handleAddToCart = () => {
        setIsAddingToCart(true);

        // Get button position for animation
        if (buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const startPosition = {
                x: buttonRect.left + buttonRect.width / 2,
                y: buttonRect.top + buttonRect.height / 2,
            };

            // Trigger the flying animation
            addAnimation(product.thumbnail, product.title, startPosition);
        }

        // Convert selectedAttributes object to the attribute array format expected by the API
        const attributeArray = Object.entries(selectedAttributes).map(([title, value]) => ({
            title,
            value,
        }));

        // Calculate discounted price
        const priceDetails = calculatePrice(product.price || 0, product.discount || 0);

        // Prepare cart data with attribute information
        const cartData = {
            id: product._id || product.id, // Use _id as primary ID which is needed for API
            name: product.title,
            price: priceDetails.salePrice, // Use discounted price
            originalPrice: priceDetails.originalPrice, // Add original price for savings calculation
            discount: product.discount,
            image: product.thumbnail,
            attribute: attributeArray, // Use the API expected format
            is_free_shipping: product.is_free_shipping || false,
        };

        // Add to cart (no longer opens sidebar automatically)
        addToCart(cartData, quantity);

        // Reset button state
        setTimeout(() => {
            setIsAddingToCart(false);
        }, 700);
    };

    // Add quantity selector function
    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    return (
        <>
            {/* Product Attributes Section */}
            {productAttributes.length > 0 && (
                <div className="mb-6">
                    <MultipleAttributesSelector
                        attributes={productAttributes}
                        selectedAttributes={selectedAttributes}
                        onAttributeChange={handleAttributeChange}
                    />
                </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-5">
                <h3 className="font-medium text-gray-800 mb-2">Quantity</h3>
                <div className="flex items-center">
                    <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l ${
                            quantity <= 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                    </button>

                    <div className="w-14 h-10 flex items-center justify-center border-t border-b border-gray-300 bg-white">
                        <span className="text-gray-800 font-medium">{quantity}</span>
                    </div>

                    <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r bg-gray-50 text-gray-700 hover:bg-gray-100">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <button
                    ref={buttonRef}
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className={`bg-blue-600 text-white font-medium py-3.5 px-6 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md flex items-center justify-center
                    ${isAddingToCart ? 'bg-blue-700 scale-95' : 'hover:bg-blue-700 active:bg-blue-800'}`}>
                    {isAddingToCart ? (
                        <>
                            <svg
                                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            Add to Cart
                        </>
                    )}
                </button>

                <button
                    onClick={() => onBuyNow(quantity)} // Pass quantity to onBuyNow
                    className="border-2 border-blue-600 text-blue-600 font-medium py-3.5 px-6 rounded-lg hover:bg-blue-50 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                    Buy Now
                </button>
            </div>
        </>
    );
};

export default ProductActions;
