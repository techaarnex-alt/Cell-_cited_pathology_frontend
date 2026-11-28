import React from 'react';
import { LuCheck, LuSave, LuCircleAlert } from 'react-icons/lu';

/**
 * ResultActions - Action bar for saving draft, finalizing, and date input
 */
export default function ResultActions({
  reportedOn,
  onDateChange,
  onSaveDraft,
  onFinalize,
  isSaving = false,
  isFinalizing = false,
  status = 'Draft',
  errorMessage = '',
}) {
  const isFinalized = status === 'Finalized' || status === 'Verified';

  return (
    <div className="bg-gray-50 border-t border-gray-200 p-4 rounded-b-lg flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
          Reported On:
          <input
            type="date"
            value={reportedOn}
            onChange={(e) => onDateChange?.(e.target.value)}
            disabled={isFinalized}
            className="px-2.5 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </label>
        {isFinalized && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
            <LuCheck className="w-3.5 h-3.5" /> Finalized
          </span>
        )}
      </div>

      {errorMessage && (
        <div className="text-xs text-red-600 flex items-center gap-1 font-medium">
          <LuCircleAlert className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        {onSaveDraft && !isFinalized && (
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSaving || isFinalizing}
            className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded text-xs font-semibold transition disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
        )}
        <button
          type="submit"
          onClick={onFinalize}
          disabled={isFinalizing || isFinalized}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold tracking-wide transition shadow-2xs disabled:opacity-50"
        >
          {isFinalizing ? 'Finalizing...' : isFinalized ? 'Report Verified' : 'Finalize & Approve'}
        </button>
      </div>
    </div>
  );
}
