import React from 'react';

/**
 * DocumentResultEditor - Specialized editor for document/narrative based tests
 * (e.g., Histopathology, Cytology, Biopsy, Culture reports)
 */
export default function DocumentResultEditor({
  serviceName,
  content = '',
  impression = '',
  onChangeContent,
  onChangeImpression,
  readOnly = false,
}) {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 mb-4 shadow-2xs">
      <div className="border-b border-gray-200 pb-2 mb-3">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
          {serviceName} — Narrative Report
        </h3>
        <p className="text-xs text-gray-500">
          Enter clinical observations, microscopic findings, and final impressions.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Gross & Microscopic Findings / Clinical Notes
          </label>
          <textarea
            rows={5}
            value={content}
            disabled={readOnly}
            onChange={(e) => onChangeContent?.(e.target.value)}
            placeholder="Type comprehensive investigation report here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Impression / Diagnostic Conclusion
          </label>
          <textarea
            rows={2}
            value={impression}
            disabled={readOnly}
            onChange={(e) => onChangeImpression?.(e.target.value)}
            placeholder="Summary diagnostic impression..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>
      </div>
    </div>
  );
}
