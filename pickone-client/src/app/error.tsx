'use client';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="max-w-3xl mx-auto mt-20 p-6 bg-white border border-red-100 rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold text-red-700 mb-2">
                কিছু সমস্যা হয়েছে
            </h2>
            <p className="text-gray-600 mb-4">
                পেজ data load করতে গিয়ে সমস্যা হয়েছে। আবার চেষ্টা করো।
            </p>
            <button
                onClick={reset}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
                Try again
            </button>
            {error?.digest && (
                <p className="mt-3 text-xs text-gray-400">Ref: {error.digest}</p>
            )}
        </div>
    );
}
