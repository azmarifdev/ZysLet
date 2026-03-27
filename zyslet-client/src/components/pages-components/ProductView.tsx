'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ImageGallery from './ImageGallery';
import Modal from '../reusable/Modal';
import { calculatePrice } from '@/lib/calculatePrice';
import { useMetaPixel } from '@/hooks/useMetaPixel';
import { trackProductView as trackServerProductView } from '@/lib/server-tracking';
import { trackProductView as trackGTMProductView } from '@/lib/gtm';

// Import our new component parts
import ProductHeader from './ProductView/ProductHeader';
import ProductPricing from './ProductView/ProductPricing';
import ProductInfo from './ProductView/ProductInfo';
import ProductActions from './ProductView/ProductActions';
import ProductVideo from './ProductView/ProductVideo';
import ProductBundle from './ProductView/ProductBundle';
import { Product } from '@/app/product/types';

interface ProductViewProps {
    product: Product;
}

interface BundleProduct {
    id: string;
    name: string;
    price: number;
    discount?: number;
    image: string;
    originalPrice?: number;
    variant?: string;
}

const ProductView: React.FC<ProductViewProps> = ({ product }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const [isMobile, setIsMobile] = useState<boolean>(true);
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [initialQuantity, setInitialQuantity] = useState<number>(1); // Add state for initial quantity
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const [selectedBundleProducts, setSelectedBundleProducts] = useState<BundleProduct[]>([]);
    const [hasBundleFreeShipping, setHasBundleFreeShipping] = useState<boolean>(false);
    const [modalProduct, setModalProduct] = useState<any>(null);
    const [bundleProductsForModal, setBundleProductsForModal] = useState<BundleProduct[]>([]);
    const { trackProductView } = useMetaPixel();

    // Track product view with Meta Pixel
    useEffect(() => {
        if (product) {
            // Client-side GTM tracking
            trackGTMProductView(product);

            // Client-side Meta Pixel tracking
            trackProductView(product);

            // Server-side tracking using Facebook Conversion API
            trackServerProductView(product);
        }
    }, [product, trackProductView]);

    // Check if on mobile device for responsive layout decisions
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => {
            window.removeEventListener('resize', checkIsMobile);
        };
    }, []);

    // Combine thumbnail and image array to show thumbnail as the first image
    // Moving this before the early return to maintain hook order
    const galleryImages = useMemo(() => {
        if (!product) return [];

        // Create a new array starting with the thumbnail (if available)
        let combinedImages = [];

        // Check if there's a thumbnail and it's not already in the images array
        if (product.thumbnail) {
            // Check if the thumbnail is already in the images array
            const thumbnailAlreadyExists = product.images?.some((img) => img.url === product.thumbnail);

            if (!thumbnailAlreadyExists) {
                // Add the thumbnail as the first image with a unique _id
                combinedImages.push({
                    _id: `thumbnail-${product._id || Date.now()}`,
                    url: product.thumbnail,
                });
            }
        }

        // Add all other images from the product.images array
        if (product.images && product.images.length > 0) {
            combinedImages = [...combinedImages, ...product.images];
        }

        return combinedImages;
    }, [product]);

    // Handle attributes selection
    const handleAttributeChange = (attributes: Record<string, string>) => {
        setSelectedAttributes(attributes);
    };

    // Handle Buy Now action with quantity
    const handleBuyNow = (
        quantity: number,
        productToUse = product,
        bundleProducts?: BundleProduct[],
        forceShipping?: boolean,
    ) => {
        setInitialQuantity(quantity);
        setModalProduct(productToUse);
        if (bundleProducts && bundleProducts.length > 0) {
            setBundleProductsForModal(bundleProducts);
            // If force shipping is true, always set bundle free shipping to true
            if (forceShipping) {
                setHasBundleFreeShipping(true);
            }
        } else {
            setBundleProductsForModal([]);
        }
        setIsModalOpen(true);
    };

    // Handle bundle selection with memoization to prevent unnecessary updates
    const handleBundleSelection = useCallback(
        (products: BundleProduct[], hasFreeShipping: boolean) => {
            // Use a deep comparison to prevent unnecessary state updates
            const hasProductsChanged = JSON.stringify(products) !== JSON.stringify(selectedBundleProducts);
            const hasShippingChanged = hasFreeShipping !== hasBundleFreeShipping;

            // Only update state if something actually changed
            if (hasProductsChanged) {
                setSelectedBundleProducts(products);
            }

            if (hasShippingChanged) {
                setHasBundleFreeShipping(hasFreeShipping);
            }
        },
        [selectedBundleProducts, hasBundleFreeShipping],
    );

    // Early return with a loading state if product is undefined
    if (!product) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-pulse text-gray-500">Loading product information...</div>
            </div>
        );
    }

    // Use the price calculation utility with a safety check
    const { originalPrice, salePrice, discountPercentage } = calculatePrice(product?.price || 0, product?.discount || 0);

    // Use product rating from props or default to 0
    const rating = product.averageRating || 0;

    // Get the actual review count from the product data
    const reviewCount = product.reviews?.length || 0;

    return (
        <div className="flex flex-col lg:flex-row lg:space-x-6 mb-12 md:mb-16">
            {/* Mobile product title - only visible on small screens */}
            <ProductHeader
                productName={product?.title}
                rating={rating}
                reviewCount={reviewCount}
                isMobile={true}
                productCode={product?.code}
            />

            {/* Product Image Section */}
            <div className="lg:w-1/2 mb-6 lg:mb-0">
                <div className="bg-white p-2 md:p-4 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                    <ImageGallery images={galleryImages} className="w-full" />
                </div>
            </div>

            {/* Product Info Section */}
            <div className="lg:w-1/2">
                {/* Desktop product title - hidden on mobile */}
                <ProductHeader
                    productName={product?.title}
                    rating={rating}
                    reviewCount={reviewCount}
                    isMobile={false}
                    productCode={product?.code}
                />

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Price section */}
                    <ProductPricing
                        salePrice={salePrice}
                        originalPrice={originalPrice}
                        discountPercentage={discountPercentage}
                    />

                    <div className="p-5 md:p-6 border-t border-gray-100">
                        {/* Stock and delivery info */}
                        <ProductInfo quantity={product.quantity} isFreeShipping={product.is_free_shipping} />

                        {/* Quantity Selector and Action Buttons */}
                        <ProductActions
                            product={product}
                            onBuyNow={handleBuyNow}
                            onAttributeChange={handleAttributeChange}
                        />
                    </div>
                </div>

                {/* Bundle section - added above the YouTube video section */}
                <ProductBundle onBundleSelection={handleBundleSelection} mainProduct={product} onBuyNow={handleBuyNow} />

                {/* Order Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    product={modalProduct || product}
                    selectedAttributes={selectedAttributes}
                    initialQuantity={initialQuantity}
                    bundleProducts={bundleProductsForModal}
                    hasFreeShipping={hasBundleFreeShipping}
                />

                {/* YouTube Video section - only shown if youtube_video exists */}
                {product.youtube_video && <ProductVideo youtubeUrl={product.youtube_video} />}
            </div>
        </div>
    );
};

export default ProductView;
