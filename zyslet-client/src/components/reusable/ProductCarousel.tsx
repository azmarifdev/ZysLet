'use client';

import { useRef, FC, useCallback, useState, useEffect, TouchEvent, MouseEvent } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';

interface ProductCarouselProps {
    products: any;
    title: string;
    scrollAmount?: number;
    showSeeAllButton?: boolean; // Optional prop to control visibility of "See All" button
}

const ProductCarousel: FC<ProductCarouselProps> = ({ products, title, scrollAmount = 300, showSeeAllButton = false }) => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [showLeftButton, setShowLeftButton] = useState<boolean>(false);
    const [showRightButton, setShowRightButton] = useState<boolean>(true);
    const [touchStartX, setTouchStartX] = useState<number>(0);
    const [touchEndX, setTouchEndX] = useState<number>(0);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [startX, setStartX] = useState<number>(0);
    const [scrollLeft, setScrollLeft] = useState<number>(0);

    // Memoize scroll handlers to prevent unnecessary re-renders
    const scrollLeftFunc = useCallback(() => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth',
            });
        }
    }, [scrollAmount]);

    const scrollRightFunc = useCallback(() => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth',
            });
        }
    }, [scrollAmount]);

    // Check if scroll buttons should be visible
    const checkScrollPosition = useCallback(() => {
        if (carouselRef.current) {
            // Show left button only if scrolled to the right
            setShowLeftButton(carouselRef.current.scrollLeft > 0);

            // Show right button only if there's more content to scroll to
            const isAtEnd =
                carouselRef.current.scrollLeft + carouselRef.current.clientWidth >= carouselRef.current.scrollWidth - 10; // 10px threshold for small rounding differences

            setShowRightButton(!isAtEnd);
        }
    }, []);

    // Add scroll event listener to update button visibility
    useEffect(() => {
        const carousel = carouselRef.current;
        if (carousel) {
            carousel.addEventListener('scroll', checkScrollPosition);
            // Initial check
            checkScrollPosition();

            // Check if there's enough content to scroll
            setShowRightButton(carousel.scrollWidth > carousel.clientWidth);
        }

        return () => {
            if (carousel) {
                carousel.removeEventListener('scroll', checkScrollPosition);
            }
        };
    }, [checkScrollPosition]);

    // Update button visibility when window is resized
    useEffect(() => {
        const handleResize = () => {
            checkScrollPosition();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [checkScrollPosition]);

    // Touch event handlers for swipe functionality
    const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        setTouchStartX(e.touches?.[0]?.clientX);
    };

    const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
        setTouchEndX(e.touches?.[0]?.clientX);
    };

    const handleTouchEnd = () => {
        if (!carouselRef.current) return;

        const touchDiff = touchStartX - touchEndX;

        // Minimum swipe distance threshold (pixels)
        const minSwipeDistance = 50;

        if (Math.abs(touchDiff) > minSwipeDistance) {
            // Swipe left (to see content on the right)
            if (touchDiff > 0 && showRightButton) {
                scrollRightFunc();
            }
            // Swipe right (to see content on the left)
            else if (touchDiff < 0 && showLeftButton) {
                scrollLeftFunc();
            }
        }

        // Reset touch coordinates
        setTouchStartX(0);
        setTouchEndX(0);
    };

    // Mouse event handlers for drag functionality
    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        if (!carouselRef.current) return;

        e.preventDefault();
        setIsDragging(true);
        setStartX(e.pageX - carouselRef.current.offsetLeft);
        setScrollLeft(carouselRef.current.scrollLeft);

        // Change cursor style
        if (carouselRef.current) {
            carouselRef.current.style.cursor = 'grabbing';
        }
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !carouselRef.current) return;

        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // Scroll speed factor
        carouselRef.current.scrollLeft = scrollLeft - walk;

        // Update button visibility during drag
        checkScrollPosition();
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (carouselRef.current) {
            carouselRef.current.style.cursor = 'grab';
        }
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            if (carouselRef.current) {
                carouselRef.current.style.cursor = 'grab';
            }
        }
    };

    return (
        <div className="my-10 relative">
            {/* Header section with title and see all button */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                {showSeeAllButton && (
                    <Link
                        href={`/productPage`}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300 rounded-lg shadow-sm">
                        <span>See All</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                )}
            </div>

            {/* Carousel with buttons outside */}
            <div className="flex items-center gap-2">
                {/* Left Desktop Button - Outside carousel */}
                <div className="hidden md:flex items-center justify-center">
                    <button
                        onClick={scrollLeftFunc}
                        disabled={!showLeftButton}
                        aria-label="Scroll left"
                        className={`bg-white rounded-full shadow-lg p-3 transition-all duration-200 
                        ${showLeftButton ? 'opacity-100 hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 24 24"
                            stroke="currentColor"
                            className="h-5 w-5 text-blue-600">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* Carousel container */}
                <div className="flex-1 relative overflow-hidden">
                    {/* Mobile Left Button - Inside but at the very edge */}
                    {showLeftButton && (
                        <button
                            onClick={scrollLeftFunc}
                            aria-label="Scroll left"
                            className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md z-10 md:hidden">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="h-5 w-5 text-blue-600">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {/* Carousel Content with touch and mouse drag support */}
                    <div
                        ref={carouselRef}
                        className={`flex overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory space-x-1 md:space-x-6 py-4 px-2
                        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                        role="region"
                        aria-label={`${title} products carousel`}
                        tabIndex={0}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}>
                        {products?.map((product: any) => (
                            <div
                                key={product.id}
                                className="flex-shrink-0 snap-start w-[220px] sm:w-[250px] md:w-[280px] h-full">
                                <ProductCard {...product} />
                            </div>
                        ))}
                    </div>

                    {/* Mobile Right Button - Inside but at the very edge */}
                    {showRightButton && (
                        <button
                            onClick={scrollRightFunc}
                            aria-label="Scroll right"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md z-10 md:hidden">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="h-5 w-5 text-blue-600">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Right Desktop Button - Outside carousel */}
                <div className="hidden md:flex items-center justify-center">
                    <button
                        onClick={scrollRightFunc}
                        disabled={!showRightButton}
                        aria-label="Scroll right"
                        className={`bg-white rounded-full shadow-lg p-3 transition-all duration-200 
                        ${showRightButton ? 'opacity-100 hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 24 24"
                            stroke="currentColor"
                            className="h-5 w-5 text-blue-600">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Swipe/drag indicator */}
            <div className="flex justify-center mt-4">
                <div className="flex items-center text-xs text-gray-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-3 w-3 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    <span className="hidden sm:inline">Drag to see more</span>
                    <span className="sm:hidden">Swipe to see more</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-3 w-3 ml-1">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default ProductCarousel;
