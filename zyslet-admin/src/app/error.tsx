"use client"; // Error boundaries must be Client Components

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & {digest?: string};
    reset: () => void;
}) {
    return (
        // global-error must include html and body tags
        <html>
            <body>
                <div className="h-screen flex flex-col items-center justify-center">
                    <h2 className="text-lg text-red-500 ">{error.message}</h2>
                    <h2 className="text-2xl text-black mt-2">
                        Something went wrong!
                    </h2>
                    <button
                        className="btn-outline w-44 py-2 mt-5"
                        onClick={() => reset()}>
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
