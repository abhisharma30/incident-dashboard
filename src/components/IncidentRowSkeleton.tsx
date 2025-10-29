// src/IncidentRowSkeleton.tsx
import React from "react";

const IncidentRowSkeleton: React.FC = () => {
  return (
    <div className="bg-white border-l-4 border-gray-200 rounded-lg shadow-sm p-4 mb-3 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        {/* Left Section: ID and Metadata */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            {/* Incident ID */}
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
            {/* Severity Badge */}
            <div className="h-5 w-16 bg-gray-200 rounded-md"></div>
            {/* Service Badge */}
            <div className="h-5 w-14 bg-gray-200 rounded-md"></div>
            {/* Status Badge */}
            <div className="h-5 w-12 bg-gray-200 rounded-md"></div>
          </div>
          
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs mt-3">
            <div className="flex items-center gap-1.5">
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-start gap-2 shrink-0">
          <div className="h-7 w-24 bg-gray-200 rounded-md"></div>
          <div className="h-7 w-20 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default IncidentRowSkeleton;

