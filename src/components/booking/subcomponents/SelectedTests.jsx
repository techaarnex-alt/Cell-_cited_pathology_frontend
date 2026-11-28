import React from 'react';
import { LuX } from 'react-icons/lu';

/**
 * SelectedTests - Render chips for selected investigations
 */
export default function SelectedTests({
  selectedTests = [],
  onRemoveTest,
}) {
  if (!selectedTests.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 border border-gray-200 rounded-lg mb-3">
      {selectedTests.map((test) => (
        <span
          key={test.id || test.name}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-white text-gray-800 border border-gray-300 shadow-2xs font-medium"
        >
          <span>{test.name}</span>
          <span className="text-blue-700 font-bold">
            ₹{test.rate || 0}
          </span>
          <button
            type="button"
            onClick={() => onRemoveTest(test.name)}
            className="text-gray-400 hover:text-red-500 cursor-pointer ml-0.5"
            aria-label={`Remove ${test.name}`}
          >
            <LuX className="w-3.5 h-3.5" />
          </button>
        </span>
      ))}
    </div>
  );
}
