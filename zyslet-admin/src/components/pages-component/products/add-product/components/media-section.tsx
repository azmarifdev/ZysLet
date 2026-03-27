/* eslint-disable @next/next/no-img-element */
"use client";

import {useRef, type ChangeEvent} from "react";
import {useFormContext} from "react-hook-form";
import {FaImage, FaTimes, FaUpload} from "react-icons/fa";
import {SectionTitle} from "./section-title";

interface MediaSectionProps {
    thumbnailImage: File | null;
    productImages: File[];
    // eslint-disable-next-line no-unused-vars
    setThumbnailImage: (file: File | null) => void;
    // eslint-disable-next-line no-unused-vars
    setProductImages: (files: File[]) => void;
    // eslint-disable-next-line no-unused-vars
    removeProductImage: (index: number) => void;
}

export function MediaSection({
    thumbnailImage,
    productImages,
    setThumbnailImage,
    setProductImages,
    removeProductImage,
}: MediaSectionProps) {
    const {
        setValue,
        formState: {errors},
        clearErrors,
        trigger,
    } = useFormContext();
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const productImagesInputRef = useRef<HTMLInputElement>(null);

    // Handle thumbnail image selection
    const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setThumbnailImage(file);
            setValue("thumbnail_image", file);
            clearErrors("thumbnail_image");
            trigger("thumbnail_image");
        }
    };

    // Handle product images selection
    const handleProductImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            const updatedFiles = [...productImages, ...newFiles];
            setProductImages(updatedFiles);
            setValue("product_images", updatedFiles);
            clearErrors("product_images");
            trigger("product_images");
        }
    };

    // Trigger file input click
    const triggerThumbnailInput = () => {
        if (thumbnailInputRef.current) {
            thumbnailInputRef.current.click();
        }
    };

    const triggerProductImagesInput = () => {
        if (productImagesInputRef.current) {
            productImagesInputRef.current.click();
        }
    };

    return (
        <section className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
            <SectionTitle title="Product Media" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Thumbnail Image */}
                <div>
                    <label className="block text-gray-700 mb-2">
                        Product Thumbnail{" "}
                        <span className="text-red-700 ml-1">*</span>
                    </label>
                    <div className="space-y-4">
                        <div
                            onClick={triggerThumbnailInput}
                            className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                                thumbnailImage
                                    ? "border-gray-300 bg-gray-50"
                                    : errors.thumbnail_image
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                            }`}
                            style={{minHeight: "200px"}}>
                            {thumbnailImage ? (
                                <div className="relative w-full h-full">
                                    <img
                                        src={
                                            URL.createObjectURL(
                                                thumbnailImage
                                            ) || "/placeholder.svg"
                                        }
                                        alt="Thumbnail preview"
                                        className="mx-auto max-h-[180px] object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setThumbnailImage(null);
                                            setValue("thumbnail_image", null);
                                        }}
                                        className="absolute top-0 right-0 bg-red-100 text-red-500 hover:text-red-700 p-1 rounded-full">
                                        <FaTimes size={14} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <FaImage
                                        className={`text-4xl mb-2 ${
                                            errors.thumbnail_image
                                                ? "text-red-500"
                                                : "text-gray-400"
                                        }`}
                                    />
                                    <p
                                        className={`text-center ${
                                            errors.thumbnail_image
                                                ? "text-red-500"
                                                : "text-gray-500"
                                        }`}>
                                        Click to upload thumbnail image
                                    </p>
                                    <p className="text-gray-400 text-sm text-center mt-1">
                                        Recommended size: 800x800px
                                    </p>
                                </>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={thumbnailInputRef}
                            onChange={handleThumbnailChange}
                            accept="image/*"
                            className="hidden"
                        />
                        {errors.thumbnail_image && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.thumbnail_image.message?.toString()}
                            </p>
                        )}
                    </div>
                </div>

                {/* Product Images */}
                <div>
                    <label className="block text-gray-700 mb-2">
                        Product Images{" "}
                        <span className="text-red-700 ml-1">*</span>
                    </label>
                    <div className="space-y-4">
                        <div
                            onClick={triggerProductImagesInput}
                            className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                                errors.product_images
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                            }`}
                            style={{minHeight: "200px"}}>
                            <FaUpload
                                className={`text-4xl mb-2 ${
                                    errors.product_images
                                        ? "text-red-500"
                                        : "text-gray-400"
                                }`}
                            />
                            <p
                                className={`text-center ${
                                    errors.product_images
                                        ? "text-red-500"
                                        : "text-gray-500"
                                }`}>
                                Click to upload product images
                            </p>
                            <p className="text-gray-400 text-sm text-center mt-1">
                                You can select multiple images
                            </p>
                            <input
                                type="file"
                                ref={productImagesInputRef}
                                onChange={handleProductImagesChange}
                                accept="image/*"
                                multiple
                                className="hidden"
                            />
                        </div>
                        {errors.product_images && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.product_images.message?.toString()}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Product Images Preview */}
            {productImages.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-md font-medium text-gray-700 mb-3">
                        Product Images Preview
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {productImages.map((image, index) => (
                            <div key={index} className="relative group">
                                <div className="border rounded-lg overflow-hidden bg-gray-50 aspect-square flex items-center justify-center">
                                    <img
                                        src={
                                            URL.createObjectURL(image) ||
                                            "/placeholder.svg"
                                        }
                                        alt={`Product image ${index + 1}`}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeProductImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-100 text-red-500 hover:text-red-700 p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FaTimes size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
