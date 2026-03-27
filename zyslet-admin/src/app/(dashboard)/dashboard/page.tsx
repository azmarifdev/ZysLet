"use client";
import {
    FaPencilAlt,
    FaLock,
    FaCalendarAlt,
    FaEnvelope,
    FaShieldAlt,
    FaBoxOpen,
    FaStar,
    FaArrowUp,
    FaArrowDown,
    FaPlus,
} from "react-icons/fa";
import {MdDashboard, MdTrendingUp, MdCategory} from "react-icons/md";
import {TbLogout, TbMenuOrder} from "react-icons/tb";
import {useAppSelector} from "@/redux/hooks";
import Image from "next/image";
import {logout} from "@/redux/features/authSlice";
import {useLogoutMutation} from "@/redux/api/authApi";
import {useRouter} from "next/navigation";
import UpdateProfileModal from "./UpdateProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";
import {useState, useEffect} from "react";
import {useGetOrdersQuery} from "@/redux/api/orderApi";
import {useProductListsQuery} from "@/redux/api/productApi";
import {useGetReviewsQuery} from "@/redux/api/reviewApi";
import Link from "next/link";
import SimpleChart from "@/components/shared/Analytics/SimpleChart";
import DashboardSkeleton from "@/components/shared/Loading/DashboardSkeleton";

