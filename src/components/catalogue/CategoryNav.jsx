import React from 'react';
import { LuSlidersHorizontal } from 'react-icons/lu';

export const REQUIRED_CATEGORIES = [
  'All',
  'Haematology',
  'Biochemistry',
  'Serology & Immunology',
  'Clinical Pathology',
  'Cytology',
  'Microbiology',
  'Endocrinology',
  'Histopathology',
  'Others',
  'Miscellaneous',
];

export default function CategoryNav({
  categories = [],
  selectedCategory = 'All',
  onSelectCategory,
  onOpenCategoryReorder,
  totals = {},
}) {
  // Map category data by normalized name
  const categoryMap = React.useMemo(() => {
    const map = {};
    categories.forEach((cat) => {
      map[cat.name] = cat;
    });
    return map;
  }, [categories]);

  return (
    <div className="catalogue-category-nav-wrapper">
      <div className="catalogue-category-bar" role="tablist" aria-label="Test categories navigation">
        <div className="catalogue-category-scroll">
          {REQUIRED_CATEGORIES.map((catName) => {
            const isActive = selectedCategory === catName;
            const catData = categoryMap[catName];

            // Dynamic counts distinguishing catalogue tests vs parameters
            const testCount = catName === 'All'
              ? (totals.catalogueTests || 0)
              : (catData?.catalogueTestCount || 0);

            const paramCount = catName === 'All'
              ? (totals.nestedParameters || 0)
              : (catData?.nestedParameterCount || 0);

            const title = catName === 'All'
              ? `All categories: ${testCount} catalogue tests, ${paramCount} nested parameters`
              : `${catName}: ${testCount} tests (${paramCount} parameters)`;

            return (
              <React.Fragment key={catName}>
                <button
                  type="button"
                  className={`category-nav-tab ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectCategory(catName)}
                  role="tab"
                  aria-selected={isActive}
                  title={title}
                >
                  <span className="category-nav-label">{catName}</span>
                  <span className={`category-nav-badge ${isActive ? 'active' : ''}`}>
                    {testCount}
                  </span>
                  {paramCount > 0 && (
                    <span className="category-nav-subbadge" title={`${paramCount} nested parameters`}>
                      {paramCount}p
                    </span>
                  )}
                </button>
                {catName === 'Clinical Pathology' && <div className="category-row-break" />}
              </React.Fragment>
            );
          })}
        </div>

        {onOpenCategoryReorder && (
          <button
            type="button"
            className="category-reorder-btn secondary small"
            onClick={onOpenCategoryReorder}
            title="Reorder category display order"
          >
            <LuSlidersHorizontal /> Reorder
          </button>
        )}
      </div>
    </div>
  );
}
