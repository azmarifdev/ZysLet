import React from 'react';

type SpecificationItem = {
    key: string;
    value: string;
};

const SpecificationTabContent = ({ specifications }: { specifications: SpecificationItem[] }) => {
    return (
        <div className="max-w-none">
            {specifications && specifications.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    {specifications.map((spec, index) => (
                        <div
                            key={index}
                            className={`flex items-center justify-between px-4 py-3 ${
                                index !== specifications.length - 1 ? 'border-b border-gray-100' : ''
                            } hover:bg-gray-50 transition-colors`}>
                            <div className="font-medium text-gray-700 flex-1">{spec.key}</div>
                            <div className="text-gray-600 font-normal ml-8 text-right">{spec.value}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <p>No specifications available.</p>
                </div>
            )}
        </div>
    );
};

export default SpecificationTabContent;
