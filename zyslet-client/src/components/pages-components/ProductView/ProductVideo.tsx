import React from 'react';

interface ProductVideoProps {
    youtubeUrl: string;
}

const ProductVideo: React.FC<ProductVideoProps> = ({ youtubeUrl }) => {
    // Extract video ID from YouTube URL
    const getYouTubeVideoId = (url: string): string | null => {
        // Handle different YouTube URL formats
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        return match && match[2].length === 11 ? match[2] : null;
    };

    const videoId = getYouTubeVideoId(youtubeUrl);

    if (!videoId) {
        return null;
    }

    return (
        <div className="mt-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 md:p-6">
                    <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-red-600"
                            viewBox="0 0 24 24"
                            fill="currentColor">
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                        Product Video
                    </h3>
                    <div className="aspect-video w-full overflow-hidden rounded-lg">
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title="Product Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductVideo;
