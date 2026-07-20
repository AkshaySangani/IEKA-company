import React from "react";

interface PaginationProps {
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

const Pagination: React.FC<PaginationProps> = ({
  totalRecords,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}) => {
  const totalPages = Math.ceil(totalRecords / pageSize);

  const getPages = () => {
    const pages: number[] = [];

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);

    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* Total Records */}
      <div className="text-[15px] text-gray-700">
        Total : <span className="font-semibold">{totalRecords}</span>
      </div>

      <div className="flex items-center gap-6">
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="h-9 min-w-9 border border-gray-300 px-3 text-sm disabled:opacity-50"
            >
              Prev
            </button>

            {getPages().map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`h-9 min-w-9 border text-sm ${
                  currentPage === page
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="h-9 min-w-9 border border-gray-300 px-3 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Page Size */}
        <div className="flex items-center gap-3">
          <span className="text-[15px]">Show</span>

          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 min-w-[85px] border border-gray-300 px-3 outline-none"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <span className="text-[15px]">Per Page</span>
        </div>
      </div>
    </div>
  );
};

export default Pagination;