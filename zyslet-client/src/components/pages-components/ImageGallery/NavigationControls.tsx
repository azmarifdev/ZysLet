import React from 'react';

interface NavigationControlsProps {
    totalImages: number;
    activeIndex: number;
    isTransitioning: boolean;
    // eslint-disable-next-line no-unused-vars
    onPrevious: (e: React.MouseEvent) => void;
    // eslint-disable-next-line no-unused-vars
    onNext: (e: React.MouseEvent) => void;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
    totalImages,
    activeIndex,
    isTransitioning,
    onPrevious,
    onNext,
}) => {
    // Visual indicator but no functional disabling
    const isInTransition = isTransitioning;

    return (
        <>
            {/* Previous button - positioned on the left side of the main image */}
            <button
                type="button"
                className={`absolute top-1/2 left-2 -translate-y-1/2 z-20 inline-flex justify-center items-center text-gray-800 focus:outline-none ${
                    isInTransition ? 'opacity-70' : ''
                }`}
                onClick={onPrevious}>
                <span className="sr-only">Previous</span>
                <span
                    className="flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/90 shadow-md backdrop-blur-sm hover:bg-white border border-gray-100 transition-all duration-150 active:scale-95"
                    aria-hidden="true"
                    style={{ filter: 'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07))' }}>
                    <svg
                        className="w-5 h-5 md:w-6 md:h-6 text-gray-700"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6"></path>
                    </svg>
                </span>
            </button>

            {/* Next button - positioned on the right side of the main image */}
            <button
                type="button"
                className={`absolute top-1/2 right-2 -translate-y-1/2 z-20 inline-flex justify-center items-center text-gray-800 focus:outline-none ${
                    isInTransition ? 'opacity-70' : ''
                }`}
                onClick={onNext}>
                <span className="sr-only">Next</span>
                <span
                    className="flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/90 shadow-md backdrop-blur-sm hover:bg-white border border-gray-100 transition-all duration-150 active:scale-95"
                    aria-hidden="true"
                    style={{ filter: 'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07))' }}>
                    <svg
                        className="w-5 h-5 md:w-6 md:h-6 text-gray-700"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6"></path>
                    </svg>
                </span>
            </button>

            {/* Image counter/indicator - refined styling */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm font-medium z-10">
                {activeIndex + 1} / {totalImages}
            </div>
        </>
    );
};

export default NavigationControls;
