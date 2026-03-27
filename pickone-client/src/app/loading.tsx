export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
            <div className="h-56 md:h-72 rounded-2xl bg-gray-200 mb-8" />
            <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-gray-100 p-3 bg-white">
                        <div className="h-36 bg-gray-200 rounded-lg mb-3" />
                        <div className="h-4 bg-gray-200 rounded w-4/5 mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-2/5" />
                    </div>
                ))}
            </div>
            <div className="h-8 w-44 bg-gray-200 rounded mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-gray-100 p-3 bg-white">
                        <div className="h-36 bg-gray-200 rounded-lg mb-3" />
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-2/5" />
                    </div>
                ))}
            </div>
        </div>
    );
}
