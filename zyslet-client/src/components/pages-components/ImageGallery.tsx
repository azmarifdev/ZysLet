'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ThumbnailGallery from './ImageGallery/ThumbnailGallery';
import NavigationControls from './ImageGallery/NavigationControls';
import MainImage from './ImageGallery/MainImage';

interface ImageGalleryProps {
    images: { _id: string; url: string }[];
    className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, className = '' }) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    const [isZoomed, setIsZoomed] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(true);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const slideContainerRef = useRef<HTMLDivElement>(null!);
    const thumbnailsRef = useRef<HTMLDivElement>(null!) as React.RefObject<HTMLDivElement>;
    const mainImageRef = useRef<HTMLDivElement>(null);
    const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Check if on mobile device with debouncing for better performance
    useEffect(() => {
        // Debounce the resize event for better performance
        let resizeTimer: ReturnType<typeof setTimeout>;

        const checkIsMobile = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                setIsMobile(window.innerWidth < 768);
            }, 150);
        };

        // Initial check without delay
        setIsMobile(window.innerWidth < 768);

        // Add listener with debounce
        window.addEventListener('resize', checkIsMobile);

        return () => {
            window.removeEventListener('resize', checkIsMobile);
            if (resizeTimer) clearTimeout(resizeTimer);
        };
    }, []);

    // Calculate width of slides on mount and window resize
    useEffect(() => {
        const updateSlideWidth = () => {
            if (slideContainerRef.current) {
                const slides = slideContainerRef.current.querySelectorAll('.gallery-slide');
                // Use requestAnimationFrame for better performance with DOM operations
                requestAnimationFrame(() => {
                    slides.forEach((slide, index) => {
                        (slide as HTMLElement).style.transform = `translateX(${index * 100}%)`;
                    });
                });
            }
        };

        updateSlideWidth();

        // Debounce resize event for better performance
        let resizeTimer: ReturnType<typeof setTimeout>;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateSlideWidth, 100);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimer);
        };
    }, [images.length]);

    // Handle slide transitions
    useEffect(() => {
        if (slideContainerRef.current) {
            const slides = slideContainerRef.current.querySelectorAll('.gallery-slide');

            // Use requestAnimationFrame for smoother animation performance
            requestAnimationFrame(() => {
                slides.forEach((slide, index) => {
                    (slide as HTMLElement).style.transform = `translateX(${(index - activeIndex) * 100}%)`;
                });
            });
        }

        // Scroll the thumbnail into view when active image changes
        // Using requestAnimationFrame for smoother DOM operations
        if (thumbnailsRef.current) {
            requestAnimationFrame(() => {
                const activeThumb = thumbnailsRef.current?.querySelector(`[data-index="${activeIndex}"]`);
                if (activeThumb) {
                    if (isMobile) {
                        activeThumb.scrollIntoView({
                            behavior: 'smooth',
                            inline: 'center',
                            block: 'nearest',
                        });
                    } else {
                        activeThumb.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest',
                        });
                    }
                }
            });
        }
    }, [activeIndex, isMobile]);

    // Helper to clear any existing transition timers
    const clearTransitionTimer = useCallback(() => {
        if (transitionTimerRef.current) {
            clearTimeout(transitionTimerRef.current);
            transitionTimerRef.current = null;
        }
    }, []);

    // Set a new transition timer with shorter duration for faster responsiveness
    const startTransitionTimer = useCallback(() => {
        setIsTransitioning(true);
        clearTransitionTimer();
        transitionTimerRef.current = setTimeout(() => {
            setIsTransitioning(false);
            transitionTimerRef.current = null;
        }, 150); // Much shorter transition time for immediate responsiveness
    }, [clearTransitionTimer]);

    // Handle navigation with improved responsiveness
    const handlePrevious = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            if (isZoomed) return;

            // Always update the activeIndex immediately regardless of transition state
            setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

            // Use a very brief transition effect
            startTransitionTimer();
        },
        [isZoomed, images.length, startTransitionTimer],
    );

    const handleNext = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            if (isZoomed) return;

            // Always update the activeIndex immediately regardless of transition state
            setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

            // Use a very brief transition effect
            startTransitionTimer();
        },
        [isZoomed, images.length, startTransitionTimer],
    );

    const handleThumbnailClick = useCallback(
        (index: number) => {
            if (index === activeIndex || isZoomed) return;

            // Immediately update the active index
            setActiveIndex(index);

            // Use a very brief transition effect
            startTransitionTimer();
        },
        [activeIndex, isZoomed, startTransitionTimer],
    );

    // For touch swipe support
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Minimum swipe distance threshold
    const minSwipeDistance = 50;

    // Optimize touch handlers with useCallback
    const onTouchStart = useCallback(
        (e: React.TouchEvent) => {
            if (isZoomed) return; // Don't process touch events when zoomed
            setTouchEnd(null);
            setTouchStart(e.targetTouches?.[0]?.clientX);
        },
        [isZoomed],
    );

    const onTouchMove = useCallback(
        (e: React.TouchEvent) => {
            if (isZoomed) return; // Don't process touch events when zoomed
            setTouchEnd(e.targetTouches?.[0]?.clientX);
        },
        [isZoomed],
    );

    const onTouchEnd = useCallback(() => {
        if (!touchStart || !touchEnd || isZoomed) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNext({ stopPropagation: () => {} } as React.MouseEvent);
        } else if (isRightSwipe) {
            handlePrevious({ stopPropagation: () => {} } as React.MouseEvent);
        }
    }, [touchStart, touchEnd, isZoomed, handleNext, handlePrevious, minSwipeDistance]);

    // Handle image zoom with throttling for better performance
    const handleImageZoom = useCallback(
        (e: React.MouseEvent) => {
            if (isMobile) return;

            if (mainImageRef.current) {
                // Use requestAnimationFrame to optimize performance by reducing updates
                requestAnimationFrame(() => {
                    if (!mainImageRef.current) return;
                    const { left, top, width, height } = mainImageRef.current.getBoundingClientRect();
                    const x = ((e.clientX - left) / width) * 100;
                    const y = ((e.clientY - top) / height) * 100;

                    setMousePosition({ x, y });
                });
            }
        },
        [isMobile],
    );

    const handleZoomToggle = useCallback(() => {
        if (isMobile) return;
        setIsZoomed((prev) => !prev);
    }, [isMobile]);

    const handleZoomExit = useCallback(() => {
        setIsZoomed(false);
    }, []);

    // Cleanup transition timers on unmount
    useEffect(() => {
        return () => clearTransitionTimer();
    }, [clearTransitionTimer]);

    return (
        <div className={`relative ${className}`}>
            {/* Vertical stacked layout with thumbnails below main image */}
            <div className="flex flex-col gap-4">
                {/* Main image container - with dedicated space for navigation controls */}
                <div ref={mainImageRef} className="relative">
                    <MainImage
                        images={images}
                        activeIndex={activeIndex}
                        isZoomed={isZoomed}
                        isMobile={isMobile}
                        mousePosition={mousePosition}
                        slideContainerRef={slideContainerRef}
                        onImageZoom={handleImageZoom}
                        onZoomToggle={handleZoomToggle}
                        onZoomExit={handleZoomExit}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    />

                    {/* Navigation buttons - hidden when zoomed and positioned to avoid thumbnails */}
                    {!isZoomed && (
                        <NavigationControls
                            totalImages={images.length}
                            activeIndex={activeIndex}
                            isTransitioning={isTransitioning}
                            onPrevious={handlePrevious}
                            onNext={handleNext}
                        />
                    )}
                </div>

                {/* Thumbnails - horizontal row on both mobile and desktop */}
                <div className="mt-2">
                    <ThumbnailGallery
                        images={images}
                        activeIndex={activeIndex}
                        isMobile={isMobile}
                        onThumbnailClick={handleThumbnailClick}
                        thumbnailsRef={thumbnailsRef}
                        isTransitioning={isTransitioning}
                    />
                </div>
            </div>
        </div>
    );
};

export default ImageGallery;
