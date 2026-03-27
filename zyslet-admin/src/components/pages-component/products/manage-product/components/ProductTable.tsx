import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import Image from 'next/image';
import { FiEye, FiEdit, FiTrash2, FiPackage } from 'react-icons/fi';
import { useDeleteProductMutation, useTogglePublishMutation } from '@/redux/api/productApi';
import { useRouter } from 'next/navigation';
import DeleteConfirmDialog from '@/components/pages-component/category/DeleteConfirmDialog';
import { getImageUrl } from '@/lib/imageUtils';

const ProductTable = ({ data }: { data: any[] }) => {
    const [togglePublish] = useTogglePublishMutation();
    const router = useRouter();

    const handlePublishedChange = async (id: string) => {
        await togglePublish(id).unwrap();
    };

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [deleteProduct, { isLoading }] = useDeleteProductMutation();

    const handleDeleteProduct = async (id: string) => {
        await deleteProduct(id).unwrap();
        setIsDeleteDialogOpen(false);
    };

    return (
        <div className="overflow-x-auto">
            <Table className="w-full">
                <TableHeader>
                    <TableRow className="bg-gray-50 border-b border-gray-200">
                        <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                        </TableHead>
                        <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Details
                        </TableHead>
                        <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price & Stock
                        </TableHead>
                        <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                        </TableHead>
                        <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </TableHead>
                        <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                    {data?.map((product: any, i: number) => (
                        <TableRow key={product?._id} className="hover:bg-gray-50 transition-colors">
                            {/* Product Column */}
                            <TableCell className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0 w-12 h-12">
                                        {product?.images?.[0] ? (
                                            <Image
                                                src={getImageUrl(
                                                    typeof product.images[0] === 'string'
                                                        ? product.images[0]
                                                        : product.images[0]?.url || product.images[0],
                                                )}
                                                alt={product.title}
                                                width={48}
                                                height={48}
                                                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <FiPackage className="text-gray-400" size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 truncate">{product?.title}</p>
                                        <p className="text-sm text-gray-500">SKU: {product?.code}</p>
                                    </div>
                                </div>
                            </TableCell>

                            {/* Details Column */}
                            <TableCell className="px-6 py-4">
                                <div className="text-sm">
                                    <p className="text-gray-900 font-medium">#{i + 1}</p>
                                    <p className="text-gray-500 text-xs">ID: {product?._id?.slice(-6)}</p>
                                </div>
                            </TableCell>

                            {/* Price & Stock Column */}
                            <TableCell className="px-6 py-4">
                                <div className="text-sm">
                                    <p className="text-gray-900 font-semibold">৳{product?.price?.toLocaleString()}</p>
                                    <div className="flex items-center space-x-1">
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                product?.quantity > 10
                                                    ? 'bg-green-100 text-green-800'
                                                    : product?.quantity > 0
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                            {product?.quantity} pcs
                                        </span>
                                    </div>
                                </div>
                            </TableCell>

                            {/* Category Column */}
                            <TableCell className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {product?.category?.title || 'Uncategorized'}
                                </span>
                            </TableCell>

                            {/* Status Column */}
                            <TableCell className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                    <Switch
                                        id={`publish-switch-${product._id}`}
                                        checked={product?.is_published || false}
                                        onCheckedChange={() => handlePublishedChange(product?._id)}
                                    />
                                    <div className="text-sm">
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                product?.is_published
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {product?.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                </div>
                            </TableCell>

                            {/* Actions Column */}
                            <TableCell className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                    <Link
                                        href={`/product/manage-product/view/?productId=${product?.id}`}
                                        className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors">
                                        <FiEye size={14} className="mr-1" />
                                        View
                                    </Link>

                                    <button
                                        onClick={() => router.push(`/product/manage-product/edit-product?id=${product.id}`)}
                                        className="inline-flex items-center px-3 py-1.5 border border-green-300 text-green-700 bg-green-50 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors">
                                        <FiEdit size={14} className="mr-1" />
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setIsDeleteDialogOpen(true);
                                        }}
                                        className="inline-flex items-center px-3 py-1.5 border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors">
                                        <FiTrash2 size={14} className="mr-1" />
                                        Delete
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Delete Confirmation Dialog */}
            {isDeleteDialogOpen && selectedProduct && (
                <DeleteConfirmDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onConfirm={() => handleDeleteProduct(selectedProduct?._id)}
                    isDeleting={isLoading}
                />
            )}
        </div>
    );
};

export default ProductTable;
