import React from 'react'

const ShippingOption = () => {
  return (
      <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-lg mb-4">Shipping & Returns</h3>
          <ul className="space-y-3">
              <li className="flex items-start">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-green-500 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Free shipping on orders over $50</span>
              </li>
              <li className="flex items-start">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-green-500 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>30-day return policy</span>
              </li>
              <li className="flex items-start">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-green-500 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>2-year warranty</span>
              </li>
          </ul>
      </div>
  );
}

export default ShippingOption