import React from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { FiStar, FiUser, FiCalendar, FiMessageCircle, FiImage, FiX } from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageUtils';

interface ReviewDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    review: any | null;
}

const ReviewDetailsModal: React.FC<ReviewDetailsModalProps> = ({ isOpen, onClose, review }) => {
    if (!review) return null;

    // Render status badge with appropriate color
    const renderStatusBadge = (status: string) => {
        let customClass = '';
        let icon = null;

        switch (status) {
            case 'pending':
                customClass = 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border border-yellow-200';
                icon = <FiStar className="w-3 h-3" />;
                break;
            case 'approved':
                customClass = 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200';
                icon = <FiStar className="w-3 h-3" />;
                break;
            case 'rejected':
                customClass = 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200';
                icon = <FiX className="w-3 h-3" />;
                break;
        }

        return (
            <Badge className={`${customClass} px-3 py-1 font-medium capitalize flex items-center gap-1`}>
                {icon}
                {status}
            </Badge>
        );
    };

    // Render star rating
    const renderRating = (rating: number) => {
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20">
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                    </svg>
                ))}
                <span className="ml-2 text-sm font-medium">{rating}/5</span>
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Review Details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Product Information Card */}
                    <Card className="border-l-4 border-l-blue-500 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Image
                                        src={getImageUrl(review.product_id?.thumbnail) || 'https://placehold.co/100x100'}
                                        alt={review.product_id?.title}
                                        width={80}
                                        height={80}
                                        className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{review.product_id?.title}</h3>
                                    <p className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block">
                                        Code: {review?.product_id?.code}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer & Review Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Customer Information */}
                        <Card className="shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <FiUser className="w-5 h-5 text-blue-600" />
                                    <h4 className="text-lg font-semibold text-gray-900">Customer Information</h4>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                                        {review?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-lg">{review?.name || 'Anonymous'}</p>
                                        <p className="text-sm text-gray-500">Customer</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Review Metadata */}
                        <Card className="shadow-lg">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <FiCalendar className="w-5 h-5 text-green-600" />
                                    <h4 className="text-lg font-semibold text-gray-900">Review Metadata</h4>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Review Date</p>
                                        <p className="text-gray-900">
                                            {review.createdAt &&
                                                format(new Date(review.createdAt), "MMMM dd, yyyy 'at' hh:mm a")}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Status</p>
                                        <div className="mt-1">{renderStatusBadge(review.status)}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Rating Card */}
                    <Card className="shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <FiStar className="w-5 h-5 text-yellow-600" />
                                <h4 className="text-lg font-semibold text-gray-900">Rating</h4>
                            </div>
                            <div className="flex items-center gap-4">
                                {renderRating(review.rating)}
                                <span className="text-sm text-gray-600">({review.rating} out of 5 stars)</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Review Comment */}
                    <Card className="shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <FiMessageCircle className="w-5 h-5 text-purple-600" />
                                <h4 className="text-lg font-semibold text-gray-900">Review Comment</h4>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                                    {review?.comment || review?.message || 'No comment provided.'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Review Images */}
                    {review?.images && review.images.length > 0 && (
                        <Card className="shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <FiImage className="w-5 h-5 text-indigo-600" />
                                    <h4 className="text-lg font-semibold text-gray-900">
                                        Review Images ({review.images.length})
                                    </h4>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {review.images.map((image: any, index: number) => (
                                        <div key={index} className="relative group">
                                            <Image
                                                src={getImageUrl(typeof image === "string" ? image : image?.url)}
                                                alt={`Review Image ${index + 1}`}
                                                width={150}
                                                height={150}
                                                className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm group-hover:shadow-md transition-shadow duration-200"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-200"></div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <DialogFooter className="pt-6 border-t border-gray-200">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                        <FiX className="w-4 h-4 mr-2" />
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewDetailsModal;
