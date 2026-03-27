'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaCheck, FaTimes, FaEdit } from 'react-icons/fa';
import ConvertHtml from '@/components/shared/ConvertHtml';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/imageUtils';

interface ProductImage {
    _id: string;
    url: string;
    id: string;
}

interface Specification {
    _id: string;
    key: string;
    value: string;
    id: string;
}

interface Category {
    _id: string;
    title: string;
    id: string;
}

interface Attribute {
    title: string;
    values: string[];
}

interface DescriptionBlock {
    description: string;
    url: string;
}

interface BundleProduct {
    _id: string;
    title: string;
    slug: string;
    thumbnail: string;
    discount: number;
    price: number;
}

interface Product {
    _id: string;
    title: string;
    desc: string;
    slug: string;
    thumbnail: string;
    images: ProductImage[];
    main_features: string;
    specification: Specification[];
    important_note: string;
    code: string;
    category: Category;
    discount: number;
    price: number;
    quantity: number;
    meta_desc: string;
    meta_keywords: string[];
    is_published: boolean;
    show_related_products: boolean;
    is_free_shipping: boolean;
    youtube_video: string;
    attributes: Attribute[];
    id: string;
    createdAt: string;
    updatedAt: string;
    description_blocks: DescriptionBlock[];
    bundle_products: BundleProduct[];
}

