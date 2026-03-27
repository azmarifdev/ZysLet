// src/providers/ReduxProvider.tsx
"use client"; // Ensure this component is treated as a client component

import {Provider} from "react-redux";
import React from "react";
import {store} from "@/redux/store"; // Ensure this path is correct

interface StoreProviderProps {
    children: React.ReactNode;
}

const StoreProvider: React.FC<StoreProviderProps> = ({children}) => {
    return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
