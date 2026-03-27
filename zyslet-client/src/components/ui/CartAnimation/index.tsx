'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imageUtils';

interface Position {
    x: number;
    y: number;
}

interface CartAnimationProps {
    productImage: string;
    productName: string;
    startPosition: Position;
    endPosition: Position;
    onAnimationComplete: () => void;
}

const CartAnimation: React.FC<CartAnimationProps> = ({
    productImage,
    productName,
    startPosition,
    endPosition,
    onAnimationComplete,
}) => {
    const [position, setPosition] = useState<Position>(startPosition);
    const [opacity, setOpacity] = useState<number>(1);
    const [scale, setScale] = useState<number>(1);
    const [rotation, setRotation] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean>(true);
    const [showSuccessIcon, setShowSuccessIcon] = useState<boolean>(false);

    // Process image URL to ensure it's absolute
    const processedImageUrl = getImageUrl(productImage);

    useEffect(() => {
        if (!isActive) return;

        // Start the animation
        const animationDuration = 800; // ms
        const startTime = Date.now();

        // Calculate animation curve (easeOutBack for a bouncy effect)
        const animateFrame = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / animationDuration, 1);

            // Custom easing function for a more dynamic feel
            const easeProgress =
                progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            // Add a slight arc to the path (parabolic trajectory)
            const arcHeight = 100; // maximum height of the arc in pixels
            const arcProgress = Math.sin(easeProgress * Math.PI);

            // Update position with arc effect
            setPosition({
                x: startPosition.x + (endPosition.x - startPosition.x) * easeProgress,
                y: startPosition.y + (endPosition.y - startPosition.y) * easeProgress - arcHeight * arcProgress,
            });

            // Update visual effects
            setScale(progress < 0.85 ? 1 - 0.4 * easeProgress : 0.6 - ((progress - 0.85) / 0.15) * 0.6); // Scale from 1 to 0.6, then shrink quickly
            setOpacity(progress < 0.85 ? 1 : 1 - (progress - 0.85) / 0.15); // Keep full opacity until 85%, then fade out
            setRotation(progress < 0.7 ? easeProgress * 360 : 360); // Rotate for visual interest

            // Show success checkmark briefly at the end
            if (progress > 0.6 && progress < 0.85) {
                setShowSuccessIcon(true);
            }

            if (progress < 1) {
                requestAnimationFrame(animateFrame);
            } else {
                // Animation complete
                setIsActive(false);
                setTimeout(() => {
                    onAnimationComplete();
                }, 50);
            }
        };

        requestAnimationFrame(animateFrame);
    }, [startPosition, endPosition, isActive, onAnimationComplete]);

    if (!isActive) return null;

    return (
        <div
            className="fixed z-[9999] pointer-events-none"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
                opacity: opacity,
                transition: 'transform 0.05s ease-out, opacity 0.05s ease-out',
            }}>
            <div className="relative w-16 h-16">
                {/* Product image container */}
                <div className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center overflow-hidden border-2 border-blue-400">
                    {processedImageUrl && processedImageUrl !== '' ? (
                        <div className="relative w-14 h-14">
                            <Image
                                src={processedImageUrl}
                                alt={productName || 'Product'}
                                fill
                                className="object-cover rounded-full"
                                sizes="56px"
                                onError={() => {
                                    // Handle image load error gracefully
                                }}
                            />
                        </div>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-green-500"
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
                    )}
                </div>

                {/* Cart icon badge with pulse effect */}
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full w-8 h-8 flex items-center justify-center border-2 border-white shadow-md">
                    {showSuccessIcon ? (
                        <svg
                            className="h-4 w-4 text-white animate-pulse"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                    )}
                </div>

                {/* Sparkle effects */}
                <div
                    className="absolute top-0 right-0 w-4 h-4 bg-yellow-300 rounded-full opacity-70 animate-ping"
                    style={{ animationDuration: '0.8s' }}></div>
                <div
                    className="absolute bottom-2 left-0 w-3 h-3 bg-blue-400 rounded-full opacity-60 animate-ping"
                    style={{ animationDuration: '1.2s' }}></div>
            </div>
        </div>
    );
};

export default CartAnimation;
