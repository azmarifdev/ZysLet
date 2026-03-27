"use client";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    productsPerPage: number;
    // eslint-disable-next-line no-unused-vars
    paginate: (pageNumber: number) => void;
    goToPreviousPage: () => void;
    goToNextPage: () => void;
    // eslint-disable-next-line no-unused-vars
    setProductsPerPage: (perPage: number) => void;
}

export const ProductPagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    productsPerPage,
    paginate,
    goToPreviousPage,
    goToNextPage,
    setProductsPerPage,
}) => {
    const pageNumbers = Array.from({length: totalPages}, (_, index) => index + 1);
    const visiblePages = pageNumbers.filter(
        (page) => page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1),
    );

    const withEllipsis: (number | string)[] = [];
    visiblePages.forEach((page, idx) => {
        withEllipsis.push(page);
        const next = visiblePages[idx + 1];
        if (next && next - page > 1) withEllipsis.push('...');
    });

    return (
        <div className="flex flex-col items-center space-y-5 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            {totalPages > 1 && (
                <div className="flex justify-center ">
                    <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                </div>
            )}

            <div className="flex items-center space-x-4">
                <select
                    value={productsPerPage}
                    onChange={(e) =>
                        setProductsPerPage(parseInt(e.target.value))
                    }
                    className="px-3 py-1 rounded-md bg-white border border-gray-300 bg-transparent focus:outline-none">
                    {[10, 20, 30, 50].map((option) => (
                        <option key={option} value={option}>
                            {option} per page
                        </option>
                    ))}
                </select>

                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                        currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                    aria-label="Previous page">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>

                {withEllipsis.map((item, index) =>
                    item === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                            ...
                        </span>
                    ) : (
                        <button
                            key={item}
                            onClick={() => paginate(Number(item))}
                            className={`px-3 py-1 rounded-md ${
                                Number(item) === currentPage
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                            }`}>
                            {item}
                        </button>
                    ),
                )}

                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                        currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                    aria-label="Next page">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};
