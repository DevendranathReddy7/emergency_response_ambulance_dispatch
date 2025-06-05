import type { PaginationProps } from "../../dataModals/Common";

export const ShowPagination = ({ pagination,updatePage,prevNext }:PaginationProps) => {
    
    const handlePrev = () => {
        if (pagination.currentPage > 1) {
            prevNext(pagination.currentPage - 1)
        }
    };

    const handleNext = () => {
        if (pagination.currentPage < pagination.totalPages) {
            prevNext(pagination.currentPage + 1)

        }
    };

    const handlePageClick = (i: number) => {
        updatePage(i)
    };

    return (
        <div className="flex justify-center items-center">
            <div
                className={`mr-2 cursor-pointer ${pagination.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handlePrev}
            >
                ◀️
            </div>

            {[...Array(pagination?.totalPages)].map((_, i) => {
                return (
                    <div
                        key={i}
                        className={`mx-1 px-3 py-1 border border-gray-300 rounded-3xl cursor-pointer text-center ${pagination.currentPage === i + 1 ? 'bg-blue-800 text-white border-blue-800' : ''
                            }`}
                        onClick={() => handlePageClick(i)}
                    >
                        {i + 1}
                    </div>
                );
            })}

            <div
                className={`ml-2 cursor-pointer ${pagination.currentPage === pagination.totalPages || pagination.totalPages === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleNext}
            >
                ▶️
            </div>

        </div>
    )
}
