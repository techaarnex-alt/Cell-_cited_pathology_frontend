import React from 'react';

/**
 * ParameterInput - Renders a single result parameter input with range indicator and unit
 */
export default function ParameterInput({
  item,
  value = '',
  remark = '',
  onChangeValue,
  onChangeRemark,
}) {
  const isOutOfRange = item.isOutOfRange;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 py-2.5 px-3 border-b border-gray-100 hover:bg-gray-50/50 items-center text-xs">
      {/* Parameter Name & Snapshot Info */}
      <div className="md:col-span-4">
        <span className="font-semibold text-gray-900 block">{item.name || item.testNameSnapshot}</span>
        {item.parentPanelName && (
          <span className="text-[10px] text-blue-600 block">{item.parentPanelName}</span>
        )}
      </div>

      {/* Value Input */}
      <div className="md:col-span-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChangeValue(e.target.value)}
          placeholder="Observed result"
          className={`w-full px-2.5 py-1.5 border rounded text-xs focus:outline-none focus:ring-1 ${
            isOutOfRange
              ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500 font-bold'
              : 'border-gray-300 bg-white focus:ring-blue-500 text-gray-900'
          }`}
        />
      </div>

      {/* Unit */}
      <div className="md:col-span-2 text-gray-600 font-medium">
        {item.unit || item.unitSnapshot || '—'}
      </div>

      {/* Reference Range */}
      <div className="md:col-span-3 text-gray-500 flex items-center justify-between">
        <span>{item.range || item.rangeSnapshot || '—'}</span>
        {isOutOfRange && (
          <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold">
            Alert
          </span>
        )}
      </div>
    </div>
  );
}
