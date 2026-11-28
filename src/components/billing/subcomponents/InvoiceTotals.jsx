import React from 'react';

/**
 * InvoiceTotals - Clear breakdown of subtotal, discount, grand total, paid, and balance due
 */
export default function InvoiceTotals({
  subtotal = 0,
  discount = 0,
  grandTotal = 0,
  paid = 0,
  due = 0,
}) {
  return (
    <div className="flex justify-end my-4">
      <div className="w-64 space-y-1.5 text-xs">
        <div className="flex justify-between py-1 border-b border-gray-100 text-gray-600">
          <span>Subtotal</span>
          <span className="font-mono font-semibold text-gray-900">
            ₹{Number(subtotal).toFixed(2)}
          </span>
        </div>

        {Number(discount) > 0 && (
          <div className="flex justify-between py-1 border-b border-gray-100 text-gray-600">
            <span>Discount</span>
            <span className="font-mono font-semibold text-red-600">
              - ₹{Number(discount).toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex justify-between py-1.5 border-b-2 border-gray-300 font-bold text-sm text-gray-900">
          <span>Grand Total</span>
          <span className="font-mono text-blue-900">
            ₹{Number(grandTotal).toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between py-1 text-gray-600">
          <span>Amount Paid</span>
          <span className="font-mono font-semibold text-green-700">
            ₹{Number(paid).toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between py-1 font-bold text-gray-900 bg-gray-50 px-2 rounded">
          <span>Balance Due</span>
          <span
            className={`font-mono ${
              Number(due) > 0 ? 'text-amber-700' : 'text-gray-700'
            }`}
          >
            ₹{Number(due).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
