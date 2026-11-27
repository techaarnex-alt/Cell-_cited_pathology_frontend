import React from 'react';
import {
  LuSearch,
  LuX,
  LuEye,
  LuPencil,
  LuArrowUp,
  LuArrowDown,
  LuGripVertical,
  LuPlus,
  LuTrash2,
} from 'react-icons/lu';

export default function CatalogueTable({
  tests = [],
  totalTests = 0,
  category = 'All',
  searchQuery = '',
  onSearchChange,
  testTypeFilter = 'all',
  onTestTypeFilterChange,
  statusFilter = 'all',
  onStatusFilterChange,
  pageSize = 25,
  onPageSizeChange,
  currentPage = 1,
  onPageChange,
  totalPages = 1,
  onViewTest,
  onEditTest,
  onDeleteTest,
  onMoveUp,
  onMoveDown,
  onAddNewTest,
  loading = false,
}) {
  const isAllPages = pageSize === 0;
  const startIndex = totalTests === 0 ? 0 : (currentPage - 1) * (isAllPages ? totalTests : pageSize) + 1;
  const endIndex = isAllPages ? totalTests : Math.min(currentPage * pageSize, totalTests);

  const getStatusBadge = (status) => {
    const s = String(status || 'active').toLowerCase();
    if (s === 'matched' || s === 'active') {
      return <span className="cat-badge cat-badge-success">Active</span>;
    }
    if (s === 'needs_review' || s === 'review') {
      return <span className="cat-badge cat-badge-warning">Review</span>;
    }
    if (s === 'inactive') {
      return <span className="cat-badge cat-badge-muted">Inactive</span>;
    }
    return <span className="cat-badge cat-badge-info">{status}</span>;
  };

  const getTestTypeBadge = (type) => {
    const t = String(type || 'single_parameter').toLowerCase();
    if (t === 'multi_parameter') {
      return <span className="cat-type-badge cat-type-multi">Multi-param</span>;
    }
    if (t === 'panel') {
      return <span className="cat-type-badge cat-type-panel">Panel</span>;
    }
    if (t === 'document') {
      return <span className="cat-type-badge cat-type-doc">Document</span>;
    }
    return <span className="cat-type-badge cat-type-single">Single</span>;
  };

  return (
    <div className="catalogue-table-wrapper">
      <div className="catalogue-table-top-bar">
        <div className="catalogue-search-filter-group">
          <div className="catalogue-search-box">
            <LuSearch className="catalogue-search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={`Search tests in ${category}... (name, code, parameter)`}
              className="catalogue-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="catalogue-search-clear"
                onClick={() => onSearchChange('')}
                title="Clear search"
              >
                <LuX />
              </button>
            )}
          </div>

          <select
            value={testTypeFilter}
            onChange={(e) => onTestTypeFilterChange(e.target.value)}
            className="catalogue-filter-select"
            aria-label="Filter by test type"
          >
            <option value="all">All Types</option>
            <option value="single_parameter">Single Parameter</option>
            <option value="multi_parameter">Multi-Parameter</option>
            <option value="panel">Panel</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="catalogue-filter-select"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="needs_review">Needs Review</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="catalogue-top-actions">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="catalogue-pagesize-select"
            aria-label="Tests per page"
          >
            <option value={15}>15 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
            <option value={0}>Show all</option>
          </select>

          <button
            type="button"
            className="cat-btn-primary"
            onClick={onAddNewTest}
          >
            <LuPlus /> Add Test
          </button>
        </div>
      </div>

      <div className="table-scroll catalogue-table-scroll">
        <table className="app-table catalogue-table">
          <thead>
            <tr>
              <th className="col-reorder" title="Display Order & Move Controls">Order</th>
              <th className="col-name">Test / Investigation</th>
              <th className="col-shortname">Short Name</th>
              <th className="col-category">Category</th>
              <th className="col-type">Type</th>
              <th className="col-params">Parameters</th>
              <th className="col-status">Status</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="catalogue-loading-cell">
                  <div className="catalogue-spinner" />
                  <p>Loading catalogue tests...</p>
                </td>
              </tr>
            ) : tests.length > 0 ? (
              tests.map((test, index) => {
                const testId = test.id || test._id;
                const paramCount = test.parameterCount !== undefined
                  ? test.parameterCount
                  : (Array.isArray(test.parameters) ? test.parameters.length : 0);

                return (
                  <tr key={testId || index} className="catalogue-row">
                    <td className="col-reorder">
                      <div className="reorder-cell-content">
                        <span className="reorder-handle" title="Reorder handle">
                          <LuGripVertical />
                        </span>
                        <span className="order-number">{test.order || index + 1}</span>
                        {category !== 'All' && (
                          <div className="reorder-arrows">
                            <button
                              type="button"
                              className="order-arrow-btn"
                              onClick={() => onMoveUp(index)}
                              disabled={index === 0}
                              title="Move up"
                            >
                              <LuArrowUp />
                            </button>
                            <button
                              type="button"
                              className="order-arrow-btn"
                              onClick={() => onMoveDown(index)}
                              disabled={index === tests.length - 1}
                              title="Move down"
                            >
                              <LuArrowDown />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="col-name">
                      <div className="test-name-cell">
                        <span
                          className="test-title-link"
                          onClick={() => onViewTest(test)}
                          title="Click to view details"
                        >
                          {test.name}
                        </span>
                        {test.code && (
                          <span className="test-code-tag">{test.code}</span>
                        )}
                        {test.rate > 0 && (
                          <span className="test-rate-tag">₹{test.rate}</span>
                        )}
                      </div>
                    </td>

                    <td className="col-shortname">
                      <span className="test-shortname-cell">{test.shortName || '—'}</span>
                    </td>

                    <td className="col-category">
                      <span className="test-cat-tag">{test.category}</span>
                    </td>

                    <td className="col-type">
                      {getTestTypeBadge(test.testType)}
                    </td>

                    <td className="col-params">
                      <span className="param-count-badge" title={`${paramCount} nested parameter(s)`}>
                        {paramCount} {paramCount === 1 ? 'param' : 'params'}
                      </span>
                    </td>

                    <td className="col-status">
                      {getStatusBadge(test.status)}
                    </td>

                    <td className="col-actions">
                      <div className="catalogue-row-actions">
                        <button
                          type="button"
                          className="cat-action-btn view"
                          onClick={() => onViewTest(test)}
                          title="View test details"
                        >
                          <LuEye /> View
                        </button>
                        <button
                          type="button"
                          className="cat-action-btn edit"
                          onClick={() => onEditTest(test)}
                          title="Edit test"
                        >
                          <LuPencil /> Edit
                        </button>
                        {onDeleteTest && (
                          <button
                            type="button"
                            className="cat-action-btn delete"
                            onClick={() => onDeleteTest(test)}
                            title="Remove test from catalogue"
                          >
                            <LuTrash2 />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="catalogue-no-results">
                  <div>
                    <p>
                      No tests found in <b>{category}</b>
                      {searchQuery ? ` matching "${searchQuery}"` : ''}.
                    </p>
                    <button
                      type="button"
                      className="cat-btn-secondary small"
                      onClick={() => {
                        onSearchChange('');
                        onTestTypeFilterChange('all');
                        onStatusFilterChange('all');
                      }}
                    >
                      Reset filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && !isAllPages && (
        <div className="catalogue-pagination-bar">
          <div className="catalogue-pagination-info">
            Showing <b>{startIndex}</b>–<b>{endIndex}</b> of <b>{totalTests}</b> tests
          </div>
          <div className="catalogue-pagination-controls">
            <button
              type="button"
              className="cat-page-btn"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(1)}
              title="First page"
            >
              «
            </button>
            <button
              type="button"
              className="cat-page-btn"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              title="Previous page"
            >
              ‹
            </button>
            <span className="cat-page-indicator">
              Page <b>{currentPage}</b> of <b>{totalPages}</b>
            </span>
            <button
              type="button"
              className="cat-page-btn"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              title="Next page"
            >
              ›
            </button>
            <button
              type="button"
              className="cat-page-btn"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(totalPages)}
              title="Last page"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
