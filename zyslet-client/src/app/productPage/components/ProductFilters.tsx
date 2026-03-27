'use client';

const priceRanges = [
    { label: 'Under ৳1,000', min: 0, max: 1000 },
    { label: '৳1,000 - ৳2,000', min: 1000, max: 2000 },
    { label: '৳2,000 - ৳3,000', min: 2000, max: 3000 },
    { label: '৳3,000 - ৳5,000', min: 3000, max: 5000 },
    { label: 'Over ৳5,000', min: 5000, max: Infinity },
];

interface PriceRange {
    min: number;
    max: number;
}

// interface Category {
//     id: string;
//     name: string;
// }

interface ProductFiltersProps {
    selectedCategory: string;
    // eslint-disable-next-line no-unused-vars
    setSelectedCategory: (category: string) => void;
    selectedPriceRange: PriceRange | null;
    // eslint-disable-next-line no-unused-vars
    setSelectedPriceRange: (range: PriceRange | null) => void;
    minRating: number;
    // eslint-disable-next-line no-unused-vars
    setMinRating: (rating: number) => void;
    resetFilters: () => void;
    showFilters: boolean;
    categories?: any[]; // Replace with actual type if available
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
    selectedCategory,
    setSelectedCategory,
    selectedPriceRange,
    setSelectedPriceRange,
    // minRating,
    // setMinRating,
    resetFilters,
    showFilters,
    categories,
}) => {
    return (
        <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-52 lg:w-56 flex-shrink-0`}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-bold">Filters</h2>
                    <button onClick={resetFilters} className="text-sm text-blue-600 hover:underline">
                        Reset All
                    </button>
                </div>

                {/* Categories filter */}
                <div className="mb-4">
                    <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">Categories</h3>
                    <div className="space-y-2">
                        {/* All Products option */}
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="category-all"
                                name="category"
                                checked={selectedCategory === ''}
                                onChange={() => setSelectedCategory('')}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <label htmlFor="category-all" className="ml-2 text-sm text-gray-700">
                                All Products
                            </label>
                        </div>
                        {categories?.map((category: any) => (
                            <div key={category.id} className="flex items-center">
                                <input
                                    type="radio"
                                    id={`category-${category.id}`}
                                    name="category"
                                    checked={selectedCategory === category?.id}
                                    onChange={() => setSelectedCategory(category.id)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-gray-700">
                                    {category.title}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price range filter */}
                <div className="mb-4">
                    <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">Price Range</h3>
                    <div className="space-y-2">
                        {priceRanges.map((range, index) => (
                            <div key={index} className="flex items-center">
                                <input
                                    type="radio"
                                    id={`price-${index}`}
                                    name="price"
                                    checked={selectedPriceRange === range}
                                    onChange={() => setSelectedPriceRange(range)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <label htmlFor={`price-${index}`} className="ml-2 text-sm text-gray-700">
                                    {range.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
