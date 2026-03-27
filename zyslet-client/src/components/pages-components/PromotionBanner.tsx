import Link from 'next/link';
import React from 'react';

const PromotionBanner = () => {
    return (
        <section className="mb-16 mt-6">
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl overflow-hidden relative shadow-lg">
                {/* Abstract background pattern */}
                <div className="absolute top-0 right-0 w-1/3 h-full opacity-20">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path
                            fill="#FFFFFF"
                            d="M47.5,-73.8C59.3,-67.8,65.3,-49.9,70.4,-33.5C75.5,-17.1,79.7,-2.1,78.3,12.9C76.8,27.9,69.7,42.8,58.1,51.4C46.4,60.1,30.2,62.4,14.9,67.1C-0.3,71.7,-15.6,78.8,-28.7,75.9C-41.9,73,-52.9,60.2,-62.7,46.6C-72.6,33.1,-81.3,18.7,-83.1,3.3C-85,-12.2,-80,-28.7,-70.3,-39.9C-60.5,-51.2,-46,-57.3,-32.8,-62.4C-19.5,-67.6,-7.8,-71.8,6,-78.7C19.7,-85.6,39.4,-93.3,54.5,-89.5C69.5,-85.7,80,-86.3,85,-79.7C90.1,-73.1,89.8,-59.3,84.1,-47.8C78.3,-36.2,67.2,-26.9,60.8,-16.4C54.4,-5.9,52.6,5.9,52,19.7C51.4,33.6,52,49.6,45.4,60.1C38.8,70.7,24.9,75.8,12.5,72.9C0,69.9,-10.9,58.8,-24.3,54.1C-37.8,49.3,-53.8,50.9,-68.2,45C-82.7,39,-95.6,25.6,-98.1,10.6C-100.5,-4.4,-92.5,-21.1,-82.8,-34.9C-73.1,-48.8,-61.6,-59.6,-48.2,-67.2C-34.8,-74.7,-19.5,-77.9,-2.8,-74.4C13.9,-70.9,29.7,-60.9,43.1,-52.4C56.4,-44,67.4,-37.2,74.4,-26.3C81.3,-15.4,84.2,-0.4,78.2,10.1C72.2,20.6,57.3,26.6,47,36.1C36.7,45.6,31,58.5,22.1,61.3C13.2,64.1,1.2,56.8,-12,55.5C-25.1,54.3,-39.5,59.2,-49.9,55.8C-60.3,52.4,-66.7,40.8,-72.3,28.1C-77.9,15.4,-82.7,1.5,-83,-13.2C-83.4,-27.9,-79.2,-43.5,-69.6,-53.5C-60,-63.4,-45,-67.8,-31.4,-65.7C-17.9,-63.7,-5.8,-55.2,8.6,-53.3C23.1,-51.3,39.8,-55.8,51,-50.5C62.2,-45.2,68,-29.9,71.6,-14.9C75.2,0,76.6,14.6,73.4,28.2C70.3,41.8,62.5,54.4,51.2,58.8C39.9,63.2,25,59.5,13.3,54.6C1.6,49.7,-6.8,43.7,-17.7,41.5C-28.5,39.3,-41.8,41.1,-52.2,36.9C-62.6,32.6,-70.1,22.2,-71.7,10.7C-73.3,-0.8,-69.1,-13.5,-62.8,-23.6C-56.6,-33.8,-48.3,-41.5,-38.7,-48.9C-29,-56.3,-18,-63.4,-5.2,-68.1C7.6,-72.7,22.2,-74.9,35.1,-72C48,-69.2,59.2,-61.2,66.5,-50.3C73.7,-39.4,76.8,-25.6,78.9,-11.5C81,2.7,82,17.3,77.3,29.7C72.6,42,62.2,52.1,49.9,55.8C37.7,59.4,23.6,56.6,11,55.1C-1.6,53.6,-12.8,53.5,-25.4,51.9C-38,50.3,-52,47.1,-60.4,39C-68.9,31,-71.7,18,-72.4,5.1C-73.2,-7.8,-71.8,-20.5,-67.9,-34.1C-63.9,-47.7,-57.3,-61.9,-46.2,-73.1C-35.1,-84.2,-19.4,-92.2,-3.2,-89.1C13.1,-86.1,30,-72,44.6,-59.9C59.2,-47.7,71.5,-37.7,75.4,-25C79.4,-12.4,74.9,2.9,70,17.6C65,32.3,59.5,46.4,49.2,53.3C38.9,60.1,23.8,59.6,8.8,63.3C-6.2,67,-21.1,74.8,-34.8,73.9C-48.6,72.9,-61.1,63.2,-71.2,50.8C-81.3,38.4,-88.9,23.1,-91.1,7.1C-93.4,-8.9,-90.4,-25.6,-83.1,-41.1C-75.9,-56.7,-64.3,-71.2,-49.7,-77.8C-35.1,-84.3,-17.6,-82.9,0.2,-83.1C18,-83.4,35.9,-85.4,48.2,-77.5Z"
                            transform="translate(100 100)"
                        />
                    </svg>
                </div>

                {/* Left side decorative circles */}
                <div className="absolute left-0 top-0 h-full w-1/4 overflow-hidden opacity-30">
                    <div className="absolute w-24 h-24 rounded-full bg-white/10 -left-10 top-10"></div>
                    <div className="absolute w-16 h-16 rounded-full bg-white/10 left-20 top-20"></div>
                    <div className="absolute w-32 h-32 rounded-full bg-white/10 -left-10 bottom-10"></div>
                </div>

                {/* Content section */}
                <div className="grid md:grid-cols-5 gap-8 p-8 md:p-10 relative z-10">
                    <div className="md:col-span-3 relative z-10 flex flex-col justify-center">
                        <div className="inline-flex items-center bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4 w-fit backdrop-blur-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            Limited Time Offer
                        </div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white">Special Summer Sale</h2>
                        <p className="mb-6 opacity-90 text-white text-base md:text-lg max-w-lg leading-relaxed">
                            Get up to <span className="font-bold text-yellow-300">30% off</span> on selected products.
                            Perfect for upgrading your lifestyle with premium quality items that last longer!
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/productPage"
                                className="bg-white text-green-600 px-6 py-2.5 rounded-lg font-medium hover:bg-green-50 transition duration-300 inline-block shadow-md hover:shadow-lg">
                                View All Products
                            </Link>
                        </div>
                    </div>

                    <div className="hidden md:flex md:col-span-2 items-center justify-center">
                        <div className="w-64 h-64 relative">
                            <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                            <div className="absolute inset-2 bg-white/30 rounded-full flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-white text-5xl font-bold">30%</p>
                                    <p className="text-white text-xl font-semibold">OFF</p>
                                    <p className="text-white/80 text-sm mt-2">Limited time only</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromotionBanner;
