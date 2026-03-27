import React from 'react';
import Image from 'next/image';
import { MousePosition } from './types';
import { getImageUrl } from '@/lib/imageUtils';

interface MainImageProps {
    images: { _id: string; url: string }[];
    activeIndex: number;
    isZoomed: boolean;
    isMobile: boolean;
    mousePosition: MousePosition;
    slideContainerRef: React.RefObject<HTMLDivElement>;
    // eslint-disable-next-line no-unused-vars
    onImageZoom: (e: React.MouseEvent) => void;
    onZoomToggle: () => void;
    onZoomExit: () => void;
    // eslint-disable-next-line no-unused-vars
    onTouchStart: (e: React.TouchEvent) => void;
    // eslint-disable-next-line no-unused-vars
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
}

const MainImage: React.FC<MainImageProps> = ({
    images,
    activeIndex,
    isZoomed,
    isMobile,
    mousePosition,
    slideContainerRef,
    onImageZoom,
    onZoomToggle,
    onZoomExit,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
}) => {
    return (
        <div
            className={`relative overflow-hidden min-h-[200px] sm:min-h-[280px] md:min-h-[320px] lg:min-h-[380px] bg-white rounded-xl border border-gray-100 shadow-sm ${
                isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onMouseMove={onImageZoom}
            onClick={onZoomToggle}
            onMouseLeave={onZoomExit}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}>
            <div
                ref={slideContainerRef}
                className="absolute top-0 bottom-0 left-0 right-0 flex transition-opacity duration-150">
                {images.map((image, index) => (
                    <div
                        key={image._id}
                        className="gallery-slide absolute top-0 left-0 w-full h-full transition-transform duration-150 ease-in-out">
                        <div className="relative w-full h-full flex items-center justify-center p-4">
                            {isZoomed && activeIndex === index ? (
                                <ZoomedImage image={image} mousePosition={mousePosition} />
                            ) : (
                                <Image
                                    src={getImageUrl(image.url)}
                                    alt={image._id}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 40vw"
                                    className={`object-contain transition-transform duration-150 ${
                                        !isZoomed && !isMobile ? 'hover:scale-105' : ''
                                    }`}
                                    priority={index === 0}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Zoom indicator - only visible on desktop and when not zoomed */}
            {!isMobile && !isZoomed && <ZoomIndicator />}

            {/* Exit zoom button - only visible when zoomed */}
            {isZoomed && (
                <ExitZoomButton
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onZoomExit();
                    }}
                />
            )}
        </div>
    );
};

interface ZoomedImageProps {
    image: { _id: string; url: string };
    mousePosition: MousePosition;
}

const ZoomedImage: React.FC<ZoomedImageProps> = ({ image, mousePosition }) => {
    return (
        <div className="absolute inset-0 bg-white">
            <div
                className="w-[150%] h-[150%] absolute"
                style={{
                    transform: `translate(-${mousePosition.x}%, -${mousePosition.y}%)`,
                    transformOrigin: 'center',
                }}>
                <Image src={getImageUrl(image.url)} alt={image._id} fill sizes="200vw" className="object-contain" priority />
            </div>
        </div>
    );
};

const ZoomIndicator: React.FC = () => {
    return (
        <div className="absolute bottom-4 right-4 hidden md:flex items-center text-xs text-gray-700 bg-white/80 px-2 py-1 rounded-md backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 8a1 1 0 011-1h1V6a1 1 0 012 0v1h1a1 1 0 110 2H9v1a1 1 0 11-2 0V9H6a1 1 0 01-1-1z" />
                <path
                    fillRule="evenodd"
                    d="M2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8zm6-4a4 4 0 100 8 4 4 0 000-8z"
                    clipRule="evenodd"
                />
            </svg>
            <span>Click to zoom</span>
        </div>
    );
};

interface ExitZoomButtonProps {
    // eslint-disable-next-line no-unused-vars
    onClick: (e: React.MouseEvent) => void;
}

const ExitZoomButton: React.FC<ExitZoomButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="absolute top-4 right-4 bg-white/80 text-gray-700 rounded-full p-2 shadow-md backdrop-blur-sm z-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                />
            </svg>
        </button>
    );
};

export default MainImage;
