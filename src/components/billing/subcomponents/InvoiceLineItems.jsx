import React from 'react';

/**
 * InvoiceLineItems - Renders discrete booked service items and exact fees
 * Eliminates any item-splitting or divide rule!
 */
export default function InvoiceLineItems({ items = [], startIndex = 0 }) {
  return (
    <div className="my-4 overflow-hidden rounded border border-gray-200">
      <table className="w-full text-xs text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-700 uppercase tracking-wider text-[11px] border-b border-gray-200">
            <th className="py-2 px-3 w-12 text-center">#</th>
            <th className="py-2 px-4">Investigation / Laboratory Service</th>
            <th className="py-2 px-4 text-center w-28">Type</th>
            <th className="py-2 px-4 text-right w-28">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item, index) => {
            const isPanel = item.testType === 'panel';
            const rateNum = Number(item.rate || 0);

            return (
              <tr key={index} className="hover:bg-gray-50/50">
                <td className="py-2.5 px-3 text-center text-gray-500 font-mono">
                  {startIndex + index + 1}
                </td>
                <td className="py-2.5 px-4 font-semibold text-gray-900">
                  <span>{item.name}</span>
                  {item.category && (
                    <span className="block text-[10px] font-normal text-gray-500">
                      Category: {item.category}
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-4 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] rounded-full font-medium ${
                      isPanel
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {isPanel ? 'Panel' : 'Investigation'}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-right font-mono font-bold text-gray-900">
                  ₹{rateNum.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
