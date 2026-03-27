import React from 'react';

interface PaymentMethodSelectorProps {
    paymentMethod: string;
    // eslint-disable-next-line no-unused-vars
    setPaymentMethod: (method: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ paymentMethod, setPaymentMethod }) => {
    return (
        <div className="mb-5">
            <span className="block text-sm font-medium text-gray-700 mb-2">Payment Method</span>
            <div className="grid grid-cols-1 gap-3">
                <label
                    className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                        paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}>
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="sr-only"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>Cash on Delivery</span>
                </label>
            </div>
        </div>
    );
};

export default PaymentMethodSelector;
