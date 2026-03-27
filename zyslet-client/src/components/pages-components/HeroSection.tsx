import Link from 'next/link';
import React from 'react';

const HeroSection = () => {
    return (
        <section className="mb-8 mt-8">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Abstract background pattern with further reduced opacity */}
                <div className="absolute inset-0 bg-white/5 z-0"></div>
                <div className="absolute right-0 bottom-0 opacity-10 w-1/3 h-full rotate-12">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path
                            fill="#FFFFFF"
                            d="M40.8,-68.7C52.9,-61.5,63.1,-50.3,71.2,-37.1C79.4,-24,85.3,-9,85.6,6.1C85.9,21.3,80.6,36.4,71.4,49.1C62.2,61.8,49.2,71.9,34.9,76.5C20.6,81.1,4.9,80.1,-9.1,76.7C-23.1,73.3,-35.3,67.5,-45.2,58.7C-55.2,50,-62.9,38.5,-68.4,25.8C-74,13,-77.4,-0.9,-75.8,-15.5C-74.1,-30.1,-67.5,-45.3,-56.6,-53.9C-45.7,-62.4,-30.7,-64.3,-16.5,-65.6C-2.2,-66.9,12.2,-67.7,26.2,-68C40.1,-68.4,53.7,-68.2,62,-61.9C70.2,-55.5,73.2,-42.9,71.3,-32.6C69.5,-22.3,62.9,-14.2,58.4,-6.9C54,-0.4,51.6,5.1,49.1,10.5"
                            transform="translate(100 100)"
                        />
                    </svg>
                </div>

                {/* Left side abstract decoration */}
                <div className="absolute left-0 top-0 opacity-10 w-1/4 h-full">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path
                            fill="#FFFFFF"
                            d="M39.9,-65.7C51.1,-59.6,59.5,-47.8,65.5,-35.2C71.5,-22.7,75,-9.3,74.2,3.8C73.3,16.9,68,29.8,59.7,41.2C51.5,52.7,40.3,62.7,27.7,67.4C15.2,72.2,1.3,71.7,-12.4,69.2C-26.1,66.6,-39.7,62,-49.3,53.1C-58.9,44.2,-64.5,31,-69.9,16.9C-75.3,2.8,-80.5,-12.2,-77.9,-25.9C-75.2,-39.5,-64.8,-51.8,-51.7,-57.5C-38.6,-63.3,-22.9,-62.5,-8.2,-60.6C6.5,-58.8,19.9,-56,30.6,-54.5C41.3,-53,49.4,-52.9,55.7,-49.4C62,-45.9,66.7,-39.1,67.8,-31.5C69,-24,66.7,-15.7,65.3,-7.6C63.9,0.4,63.5,8.2,61.7,15.7"
                            transform="translate(100 100)"
                        />
                    </svg>
                </div>

                {/* Content grid with more compact layout */}
                <div className="grid md:grid-cols-5 gap-4 py-4 px-5 md:py-6 md:px-8 relative z-10">
                    {/* Text content taking up 3/5 of the space */}
                    <div className="flex flex-col justify-center md:col-span-3">
                        {/* Small badge */}
                        <span className="bg-white/20 text-white text-xs font-medium px-3 py-0.5 rounded-full w-fit mb-2 backdrop-blur-sm">
                            New Collection
                        </span>

                        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-white drop-shadow-sm">
                            Brighten Your Space with Style
                        </h1>
                        <p className="text-xs md:text-sm mb-3 text-white/90 max-w-md leading-relaxed">
                            Discover our premium collection of lifestyle products designed to enhance your everyday
                            experience. Quality that speaks for itself.
                        </p>
                    </div>

                    {/* Button section taking up 2/5 of the space */}
                    <div className="flex items-center justify-center md:col-span-2">
                        <Link
                            href="/productPage"
                            className="group relative bg-gradient-to-r from-white to-gray-100 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:from-blue-50 hover:to-white hover:scale-105 shadow-lg hover:shadow-xl transition-all duration-300 text-sm flex items-center gap-2 border border-white/20 backdrop-blur-sm">
                            <span>Shop Now</span>
                            <svg
                                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* Bottom wave decoration - minimized */}
                <div className="absolute bottom-0 left-0 right-0 h-4 overflow-hidden">
                    <svg
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                        className="absolute bottom-0 left-0 w-full h-6 text-white/10">
                        <path
                            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                            fill="currentColor"></path>
                    </svg>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
