import React, { useState } from 'react';
import Image from 'next/image';
import { Review } from '@/app/product/types';
import { getImageUrl } from '@/lib/imageUtils';

const CustomerReview: React.FC<Review> = ({ name, message, rating, images, createdAt }) => {
    const [activeImage, setActiveImage] = useState<string | null>(null);

    return (
        <div className="bg-white hover:bg-gray-50 rounded-lg p-3 md:p-6 border border-gray-200 mb-8 shadow-sm transition-all duration-300">
            <div className="flex items-center mb-3">
                {/* User avatar */}
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-3">
                    {name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1">
                    <div className="font-semibold text-gray-800 text-lg">{name}</div>
                    <div className="flex items-center">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className="w-5 h-5"
                                    fill={i < rating ? 'currentColor' : '#d1d5db'}
                                    viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                            ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">{rating} out of 5</span>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    {new Date(createdAt)?.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </div>
            </div>

            <div className="py-3 border-t border-b border-gray-100 mb-4">
                <p className="text-gray-700">{message}</p>
            </div>

            {images?.length > 0 && (
                <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-3">Photos from this review</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className="relative group cursor-pointer rounded-lg overflow-hidden"
                                onClick={() => setActiveImage(image)}>
                                <Image
                                    src={getImageUrl(image)}
                                    alt={`Review image ${index + 1}`}
                                    width={200}
                                    height={200}
                                    className="h-36 w-full object-cover transform transition-transform hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Image preview modal */}
            {activeImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
                    onClick={() => setActiveImage(null)}>
                    <div className="relative max-w-3xl max-h-full">
                        <Image
                            src={getImageUrl(activeImage)}
                            alt="Review image full view"
                            width={800}
                            height={800}
                            className="max-h-[90vh] w-auto object-contain"
                        />
                        <button
                            onClick={() => setActiveImage(null)}
                            className="absolute -top-12 right-0 text-white p-2 rounded-full hover:bg-white hover:bg-opacity-20">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerReview;
