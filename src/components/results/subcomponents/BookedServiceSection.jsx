import React from 'react';

/**
 * BookedServiceSection - Groups parameter inputs under their booked service header
 */
export default function BookedServiceSection({
  serviceName,
  categoryName,
  children,
}) {
  return (
    <div className="mb-4 bg-white rounded-lg border border-gray-200 overflow-hidden shadow-2xs">
      <div className="bg-gray-100/80 px-4 py-2 border-b border-gray-200 flex items-center justify-between text-xs">
        <span className="font-bold text-gray-800 uppercase tracking-wide">{serviceName}</span>
        {categoryName && (
          <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-medium">
            {categoryName}
          </span>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
