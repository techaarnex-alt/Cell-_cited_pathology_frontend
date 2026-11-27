import React from 'react';
import { LuChevronRight, LuFolder } from 'react-icons/lu';

export default function Breadcrumbs({ crumbs = [], onNavigate }) {
  if (!crumbs.length) return null;

  return (
    <nav className="catalogue-breadcrumbs" aria-label="Breadcrumb">
      <LuFolder className="breadcrumb-root-icon" />
      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;
        return (
          <React.Fragment key={crumb.path || idx}>
            {idx > 0 && <LuChevronRight className="breadcrumb-separator" />}
            {isLast ? (
              <span className="breadcrumb-current" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <button
                type="button"
                className="breadcrumb-link"
                onClick={() => onNavigate(crumb.path)}
              >
                {crumb.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
