import React from 'react';

interface DeliveryAreaSelectorProps {
    deliveryArea: string;
    // eslint-disable-next-line no-unused-vars
    setDeliveryArea: (area: string) => void;
}

type DeliveryAreaOption = {
    value: string;
    label: string;
    charge: number;
};

const DeliveryAreaSelector: React.FC<DeliveryAreaSelectorProps> = ({ deliveryArea, setDeliveryArea }) => {
    const deliveryOptions: DeliveryAreaOption[] = [
        { value: 'inside_dhaka', label: 'Inside Dhaka', charge: 60 },
        { value: 'outside_dhaka', label: 'Outside Dhaka', charge: 120 },
    ];

    return (
        <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">Delivery Area</label>
            <div className="grid grid-cols-1 gap-3">
                {deliveryOptions.map((option) => (
                    <label
                        key={option.value}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                            deliveryArea === option.value
                                ? 'border-blue-500 bg-blue-50 shadow-sm'
                                : 'border-gray-200 hover:border-blue-300'
                        }`}>
                        <input
                            type="radio"
                            name="deliveryArea"
                            value={option.value}
                            checked={deliveryArea === option.value}
                            onChange={() => setDeliveryArea(option.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 mr-3"
                        />
                        <div>
                            <span className="font-medium block">{option.label}</span>
                            <span className="text-sm text-gray-500">Delivery Charge: ৳{option.charge}</span>
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default DeliveryAreaSelector;
