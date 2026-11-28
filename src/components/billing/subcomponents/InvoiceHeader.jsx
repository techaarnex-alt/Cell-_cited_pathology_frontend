import React from 'react';

/**
 * InvoiceHeader - Laboratory logo, title, invoice metadata, and patient details
 */
export default function InvoiceHeader({
  labName,
  labAddress,
  labPhones,
  labEmail,
  invoiceNo,
  createdOn,
  patientName,
  patientId,
  age,
  ageUnit,
  gender,
  reportNumber,
  reference,
  paymentMethod,
  paymentStatus,
  pageNumber,
  totalPages,
}) {
  return (
    <div className="space-y-4 border-b border-gray-300 pb-4">
      {/* Top Header: Logo, Lab Info, Tax Invoice Badge */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-200 flex-shrink-0 bg-white">
            <img
              src="/cell-cited-logo.jpg"
              alt={labName || 'Cell Cited'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `${import.meta.env.BASE_URL}cell-cited-logo.jpg`;
              }}
            />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-blue-900 leading-tight">
              {labName || 'CELL CITED PATHOLOGY LAB (CCPL)'}
            </h1>
            <p className="text-[11px] text-gray-600 leading-snug">
              {labAddress || 'Shop No. 17, City Trade Centre, Lakhperabagh Chauraha, Barabanki - 225001'}
            </p>
            <p className="text-[10px] text-gray-500 font-medium">
              {labPhones || '9554448906 · 6307342505 · 8601463398'} · {labEmail || 'ccpath11@gmail.com'}
            </p>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <span className="inline-block px-2.5 py-0.5 bg-blue-900 text-white font-black text-xs uppercase tracking-wider rounded">
            TAX INVOICE
          </span>
          <p className="text-xs font-bold text-gray-800 mt-1">Invoice #{invoiceNo}</p>
          <p className="text-[11px] text-gray-500">
            Date: {createdOn}
            {totalPages > 1 && ` · Page ${pageNumber} of ${totalPages}`}
          </p>
        </div>
      </div>

      {/* Patient & Booking Demographics */}
      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-md text-xs border border-gray-200">
        <div className="space-y-1">
          <div className="flex">
            <span className="w-24 text-gray-500 font-medium">Patient Name:</span>
            <span className="font-bold text-gray-900">{patientName || '—'}</span>
          </div>
          <div className="flex">
            <span className="w-24 text-gray-500 font-medium">Patient ID:</span>
            <span className="text-gray-800">{patientId || '—'}</span>
          </div>
          <div className="flex">
            <span className="w-24 text-gray-500 font-medium">Age / Gender:</span>
            <span className="text-gray-800">
              {age || '—'} {ageUnit || 'years'} / {gender || '—'}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex">
            <span className="w-24 text-gray-500 font-medium">Report No:</span>
            <span className="font-bold text-blue-950">{reportNumber || '—'}</span>
          </div>
          <div className="flex">
            <span className="w-24 text-gray-500 font-medium">Referred By:</span>
            <span className="text-gray-800">{reference || 'Self'}</span>
          </div>
          <div className="flex items-center">
            <span className="w-24 text-gray-500 font-medium">Payment:</span>
            <span className="text-gray-800 mr-2">{paymentMethod || 'Cash'}</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                paymentStatus === 'PAID IN FULL'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {paymentStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