// Statistics Card Component
const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    color = "blue",
    href,
}: {
    title: string;
    value: string | number;
    icon: any;
    trend?: "up" | "down";
    trendValue?: string;
    color?: "blue" | "green" | "purple" | "orange" | "red";
    href?: string;
}) => {
    const colorClasses = {
        blue: "from-blue-500 to-blue-600 bg-blue-50 text-blue-600",
        green: "from-green-500 to-green-600 bg-green-50 text-green-600",
        purple: "from-purple-500 to-purple-600 bg-purple-50 text-purple-600",
        orange: "from-orange-500 to-orange-600 bg-orange-50 text-orange-600",
        red: "from-red-500 to-red-600 bg-red-50 text-red-600",
    };

    const CardContent = (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                        {title}
                    </p>
                    <div className="flex items-baseline">
                        <p className="text-2xl font-bold text-gray-900">
                            {value}
                        </p>
                        {trend && trendValue && (
                            <div
                                className={`flex items-center ml-2 text-sm ${
                                    trend === "up"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}>
                                {trend === "up" ? (
                                    <FaArrowUp className="h-3 w-3 mr-1" />
                                ) : (
                                    <FaArrowDown className="h-3 w-3 mr-1" />
                                )}
                                {trendValue}
                            </div>
                        )}
                    </div>
                </div>
                <div
                    className={`p-3 rounded-lg ${colorClasses[color]
                        .split(" ")
                        .slice(2)
                        .join(" ")}`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );

    return href ? <Link href={href}>{CardContent}</Link> : CardContent;
};

// Quick Action Button Component
const QuickActionButton = ({
    title,
    description,
    icon: Icon,
    href,
    color = "blue",
}: {
    title: string;
    description: string;
    icon: any;
    href: string;
    color?: "blue" | "green" | "purple" | "orange";
}) => {
    const colorClasses = {
        blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
        green: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
        purple: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
        orange: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
    };

    return (
        <Link href={href}>
            <div
                className={`bg-gradient-to-r ${colorClasses[color]} text-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
                <div className="flex items-center">
                    <Icon className="h-8 w-8 mr-4" />
                    <div>
                        <h3 className="text-lg font-semibold">{title}</h3>
                        <p className="text-blue-100 text-sm">{description}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

const Dashboard = () => {
    const user = useAppSelector((state) => state.auth.user);
    const [isUpdateProfileModalOpen, setIsUpdateProfileModalOpen] =
        useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
        useState(false);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalProducts: 0,
        totalReviews: 0,
        totalRevenue: 0,
        pendingOrders: 0,
    });
    const [monthlyNetRevenueData, setMonthlyNetRevenueData] = useState<
        {label: string; value: number; color: string}[]
    >([]);
    const [revenueMetrics, setRevenueMetrics] = useState({
        grossBookedRevenue: 0,
        realizedRevenue: 0,
        pipelineRevenue: 0,
        lostRevenue: 0,
        netRevenue: 0,
        averageOrderValue: 0,
        projectedMonthRevenue: 0,
    });
    const [trendData, setTrendData] = useState({
        orderTrend: "+0%",
        orderTrendType: "up" as "up" | "down",
        revenueTrend: "+0%",
        revenueTrendType: "up" as "up" | "down",
    });

    const {data: ordersData, isLoading: ordersLoading} = useGetOrdersQuery({
        query: "limit=1000",
    });
    const {data: productsData, isLoading: productsLoading} =
        useProductListsQuery({queries: {limit: 1000}});
    const {data: reviewsData, isLoading: reviewsLoading} = useGetReviewsQuery({
        query: "limit=1000",
    });

    const [logoutMutation] = useLogoutMutation();
    const router = useRouter();

    // Calculate statistics and monthly performance
    useEffect(() => {
        const orders = ordersData?.data || [];
        const products = productsData?.data || [];
        const reviews = reviewsData?.data || [];

        const totalOrders = orders.length;
        const totalProducts = products.length;
        const totalReviews = reviews.length;
        const pendingOrders = orders.filter(
            (order: any) => order.status === "pending"
        ).length;
        const grossBookedRevenue = orders.reduce(
            (sum: number, order: any) => sum + Number(order.total_price || 0),
            0,
        );
        const realizedRevenue = orders
            .filter((order: any) => order.status === "completed")
            .reduce(
                (sum: number, order: any) => sum + Number(order.total_price || 0),
                0,
            );
        const pipelineRevenue = orders
            .filter(
                (order: any) =>
                    order.status === "pending" || order.status === "processing",
            )
            .reduce(
                (sum: number, order: any) => sum + Number(order.total_price || 0),
                0,
            );
        const returnedRevenue = orders
            .filter((order: any) => order.status === "returned")
            .reduce(
                (sum: number, order: any) => sum + Number(order.total_price || 0),
                0,
            );
        const cancelledRevenue = orders
            .filter((order: any) => order.status === "cancelled")
            .reduce(
                (sum: number, order: any) => sum + Number(order.total_price || 0),
                0,
            );
        const lostRevenue = returnedRevenue + cancelledRevenue;
        const netRevenue = Math.max(0, realizedRevenue - returnedRevenue);

        const completedOrdersCount = orders.filter(
            (order: any) => order.status === "completed",
        ).length;
        const averageOrderValue =
            completedOrdersCount > 0
                ? Math.round(realizedRevenue / completedOrdersCount)
                : 0;

        // Last 6 months revenue chart
        const monthLabels = Array.from({length: 6}, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            return d.toLocaleDateString("en-US", {month: "short"});
        });

        const monthNetMap = new Map<string, number>();
        const monthRealizedMap = new Map<string, number>();
        const monthReturnedMap = new Map<string, number>();
        monthLabels.forEach((label) => {
            monthNetMap.set(label, 0);
            monthRealizedMap.set(label, 0);
            monthReturnedMap.set(label, 0);
        });

        orders.forEach((order: any) => {
            if (!order?.createdAt) return;
            const label = new Date(order.createdAt).toLocaleDateString(
                "en-US",
                {month: "short"}
            );
            if (monthNetMap.has(label)) {
                const amount = Number(order.total_price || 0);
                if (order.status === "completed") {
                    monthRealizedMap.set(
                        label,
                        (monthRealizedMap.get(label) || 0) + amount,
                    );
                } else if (order.status === "returned") {
                    monthReturnedMap.set(
                        label,
                        (monthReturnedMap.get(label) || 0) + amount,
                    );
                }
            }
        });

        const monthlyData = monthLabels.map((label) => ({
            label,
            value: Math.max(
                0,
                (monthRealizedMap.get(label) || 0) -
                    (monthReturnedMap.get(label) || 0),
            ),
            color: "#3b82f6",
        }));

        // Trend: current month vs previous month
        const currentMonthRevenue =
            monthlyData[monthlyData.length - 1]?.value || 0;
        const previousMonthRevenue =
            monthlyData[monthlyData.length - 2]?.value || 0;
        const revenueChangePct =
            previousMonthRevenue === 0
                ? currentMonthRevenue > 0
                    ? 100
                    : 0
                : ((currentMonthRevenue - previousMonthRevenue) /
                      previousMonthRevenue) *
                  100;

        const currentMonthOrderCount = orders.filter((order: any) => {
            if (!order?.createdAt) return false;
            const now = new Date();
            const d = new Date(order.createdAt);
            return (
                d.getMonth() === now.getMonth() &&
                d.getFullYear() === now.getFullYear()
            );
        }).length;

        const previousMonthOrderCount = orders.filter((order: any) => {
            if (!order?.createdAt) return false;
            const now = new Date();
            const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const d = new Date(order.createdAt);
            return (
                d.getMonth() === prev.getMonth() &&
                d.getFullYear() === prev.getFullYear()
            );
        }).length;

        const orderChangePct =
            previousMonthOrderCount === 0
                ? currentMonthOrderCount > 0
                    ? 100
                    : 0
                : ((currentMonthOrderCount - previousMonthOrderCount) /
                      previousMonthOrderCount) *
                  100;

        const now = new Date();
        const currentDay = now.getDate();
        const totalDaysInMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
        ).getDate();
        const projectedMonthRevenue =
            currentDay > 0
                ? Math.round((currentMonthRevenue / currentDay) * totalDaysInMonth)
                : 0;

        setMonthlyNetRevenueData(monthlyData);
        setRevenueMetrics({
            grossBookedRevenue,
            realizedRevenue,
            pipelineRevenue,
            lostRevenue,
            netRevenue,
            averageOrderValue,
            projectedMonthRevenue,
        });
        setTrendData({
            orderTrend:
                `${orderChangePct >= 0 ? "+" : ""}${Math.round(orderChangePct)}%`,
            orderTrendType: orderChangePct >= 0 ? "up" : "down",
            revenueTrend:
                `${revenueChangePct >= 0 ? "+" : ""}${Math.round(revenueChangePct)}%`,
            revenueTrendType: revenueChangePct >= 0 ? "up" : "down",
        });

        setStats({
            totalOrders,
            totalProducts,
            totalReviews,
            pendingOrders,
            totalRevenue: netRevenue,
        });
    }, [ordersData, productsData, reviewsData]);

    // Get initials for avatar fallback
    const getInitials = (name: string): string => {
        return name
            ?.split(" ")
            ?.map((n: string) => n?.[0])
            ?.join("")
            ?.toUpperCase();
    };

    const handleLogout = async () => {
        await logoutMutation({});
        logout();
        router.push("/login");
    };

    // Format date to be more readable
    const formatDate = (dateString: string): string => {
        return new Date(dateString)?.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Show loading skeleton while data is being fetched
    if (ordersLoading || productsLoading || reviewsLoading) {
        return <DashboardSkeleton />;
    }

    const orderStatusData = [
        {
            label: "Completed",
            value:
                ordersData?.data?.filter(
                    (order: any) => order.status === "completed"
                ).length || 0,
            color: "#10b981",
        },
        {
            label: "Processing",
            value:
                ordersData?.data?.filter(
                    (order: any) => order.status === "processing"
                ).length || 0,
            color: "#3b82f6",
        },
        {
            label: "Pending",
            value:
                ordersData?.data?.filter(
                    (order: any) => order.status === "pending"
                ).length || 0,
            color: "#f59e0b",
        },
        {
            label: "Cancelled",
            value:
                ordersData?.data?.filter(
                    (order: any) => order.status === "cancelled"
                ).length || 0,
            color: "#ef4444",
        },
    ];

    const reviewStatusData = [
        {
            label: "Approved Reviews",
            value:
                reviewsData?.data?.filter(
                    (review: any) => review.status === "approved"
                ).length || 0,
            color: "#22c55e",
        },
        {
            label: "Pending Reviews",
            value:
                reviewsData?.data?.filter(
                    (review: any) => review.status === "pending"
                ).length || 0,
            color: "#f59e0b",
        },
        {
            label: "Rejected Reviews",
            value:
                reviewsData?.data?.filter(
                    (review: any) => review.status === "rejected"
                ).length || 0,
            color: "#ef4444",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-8 animate-fade-in-up">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Welcome back, {user?.name}!
                        </h1>
                        <p className="text-blue-100">
                            Here&apos;s what&apos;s happening with your business
                            today.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <MdDashboard className="h-16 w-16 text-blue-200" />
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-animation">
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={TbMenuOrder}
                    trend={trendData.orderTrendType}
                    trendValue={trendData.orderTrend}
                    color="blue"
                    href="/orders"
                />
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={FaBoxOpen}
                    trend="up"
                    trendValue="+5%"
                    color="green"
                    href="/product/manage-product"
                />
                <StatCard
                    title="Net Revenue"
                    value={`৳${stats.totalRevenue.toLocaleString()}`}
                    icon={MdTrendingUp}
                    trend={trendData.revenueTrendType}
                    trendValue={trendData.revenueTrend}
                    color="purple"
                />
                <StatCard
                    title="Total Reviews"
                    value={stats.totalReviews}
                    icon={FaStar}
                    trend="up"
                    trendValue={`${reviewStatusData[1]?.value || 0} pending`}
                    color="orange"
                    href="/reviews"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-animation">
                <QuickActionButton
                    title="Add Product"
                    description="Create a new product listing"
                    icon={FaPlus}
                    href="/product/add-product"
                    color="blue"
                />
                <QuickActionButton
                    title="Manage Orders"
                    description="View and process orders"
                    icon={TbMenuOrder}
                    href="/orders"
                    color="green"
                />
                <QuickActionButton
                    title="Categories"
                    description="Manage product categories"
                    icon={MdCategory}
                    href="/category"
                    color="purple"
                />
                <QuickActionButton
                    title="Reviews"
                    description="Check customer feedback"
                    icon={FaStar}
                    href="/reviews"
                    color="orange"
                />
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-scale-in">
                <SimpleChart
                    title="Order Status Distribution"
                    type="doughnut"
                    data={orderStatusData}
                />
                <SimpleChart
                    title="Monthly Net Revenue (Last 6 Months)"
                    type="bar"
                    data={monthlyNetRevenueData}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-scale-in">
                <SimpleChart
                    title="Revenue Composition"
                    type="doughnut"
                    data={[
                        {
                            label: "Realized",
                            value: Math.round(revenueMetrics.realizedRevenue),
                            color: "#22c55e",
                        },
                        {
                            label: "Pipeline",
                            value: Math.round(revenueMetrics.pipelineRevenue),
                            color: "#3b82f6",
                        },
                        {
                            label: "Lost/Returned",
                            value: Math.round(revenueMetrics.lostRevenue),
                            color: "#ef4444",
                        },
                    ]}
                />
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Revenue Intelligence
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                            <p className="text-xs text-green-700 font-medium">
                                Realized Revenue
                            </p>
                            <p className="text-xl font-bold text-green-800">
                                ৳{Math.round(revenueMetrics.realizedRevenue).toLocaleString()}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                            <p className="text-xs text-blue-700 font-medium">
                                Pipeline Revenue
                            </p>
                            <p className="text-xl font-bold text-blue-800">
                                ৳{Math.round(revenueMetrics.pipelineRevenue).toLocaleString()}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                            <p className="text-xs text-red-700 font-medium">
                                Lost / Returned
                            </p>
                            <p className="text-xl font-bold text-red-800">
                                ৳{Math.round(revenueMetrics.lostRevenue).toLocaleString()}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                            <p className="text-xs text-purple-700 font-medium">
                                Average Order Value
                            </p>
                            <p className="text-xl font-bold text-purple-800">
                                ৳{Math.round(revenueMetrics.averageOrderValue).toLocaleString()}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 sm:col-span-2">
                            <p className="text-xs text-amber-700 font-medium">
                                Projected This Month (Run Rate)
                            </p>
                            <p className="text-2xl font-bold text-amber-800">
                                ৳{Math.round(revenueMetrics.projectedMonthRevenue).toLocaleString()}
                            </p>
                            <p className="text-xs text-amber-700 mt-1">
                                Based on current month net revenue pace
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="animate-scale-in">
                <SimpleChart
                    title="Review Moderation Overview"
                    type="bar"
                    data={reviewStatusData}
                />
            </div>

            {/* User Profile Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        {/* Profile Header with Background */}
                        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                            {/* Avatar - Positioned to overlap the header and content */}
                            <div className="absolute -bottom-16 left-8">
                                <div className="p-1 bg-white rounded-full shadow-lg">
                                    {user?.profile_image ? (
                                        <Image
                                            src={
                                                user?.profile_image ||
                                                "/placeholder.svg"
                                            }
                                            alt={user?.name}
                                            width={100}
                                            height={100}
                                            className="w-32 h-32 rounded-full object-cover border-4 border-white"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-3xl font-bold text-gray-700 border-4 border-white">
                                            {getInitials(user?.name)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Content Section with spacing for the avatar */}
                        <div className="pt-20 px-8 pb-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                        {user?.name}
                                    </h2>
                                    <div className="flex items-center text-gray-500 mb-4">
                                        <FaShieldAlt className="w-4 h-4 mr-2" />
                                        <span className="capitalize font-medium">
                                            {user?.role}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors duration-200">
                                    <TbLogout size={18} />
                                    Logout
                                </button>
                            </div>

                            {/* User Info Grid */}
                            <div className="space-y-4">
                                {/* Email */}
                                <div className="flex items-center">
                                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                        <FaEnvelope className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Email Address
                                        </p>
                                        <p className="text-base font-medium text-gray-900">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Member Since */}
                                <div className="flex items-center">
                                    <div className="bg-green-100 p-3 rounded-lg mr-4">
                                        <FaCalendarAlt className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Member Since
                                        </p>
                                        <p className="text-base font-medium text-gray-900">
                                            {formatDate(user?.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                <button
                                    onClick={() =>
                                        setIsUpdateProfileModalOpen(true)
                                    }
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300">
                                    <FaPencilAlt className="h-4 w-4" />
                                    Update Profile
                                </button>
                                <button
                                    onClick={() =>
                                        setIsChangePasswordModalOpen(true)
                                    }
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300">
                                    <FaLock className="h-4 w-4" />
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Sidebar */}
                <div className="space-y-6">
                    {/* Recent Orders */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Recent Orders
                            </h3>
                            <Link
                                href="/orders"
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                View All
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {ordersData?.data
                                ?.slice(0, 3)
                                .map((order: any, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                #{order?.orderNo}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {order?.address?.name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">
                                                ৳{order.total_price}
                                            </p>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${
                                                    order.status === "completed"
                                                        ? "bg-green-100 text-green-800"
                                                        : order.status ===
                                                          "processing"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : order.status ===
                                                          "pending"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                )) || (
                                <div className="text-center py-4 text-gray-500">
                                    <p className="text-sm">No recent orders</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    {/* <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Recent Activity
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="bg-green-100 p-2 rounded-lg mr-3">
                                    <FaBoxOpen className="h-4 w-4 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        New product added
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        2 hours ago
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                    <TbMenuOrder className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        Order processed
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        4 hours ago
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                    <FaStar className="h-4 w-4 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        New review received
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        6 hours ago
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    {/* System Health */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            System Status
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    Server Status
                                </span>
                                <span className="flex items-center text-green-600 text-sm font-medium">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    Online
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    Database
                                </span>
                                <span className="flex items-center text-green-600 text-sm font-medium">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    Connected
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    API Status
                                </span>
                                <span className="flex items-center text-green-600 text-sm font-medium">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isUpdateProfileModalOpen && (
                <UpdateProfileModal
                    isOpen={isUpdateProfileModalOpen}
                    setIsOpen={setIsUpdateProfileModalOpen}
                    userData={user}
                />
            )}
            {isChangePasswordModalOpen && (
                <ChangePasswordModal
                    isOpen={isChangePasswordModalOpen}
                    setIsOpen={setIsChangePasswordModalOpen}
                />
            )}
        </div>
    );
};

export default Dashboard;
