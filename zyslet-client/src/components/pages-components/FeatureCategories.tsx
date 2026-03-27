import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const FeatureCategories = () => {
    const categories = [
        {
            name: 'Indoor',
            image: 'https://dummyimage.com/600x600/f0f0f0/555555.png&text=Indoor',
            description: 'Stylish indoor essentials',
        },
        {
            name: 'Outdoor',
            image: 'https://dummyimage.com/600x600/e6e6e6/555555.png&text=Outdoor',
            description: 'Weather-resistant designs',
        },
        {
            name: 'New In',
            image: 'https://dummyimage.com/600x600/f5f5f5/555555.png&text=New+In',
            description: 'Latest collections',
        },
        {
            name: 'Best Sales',
            image: 'https://dummyimage.com/600x600/eaeaea/555555.png&text=Best+Sellers',
            description: 'Most loved products',
        },
    ];

    return (
        <section className="mb-16">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Shop by Category</h2>
                <Link href="/categories" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                    View All
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {categories.map((category) => (
                    <Link
                        href={`/category/${category.name?.toLowerCase().replace(/\s+/g, '-')}`}
                        key={category.name}
                        className="group relative overflow-hidden rounded-xl aspect-square bg-gray-100 transition-all duration-300 hover:shadow-lg">
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10 group-hover:from-black/80 transition-all duration-300"></div>

                        {/* Background image */}
                        <div className="absolute inset-0 z-0">
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 p-4 z-20 w-full transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                            <h3 className="text-white text-lg font-bold mb-1">{category.name}</h3>
                            <p className="text-white/80 text-sm mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {category.description}
                            </p>
                            <span className="inline-flex items-center text-xs text-white/90 font-medium">
                                Explore
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5 ml-1 group-hover:ml-2 transition-all duration-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                                    />
                                </svg>
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default FeatureCategories;
