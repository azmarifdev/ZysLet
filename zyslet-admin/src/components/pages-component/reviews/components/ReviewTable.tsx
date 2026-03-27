/* eslint-disable no-unused-vars */
// components/review/ReviewTable.tsx
import React from 'react';
import { format } from 'date-fns';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { useTogglePublishMutation } from '@/redux/api/reviewApi';
import { FiEye, FiCheck, FiX, FiTrash2, FiStar } from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageUtils';

interface ReviewTableProps {
    data: any[];
    handleAction: (type: 'approve' | 'reject' | 'delete' | 'view', review: any) => void;
}

const ReviewTable = ({ data, handleAction }: ReviewTableProps) => {
    // Render status badge with appropriate color
    const renderStatusBadge = (status: string) => {
        let customClass = '';
        let icon = null;

        switch (status) {
            case 'pending':
                customClass =
                    'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border border-yellow-200 shadow-sm';
                icon = <FiStar className="w-3 h-3" />;
                break;
            case 'approved':
                customClass = 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200 shadow-sm';
                icon = <FiCheck className="w-3 h-3" />;
                break;
            case 'rejected':
                customClass = 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200 shadow-sm';
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

    const [togglePublish] = useTogglePublishMutation();

    const handlePublishedChange = async (id: string, isPublished: boolean) => {
        await togglePublish(id).unwrap();
    };

    // Render star rating
    const renderRating = (rating: number) => {
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20">
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                    </svg>
                ))}
                <span className="ml-1 text-sm font-medium">{rating}/5</span>
            </div>
        );
    };

    return (
        <div className="overflow-x-auto">
            <Table className="w-full">
                <TableHeader>
                    <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <TableHead className="h-12 px-6 text-left font-semibold text-gray-700 first:rounded-tl-lg">
                            #
                        </TableHead>
                        <TableHead className="h-12 px-6 text-left font-semibold text-gray-700">Product & Customer</TableHead>
                        <TableHead className="h-12 px-6 text-left font-semibold text-gray-700">Review Content</TableHead>
                        <TableHead className="h-12 px-6 text-left font-semibold text-gray-700">Rating & Date</TableHead>
                        <TableHead className="h-12 px-6 text-left font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="h-12 px-6 text-left font-semibold text-gray-700">Published</TableHead>
                        <TableHead className="h-12 px-6 text-left font-semibold text-gray-700 last:rounded-tr-lg">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((review: any, index: number) => (
                        <TableRow
                            key={review?._id || index}
                            className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                            <TableCell className="px-6 py-4 font-medium text-gray-900">
                                {String(index + 1).padStart(2, '0')}
                            </TableCell>
                            <TableCell className="px-6 py-4">
                                <div className="space-y-3">
                                    {/* Product Info */}
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Image
                                                src={
                                                    getImageUrl(review?.product_id?.thumbnail) ||
                                                    'https://placehold.co/50x50'
                                                }
                                                alt={review?.product_id?.title}
                                                width={48}
                                                height={48}
                                                className="w-12 h-12 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                                                {review?.product_id?.title?.length > 25
                                                    ? `${review?.product_id?.title.slice(0, 25)}...`
                                                    : review?.product_id?.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">Product</p>
                                        </div>
                                    </div>
                                    {/* Customer Info */}
                                    <div className="flex items-center gap-3 pl-15">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                            {review?.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                {review?.name || 'Anonymous'}
                                            </p>
                                            <p className="text-xs text-gray-500">Customer</p>
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                                <div className="max-w-xs">
                                    <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                                        {(review?.message || review?.comment)?.length > 100
                                            ? `${(review?.message || review?.comment).slice(0, 100)}...`
                                            : review?.message || review?.comment || 'No comment provided'}
                                    </p>
                                </div>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">{renderRating(review?.rating)}</div>
                                    <p className="text-xs text-gray-500">
                                        {review?.createdAt && format(new Date(review.createdAt), 'MMM dd, yyyy')}
                                    </p>
                                </div>
                            </TableCell>
                            <TableCell className="px-6 py-4">{renderStatusBadge(review?.status)}</TableCell>
                            <TableCell className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Switch
                                        id={`publish-switch-${review.id}`}
                                        checked={review?.is_published || false}
                                        disabled={review?.status !== 'approved'}
                                        onCheckedChange={(checked) => handlePublishedChange(review?._id, checked)}
                                        className="data-[state=checked]:bg-green-500"
                                    />
                                    <span className="text-xs text-gray-600">
                                        {review?.is_published ? 'Published' : 'Unpublished'}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-3 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                                        onClick={() => handleAction('view', review)}>
                                        <FiEye className="w-3 h-3 mr-1" />
                                        View
                                    </Button>
                                    {review?.status === 'pending' && (
                                        <>
                                            <Button
                                                size="sm"
                                                className="h-8 px-3 bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm"
                                                onClick={() => handleAction('approve', review)}>
                                                <FiCheck className="w-3 h-3 mr-1" />
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 px-3 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                                                onClick={() => handleAction('reject', review)}>
                                                <FiX className="w-3 h-3 mr-1" />
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        size="sm"
                                        className="h-8 px-3 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm"
                                        onClick={() => handleAction('delete', review)}>
                                        <FiTrash2 className="w-3 h-3 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ReviewTable;
