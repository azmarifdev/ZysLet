'use client'

import React, { useState } from 'react'
import Modal from '../reusable/Modal';

const OrderButton = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const product = {
        id: '1',
        imageSrc: '/path/to/image.jpg',
        productName: 'Sample Product',
        originalPrice: 100,
        discountedPrice: 80,
        description: 'This is a sample product description.',
        category: 'Sample Category',
        salePrice: 75,
        discount: 25,
        buttonText: 'Buy Now'
    };
  return (
      <div>
          <button
              onClick={() => setIsModalOpen(true)}
              className="border-2 border-blue-600 text-blue-600 font-medium py-3.5 px-6 rounded-lg hover:bg-blue-50 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
              </svg>
              Order Now
          </button>
          {product && <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={product} />}
      </div>
  );
}

export default OrderButton