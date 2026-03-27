/* eslint-disable react/no-unescaped-entities */

const WarrantyContent = () => {
    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            {/* Hero Section */}
            <div className="mb-16 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Warranty Information</h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    We stand behind the quality of our products with comprehensive warranty coverage. Learn about our
                    warranty terms, what is covered, and how to submit a claim.
                </p>
            </div>

            {/* Content Sections */}
            <div className="space-y-16">
                {/* Standard Warranty Section */}
                <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Our Warranty Coverage</h2>
                    </div>

                    {/* Rest of warranty content */}
                    {/* This is shortened for brevity */}

                    <div className="space-y-6">
                        {/* Warranty details */}
                        <p>Please refer to our warranty documentation for full details.</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default WarrantyContent;
