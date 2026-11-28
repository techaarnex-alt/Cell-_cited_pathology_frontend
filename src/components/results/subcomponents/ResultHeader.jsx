import React from 'react';

/**
 * ResultHeader - Renders patient demographic badge and report metadata
 */
export default function ResultHeader({
  reportNumber,
  patientName,
  patientAge,
  patientGender,
  sampleType,
  registeredOn,
}) {
  return (
    <div className="bg-gray-50 border-b border-gray-200 p-4 rounded-t-lg">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-xs uppercase tracking-wider text-blue-600 font-semibold">Report #{reportNumber}</span>
          <h2 className="text-lg font-bold text-gray-900">{patientName}</h2>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-gray-600">
          <span>Age/Sex: <b className="text-gray-800">{patientAge || '—'} / {patientGender || '—'}</b></span>
          <span>Sample: <b className="text-gray-800">{sampleType || 'Blood'}</b></span>
          <span>Date: <b className="text-gray-800">{registeredOn || '—'}</b></span>
        </div>
      </div>
    </div>
  );
}
