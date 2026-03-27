"use client";
import React, {useState, useEffect} from "react";
import {
    FiSearch,
    FiStar,
    FiClock,
    FiCheckCircle,
    FiXCircle,
} from "react-icons/fi";
import Loader from "@/components/reusable/Loader/Loader";
import {
    useGetReviewsQuery,
    useApproveReviewMutation,
    useRejectReviewMutation,
    useDeleteReviewMutation,
} from "@/redux/api/reviewApi";
import NotFound from "@/components/shared/NotFound";
import Pagination from "@/components/shared/Pagination";
import ReviewTable from "./components/ReviewTable";
import ConfirmationModal from "./components/ConfirmationModal";
import ReviewDetailsModal from "./components/ReviewDetailsModal";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const Reviews = () => {
    const [activeTab, setActiveTab] = useState<string | "all">("all");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // RTK Query hooks
    const [approveReview] = useApproveReviewMutation();
    const [rejectReview] = useRejectReviewMutation();
    const [deleteReview] = useDeleteReviewMutation();

    // State for modals
    const [currentReview, setCurrentReview] = useState<any>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{
        type: "approve" | "reject" | "delete";
        reviewId: string;
        title: string;
        description: string;
    } | null>(null);

    // Debounce effect for search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    // Construct query parameters
    let queries = `page=${currentPage}&limit=${itemsPerPage}`;
    if (activeTab !== "all") queries += `&status=${activeTab}`;
    if (debouncedSearchTerm) queries += `&search=${debouncedSearchTerm}`;

    // Fetch reviews
    const {
        data: reviews,
        isLoading,
        isFetching,
    } = useGetReviewsQuery({query: queries});

    // Summary queries for functional counters across all pages
    const {data: allReviewsSummary} = useGetReviewsQuery({
        query: "page=1&limit=1",
    });
    const {data: pendingReviewsSummary} = useGetReviewsQuery({
        query: "page=1&limit=1&status=pending",
    });
    const {data: approvedReviewsSummary} = useGetReviewsQuery({
        query: "page=1&limit=1&status=approved",
    });
    const {data: rejectedReviewsSummary} = useGetReviewsQuery({
        query: "page=1&limit=1&status=rejected",
    });

    const totalReviews = allReviewsSummary?.meta?.total || 0;
    const pendingReviews = pendingReviewsSummary?.meta?.total || 0;
    const approvedReviews = approvedReviewsSummary?.meta?.total || 0;
    const rejectedReviews = rejectedReviewsSummary?.meta?.total || 0;
    const averageRating =
        reviews?.data?.length > 0
            ? (
                  reviews.data.reduce(
                      (sum: number, review: any) =>
                          sum + Number(review.rating || 0),
                      0
                  ) / reviews.data.length
              ).toFixed(1)
            : "0.0";

    // Calculate total pages
    useEffect(() => {
        if (reviews?.meta?.total) {
            setTotalPages(Math.ceil(reviews?.meta.total / itemsPerPage));
        }
    }, [reviews?.meta?.total, itemsPerPage]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage, activeTab, debouncedSearchTerm]);

    const handleAction = (
        type: "approve" | "reject" | "delete" | "view",
        review: any
    ) => {
        if (type === "view") {
            setCurrentReview(review);
            setIsViewModalOpen(true);
            return;
        }

        let title = "";
        let description = "";

        switch (type) {
            case "approve":
                title = "Approve Review";
                description = "Are you sure you want to approve this review?";
                break;
            case "reject":
                title = "Reject Review";
                description = "Are you sure you want to reject this review?";
                break;
            case "delete":
                title = "Delete Review";
                description =
                    "Are you sure you want to delete this review? This action cannot be undone.";
                break;
        }

        setConfirmAction({
            type,
            reviewId: review._id,
            title,
            description,
        });
        setIsConfirmModalOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!confirmAction) return;

        try {
            switch (confirmAction.type) {
                case "approve":
                    await approveReview(confirmAction.reviewId).unwrap();
                    break;
                case "reject":
                    await rejectReview(confirmAction.reviewId).unwrap();
                    break;
                case "delete":
                    await deleteReview(confirmAction.reviewId).unwrap();
                    break;
            }
            setIsConfirmModalOpen(false);
            setConfirmAction(null);
        } catch (error) {
            console.error("Action failed:", error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Review Management
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage and moderate customer reviews
                    </p>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-600 text-sm font-medium">
                                    Total Reviews
                                </p>
                                <p className="text-2xl font-bold text-blue-900">
                                    {totalReviews}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-200 rounded-full">
                                <FiStar className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-600 text-sm font-medium">
                                    Pending Reviews
                                </p>
                                <p className="text-2xl font-bold text-yellow-900">
                                    {pendingReviews}
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-200 rounded-full">
                                <FiClock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-600 text-sm font-medium">
                                    Approved Reviews
                                </p>
                                <p className="text-2xl font-bold text-green-900">
                                    {approvedReviews}
                                </p>
                            </div>
                            <div className="p-3 bg-green-200 rounded-full">
                                <FiCheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-600 text-sm font-medium">
                                    Rejected Reviews
                                </p>
                                <p className="text-2xl font-bold text-red-900">
                                    {rejectedReviews}
                                </p>
                            </div>
                            <div className="p-3 bg-red-200 rounded-full">
                                <FiXCircle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md border border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardContent className="p-4 flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-semibold">{reviews?.data?.length || 0}</span> reviews on this page
                    </p>
                    <p className="text-sm text-gray-700">
                        Average Rating: <span className="font-semibold text-indigo-700">{averageRating} / 5</span>
                    </p>
                </CardContent>
            </Card>

            {/* Filters */}
            <Card className="shadow-lg border-0 bg-white">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
                        {/* Search */}
                        <div className="flex-1 space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Search Reviews
                            </label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Search by product, customer, or review content..."
                                    className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                                <FiSearch className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Filter by Status
                            </label>
                            <Select
                                value={activeTab}
                                onValueChange={(value) =>
                                    setActiveTab(value as string | "all")
                                }>
                                <SelectTrigger className="w-40 h-11 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="all">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="approved">
                                        Approved
                                    </SelectItem>
                                    <SelectItem value="rejected">
                                        Rejected
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Items per page */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Show
                            </label>
                            <Select
                                value={itemsPerPage.toString()}
                                onValueChange={(value) =>
                                    setItemsPerPage(Number(value))
                                }>
                                <SelectTrigger className="w-24 h-11 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Content */}
            <Card className="shadow-lg border-0 bg-white">
                <CardContent className="p-0">
                    {isLoading || isFetching ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader />
                        </div>
                    ) : reviews?.data?.length === 0 ? (
                        <div className="py-12">
                            <NotFound message="No reviews found matching your criteria." />
                        </div>
                    ) : (
                        <ReviewTable
                            data={reviews?.data}
                            handleAction={handleAction}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {reviews?.meta?.total > 1 && (
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

            {/* Review Details Modal */}
            <ReviewDetailsModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                review={currentReview}
            />

            {/* Confirmation Modal */}
            <ConfirmationModal
                dialogOpen={isConfirmModalOpen}
                setDialogOpen={setIsConfirmModalOpen}
                dialogAction={{
                    title: confirmAction?.title || "",
                    description: confirmAction?.description || "",
                    type:
                        confirmAction?.type === "delete" ? "delete" : "default",
                }}
                handleConfirmAction={handleConfirmAction}
            />
        </div>
    );
};

export default Reviews;
