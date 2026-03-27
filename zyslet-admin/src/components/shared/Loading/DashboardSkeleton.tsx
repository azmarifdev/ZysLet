'use client';
import React from 'react';

const DashboardSkeleton = () => {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Welcome Header Skeleton */}
            <div className="bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl h-32"></div>

            {/* Statistics Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded-xl h-24"></div>
                ))}
            </div>

            {/* Analytics and Profile Section Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-64"></div>
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-64"></div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-80"></div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-64"></div>
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-48"></div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;
