"use client";
import Loader from "@/components/reusable/Loader/Loader";
import {useLoadUserQuery} from "@/redux/api/authApi";
import {setUser} from "@/redux/features/authSlice";
import {useAppDispatch} from "@/redux/hooks";
import {useRouter} from "next/navigation";
import {ReactNode, useEffect} from "react";

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({children}: UserProviderProps): JSX.Element => {
    const dispatch = useAppDispatch();

    // Call the profile API using the RTK Query hook
    const {data: profileData, isLoading, isSuccess} = useLoadUserQuery({});

    // When the profile data is successfully fetched, update the Redux store
    useEffect(() => {
        if (isSuccess && profileData?.data)
            dispatch(setUser(profileData?.data));
    }, [isSuccess, profileData?.data, dispatch]);

    const router = useRouter();
    if (isLoading) return <Loader />;

    if (!isLoading && profileData?.data?.role !== "admin")
        router.push("/login");

    return <>{children}</>;
};
