import React from "react";

type Props = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
};

const Pagination: React.FC<Props> = ({ page, pageSize, total, onPageChange, onPageSizeChange }) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between text-sm text-gray-700">
      <div>
        Showing <span className="font-medium">{start}</span>–<span className="font-medium">{end}</span> of <span className="font-medium">{total}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="px-3 py-1.5 border rounded-md disabled:opacity-50"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
        >
          Prev
        </button>
        <span className="px-2">{page} / {totalPages}</span>
        <button
          className="px-3 py-1.5 border rounded-md disabled:opacity-50"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
        >
          Next
        </button>
        <select
          className="ml-2 p-2 border rounded-md"
          value={pageSize}
          onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
        >
          {[10, 20, 50, 100].map((s) => (
            <option key={s} value={s}>{s} / page</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;

