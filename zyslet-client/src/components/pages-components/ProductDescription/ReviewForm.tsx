import React, { useState, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { config } from '@/config/env';

interface ReviewFormProps {
    productId: string;
    onReviewSubmitted?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onReviewSubmitted }) => {
    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [reviewName, setReviewName] = useState<string>('');
    const [reviewPhone, setReviewPhone] = useState<string>('');
    const [reviewText, setReviewText] = useState<string>('');
    const [reviewImages, setReviewImages] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [imageError, setImageError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageError(null);
        const files = e.target.files;

        if (!files || files.length === 0) return;

        // Check if adding these files would exceed the limit
        if (reviewImages.length + files.length > 5) {
            setImageError('Maximum 5 images allowed');
            return;
        }

        // Process each file
        Array.from(files).forEach((file) => {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setImageError('Images must be less than 5MB each');
                return;
            }

            // Check file type
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setImageError('Please upload only JPEG, PNG, or WebP images');
                return;
            }

            // Add file to reviewImages state for form submission
            setReviewImages((prev) => [...prev, file]);

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setPreviewImages((prev) => [...prev, event.target!.result as string]);
                }
            };
            reader.readAsDataURL(file);
        });

        // Reset file input to allow selecting the same files again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeImage = (indexToRemove: number) => {
        setReviewImages(reviewImages.filter((_, index) => index !== indexToRemove));
        setPreviewImages(previewImages.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Create a new FormData instance
            const formData = new FormData();

            // Add all form fields based on the API requirements from the image
            formData.append('product_id', productId);
            formData.append('name', reviewName);
            formData.append('phone', reviewPhone);
            formData.append('rating', rating.toString());
            formData.append('message', reviewText);

            // Add all selected images to the FormData
            reviewImages.forEach((image) => {
                formData.append('images', image);
            });

            // Make the API request
            const response = await axios.post(`${config.BASE_URL}/api/v1/review/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data?.success) {
                // Reset form on success
                setRating(0);
                setReviewName('');
                setReviewPhone('');
                setReviewText('');
                setReviewImages([]);
                setPreviewImages([]);
                setSubmitSuccess(true);

                // Notify parent component if callback provided
                if (onReviewSubmitted) {
                    onReviewSubmitted();
                }

                // Reset success message after a delay
                setTimeout(() => {
                    setSubmitSuccess(false);
                }, 5000);
            } else {
                setSubmitError(response.data?.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            setSubmitError('An error occurred while submitting your review. Please try again.');
        } finally {
            setIsSubmitting(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {submitSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-700 text-sm font-medium">Your review has been submitted successfully!</p>
                </div>
            )}

            {submitError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-700 text-sm font-medium">{submitError}</p>
                </div>
            )}

            <div className="mb-4">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                    Rating*
                </label>
                <div className="flex">
                    {[...Array(5)].map((_, i) => (
                        <button
                            type="button"
                            key={i}
                            onClick={() => setRating(i + 1)}
                            onMouseEnter={() => setHoverRating(i + 1)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="w-6 h-6 focus:outline-none">
                            <svg
                                className="w-6 h-6"
                                fill={(hoverRating || rating) > i ? 'rgb(250 204 21)' : 'rgb(209 213 219)'}
                                viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                        </button>
                    ))}
                </div>
                {rating === 0 && <p className="text-red-500 text-xs mt-1">Please select a rating</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name*
                </label>
                <input
                    type="text"
                    id="name"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone*
                </label>
                <input
                    type="number"
                    id="phone"
                    value={reviewPhone}
                    onChange={(e) => setReviewPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
                    Review*
                </label>
                <textarea
                    id="review"
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required></textarea>
            </div>

            <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Add Photos (optional, max 5)</label>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageUpload}
                    multiple
                />

                {previewImages?.length > 0 ? (
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {previewImages.map((image, index) => (
                            <div key={index} className="relative h-24 rounded-md overflow-hidden border border-gray-200">
                                <div className="relative w-full h-full">
                                    <Image
                                        src={image}
                                        alt={`Review image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 50vw, 33vw"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-gray-600"
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
                        ))}

                        {previewImages.length < 5 && (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-gray-400 mb-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                <p className="text-xs text-gray-500">Add more</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-gray-400 mb-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <p className="text-sm text-gray-500">Click to upload images</p>
                        <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP (max 5MB each)</p>
                    </div>
                )}

                {imageError && <p className="text-red-500 text-xs mt-1">{imageError}</p>}
            </div>

            <button
                type="submit"
                disabled={rating === 0 || isSubmitting}
                className={`w-full font-medium py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ${
                    rating === 0 || isSubmitting
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                {isSubmitting ? (
                    <span className="flex items-center justify-center">
                        <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                    </span>
                ) : (
                    'Submit Review'
                )}
            </button>
        </form>
    );
};

export default ReviewForm;
