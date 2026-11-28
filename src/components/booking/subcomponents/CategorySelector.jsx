import React from 'react';

/**
 * CategorySelector - Displays category pills with active state and test counts
 */
export default function CategorySelector({
  categories = [],
  activeCategory = '',
  onSelectCategory,
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {categories.map((cat) => {
        const name = cat.name || cat;
        const count = cat.testCount !== undefined ? cat.testCount : (cat.tests?.length || 0);
        const isActive = activeCategory.toLowerCase() === name.toLowerCase();

        return (
          <button
            key={name}
            type="button"
            onClick={() => onSelectCategory(name)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              isActive
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{name}</span>
            {count > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  isActive ? 'bg-blue-700 text-white' : 'bg-gray-300 text-gray-800'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
