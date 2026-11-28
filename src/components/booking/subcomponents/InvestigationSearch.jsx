import React from 'react';
import { LuSearch, LuX } from 'react-icons/lu';

/**
 * InvestigationSearch - Search bar with clear button
 */
export default function InvestigationSearch({
  searchQuery = '',
  onSearchChange,
  placeholder = 'Search investigations...',
}) {
  return (
    <div className="relative w-full mb-3">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <LuSearch className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => onSearchChange('')}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <LuX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
