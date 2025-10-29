// src/IncidentDashboard.tsx
import React, { useEffect, useState, useCallback } from "react";
import { fetchIncidents } from "../api/api";
import { subscribeToIncidents } from "../helpers/websocket";
import type { Incident } from "../types/types";
import FilterBar from "../components/FilterBar.tsx";
import IncidentList from "../components/IncidentList.tsx";
import Pagination from "../components/Pagination";

const IncidentDashboard: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filters, setFilters] = useState({
    severity: "",
    service: "",
    status: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wsError, setWsError] = useState("");
  const [lastEventAt, setLastEventAt] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);

  const toApiFilters = (
    f: { severity: string; service: string; status: string }
  ): Partial<Omit<Incident, "id" | "owner" | "timestamp">> => ({
    ...(f.severity ? { severity: f.severity as Incident["severity"] } : {}),
    ...(f.service ? { service: f.service } : {}),
    ...(f.status ? { status: f.status as Incident["status"] } : {}),
  });

  const reload = useCallback(() => {
    setLoading(true);
    fetchIncidents(toApiFilters(filters), { page, pageSize })
      .then((res) => {
        setIncidents(res.items);
        setTotal(res.total);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [filters, page, pageSize]);

  useEffect(() => {
    reload();
  }, [reload]);
  useEffect(() => {
    function matchesFilter(i: Incident) {
      if (filters.severity && i.severity !== (filters.severity as Incident["severity"])) return false;
      if (filters.service && i.service !== filters.service) return false;
      if (filters.status && i.status !== (filters.status as Incident["status"])) return false;
      return true;
    }
    const unsubscribe = subscribeToIncidents(
      (update) => {
        setLastEventAt(Date.now());
        setIncidents((prev) => {
          const existsIdx = prev.findIndex((i) => i.id === update.id);
          const shouldShow = matchesFilter(update);
          if (!shouldShow) {
            // If it exists, remove it; otherwise ignore
            return existsIdx >= 0 ? prev.filter((i) => i.id !== update.id) : prev;
          }
          if (existsIdx >= 0) {
            const arr = [...prev];
            arr[existsIdx] = update;
            return arr;
          }
          return [update, ...prev];
        });
      },
      setWsError
    );
    return unsubscribe;
  }, [filters, page, pageSize]);

  return (
    <div className="max-w-5xl mx-auto mt-7 px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-gray-900">Incidents</h2>
        <span className={`inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full ${
          lastEventAt && Date.now() - lastEventAt < 8000 ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-50 text-gray-600 border border-gray-200"
        }`}>
          <span className={`inline-block h-2 w-2 rounded-full ${
            lastEventAt && Date.now() - lastEventAt < 8000 ? "bg-green-500 animate-pulse" : "bg-gray-400"
          }`} />
          Live
        </span>
      </div>
      <div className="flex flex-wrap gap-3 text-xs sm:text-sm mb-6">
        <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-md shadow-sm">
          <span className="material-symbols-outlined text-gray-600 text-base">notifications</span>
          <span className="text-gray-700 font-medium">{incidents.length}</span>
          <span className="text-gray-500">total</span>
        </span>
        <span className="inline-flex items-center gap-1.5 bg-white border border-red-200 px-3 py-1.5 rounded-md shadow-sm">
          <span className="material-symbols-outlined text-red-600 text-base">local_fire_department</span>
          <span className="text-red-700 font-medium">{incidents.filter(i=>i.status==='open').length}</span>
          <span className="text-gray-500">open</span>
        </span>
        <span className="inline-flex items-center gap-1.5 bg-white border border-emerald-200 px-3 py-1.5 rounded-md shadow-sm">
          <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
          <span className="text-emerald-700 font-medium">{incidents.filter(i=>i.status==='resolved').length}</span>
          <span className="text-gray-500">resolved</span>
        </span>
      </div>
      <FilterBar filters={filters} setFilters={setFilters} />
      {error && <div className="my-4 text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-lg">{error}</div>}
      {wsError && <div className="my-4 text-yellow-700 bg-yellow-50 border border-yellow-200 px-4 py-3 rounded-lg">{wsError}</div>}
      <div className="mt-6">
        <IncidentList incidents={incidents} reload={reload} loading={loading} />
      </div>
      <div className="mt-6">
        {/* Pagination */}
        {total > 0 && (
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={(p) => setPage(p)}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          />
        )}
      </div>
    </div>
  );
};
export default IncidentDashboard;
