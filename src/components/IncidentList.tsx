import React from 'react';
import IncidentRow from '../components/IncidentRow';
import IncidentRowSkeleton from '../components/IncidentRowSkeleton';
import type { Incident } from '../types/types';

const IncidentList: React.FC<{ incidents: Incident[]; reload: () => void; loading?: boolean }> = ({ incidents, reload, loading = false }) => {
  if (loading) {
    return (
      <div className="space-y-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <IncidentRowSkeleton key={i} />
        ))}
      </div>
    );
  }
  
  if (!incidents.length) return <div className="py-10 text-gray-500 text-center border border-dashed rounded-md">No incidents found. Try adjusting filters.</div>;
  
  return (
    <div className="space-y-0">
      {incidents.map((incident) => (
        <IncidentRow key={incident.id} incident={incident} reload={reload} />
      ))}
    </div>
  );
};
export default IncidentList;
