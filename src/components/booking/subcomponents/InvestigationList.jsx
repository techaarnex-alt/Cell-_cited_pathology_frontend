import React from 'react';

/**
 * InvestigationList - Render tests in dropdown list with rates and selection states
 */
export default function InvestigationList({
  tests = [],
  selectedTests = [],
  onToggleTest,
  emptyMessage = 'No investigations found.',
}) {
  const selectedMap = new Set(selectedTests.map((t) => (t.name || '').toLowerCase()));

  if (!tests.length) {
    return (
      <div className="p-4 text-center text-xs text-gray-500 italic">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 bg-white rounded-lg border border-gray-200 shadow-sm">
      {tests.map((test) => {
        const isSelected = selectedMap.has((test.name || '').toLowerCase());
        const rateDisplay = test.rate !== undefined && test.rate !== null ? `₹${test.rate}` : '₹0';

        return (
          <div
            key={test.id || test.name}
            onClick={() => onToggleTest(test)}
            className={`px-3 py-2 text-xs flex items-center justify-between cursor-pointer hover:bg-blue-50 transition-colors ${
              isSelected ? 'bg-blue-50 font-medium text-blue-900' : 'text-gray-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[10px] ${
                isSelected ? 'bg-blue-600 border-blue-600 text-white font-bold' : 'border-gray-300'
              }`}>
                {isSelected ? '✓' : ''}
              </span>
              <span>{test.name}</span>
            </div>
            <span className="text-gray-600 font-semibold">{rateDisplay}</span>
          </div>
        );
      })}
    </div>
  );
}
