import React from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imageUtils';

interface ThumbnailGalleryProps {
    images: { _id: string; url: string }[];
    activeIndex: number;
    isMobile: boolean;
    // eslint-disable-next-line no-unused-vars
    onThumbnailClick: (index: number) => void;
    thumbnailsRef: React.RefObject<HTMLDivElement>;
    isTransitioning?: boolean; // Add transitioning state to show visual feedback
}

const ThumbnailGallery: React.FC<ThumbnailGalleryProps> = ({
    images,
    activeIndex,
    isMobile,
    onThumbnailClick,
    thumbnailsRef,
    isTransitioning = false,
}) => {
    // Handle click with debounce to prevent too many rapid clicks
    const handleThumbnailClick = (index: number) => {
        // Always execute the click handler, even during transition
        onThumbnailClick(index);
    };

    return (
        <div ref={thumbnailsRef}>
            {/* Horizontal thumbnails for both mobile and desktop */}
            <div className="flex overflow-x-auto space-x-2 pb-1 px-1 justify-center">
                {images.map((image, index) => (
                    <Thumbnail
                        key={image._id}
                        image={image}
                        index={index}
                        isActive={activeIndex === index}
                        onClick={handleThumbnailClick}
                        isMobile={isMobile}
                        isTransitioning={isTransitioning && activeIndex !== index}
                    />
                ))}
            </div>
        </div>
    );
};

interface ThumbnailProps {
    image: { _id: string; url: string };
    index: number;
    isActive: boolean;
    // eslint-disable-next-line no-unused-vars
    onClick: (index: number) => void;
    isMobile: boolean;
    isTransitioning?: boolean;
}

const Thumbnail: React.FC<ThumbnailProps> = ({ image, index, isActive, onClick, isMobile, isTransitioning = false }) => {
    return (
        <div
            data-index={index}
            className={`shrink-0 border-2 ${
                isActive ? 'border-blue-500 ring-2 ring-blue-300 shadow-md' : 'border-gray-200 hover:border-gray-300'
            } rounded-lg overflow-hidden ${isTransitioning ? 'opacity-50' : ''} cursor-pointer ${
                isMobile ? 'w-12 h-12' : 'w-16 h-16'
            } transition-all duration-200`}
            onClick={() => onClick(index)}>
            <div className="relative w-full h-full group">
                <Image
                    src={getImageUrl(image.url)}
                    alt={`Thumbnail for ${image._id}`}
                    fill
                    sizes={isMobile ? '48px' : '64px'}
                    className={`object-cover ${!isActive ? 'group-hover:scale-110' : ''} transition-transform duration-300`}
                />
                {isActive && <div className="absolute inset-0 bg-blue-500/10"></div>}
            </div>
        </div>
    );
};

export default ThumbnailGallery;
