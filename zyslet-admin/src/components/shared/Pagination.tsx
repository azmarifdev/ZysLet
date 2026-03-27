import React from "react";
import {GrFormNext, GrFormPrevious} from "react-icons/gr";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
}) => {
    const handlePageClick = (page: number) => {
        if (page > 0 && page <= totalPages) setCurrentPage(page);
    };

    return (
        <div className="w-full flex justify-between items-center">
            <div className="flex items-center">
                <h3 className="text-base mr-3">Show Per Page:</h3>
                <div className="flex items-center space-x-1.5 text-black">
                    {/* select per page items */}
                    {[5, 10, 20, 30].map((items) => (
                        <button
                            key={items}
                            className={`px-2 w-8 text-sm rounded pt-0.5 border ${
                                itemsPerPage === items
                                    ? "border-primary text-primary font-medium"
                                    : ""
                            }`}
                            onClick={() => setItemsPerPage(items)}>
                            {items}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex items-center text-black">
                <button
                    className="btn-outline border-none py-1 rounded inline-flex items-center justify-center"
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1} // Disable if on the first page
                >
                    <GrFormPrevious className="mr-1.5 -mt-0.5" size={16} /> Prev
                </button>
                {Array.from({length: totalPages}, (_, index) => index + 1).map(
                    (page) => (
                        <button
                            key={page}
                            className={`px-3 text-sm pt-0.5 ${
                                currentPage === page
                                    ? "border border-primary rounded text-primary font-medium"
                                    : ""
                            }`}
                            onClick={() => handlePageClick(page)}>
                            {page}
                        </button>
                    )
                )}
                <button
                    className="btn-outline border-none py-1 rounded inline-flex items-center justify-center"
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === totalPages} // Disable if on the last page
                >
                    Next <GrFormNext className="ml-1.5 -mt-0.5" size={16} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
