"use client";
import {useRouter} from "next/navigation";

export default function NotFound() {
    const router = useRouter();
    return (
        <main className="h-screen w-full flex flex-col justify-center items-center bg-white">
            <h1 className="text-9xl font-extrabold text-black tracking-widest">
                404
            </h1>
            <div className="bg-primary px-2 text-lg text-white rounded rotate-12 absolute">
                Page Not Found
            </div>
            <button
                className="mt-5 btn-outline py-2 w-44"
                onClick={() => router.back()}>
                Go Back
            </button>
        </main>
    );
}