export default function ProductDetailsAdmin({ product }: { product: Product }) {
    const [selectedImage, setSelectedImage] = useState(product.thumbnail);
    const [activeTab, setActiveTab] = useState('overview');

    const discountedPrice = product.price - (product.price * product.discount) / 100;
    const formattedCreatedDate = new Date(product.createdAt)?.toLocaleDateString();
    const formattedUpdatedDate = new Date(product.updatedAt)?.toLocaleDateString();

    const router = useRouter();

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Product Details</h1>
                <button
                    onClick={() => router.push(`/product/manage-product/edit-product?id=${product._id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
                    <FaEdit className="mr-2" /> Edit Product
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Product Images */}
                        <div className="space-y-4">
                            <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-50">
                                <Image
                                    src={getImageUrl(selectedImage) || '/placeholder.svg'}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                {product.discount > 0 && (
                                    <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-medium px-2 py-1 rounded">
                                        {product.discount}% OFF
                                    </div>
                                )}
                            </div>

                            {product.images && product.images.length > 0 && (
                                <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                    <button
                                        onClick={() => setSelectedImage(product.thumbnail)}
                                        className={`relative flex-shrink-0 h-16 w-16 rounded-md border overflow-hidden ${
                                            selectedImage === product.thumbnail ? 'ring-2 ring-blue-500' : ''
                                        }`}>
                                        <Image
                                            src={product.thumbnail || '/placeholder.svg'}
                                            alt={product.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>

                                    {product.images.map((image) => (
                                        <button
                                            key={image._id}
                                            onClick={() => setSelectedImage(image.url)}
                                            className={`relative flex-shrink-0 h-16 w-16 rounded-md border overflow-hidden ${
                                                selectedImage === image.url ? 'ring-2 ring-blue-500' : ''
                                            }`}>
                                            <Image
                                                src={image.url || '/placeholder.svg'}
                                                alt={product.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-4 md:col-span-2">
                            <div>
                                <h2 className="text-2xl font-bold">{product.title}</h2>
                                <p className="text-gray-500">Product Code: {product.code}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="font-medium">Price:</span>
                                        <span>{product?.price?.toFixed(2)} BDT</span>
                                    </div>

                                    {product.discount > 0 && (
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="font-medium">Discount:</span>
                                            <span>
                                                {product.discount}% ({discountedPrice?.toFixed(2)} BDT)
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between border-b pb-2">
                                        <span className="font-medium">Quantity:</span>
                                        <span>{product.quantity} pieces</span>
                                    </div>

                                    <div className="flex justify-between border-b pb-2">
                                        <span className="font-medium">Category:</span>
                                        <span>{product.category.title}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="font-medium">Status:</span>
                                        <span
                                            className={`flex items-center ${
                                                product.is_published ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {product.is_published ? (
                                                <>
                                                    <FaCheck className="mr-1" /> Published
                                                </>
                                            ) : (
                                                <>
                                                    <FaTimes className="mr-1" /> Not Published
                                                </>
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex justify-between border-b pb-2">
                                        <span className="font-medium">Free Shipping:</span>
                                        <span
                                            className={`flex items-center ${
                                                product.is_free_shipping ? 'text-green-600' : 'text-gray-600'
                                            }`}>
                                            {product.is_free_shipping ? (
                                                <>
                                                    <FaCheck className="mr-1" /> Yes
                                                </>
                                            ) : (
                                                <>
                                                    <FaTimes className="mr-1" /> No
                                                </>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="font-medium">Show Related Products:</span>
                                        <span
                                            className={`flex items-center ${
                                                product.show_related_products ? 'text-green-600' : 'text-gray-600'
                                            }`}>
                                            {product.show_related_products ? (
                                                <>
                                                    <FaCheck className="mr-1" /> Yes
                                                </>
                                            ) : (
                                                <>
                                                    <FaTimes className="mr-1" /> No
                                                </>
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex justify-between border-b pb-2">
                                        <span className="font-medium">Created:</span>
                                        <span>{formattedCreatedDate}</span>
                                    </div>

                                    <div className="flex justify-between border-b pb-2">
                                        <span className="font-medium">Last Updated:</span>
                                        <span>{formattedUpdatedDate}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                {product?.attributes && product?.attributes?.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="font-medium mb-2">Attributes:</h3>
                                        <div className="inline-block mb-1.5">
                                            {product.attributes.map((attribute, index) => (
                                                <div key={index} className="flex flex-wrap items-center gap-2 mb-2">
                                                    <p className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-gray-50 inline-block mr-2 font-semibold">
                                                        {attribute.title}:
                                                    </p>
                                                    {attribute.values.map((value, valueIndex) => (
                                                        <p
                                                            key={valueIndex}
                                                            className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-gray-50 inline-block">
                                                            {value}
                                                        </p>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {product.meta_keywords && product.meta_keywords.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="font-medium mb-2">Meta Keywords:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.meta_keywords.map((keyword, index) => (
                                            <div
                                                key={index}
                                                className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-gray-50">
                                                {keyword}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.meta_desc && (
                                <div className="mt-4">
                                    <h3 className="font-medium mb-2">Meta Description:</h3>
                                    <p className="text-sm text-gray-600 border p-3 rounded-md bg-gray-50">
                                        {product.meta_desc}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {product.bundle_products && product.bundle_products.length > 0 && (
                    <div className="mt-4 border-t border-gray-200 px-6 py-4 overflow-x-auto">
                        <h3 className="font-medium mb-2">Bundle Products (Free Shipping):</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {product.bundle_products.map((item) => (
                                <div key={item._id} className="flex gap-4">
                                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border">
                                        <Image
                                            src={item.thumbnail || '/placeholder.svg'}
                                            alt={item.title}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium mb-2">{item.title}</h4>
                                        <p className="text-sm text-gray-500">
                                            <span className="line-through mr-2">{item.price} BDT</span>
                                            <span className="text-red-500 font-medium">
                                                {item.price - (item.price * item.discount) / 100} BDT
                                            </span>
                                            <span className="ml-2 text-green-600">({item.discount}% OFF)</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Custom Product Details Tabs */}
                <div className="border-t border-gray-200">
                    <div className="flex space-x-8 px-6">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`py-3 px-1 -mb-px font-medium text-sm whitespace-nowrap ${
                                activeTab === 'overview'
                                    ? 'border-b-2 !border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}>
                            Overview
                        </button>
                        {product.specification && product.specification.length > 0 && (
                            <button
                                onClick={() => setActiveTab('specifications')}
                                className={`py-3 px-1 -mb-px font-medium text-sm whitespace-nowrap ${
                                    activeTab === 'specifications'
                                        ? 'border-b-2 !border-blue-500 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}>
                                Specifications
                            </button>
                        )}
                        {product.important_note && (
                            <button
                                onClick={() => setActiveTab('notes')}
                                className={`py-3 px-1 -mb-px font-medium text-sm whitespace-nowrap ${
                                    activeTab === 'notes'
                                        ? 'border-b-2 !border-blue-500 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}>
                                Important Notes
                            </button>
                        )}
                        {product.main_features && (
                            <button
                                onClick={() => setActiveTab('features')}
                                className={`py-3 px-1 -mb-px font-medium text-sm whitespace-nowrap ${
                                    activeTab === 'features'
                                        ? 'border-b-2 !border-blue-500 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}>
                                Main Features
                            </button>
                        )}
                    </div>

                    <div className="p-6">
                        {activeTab === 'overview' && (
                            <div>
                                {product.description_blocks?.length > 0 && (
                                    <div className="mt-8 ">
                                        {product.description_blocks.map((block, index) => (
                                            <div key={index} className="mt-2 mb-5">
                                                <ConvertHtml content={block?.description} />
                                                <div className="flex justify-center items-center">
                                                    <Image
                                                        alt="Product Image"
                                                        src={getImageUrl(block?.url)}
                                                        width={400}
                                                        height={500}
                                                        className="object-cover rounded-md"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* YouTube Video */}
                                {product.youtube_video && (
                                    <div className="border-t border-gray-200 p-6">
                                        <h2 className="text-xl font-bold mb-4">Product Video</h2>
                                        <div className="aspect-video rounded-lg overflow-hidden max-h-[500px]">
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={product.youtube_video.replace('watch?v=', 'embed/')}
                                                title="Product Video"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen></iframe>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'specifications' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {product.specification.map((spec) => (
                                    <div key={spec._id} className="flex border-b pb-2">
                                        <span className="font-medium w-1/2">{spec.key}</span>
                                        <span className="w-1/2">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'notes' && (
                            <>{product.important_note && <ConvertHtml content={product.important_note} />}</>
                        )}
                        {activeTab === 'features' && (
                            <div>{product.main_features && <ConvertHtml content={product.main_features} />}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
