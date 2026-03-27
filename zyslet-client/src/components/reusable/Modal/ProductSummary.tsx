import React from 'react';
import Image from 'next/image';
import ProductQuantity from './ProductQuantity';
import { Product } from '@/app/product/types';
import { calculatePrice } from '@/lib/calculatePrice';
import { getImageUrl } from '@/lib/imageUtils';

interface ProductSummaryProps {
    product: Product;
    quantity: number;
    // eslint-disable-next-line no-unused-vars
    setQuantity: (quantity: number) => void;
    savingsPercentage: number;
    totalPrice: string;
    deliveryCharge: number;
    finalTotal: string;
    deliveryArea: string;
    // eslint-disable-next-line no-unused-vars
    setDeliveryArea: (area: string) => void;
    selectedAttribute?: string;
}

const ProductSummary: React.FC<ProductSummaryProps> = ({
    product,
    quantity,
    setQuantity,
    savingsPercentage,
    totalPrice,
    deliveryCharge,
    finalTotal,
    selectedAttribute,
}) => {
    const { originalPrice, salePrice } = calculatePrice(product.price || 0, product.discount || 0);
    const isFreeShipping = product.is_free_shipping;

    return (
        <>
            <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-lg font-semibold mb-3">Order Items</h3>

                {/* Selected product */}
                <div className="flex items-center py-2">
                    <div className="relative h-20 w-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <Image
                            src={getImageUrl(product.thumbnail) || 'https://dummyimage.com/150'}
                            alt={product.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                            <h3 className="font-medium">{product.title}</h3>
                            <p className="font-medium">৳{(salePrice * quantity).toFixed(0)}</p>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-2">
                                <p className="text-blue-600 font-medium">৳{salePrice?.toFixed(0)}</p>
                                <p className="text-gray-500 line-through text-sm">৳{originalPrice?.toFixed(0)}</p>
                            </div>

                            {/* Product quantity control */}
                            <ProductQuantity quantity={quantity} onQuantityChange={setQuantity} />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                            <div className="bg-green-100 text-green-700 text-xs font-bold inline-block px-2 py-1 rounded">
                                {savingsPercentage}% OFF
                            </div>
                            {isFreeShipping && (
                                <div className="bg-blue-100 text-blue-700 text-xs font-bold inline-block px-2 py-1 rounded">
                                    Free Shipping
                                </div>
                            )}
                            {selectedAttribute && (
                                <div className="bg-purple-100 text-purple-700 text-xs font-bold inline-block px-2 py-1 rounded">
                                    {/* {product.attribute?.title || 'Selected'}: {selectedAttribute} */}
                                    {'Selected'}: {selectedAttribute}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <OrderSummary
                totalPrice={totalPrice}
                deliveryCharge={deliveryCharge}
                finalTotal={finalTotal}
                isFreeShipping={isFreeShipping}
            />
        </>
    );
};

interface OrderSummaryProps {
    totalPrice: string;
    deliveryCharge: number;
    finalTotal: string;
    isFreeShipping?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ totalPrice, deliveryCharge, finalTotal, isFreeShipping = false }) => {
    // If free shipping, show 0 delivery charge and update final total
    const actualDeliveryCharge = isFreeShipping ? 0 : deliveryCharge;
    const actualFinalTotal = isFreeShipping ? totalPrice : finalTotal;

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                        fillRule="evenodd"
                        d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z"
                        clipRule="evenodd"
                    />
                </svg>
                Order Summary
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-gray-500">Subtotal</div>
                    <div className="text-lg font-semibold">৳{parseFloat(totalPrice).toFixed(0)}</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-gray-500">Delivery Charge</div>
                    {isFreeShipping ? (
                        <div className="flex items-center">
                            <span className="text-lg font-semibold text-green-600">৳0</span>
                            <span className="bg-green-100 text-green-700 text-xs ml-2 px-2 py-0.5 rounded">Free</span>
                        </div>
                    ) : (
                        <div className="text-lg font-semibold">৳{actualDeliveryCharge.toFixed(0)}</div>
                    )}
                </div>
                <div className="col-span-2 bg-blue-600 text-white p-3 rounded-lg mt-2 shadow-sm">
                    <div className="flex justify-between items-center">
                        <span>Total Amount</span>
                        <span className="text-lg font-bold">৳{parseFloat(actualFinalTotal).toFixed(0)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductSummary;
