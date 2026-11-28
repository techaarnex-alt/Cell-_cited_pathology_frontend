import React from 'react';

/**
 * PaymentSummary - Laboratory legal footer and authorized signatory
 */
export default function PaymentSummary({ labName }) {
  return (
    <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between items-end text-[11px] text-gray-500">
      <div className="max-w-md space-y-1">
        <p className="font-semibold text-gray-700">
          Thank you for choosing {labName || 'Cell Cited Pathology Lab'}.
        </p>
        <p>This is a computer-generated invoice and does not require a physical stamp.</p>
        <p>Services once rendered are subject to standard laboratory terms and conditions.</p>
      </div>

      <div className="text-center w-48">
        <div className="h-12 border-b border-gray-400 mb-1"></div>
        <p className="font-bold text-gray-800 text-xs">Authorised Signatory</p>
        <p className="text-[10px] text-gray-500">Cell Cited Pathology Lab</p>
      </div>
    </div>
  );
}
