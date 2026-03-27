/* eslint-disable no-unused-vars */
'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';

interface ResponsiveLayoutProps {
    children: React.ReactNode;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="w-full flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div
                className={`flex-grow min-h-screen overflow-hidden bg-gray-50 transition-all duration-300 ${
                    isMobile ? 'w-full' : isCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[280px]'
                }`}>
                <div className={`px-6 ${isMobile ? 'pt-16' : ''}`}>
                    <Header />
                    <div className="my-10 w-full">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default ResponsiveLayout;
