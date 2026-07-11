import React from 'react';

// Define the shape of a single column definition
export interface ColumnDef<T> {
  header: string;
  className?: string; // Custom Tailwind width or alignment classes for the header/cells
  render: (row: T, index: number) => React.ReactNode; // Custom layout function
}

interface CustomTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function CustomTable<T>({ columns, data }: CustomTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto bg-white">
      <table className="w-full border-collapse text-left text-sm">
        {/* Table Header */}
        <thead className="sticky top-0 bg-tableHeader text-gray-700 font-semibold border-b border-gray-300">
          <tr>
            {columns.map((col, index) => (
              <th 
                key={index} 
                className={`py-2 px-4 text-[15px] font-medium text-gray-800 ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-200 border-b border-gray-300">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="hover:bg-gray-50/70 transition-colors duration-150"
              >
                {columns.map((col, colIndex) => (
                  <td 
                    key={colIndex} 
                    className={`py-1 px-4 text-gray-600 align-middle ${col.className || ''}`}
                  >
                    {col.render(row, rowIndex)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}