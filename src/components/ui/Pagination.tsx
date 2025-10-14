import React from 'react';
import { ICONS } from '../../constants';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalItems === 0 || totalPages <= 1) {
    return null; // Don't show pagination if there are no items or only one page
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 p-2 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 gap-4">
      <div className="flex items-center gap-2">
        <span>Rows per page:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {[5, 10, 20].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            aria-label="Previous page"
          >
            {ICONS.chevronLeft}
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            aria-label="Next page"
          >
            {ICONS.chevronRight}
          </button>
        </div>
      </div>
    </div>
  );
};
