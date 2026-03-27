'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { calculatePrice } from '@/lib/calculatePrice';
import { config } from '@/config/env';
import { getImageUrl } from '@/lib/imageUtils';

interface BundleProduct {
    id: string;
    name: string;
    price: number;
    discount?: number;
    image: string;
    originalPrice?: number;
    variant?: string;
}

interface BundleOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    mainProduct: any;
    bundleProducts: BundleProduct[];
    hasFreeShipping: boolean;
}

const BundleOrderModal: React.FC<BundleOrderModalProps> = ({
    isOpen,
    onClose,
    mainProduct,
    bundleProducts,
    hasFreeShipping,
}) => {
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    // Calculate total price from bundle products
    const totalBundlePrice = bundleProducts.reduce((total, product) => total + product.price, 0);

    // Calculate original prices (for savings calculation)
    const originalBundlePrice = bundleProducts.reduce((total, product) => {
        return total + (product.originalPrice || product.price);
    }, 0);

    // Calculate main product price with discount
    const { salePrice: mainProductPrice } = calculatePrice(mainProduct?.price || 0, mainProduct?.discount || 0);

    // Calculate combined totals
    const totalPrice = mainProductPrice + totalBundlePrice;
    const totalSavings = (mainProduct?.price || 0) - mainProductPrice + (originalBundlePrice - totalBundlePrice);

    // Helper to build order items array
    const buildOrderItems = () => {
        const mainProductItem = {
            productId: mainProduct.id,
            quantity: 1,
            price: parseInt(mainProductPrice.toFixed(0)),
            discount_price: parseInt(((mainProduct.price || 0) - mainProductPrice).toFixed(0)),
            selling_price: parseInt(mainProductPrice.toFixed(0)),
            subtotal: parseInt(mainProductPrice.toFixed(0)),
            attribute: mainProduct.variant ? [{ title: 'Variant', value: mainProduct.variant }] : [],
            product_name: mainProduct.title,
        };
        const bundleItems = bundleProducts.map((product) => ({
            productId: product.id,
            quantity: 1,
            price: parseInt((product.price || 0).toFixed(0)),
            discount_price: parseInt(((product.originalPrice || product.price) - product.price).toFixed(0)),
            selling_price: parseInt((product.price || 0).toFixed(0)),
            subtotal: parseInt((product.price || 0).toFixed(0)),
            attribute: product.variant ? [{ title: 'Variant', value: product.variant }] : [],
            product_name: product.name,
        }));
        return [mainProductItem, ...bundleItems];
    };

    const handleBundleOrder = async () => {
        setIsProcessing(true);
        // Prepare order data
        const orderItems = buildOrderItems();
        const orderData = {
            delivery_charge: hasFreeShipping ? 0 : 60,
            subtotal: parseInt((mainProductPrice + totalBundlePrice).toFixed(0)),
            total_price: parseInt((mainProductPrice + totalBundlePrice + (hasFreeShipping ? 0 : 60)).toFixed(0)),
            address: {
                name: '', // You can add a mini form for name/phone/address if needed
                phone: '',
                address: '',
            },
            order_items: orderItems,
        };
        try {
            const response = await fetch(`${config.BASE_URL}/api/v1/order/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });
            const result = await response.json();
            if (response.ok && result.success) {
                // Prepare cartItems for tracking (match CheckoutModal)
                const cartItems = orderItems.map((item) => ({
                    id: item.productId,
                    name: item.product_name,
                    price: item.price,
                    quantity: item.quantity,
                    attribute: item.attribute,
                }));
                const orderId = result.data._id || result.data.id || 'order-' + Date.now();
                const totalValue = orderData.total_price;
                // Fire all tracking events
                import('@/lib/meta-pixel').then(({ trackPurchase }) => {
                    trackPurchase(orderId, totalValue, cartItems);
                });
                import('@/lib/gtm').then(({ trackPurchase: trackGTMPurchase }) => {
                    trackGTMPurchase(orderId, cartItems, totalValue, orderData.delivery_charge, 0);
                });
                import('@/lib/server-tracking').then(({ trackPurchase: trackServerPurchase }) => {
                    trackServerPurchase(orderId, totalValue, cartItems);
                });
            } else {
                alert(result.message || 'Order failed. Please try again.');
            }
        } catch {
            alert('Network error. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
            <div className="absolute inset-0 bg-black bg-opacity-60" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-green-500"></div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-white hover:text-gray-200 bg-black bg-opacity-20 hover:bg-opacity-30 rounded-full p-1 z-10 transition-all"
                    aria-label="Close modal">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="px-4 pt-8 pb-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Bundle Purchase</h2>

                    {/* Main Product */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100 mb-3 shadow-sm">
                        <div className="flex items-center">
                            <div className="relative h-16 w-16 bg-white rounded-md overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm">
                                <Image
                                    src={getImageUrl(mainProduct.thumbnail) || '/placeholder.jpg'}
                                    alt={mainProduct.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="ml-3 flex-1">
                                <h3 className="font-medium text-sm line-clamp-1 text-gray-800">
                                    {mainProduct.title} <span className="text-blue-600 font-bold">(Main Product)</span>
                                </h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <p className="text-blue-600 font-bold text-sm">৳{mainProductPrice.toFixed(0)}</p>
                                    {mainProduct.discount && mainProduct.discount > 0 && (
                                        <p className="text-gray-500 line-through text-xs">৳{mainProduct.price.toFixed(0)}</p>
                                    )}
                                    {mainProduct.discount && mainProduct.discount > 0 && (
                                        <span className="bg-rose-100 text-rose-700 text-xs px-1.5 py-0.5 rounded-full font-medium">
                                            {mainProduct.discount}% OFF
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bundle Products */}
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            </svg>
                            Bundle Items ({bundleProducts.length})
                        </h3>

                        {bundleProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-2 shadow-sm">
                                <div className="flex items-center">
                                    <div className="relative h-12 w-12 bg-white rounded-md overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm">
                                        <Image
                                            src={getImageUrl(product.image) || '/placeholder.jpg'}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <h4 className="text-xs font-medium line-clamp-1 text-gray-800">{product.name}</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs font-bold text-red-600">
                                                ৳{product.price.toFixed(0)}
                                            </span>
                                            {product.originalPrice && product.price < product.originalPrice && (
                                                <span className="text-xs text-gray-500 line-through">
                                                    ৳{product.originalPrice.toFixed(0)}
                                                </span>
                                            )}
                                        </div>
                                        {product.variant && (
                                            <div className="mt-1">
                                                <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                                                    {product.variant}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-white p-3 rounded-lg border border-blue-200 mb-4 shadow-inner">
                        <h3 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5 mr-1 text-blue-500"
                                viewBox="0 0 20 20"
                                fill="currentColor">
                                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                            </svg>
                            BUNDLE SUMMARY
                        </h3>

                        <div className="flex justify-between text-xs mb-1 pb-1 border-b border-blue-100">
                            <span className="text-gray-600">Main Product:</span>
                            <span className="font-medium">৳{mainProductPrice.toFixed(0)}</span>
                        </div>

                        <div className="flex justify-between text-xs mb-1 pb-1 border-b border-blue-100">
                            <span className="text-gray-600">Bundle Items ({bundleProducts.length}):</span>
                            <span className="font-medium">৳{totalBundlePrice.toFixed(0)}</span>
                        </div>

                        {totalSavings > 0 && (
                            <div className="flex justify-between text-xs mb-1 pb-1 border-b border-blue-100">
                                <span className="text-green-600">Your Savings:</span>
                                <span className="font-medium text-green-600">৳{totalSavings.toFixed(0)}</span>
                            </div>
                        )}

                        <div className="flex justify-between text-xs mb-1 pb-1 border-b border-blue-100">
                            <span className="text-gray-600">Delivery:</span>
                            {hasFreeShipping ? (
                                <span className="font-medium text-emerald-600">Free</span>
                            ) : (
                                <span className="font-medium">৳60</span>
                            )}
                        </div>

                        <div className="flex justify-between text-sm font-bold pt-1">
                            <span>Total:</span>
                            <span className="text-blue-700">৳{totalPrice.toFixed(0)}</span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleBundleOrder}
                        disabled={isProcessing}
                        className={`w-full py-3 rounded-md text-white font-medium flex items-center justify-center transition-all ${
                            isProcessing
                                ? 'bg-green-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg'
                        }`}>
                        {isProcessing ? (
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
                                Placing Order...
                            </>
                        ) : (
                            <>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1.5"
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
                                Place Bundle Order
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-gray-500 mt-2">
                        {hasFreeShipping && 'Your bundle qualifies for free shipping!'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BundleOrderModal;
