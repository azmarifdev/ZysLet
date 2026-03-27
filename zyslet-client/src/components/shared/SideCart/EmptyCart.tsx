import React from 'react';
import Link from 'next/link';
import { SheetClose } from '@/components/ui/sheet';

const EmptyCart = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="bg-blue-50 p-5 rounded-full mb-4">
                <svg className="h-14 w-14 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">Your cart is empty</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">Add items to your cart to proceed with your purchase</p>

            <SheetClose asChild>
                <Link
                    href="/productPage"
                    className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Browse Products
                </Link>
            </SheetClose>
        </div>
    );
};

export default EmptyCart;
