import React from 'react';
import Sidebar from '../../components/shared/Sidebar/Sidebar';
import Header from '../../components/shared/Header/Header';
import { UserProvider } from '@/providers/UserProvider';

export default function DashboardLayouts({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
            <div className="w-full flex min-h-screen">
                {/* Sidebar */}
                <Sidebar />

                {/* Main content area */}
                <div className="flex-grow min-h-screen overflow-hidden bg-gray-50">
                    <div className="px-6 lg:px-6 pt-20 lg:pt-0">
                        <Header />
                        <div className="my-10 w-full">{children}</div>
                    </div>
                </div>
            </div>
        </UserProvider>
    );
}
