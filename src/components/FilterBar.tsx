import React from "react";

const severities = ["", "Low", "Medium", "High", "Critical"];
const statuses = ["", "open", "resolved"];
const services = ["", "API", "DB", "Web", "Infra"];

type Props = {
  filters: { severity: string; service: string; status: string };
  setFilters: React.Dispatch<
    React.SetStateAction<{ severity: string; service: string; status: string }>
  >;
};
const FilterBar: React.FC<Props> = ({ filters, setFilters }) => (
  <div className="sticky top-0 z-10 -mx-3 px-3 pb-3 mb-4 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="hidden sm:inline">Filters</span>
      </div>
      <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-md p-1">
        {severities.map((v) => (
          <button
            key={v || 'all'}
            onClick={() => setFilters((f) => ({ ...f, severity: v }))}
            className={`px-2 py-1 rounded text-xs sm:text-sm ${filters.severity === v ? 'bg-white shadow border' : 'hover:bg-white/60'}`}
          >
            {v || 'All severities'}
          </button>
        ))}
      </div>
      <select
        name="service"
        value={filters.service}
        onChange={(e) => setFilters((f) => ({ ...f, service: e.target.value }))}
        className="p-2 border rounded-md text-sm"
      >
        {services.map((v) => (
          <option key={v} value={v}>
            {v || "All Services"}
          </option>
        ))}
      </select>
      <select
        name="status"
        value={filters.status}
        onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
        className="p-2 border rounded-md text-sm"
      >
        {statuses.map((v) => (
          <option key={v} value={v}>
            {v || "All Statuses"}
          </option>
        ))}
      </select>
      <button
        onClick={() => setFilters({ severity: "", service: "", status: "" })}
        className="ml-auto text-sm px-3 py-2 border rounded-md hover:bg-gray-50"
        title="Clear all filters"
      >
        Clear
      </button>
    </div>
  </div>
);
export default FilterBar;
