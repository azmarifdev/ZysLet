"use client";

import {useState} from "react";
import {
    useCategoryListQuery,
    useDeleteCategoryMutation,
} from "@/redux/api/categoryApi";
import {
    FaEdit,
    FaTrash,
    FaPlus,
    FaSearch,
    FaTags,
    FaCalendarAlt,
    FaEye,
} from "react-icons/fa";
// import {HiOutlineChevronDown} from "react-icons/hi";
import AddCategoryDialog from "./AddCategoryDialog";
import EditCategoryDialog from "./EditCategoryDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import {Button} from "@/components/ui/button";
import Loader from "@/components/reusable/Loader/Loader";

interface Category {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

const CategoryList = () => {
    const {data: categoryData, isLoading} = useCategoryListQuery();
    const [deleteCategory, {isLoading: isDeleting}] =
        useDeleteCategoryMutation();

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const handleDeleteClick = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedCategory) {
            try {
                await deleteCategory(selectedCategory.id).unwrap();
                setIsDeleteDialogOpen(false);
            } catch (error) {
                console.error("Failed to delete the category", error);
            }
        }
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsEditDialogOpen(true);
    };

    // Filter categories based on search term
    const filteredCategories =
        categoryData?.data?.filter((category: Category) =>
            category.title.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];

    if (isLoading) return <Loader />;

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-blue-500 rounded-lg">
                            <FaTags className="text-white text-xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Category Management
                            </h1>
                            <p className="text-gray-600">
                                Organize and manage your product categories
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Button
                            onClick={() => setIsAddDialogOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200">
                            <FaPlus size={14} />
                            Add New Category
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">
                                Total Categories
                            </p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {categoryData?.data?.length || 0}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <FaTags className="text-green-600 text-xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">
                                Active Categories
                            </p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {filteredCategories.length}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <FaEye className="text-blue-600 text-xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">
                                Last Updated
                            </p>
                            <p className="text-sm font-medium text-gray-900 mt-1">
                                {categoryData?.data?.[0]
                                    ? new Date(
                                          categoryData.data[0].updatedAt
                                      ).toLocaleDateString()
                                    : "No data"}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <FaCalendarAlt className="text-purple-600 text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <FaFilter className="text-gray-500" />
                            <span className="text-gray-700">Filter</span>
                            <HiOutlineChevronDown className="text-gray-500" />
                        </button> */}

                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                    viewMode === "grid"
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}>
                                Grid
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                    viewMode === "list"
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}>
                                List
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Display */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {filteredCategories.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <FaTags className="text-gray-400 text-2xl" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No categories found
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm
                                ? "Try adjusting your search terms"
                                : "Get started by creating your first category"}
                        </p>
                        {!searchTerm && (
                            <Button
                                onClick={() => setIsAddDialogOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white">
                                <FaPlus className="mr-2" size={14} />
                                Create Category
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Grid View */}
                        {viewMode === "grid" && (
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredCategories.map(
                                        (category: Category) => (
                                            <div
                                                key={category.id}
                                                className="group bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                                        <FaTags className="text-blue-600 text-lg" />
                                                    </div>
                                                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() =>
                                                                handleEdit(
                                                                    category
                                                                )
                                                            }
                                                            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all">
                                                            <FaEdit size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteClick(
                                                                    category
                                                                )
                                                            }
                                                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all">
                                                            <FaTrash
                                                                size={14}
                                                            />
                                                        </button>
                                                    </div>
                                                </div>

                                                <h3 className="text-lg font-semibold text-gray-900 mb-2 capitalize truncate">
                                                    {category.title}
                                                </h3>

                                                <div className="space-y-2 text-sm text-gray-500">
                                                    <div className="flex items-center space-x-2">
                                                        <FaCalendarAlt
                                                            size={12}
                                                        />
                                                        <span>
                                                            Created:{" "}
                                                            {new Date(
                                                                category.createdAt
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    {category.updatedAt !==
                                                        category.createdAt && (
                                                        <div className="flex items-center space-x-2">
                                                            <FaEdit size={12} />
                                                            <span>
                                                                Updated:{" "}
                                                                {new Date(
                                                                    category.updatedAt
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                        Active
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {/* List View */}
                        {viewMode === "list" && (
                            <div className="overflow-hidden">
                                <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
                                        <div className="col-span-4">
                                            Category Name
                                        </div>
                                        <div className="col-span-3">
                                            Created Date
                                        </div>
                                        <div className="col-span-3">
                                            Last Updated
                                        </div>
                                        <div className="col-span-2 text-center">
                                            Actions
                                        </div>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {filteredCategories.map(
                                        (category: Category) => (
                                            <div
                                                key={category.id}
                                                className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                                <div className="grid grid-cols-12 gap-4 items-center">
                                                    <div className="col-span-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                                <FaTags className="text-blue-600 text-sm" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold text-gray-900 capitalize">
                                                                    {
                                                                        category.title
                                                                    }
                                                                </h3>
                                                                <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full mt-1">
                                                                    Active
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-3 text-sm text-gray-600">
                                                        {new Date(
                                                            category.createdAt
                                                        ).toLocaleDateString()}
                                                    </div>
                                                    <div className="col-span-3 text-sm text-gray-600">
                                                        {new Date(
                                                            category.updatedAt
                                                        ).toLocaleDateString()}
                                                    </div>
                                                    <div className="col-span-2">
                                                        <div className="flex justify-center space-x-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        category
                                                                    )
                                                                }
                                                                className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all">
                                                                <FaEdit
                                                                    size={14}
                                                                />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteClick(
                                                                        category
                                                                    )
                                                                }
                                                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all">
                                                                <FaTrash
                                                                    size={14}
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Add Category Dialog */}
            <AddCategoryDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
            />

            {/* Edit Category Dialog */}
            {selectedCategory && (
                <EditCategoryDialog
                    isOpen={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    category={selectedCategory}
                />
            )}

            {/* Delete Confirmation Dialog */}
            {selectedCategory && (
                <DeleteConfirmDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onConfirm={handleConfirmDelete}
                    isDeleting={isDeleting}
                />
            )}
        </div>
    );
};

export default CategoryList;
