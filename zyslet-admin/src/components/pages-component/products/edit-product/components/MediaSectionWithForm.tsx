'use client';

import { useRef, useState, ChangeEvent } from 'react';
import Image from 'next/image';
import { FaImage, FaTimes, FaUpload } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '../../add-product/components/section-title';
import { getImageUrl } from '@/lib/imageUtils';
import { useRemoveImageMutation, useUpdateImagesMutation, useUpdateThumbnailMutation } from '@/redux/api/productApi';
import toast from 'react-hot-toast';

interface ImageObj {
    _id: string; // For existing images from DB
    url: string;
    product_id: string;
}

interface MediaSectionProps {
    existingThumbnail: string;
    existingImages: ImageObj[];
    productId: string;
    onPrev?: () => void;
    onNext?: () => void;
}

export function MediaSection({ existingThumbnail, existingImages, productId, onPrev, onNext }: MediaSectionProps) {
    // State for thumbnail
    const [thumbnail, setThumbnail] = useState<{
        url: string;
        file: File | null;
    }>({
        url: existingThumbnail,
        file: null,
    });

    // State for product images
    const [productImages, setProductImages] = useState<ImageObj[]>(existingImages);
    const [previewImages, setPreviewImages] = useState<{ url: string; file: File; id: string }[]>([]);

    // Refs for file inputs
    const thumbnailRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLInputElement>(null);

    // API mutations
    const [updateThumbnail] = useUpdateThumbnailMutation();
    const [updateImages] = useUpdateImagesMutation();
    const [removeImage] = useRemoveImageMutation();

    // Handle thumbnail change
    const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setThumbnail({
                url: URL.createObjectURL(file),
                file,
            });
        }
    };

    // Update thumbnail
    const updateThumbnailHandler = async () => {
        if (!thumbnail.file) return;

        try {
            const formData = new FormData();
            formData.append('thumbnail', thumbnail.file);

            const response = await updateThumbnail({
                id: productId,
                data: formData,
            }).unwrap();

            if (response.success) {
                toast.success('Thumbnail updated successfully');
                setThumbnail((prev) => ({
                    url: response.data.thumbnailUrl || prev.url,
                    file: null,
                }));
            }
        } catch (error) {
            toast.error('Failed to update thumbnail');
            console.error('Thumbnail update error:', error);
        }
    };

    // Handle product images change
    const handleProductImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            const files = Array.from(e.target.files);
            const newPreviewImages = files.map((file, i) => ({
                id: `preview-${Date.now()}-${i}`, // Generate unique ID for preview images
                url: URL.createObjectURL(file),
                file,
            }));
            setPreviewImages((prev) => [...prev, ...newPreviewImages]);
        }
    };

    // Upload product images
    const handleUploadImages = async () => {
        if (previewImages.length === 0) return;

        try {
            const formData = new FormData();
            previewImages.forEach((img) => {
                formData.append('images', img.file);
            });

            const response = await updateImages({
                id: productId,
                data: formData,
            }).unwrap();

            if (response.success) {
                toast.success('Images uploaded successfully');
                // Add the new images to the product images list
                const newImages = response.data.images.map((img: any) => ({
                    url: img.url,
                    _id: img?._id,
                    product_id: productId,
                }));

                setProductImages(newImages);
                setPreviewImages([]);
            }
        } catch (error) {
            toast.error('Failed to upload images');
            console.error('Image upload error:', error);
        }
    };

    // Remove specific image
    const handleRemoveImage = async (identifier: string, isPreview: boolean) => {
        if (isPreview) {
            // Remove preview image from state
            setPreviewImages((prev) => prev.filter((img) => img.id !== identifier));
            return;
        }

        try {
            // For existing images, call the API
            const response = await removeImage(identifier).unwrap();

            if (response.success) {
                toast.success('Image removed successfully');
                // Remove the image from the product images state
                setProductImages((prev) => prev.filter((img) => img._id !== identifier));
            }
        } catch (error) {
            toast.error('Failed to remove image');
            console.error('Image removal error:', error);
        }
    };

    return (
        <section className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
            <SectionTitle title="Product Media" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Thumbnail Section */}
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">Thumbnail Image</label>
                    <div
                        onClick={() => thumbnailRef.current?.click()}
                        className="cursor-pointer border-dashed border-2 border-gray-300 p-4 rounded-md flex justify-center items-center min-h-[200px]">
                        {thumbnail.url ? (
                            <Image
                                src={getImageUrl(thumbnail.url)}
                                width={200}
                                height={200}
                                className="max-h-40 object-contain"
                                alt="Thumbnail"
                            />
                        ) : (
                            <FaImage className="text-gray-400 text-3xl" />
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                        ref={thumbnailRef}
                    />
                    {thumbnail.file && (
                        <div className="mt-4">
                            <Button onClick={updateThumbnailHandler}>Upload Thumbnail</Button>
                            <p className="mt-2 text-sm text-gray-500">Selected: {thumbnail.file.name}</p>
                        </div>
                    )}
                </div>

                {/* Product Images Section */}
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">Product Images</label>
                    <div
                        onClick={() => imageRef.current?.click()}
                        className="cursor-pointer border-dashed border-2 border-gray-300 p-4 rounded-md flex flex-col items-center justify-center min-h-[200px]">
                        <FaUpload className="text-3xl text-gray-400 mb-2" />
                        <p>Click to select product images</p>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleProductImagesChange}
                            className="hidden"
                            ref={imageRef}
                        />
                    </div>
                </div>
            </div>

            {/* Preview Images Section */}
            {previewImages.length > 0 && (
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-semibold text-gray-700">New Images (Preview)</h4>
                        <Button onClick={handleUploadImages}>Upload All ({previewImages.length})</Button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {previewImages.map((img) => (
                            <div key={img.id} className="relative group">
                                <Image
                                    src={getImageUrl(img.url)}
                                    width={200}
                                    height={200}
                                    className="w-full h-32 object-contain bg-gray-50 border rounded-md"
                                    alt={`preview-${img.id}`}
                                />
                                <button
                                    onClick={() => handleRemoveImage(img.id, true)}
                                    className="absolute top-1 right-1 bg-red-100 text-red-500 hover:text-red-700 p-1 rounded-full shadow-sm">
                                    <FaTimes size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Existing Images Section */}
            {productImages.length > 0 && (
                <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Image Gallery</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {productImages.map((img) => (
                            <div key={img._id} className="relative group">
                                <Image
                                    src={getImageUrl(img.url)}
                                    width={200}
                                    height={200}
                                    className="w-full h-32 object-contain bg-gray-50 border rounded-md"
                                    alt={`img-${img._id}`}
                                />
                                <button
                                    onClick={() => handleRemoveImage(img._id, false)}
                                    className="absolute top-1 right-1 bg-red-100 text-red-500 hover:text-red-700 p-1 rounded-full shadow-sm">
                                    <FaTimes size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-end space-x-4 mt-8">
                {onPrev && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onPrev}
                        className="px-6 py-2 border-primary !text-primary">
                        Prev
                    </Button>
                )}
                {onNext && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onNext}
                        className="px-6 py-2 border-primary !text-primary">
                        Next
                    </Button>
                )}
            </div>
        </section>
    );
}
