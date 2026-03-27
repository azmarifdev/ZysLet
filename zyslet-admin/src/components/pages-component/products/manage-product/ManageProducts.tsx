"use client";
import React, {useState, useEffect} from "react";
import {
    FiSearch,
    FiPlus,
    FiPackage,
    FiTrendingUp,
    // FiDollarSign,
    FiShoppingCart,
} from "react-icons/fi";
import {HiOutlineChevronDown} from "react-icons/hi";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Loader from "@/components/reusable/Loader/Loader";
import {useCategoryListQuery} from "@/redux/api/categoryApi";
import {useProductListsQuery} from "@/redux/api/productApi";
import Pagination from "@/components/shared/Pagination";
import ProductTable from "./components/ProductTable";

const ManageProduct = () => {
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [priceOrder, setPriceOrder] = useState<"asc" | "desc" | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] =
        useState<string>(searchTerm);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const {data: categories} = useCategoryListQuery();

    // Debounce effect to delay the API call until the user stops typing
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // Delay of 500ms
        // Clean up the timeout if the user types within the delay
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    // Construct query parameters based on filters
    let queries = `page=${currentPage}&limit=${itemsPerPage}`;
    if (priceOrder) queries += `&sortBy=price&sortOrder=${priceOrder}`;
    if (selectedCategory) queries += `&category=${selectedCategory._id}`;
    if (debouncedSearchTerm) queries += `&search=${debouncedSearchTerm}`;

    const {
        data: products,
        isLoading,
        isFetching,
    } = useProductListsQuery({queries});

    // Calculate the total number of pages
    useEffect(() => {
        if (products?.meta?.total) {
            setTotalPages(Math.ceil(products?.meta.total / itemsPerPage));
        }
    }, [products?.meta?.total, itemsPerPage]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = e.target.value;
        if (categoryId === "") {
            setSelectedCategory(null);
        } else {
            const category = categories?.data.find(
                (cat: any) => cat._id === categoryId
            );
            setSelectedCategory(category || null);
        }
    };

    useEffect(() => {
        setCurrentPage(1); // Reset to the first page when filters change
    }, [itemsPerPage, selectedCategory, debouncedSearchTerm]);

    // Calculate stats
    const totalProducts = products?.meta?.total || 0;
    const publishedProducts =
        products?.data?.filter((p: any) => p.is_published)?.length || 0;
    // const totalValue =
    //     products?.data?.reduce(
    //         (sum: number, product: any) =>
    //             sum + product.price * product.quantity,
    //         0
    //     ) || 0;

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-indigo-500 rounded-lg">
                            <FiPackage className="text-white text-xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Product Management
                            </h1>
                            <p className="text-gray-600">
                                Manage your product inventory and listings
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Link href="/product/add-product">
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200">
                                <FiPlus size={16} />
                                Add New Product
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">
                                Total Products
                            </p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {totalProducts}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <FiPackage className="text-blue-600 text-xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">
                                Published
                            </p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {publishedProducts}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <FiTrendingUp className="text-green-600 text-xl" />
                        </div>
                    </div>
                </div>

                {/* <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">
                                Total Value
                            </p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                ৳{totalValue.toLocaleString()}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <FiDollarSign className="text-purple-600 text-xl" />
                        </div>
                    </div>
                </div> */}

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">
                                Categories
                            </p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {categories?.data?.length || 0}
                            </p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <FiShoppingCart className="text-orange-600 text-xl" />
                        </div>
                    </div>
                </div>
            </div>
            {/* Search and Filter Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col lg:justify-between lg:flex-row gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products by name, code, description..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>

                    {/* Filter Controls */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Price Filter */}
                        <div className="relative">
                            <select
                                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all min-w-[150px]"
                                value={priceOrder || ""}
                                onChange={(e) =>
                                    setPriceOrder(
                                        e.target.value as "asc" | "desc" | null
                                    )
                                }>
                                <option value="">Sort by Price</option>
                                <option value="asc">Price: Low to High</option>
                                <option value="desc">Price: High to Low</option>
                            </select>
                            <HiOutlineChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <select
                                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all min-w-[180px]"
                                value={selectedCategory?._id || ""}
                                onChange={handleCategoryChange}>
                                <option value="">All Categories</option>
                                {categories?.data?.map((category: any) => (
                                    <option
                                        key={category._id}
                                        value={category._id}>
                                        {category.title}
                                    </option>
                                ))}
                            </select>
                            <HiOutlineChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        {/* View Mode Toggle */}
                        {/* <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                                    viewMode === 'table'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}>
                                <FiList size={16} />
                                Table
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                                    viewMode === 'grid'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}>
                                <FiGrid size={16} />
                                Grid
                            </button>
                        </div> */}
                    </div>
                </div>

                {/* Active Filters */}
                {(selectedCategory || priceOrder || debouncedSearchTerm) && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                        <span className="text-sm text-gray-600">
                            Active filters:
                        </span>
                        {selectedCategory && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Category: {selectedCategory.title}
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="ml-2 text-blue-600 hover:text-blue-800">
                                    ×
                                </button>
                            </span>
                        )}
                        {priceOrder && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Price:{" "}
                                {priceOrder === "asc"
                                    ? "Low to High"
                                    : "High to Low"}
                                <button
                                    onClick={() => setPriceOrder(null)}
                                    className="ml-2 text-green-600 hover:text-green-800">
                                    ×
                                </button>
                            </span>
                        )}
                        {debouncedSearchTerm && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Search: &ldquo;{debouncedSearchTerm}&rdquo;
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="ml-2 text-purple-600 hover:text-purple-800">
                                    ×
                                </button>
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Products Display */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading || isFetching ? (
                    <div className="p-12">
                        <Loader />
                    </div>
                ) : products?.data.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <FiPackage className="text-gray-400 text-2xl" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No products found
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {debouncedSearchTerm || selectedCategory
                                ? "Try adjusting your search or filter criteria"
                                : "Get started by adding your first product"}
                        </p>
                        {!debouncedSearchTerm && !selectedCategory && (
                            <Link href="/product/add-product">
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    <FiPlus className="mr-2" size={16} />
                                    Add Your First Product
                                </Button>
                            </Link>
                        )}
                    </div>
                ) : (
                    <ProductTable data={products?.data} />
                )}
            </div>

            {/* Pagination */}
            {products?.meta?.total > 1 && (
                <div className="flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        setCurrentPage={setCurrentPage}
                        setItemsPerPage={setItemsPerPage}
                    />
                </div>
            )}
        </div>
    );
};

export default ManageProduct;
