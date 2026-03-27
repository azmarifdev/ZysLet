import ConvertHtml from '@/components/reusable/ConvertHtml';
import React from 'react';

type props = {
    main_features?: string;
    important_note?: string;
};

const ProductDetailsTabContent: React.FC<props> = ({ main_features, important_note }) => {
    return (
        <div className="max-w-none">
            <div className="space-y-6">
                {main_features && (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                            <h3 className="text-lg font-semibold text-blue-700 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
                                    viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Main Features
                            </h3>
                        </div>
                        <div className="px-4 py-4 text-gray-700 leading-relaxed">
                            <ConvertHtml content={main_features} />
                        </div>
                    </div>
                )}

                {important_note && (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-orange-50 px-4 py-3 border-b border-orange-100">
                            <h3 className="text-lg font-semibold text-orange-700 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
                                    viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Important Note
                            </h3>
                        </div>
                        <div className="px-4 py-4 text-gray-700 leading-relaxed">
                            <ConvertHtml content={important_note} />
                        </div>
                    </div>
                )}

                {!main_features && !important_note && (
                    <div className="text-center py-8 text-gray-500">
                        <p>No features or important notes available.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailsTabContent;
