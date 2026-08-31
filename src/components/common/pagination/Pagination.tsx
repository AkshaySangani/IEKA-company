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
    let end = Math.min(totalPages, start + 2);

    if (end - start < 4) {
      start = Math.max(1, end - 2);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div
      className="
        w-full
        flex
        items-center
        justify-between
        gap-3
        min-w-0
      "
    >
      {/* Total Records */}
      <div className="text-[14px] sm:text-[15px] text-gray-700 shrink-0">
        Total : <span className="font-medium">{totalRecords}</span>
      </div>

      <div className="flex items-center gap-3 sm:gap-6 min-w-0">
        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="
              flex
              items-center
              gap-1
              shrink-0
            "
          >
            {/* Previous */}
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              aria-label="Previous page"
              className="
                flex
                items-center
                justify-center
                w-8
                h-8
                sm:w-9
                sm:h-9
                shrink-0
                border
                border-gray-300
                text-gray-600
                hover:bg-gray-100
                disabled:opacity-40
                disabled:cursor-not-allowed
                transition-colors
              "
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            {/* Page Numbers */}
            {getPages().map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`
                  flex
                  items-center
                  justify-center
                  w-8
                  h-8
                  sm:w-9
                  sm:h-9
                  shrink-0
                  border
                  text-xs
                  sm:text-sm
                  font-medium
                  transition-colors
                  ${
                    currentPage === page
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                {page}
              </button>
            ))}

            {/* Next */}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              aria-label="Next page"
              className="
                flex
                items-center
                justify-center
                w-8
                h-8
                sm:w-9
                sm:h-9
                shrink-0
                border
                border-gray-300
                text-gray-600
                hover:bg-gray-100
                disabled:opacity-40
                disabled:cursor-not-allowed
                transition-colors
              "
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        )}

        {/* Page Size */}
        <div
          className="
            flex
            items-center
            gap-2
            sm:gap-3
            shrink-0
            whitespace-nowrap
          "
        >
          <span className="hidden sm:inline text-[15px]">
            Show
          </span>

          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="
              h-8
              sm:h-9
              w-[60px]
              sm:w-[70px]
              border
              border-gray-300
              px-2
              text-sm
              outline-none
              bg-white
              rounded-0
            "
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <span className="hidden sm:inline text-[15px]">
            Per Page
          </span>
        </div>
      </div>
    </div>
  );
};

export default Pagination;