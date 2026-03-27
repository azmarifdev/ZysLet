'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import SpecificationTabContent from './ProductDescription/SpecificationTabContent';
import ReviewsTab from './ProductDescription/ReviewsTab';
import { Product } from '@/app/product/types';
import ProductDetailsTabContent from './ProductDescription/ProductDetailsTabContent';
import ConvertHtml from '@/components/reusable/ConvertHtml';
import { getImageUrl } from '@/lib/imageUtils';

type TabType = 'details' | 'specs' | 'reviews';

const ProductDescription = ({ product }: { product: Product }) => {
    // Check if product details content is available
    const hasProductDetails = Boolean(product?.main_features || product?.important_note);

    // Set initial tab to 'specs' if no product details are available, otherwise 'details'
    const [activeTab, setActiveTab] = useState<TabType>(hasProductDetails ? 'details' : 'specs');
    const [mobileActiveSection, setMobileActiveSection] = useState<TabType>(hasProductDetails ? 'details' : 'specs');

    // Refs for section elements
    const detailsRef = useRef<HTMLDivElement>(null);
    const specsRef = useRef<HTMLDivElement>(null);
    const reviewsRef = useRef<HTMLDivElement>(null);

    // Add intersection observer to track which section is in view on mobile
    useEffect(() => {
        if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 0.5, // When 50% of the element is visible
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        if (id === 'mobile-details-section') {
                            setMobileActiveSection('details');
                        } else if (id === 'mobile-specs-section') {
                            setMobileActiveSection('specs');
                        } else if (id === 'mobile-reviews-section') {
                            setMobileActiveSection('reviews');
                        }
                    }
                });
            }, options);

            // Build the selector based on available sections
            const selectorParts = [];
            if (hasProductDetails) selectorParts.push('#mobile-details-section');
            selectorParts.push('#mobile-specs-section', '#mobile-reviews-section');

            const sections = document.querySelectorAll(selectorParts.join(', '));
            sections.forEach((section) => {
                observer.observe(section);
            });

            return () => {
                sections.forEach((section) => {
                    observer.unobserve(section);
                });
            };
        }
    }, [hasProductDetails]);

    const handleTabClick = (tab: TabType): void => {
        setActiveTab(tab);
    };

    // Function to scroll to a section on mobile
    const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement | null>) => {
        if (sectionRef.current) {
            sectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Memoize description blocks to prevent unnecessary re-renders
    const memoizedDescriptionBlocks = useMemo(() => {
        if (!product?.description_blocks || product.description_blocks.length === 0) {
            return null;
        }

        return product.description_blocks.map((block, index) => (
            <div
                key={block._id || `block-${index}`}
                className={`pb-6 ${index < product.description_blocks.length - 1 ? 'border-b border-gray-200' : ''}`}>
                {/* Title heading removed as there is no title in the current data structure */}
                <div className="mt-2 md:flex md:flex-col md:items-center">
                    <div className="w-full text-center">
                        <div className="prose max-w-none text-gray-600 leading-relaxed">
                            {block?.description ? (
                                <div className="leading-snug">
                                    <ConvertHtml content={block.description} />
                                </div>
                            ) : (
                                <p className="text-base md:text-lg">No description available</p>
                            )}
                        </div>
                    </div>

                    {block?.url && (
                        <div className="mt-3 md:mt-4 w-full flex justify-center">
                            <div className="relative rounded-lg overflow-hidden bg-gray-50 h-56 md:h-80 w-full md:w-4/5 lg:w-3/4 border border-gray-100">
                                <Image
                                    key={`img-${block._id || `block-${index}`}`}
                                    src={getImageUrl(block.url)}
                                    alt={`${product.title} description image ${index + 1}`}
                                    fill
                                    className="object-contain"
                                    priority={index === 0}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 75vw"
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                                    onLoad={() => {
                                        // Optional: Handle successful image load
                                    }}
                                    onError={() => {
                                        // Prevent infinite loops by not setting src again
                                        console.warn(`Failed to load image: ${block.url}`);
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        ));
    }, [product?.description_blocks, product?.title]);

    return (
        <div className="mb-16">
            {/* Description Blocks Section */}
            {product?.description_blocks && product.description_blocks.length > 0 && (
                <div className="mb-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden px-2 py-4 md:p-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 mr-2 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            Product Information
                        </h2>

                        <div className="space-y-6">{memoizedDescriptionBlocks}</div>
                    </div>
                </div>
            )}

            {/* Mobile Section Navigation */}
            <div className="md:hidden mb-3">
                <div className="flex justify-center space-x-2">
                    {hasProductDetails && (
                        <button
                            className={`px-2 py-1.5 rounded-lg text-sm ${
                                mobileActiveSection === 'details' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                            onClick={() => scrollToSection(detailsRef)}>
                            Details
                        </button>
                    )}
                    <button
                        className={`px-2 py-1.5 rounded-lg text-sm ${
                            mobileActiveSection === 'specs' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => scrollToSection(specsRef)}>
                        Specs
                    </button>
                    <button
                        className={`px-2 py-1.5 rounded-lg text-sm ${
                            mobileActiveSection === 'reviews' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => scrollToSection(reviewsRef)}>
                        Reviews ({product?.reviews?.length || 0})
                    </button>
                </div>
            </div>

            {/* Mobile Sections (for screens smaller than md) - Vertical Scroll */}
            <div className="md:hidden">
                {/* Product Details Section - Only show if content exists */}
                {hasProductDetails && (
                    <div
                        id="mobile-details-section"
                        ref={detailsRef}
                        className="bg-white rounded-lg shadow-sm mb-4 px-2 py-4">
                        <h2 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                            <span className="bg-blue-100 p-1.5 rounded-full mr-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-blue-700"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </span>
                            Product Details
                        </h2>
                        <ProductDetailsTabContent
                            important_note={product?.important_note || ''}
                            main_features={product?.main_features || ''}
                        />
                    </div>
                )}

                {/* Specifications Section */}
                <div id="mobile-specs-section" ref={specsRef} className="bg-white rounded-lg shadow-sm mb-4 px-2 py-4">
                    <h2 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                        <span className="bg-green-100 p-1.5 rounded-full mr-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-green-700"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                                />
                            </svg>
                        </span>
                        Specifications
                    </h2>
                    <SpecificationTabContent specifications={product?.specification || []} />
                </div>

                {/* Reviews Section */}
                <div id="mobile-reviews-section" ref={reviewsRef} className="bg-white rounded-lg shadow-sm mb-4 px-2 py-4">
                    <h2 className="text-lg font-semibold text-purple-800 mb-3 flex items-center">
                        <span className="bg-purple-100 p-1.5 rounded-full mr-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-purple-700"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                />
                            </svg>
                        </span>
                        Reviews ({product?.reviews.length})
                    </h2>
                    <ReviewsTab
                        reviews={product?.reviews}
                        productId={product?._id || ''}
                        productCode={product?.code || ''}
                    />
                </div>
            </div>

            {/* Desktop Tab Display (for md screens and larger) */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Tab Navigation */}
                <div className="border-b border-gray-200">
                    <div className="flex flex-wrap w-full">
                        {hasProductDetails && (
                            <TabButton
                                isActive={activeTab === 'details'}
                                onClick={() => handleTabClick('details')}
                                label="Product Details"
                            />
                        )}
                        <TabButton
                            isActive={activeTab === 'specs'}
                            onClick={() => handleTabClick('specs')}
                            label="Specifications"
                        />
                        <TabButton
                            isActive={activeTab === 'reviews'}
                            onClick={() => handleTabClick('reviews')}
                            label={`Reviews (${product?.reviews?.length || 0})`}
                        />
                    </div>
                </div>

                {/* Tab Content */}
                <div className="px-2 py-4 sm:p-6 md:p-8">
                    {activeTab === 'details' && hasProductDetails && (
                        <ProductDetailsTabContent
                            important_note={product?.important_note || ''}
                            main_features={product?.main_features || ''}
                        />
                    )}
                    {activeTab === 'specs' && <SpecificationTabContent specifications={product?.specification || []} />}
                    {activeTab === 'reviews' && (
                        <ReviewsTab
                            reviews={product?.reviews || []}
                            productId={product?._id || ''}
                            productCode={product?.code || ''}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

interface TabButtonProps {
    isActive: boolean;
    onClick: () => void;
    label: string;
}

const TabButton: React.FC<TabButtonProps> = React.memo(({ isActive, onClick, label }) => {
    return (
        <button
            className={`px-3 sm:px-6 py-3 text-sm sm:text-base flex-1 text-center ${
                isActive ? 'font-semibold border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={onClick}>
            {label}
        </button>
    );
});

TabButton.displayName = 'TabButton';

export default ProductDescription;
