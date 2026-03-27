import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';

interface BundleProduct {
    id: string;
    name: string;
    price: number;
    discount?: number;
    image: string;
    originalPrice?: number;
    variant?: string;
    attribute?: any; // API attribute format [{ title, value }]
    attributes?: any; // Could be array, object, or null
    defaultAttributes?: any; // Could be array, object, or null
}

interface ProductBundleProps {
    // eslint-disable-next-line no-unused-vars
    onBundleSelection: (selectedProducts: BundleProduct[], hasFreeShipping: boolean) => void;
    mainProduct?: any; // Main product prop
    // Add handleBuyNow function to handle both main product and bundle
    // eslint-disable-next-line no-unused-vars
    onBuyNow?: (quantity: number, product?: any, bundleProducts?: BundleProduct[], forceShipping?: boolean) => void;
}

const ProductBundle: React.FC<ProductBundleProps> = ({ onBundleSelection, mainProduct, onBuyNow }) => {
    // Get bundle products from mainProduct using memoization to avoid unnecessary recalculations
    const bundleProducts: BundleProduct[] = useMemo(() => {
        if (!mainProduct?.bundle_products?.length) return [];

        return mainProduct.bundle_products.map((product: any) => ({
            id: product._id || product.id,
            name: product.title,
            price: product.price - (product.price * product.discount) / 100,
            originalPrice: product.price,
            discount: product.discount,
            image: product.thumbnail,
            variant: product.variant,
            // Keep the original attribute structure from the API
            attribute: product.attribute || null, // API format attributes
            attributes: product.attributes || null,
            defaultAttributes: product.defaultAttributes || null,
        }));
    }, [mainProduct?.bundle_products]);

    // Create a stable reference key for the current bundle products to detect actual changes
    const bundleProductsKey = useMemo(() => {
        return bundleProducts.map((p) => p.id).join(',');
    }, [bundleProducts]);

    // State to track selected products - initialize empty and populate in useEffect
    const [selectedProducts, setSelectedProducts] = useState<Record<string, boolean>>({});

    // Track whether initial selection has been set to avoid repeated initialization
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize selected products only once when bundleProducts are first available
    useEffect(() => {
        // Skip if already initialized or if bundle products are empty
        if (isInitialized || bundleProducts.length === 0) return;

        const initialState: Record<string, boolean> = {};
        bundleProducts.forEach((product) => {
            initialState[product.id] = true; // Set all bundle products to selected by default
        });

        setSelectedProducts(initialState);
        setIsInitialized(true);
    }, [bundleProducts, isInitialized]);

    // Reset selection when bundle products change (different products, not just re-renders)
    useEffect(() => {
        // Skip the first initialization
        if (!isInitialized) return;

        // Only reset if bundle products actually changed
        const initialState: Record<string, boolean> = {};
        bundleProducts.forEach((product) => {
            initialState[product.id] = true; // Set all bundle products to selected by default
        });

        setSelectedProducts(initialState);
    }, [bundleProductsKey, isInitialized]);

    // Helper to calculate if the bundle qualifies for free shipping
    // Create a stable product map that only updates when bundleProductsKey changes
    const productMap = useMemo(() => {
        return bundleProducts.reduce((map, product) => {
            map[product.id] = product;
            return map;
        }, {} as Record<string, BundleProduct>);
    }, [bundleProductsKey]);

    // Now calculateHasFreeShipping uses the memoized productMap
    // instead of recreating it on every call
    const calculateHasFreeShipping = useCallback(
        (selections: Record<string, boolean>) => {
            if (!selections || Object.keys(selections).length === 0) return false;

            const total = Object.keys(selections)
                .filter((id) => selections[id])
                .reduce((sum, id) => {
                    // Using map lookup instead of find for better performance
                    return sum + (productMap[id]?.price || 0);
                }, 0);

            return total >= 65;
        },
        [productMap],
    );

    // Calculate prices using memoization to avoid unnecessary recalculations
    const { totalBundlePrice, originalTotalPrice, hasFreeShipping } = useMemo(() => {
        // Return default values if selectedProducts is empty (initial state)
        if (Object.keys(selectedProducts).length === 0 || bundleProducts.length === 0) {
            return {
                totalBundlePrice: 0,
                originalTotalPrice: 0,
                hasFreeShipping: false,
            };
        }

        const selectedIds = Object.keys(selectedProducts).filter((id) => selectedProducts[id]);

        const totalPrice = selectedIds.reduce((total, id) => {
            return total + (productMap[id]?.price || 0);
        }, 0);

        const originalPrice = selectedIds.reduce((total, id) => {
            const product = productMap[id];
            return total + (product?.originalPrice || product?.price || 0);
        }, 0);

        return {
            totalBundlePrice: totalPrice,
            originalTotalPrice: originalPrice,
            hasFreeShipping: totalPrice >= 65,
        };
    }, [selectedProducts, productMap, bundleProducts.length]);

    // Toggle product selection with useCallback for better performance
    const toggleProduct = useCallback((id: string) => {
        setSelectedProducts((prev) => {
            return { ...prev, [id]: !prev[id] };
        });
    }, []);

    // Use useEffect to notify parent component when selected products change
    // This prevents the infinite loop by separating the state update from the callback
    // Using a ref to track if this is the first render cycle
    const isFirstRender = React.useRef(true);

    useEffect(() => {
        // Skip notification in the first render cycle
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Skip the notification when bundleProducts is empty or when selectedProducts is empty
        if (bundleProducts.length === 0 || Object.keys(selectedProducts).length === 0) return;

        // To prevent excessive updates, we debounce the notification using setTimeout
        const timer = setTimeout(() => {
            const selected = bundleProducts.filter((product) => selectedProducts[product.id]);
            onBundleSelection(selected, calculateHasFreeShipping(selectedProducts));
        }, 0);

        return () => clearTimeout(timer);
    }, [bundleProducts, selectedProducts, calculateHasFreeShipping, onBundleSelection]);

    // Open modal for bundle confirmation using the Buy Now modal
    const openBundleModal = () => {
        // If onBuyNow is provided, use it to open the modal with the main product and bundle products
        if (onBuyNow && mainProduct) {
            // Get only selected bundle products and add default attributes
            const selectedBundleItems = bundleProducts
                .filter((product) => selectedProducts[product.id])
                .map((product) => {
                    // Find the original bundle product from the main product
                    const originalProduct = mainProduct?.bundle_products?.find((p: any) => (p._id || p.id) === product.id);

                    return {
                        ...product,
                        // Keep original attribute data in the correct format
                        attribute: originalProduct?.attribute || null, // API format attributes [{ title, value }]
                        attributes: originalProduct?.attributes || null,
                        defaultAttributes: originalProduct?.defaultAttributes || null,
                        // Make sure variant is included
                        variant: product.variant || originalProduct?.variant,
                    };
                });

            // Always force free shipping for bundle orders - the fourth parameter indicates free shipping
            onBuyNow(1, mainProduct, selectedBundleItems, true);
        }
    };

    // If there are no bundle products, don't render anything
    if (bundleProducts.length === 0) {
        return null;
    }

    return (
        <div className="mt-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-5 py-4">
                    <h3 className="font-bold text-base flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-green-400"
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
                        SAVE MORE & GET FREE SHIPPING
                        {hasFreeShipping && (
                            <span className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">Eligible</span>
                        )}
                    </h3>
                </div>
                <div className="p-4">
                    <div className="grid gap-3 mb-4">
                        {bundleProducts.map((product) => (
                            <div
                                key={product.id}
                                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                                    selectedProducts[product.id]
                                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                                        : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                                }`}
                                onClick={() => toggleProduct(product.id)}>
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 mr-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts[product.id]}
                                            onChange={() => {}} // Handled by the parent div onClick
                                            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="w-16 h-16 relative mr-3 flex-shrink-0 rounded-md overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                                        <Image
                                            src={
                                                product.image ||
                                                'https://dummyimage.com/150x150/e0e0e0/333333.png&text=Product'
                                            }
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform hover:scale-105"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-gray-800 line-clamp-1">{product.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm font-bold text-red-600">
                                                ৳{product.price.toFixed(0)}
                                            </span>
                                            {product.originalPrice && product.price < product.originalPrice && (
                                                <span className="text-xs text-gray-500 line-through">
                                                    ৳{product.originalPrice.toFixed(0)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Enhanced attribute display */}
                                        {product.attribute && product.attribute.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1.5">
                                                {product.attribute.map((attr: any, index: number) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full border border-blue-100">
                                                        <span className="font-medium mr-1">{attr.title}:</span> {attr.value}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Display variant if no attributes are present */}
                                        {(!product.attribute || product.attribute.length === 0) && product.variant && (
                                            <div className="mt-1.5">
                                                <span className="inline-flex items-center bg-gray-50 text-gray-700 text-xs px-2 py-0.5 rounded-full border border-gray-100">
                                                    {product.variant}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {Object.keys(selectedProducts).some((id) => selectedProducts[id]) && (
                        <div className="border-t border-gray-200 pt-3">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 mb-3">
                                <div className="flex items-center justify-between mb-3 text-sm">
                                    <span className="font-medium text-gray-700">Total price</span>
                                    <span className="font-bold text-blue-700">৳{totalBundlePrice.toFixed(0)}</span>
                                </div>
                                <div className="flex items-center justify-between mb-3 text-sm">
                                    <span className="font-medium text-gray-700">Original price</span>
                                    <span className="text-gray-500 line-through">৳{originalTotalPrice.toFixed(0)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-gray-700">You save</span>
                                    <span className="font-medium text-green-600">
                                        ৳{(originalTotalPrice - totalBundlePrice).toFixed(0)} (
                                        {(((originalTotalPrice - totalBundlePrice) / originalTotalPrice) * 100).toFixed(0)}%)
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={openBundleModal}
                                className="w-full py-3.5 rounded-md font-semibold bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white transition-all flex items-center justify-center shadow-md hover:shadow-lg mt-3 relative overflow-hidden group">
                                <div className="absolute inset-0 w-full h-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 bg-white opacity-10"></div>
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
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                    />
                                </svg>
                                Buy with Bundle
                                {hasFreeShipping && (
                                    <span className="ml-2 bg-white bg-opacity-20 text-xs px-2 py-0.5 rounded-full">
                                        Free Shipping
                                    </span>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductBundle;
