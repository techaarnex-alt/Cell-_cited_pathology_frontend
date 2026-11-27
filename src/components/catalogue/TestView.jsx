import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import {
  LuArrowLeft,
  LuPencil,
  LuCheck,
  LuX,
  LuLayers,
  LuFileText,
  LuTag,
  LuHash,
  LuDollarSign,
  LuActivity,
} from 'react-icons/lu';

export default function TestView({
  testId,
  category,
  onBack,
  onEdit,
  onEditParameter,
  noticeMessage,
}) {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');

    api.getCatalogueTest(testId)
      .then((data) => {
        if (isMounted) {
          setTest(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load test details');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [testId]);

  if (loading) {
    return (
      <div className="catalogue-view-container">
        <div className="catalogue-loading-state">
          <div className="catalogue-spinner" />
          <p>Loading test details...</p>
        </div>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="catalogue-view-container">
        <div className="catalogue-error-state">
          <h3>Test Not Found</h3>
          <p>{error || `No test found with ID "${testId}" in category "${category}".`}</p>
          <button type="button" className="cat-btn-primary" onClick={onBack}>
            <LuArrowLeft /> Back to Catalogue
          </button>
        </div>
      </div>
    );
  }

  const parameters = Array.isArray(test.parameters) ? test.parameters : [];
  const isMultiParam = test.testType === 'multi_parameter' || test.testType === 'panel' || parameters.length > 1;

  return (
    <div className="catalogue-view-container">
      {/* View Header */}
      <div className="catalogue-view-header">
        <div className="view-header-left">
          <button type="button" className="cat-btn-back" onClick={onBack} title="Back to test list">
            <LuArrowLeft /> Back to {category || 'Catalogue'}
          </button>
          <div className="view-title-group">
            <h1>{test.name}</h1>
            <div className="view-header-badges">
              {test.code && <span className="cat-tag-code">{test.code}</span>}
              {test.shortName && <span className="cat-tag-shortname">({test.shortName})</span>}
              <span className="cat-tag-category">{test.category}</span>
              <span className={`cat-badge cat-badge-${test.status === 'inactive' ? 'muted' : (test.status === 'needs_review' ? 'warning' : 'success')}`}>
                {test.status || 'Active'}
              </span>
            </div>
          </div>
        </div>

        <div className="view-header-actions">
          <button
            type="button"
            className="cat-btn-primary"
            onClick={() => onEdit(test)}
          >
            <LuPencil /> Edit Test
          </button>
        </div>
      </div>

      {noticeMessage && (
        <div className="catalogue-notice-banner">
          {noticeMessage}
        </div>
      )}

      {/* Main Metadata Grid */}
      <div className="catalogue-details-panel">
        <h2 className="section-title">Test Configuration</h2>
        <div className="catalogue-details-grid">
          <div className="detail-item">
            <span className="detail-label">Test Name</span>
            <span className="detail-value font-medium">{test.name}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Short Name</span>
            <span className="detail-value">{test.shortName || '—'}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Test Code</span>
            <span className="detail-value">{test.code || '—'}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Category</span>
            <span className="detail-value">{test.category}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Test Type</span>
            <span className="detail-value capitalize">
              {test.testType ? test.testType.replace('_', ' ') : 'Single Parameter'}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Display Order</span>
            <span className="detail-value">#{test.order || 1}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Rate / Price</span>
            <span className="detail-value font-semibold">₹{test.rate !== undefined ? test.rate : 0}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Orderable Status</span>
            <span className="detail-value">
              {test.orderable !== false ? (
                <span className="text-success"><LuCheck /> Orderable</span>
              ) : (
                <span className="text-muted"><LuX /> Non-Orderable</span>
              )}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Alertable Status</span>
            <span className="detail-value">
              {test.alertable !== false ? 'Yes (Alert on abnormal)' : 'No'}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Review Status</span>
            <span className="detail-value capitalize">{test.status || 'Active'}</span>
          </div>

          {/* Unit & Range for Single Parameter Tests */}
          {!isMultiParam && (
            <>
              <div className="detail-item">
                <span className="detail-label">Unit</span>
                <span className="detail-value">{test.unit || parameters[0]?.unit || '—'}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Reference Range</span>
                <span className="detail-value">{test.referenceRange || parameters[0]?.referenceRange || '—'}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Input Type</span>
                <span className="detail-value capitalize">{test.inputType || 'Numeric'}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Default Result</span>
                <span className="detail-value">{test.defaultResult || '—'}</span>
              </div>
            </>
          )}

          {test.source && (
            <div className="detail-item">
              <span className="detail-label">Source</span>
              <span className="detail-value">{test.source}</span>
            </div>
          )}
        </div>

        {test.note && (
          <div className="detail-note-box">
            <b>Note:</b> {test.note}
          </div>
        )}
      </div>

      {/* Linked Parameters Section */}
      <div className="catalogue-parameters-panel">
        <div className="panel-header-with-count">
          <h2 className="section-title">
            <LuLayers /> Linked Parameters &amp; Components ({parameters.length})
          </h2>
          <span className="subtext">
            {isMultiParam
              ? 'Multi-parameter tests include individual test components reported together.'
              : 'Single parameter test linked to laboratory reference range.'}
          </span>
        </div>

        {parameters.length > 0 ? (
          <div className="table-scroll">
            <table className="app-table catalogue-parameters-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Order</th>
                  <th>Parameter Name</th>
                  <th>Database Link</th>
                  <th>Unit</th>
                  <th>Reference Range</th>
                  <th>Rate</th>
                  <th>Input Type</th>
                  <th>Optional</th>
                  <th style={{ width: '80px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {parameters.map((param, pIdx) => {
                  const paramId = param.id || param._id;
                  const isLinked = Boolean(param.testId);

                  return (
                    <tr key={paramId || pIdx}>
                      <td>
                        <b>#{param.order || pIdx + 1}</b>
                      </td>
                      <td>
                        <b className="param-name">{param.name}</b>
                        {param.linkedDetails?.code && (
                          <span className="test-code-badge ml-2">{param.linkedDetails.code}</span>
                        )}
                      </td>
                      <td>
                        {isLinked ? (
                          <span className="param-link-badge linked" title={`Linked to test ID: ${param.testId}`}>
                            Linked ({param.linkedDetails?.name || 'tests collection'})
                          </span>
                        ) : (
                          <span className="param-link-badge unlinked">Unlinked</span>
                        )}
                      </td>
                      <td>{param.unit || param.linkedDetails?.unit || '—'}</td>
                      <td>
                        <span className="ref-range-cell">
                          {param.referenceRange || param.linkedDetails?.referenceRange || '—'}
                        </span>
                      </td>
                      <td>₹{param.rate !== undefined ? param.rate : (param.linkedDetails?.rate || 0)}</td>
                      <td>
                        <span className="capitalize">{param.inputType || 'numeric'}</span>
                      </td>
                      <td>
                        {param.optional ? (
                          <span className="cat-badge cat-badge-warning">Optional</span>
                        ) : (
                          <span className="cat-badge cat-badge-muted">Required</span>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="cat-action-btn edit small"
                          onClick={() => onEditParameter && onEditParameter(test, param)}
                          title="Edit parameter configuration"
                        >
                          <LuPencil />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="catalogue-empty-params">
            <p>No parameters currently mapped to this test.</p>
          </div>
        )}
      </div>
    </div>
  );
}
