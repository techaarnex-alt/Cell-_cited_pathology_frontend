import React from 'react';

/**
 * BookingSummary - Shows selected count and subtotal calculation
 */
export default function BookingSummary({
  selectedTests = [],
}) {
  const count = selectedTests.length;
  const total = selectedTests.reduce((sum, t) => sum + Number(t.rate || 0), 0);

  if (count === 0) return null;

  return (
    <div className="flex items-center justify-between p-2.5 bg-blue-50/60 border border-blue-200/80 rounded-lg text-xs mt-2">
      <span className="text-gray-700">
        Selected: <b className="text-blue-900">{count}</b> {count === 1 ? 'investigation' : 'investigations'}
      </span>
      <span className="text-gray-700">
        Total Estimated Fee: <b className="text-blue-900 font-bold text-sm">₹{total.toFixed(2)}</b>
      </span>
    </div>
  );
}
