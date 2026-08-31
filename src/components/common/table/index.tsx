import React from "react";

// Define the shape of a single column definition
export interface ColumnDef<T> {
  header: string;
  className?: string;
  render: (row: T, index: number) => React.ReactNode;
  colSpan?: number | ((row: T) => number);
  hidden?: (row: T) => boolean;

  // Sticky column
  isSticky?: boolean;
}

interface CustomTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function CustomTable<T>({
  columns,
  data,
}: CustomTableProps<T>) {
  // Calculate left position for sticky columns
  const getStickyLeft = (columnIndex: number) => {
    let left = 0;

    for (let i = 0; i < columnIndex; i++) {
      if (columns[i].isSticky) {
        // Width should ideally come from the column's className
        // Default approximate width
        left += 150;
      }
    }

    return left;
  };

  return (
    <div
      className="
        w-full
        overflow-x-auto
        overflow-y-auto
        bg-white
        max-h-[calc(100vh-160px)]
        max-sm:max-h-[calc(100vh-130px)]
        min-h-[calc(100vh-400px)]
        scrollbar-thin
        scrollbar-thumb-secondary
      "
    >
      <table
        className="
          w-full
          min-w-max
          border-collapse
          text-left
          text-sm
        "
      >
        {/* Table Header */}
        <thead
          className="
            sticky
            top-0
            z-20
            bg-tableHeader
            text-secondary
            font-medium
            border-b
            border-gray-300
          "
        >
          <tr>
            {columns.map((col, index) => {
              const stickyLeft = col.isSticky
                ? getStickyLeft(index)
                : undefined;

              return (
                <th
                  key={index}
                  style={
                    col.isSticky
                      ? {
                          left: `${stickyLeft}px`,
                        }
                      : undefined
                  }
                  className={`
                    py-2
                    px-2
                    sm:px-3
                    md:px-4
                    text-[13px]
                    sm:text-[14px]
                    md:text-[15px]
                    font-medium
                    text-gray-800
                    whitespace-nowrap

                    ${
                      col.isSticky
                        ? `
                          sticky
                          z-30
                          bg-tableHeader
                          shadow-[2px_0_3px_-2px_rgba(0,0,0,0.15)]
                        `
                        : ""
                    }

                    ${col.className || ""}
                  `}
                >
                  {col.header}
                </th>
              );
            })}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-200 border-b border-gray-300">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="
                  text-center
                  py-6
                  sm:py-8
                  px-3
                  text-gray-500
                  whitespace-nowrap
                "
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="
                  hover:bg-gray-50/70
                  transition-colors
                  duration-150
                "
              >
                {columns.map((col, colIndex) => {
                  if (col.hidden?.(row)) {
                    return null;
                  }

                  const colSpan =
                    typeof col.colSpan === "function"
                      ? col.colSpan(row)
                      : col.colSpan;

                  const stickyLeft = col.isSticky
                    ? getStickyLeft(colIndex)
                    : undefined;

                  return (
                    <td
                      key={colIndex}
                      colSpan={colSpan}
                      style={
                        col.isSticky
                          ? {
                              left: `${stickyLeft}px`,
                            }
                          : undefined
                      }
                      className={`
                        py-2
                        px-2
                        sm:px-3
                        md:px-4
                        text-[13px]
                        sm:text-[14px]
                        md:text-sm
                        text-gray-600
                        align-middle
                        whitespace-nowrap

                        ${
                          col.isSticky
                            ? `
                              sticky
                              z-10
                              bg-white
                              shadow-[2px_0_3px_-2px_rgba(0,0,0,0.15)]
                            `
                            : ""
                        }

                        ${col.className || ""}
                      `}
                    >
                      {col.render(row, rowIndex)}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}