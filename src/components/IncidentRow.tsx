import React, { useState } from "react";
import { acknowledgeIncident, resolveIncident } from "../api/api";
import type { Incident } from "../types/types";
import { getInitials, timeAgo } from "../helpers/format";

const severityColor: Record<Incident["severity"], string> = {
  Low: "border-green-500 bg-green-50",
  Medium: "border-yellow-500 bg-yellow-50",
  High: "border-orange-500 bg-orange-50",
  Critical: "border-red-500 bg-red-50",
};

const severityBadgeColor: Record<Incident["severity"], string> = {
  Low: "bg-green-100 text-green-700 border-green-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  High: "bg-orange-100 text-orange-700 border-orange-200",
  Critical: "bg-red-100 text-red-700 border-red-200",
};

const IncidentRow: React.FC<{ incident: Incident; reload: () => void }> = ({
  incident,
  reload,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAction(fn: () => Promise<void>) {
    setLoading(true);
    setError("");
    try {
      await fn();
      reload();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className={`group relative bg-white border-l-4 ${severityColor[incident.severity]} rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 mb-3`}>
      <div className="flex items-start justify-between gap-4">
        {/* Left Section: ID and Metadata */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-mono text-gray-500 font-medium">
              INC-{incident.id.padStart(4, '0')}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${severityBadgeColor[incident.severity]}`}>
              {incident.severity}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
              {incident.service}
            </span>
            {incident.status === 'open' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                Open
              </span>
            )}
          </div>
          
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-3">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">schedule</span>
              <span>{timeAgo(incident.timestamp)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-5 w-5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center text-[10px] font-semibold shadow-sm">
                {getInitials(incident.owner)}
              </span>
              <span className="text-gray-700 font-medium">{incident.owner}</span>
            </div>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-start gap-2 shrink-0">
          {incident.status === 'open' && (
            <>
              <button
                onClick={() => handleAction(() => acknowledgeIncident(incident.id))}
                disabled={loading}
                className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Acknowledge incident"
              >
                Acknowledge
              </button>
              <button
                onClick={() => handleAction(() => resolveIncident(incident.id))}
                disabled={loading}
                className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Resolve incident"
              >
                Resolve
              </button>
            </>
          )}
          {incident.status === 'resolved' && (
            <span className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md">
              Resolved
            </span>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-3 text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};
export default IncidentRow;
