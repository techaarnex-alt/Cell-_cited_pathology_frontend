import React, { useState, useEffect } from 'react';
import {
  LuGripVertical,
  LuArrowUp,
  LuArrowDown,
  LuSave,
  LuCheck,
  LuCircleAlert,
} from 'react-icons/lu';
import { patientName, date, sortTestsByCatalogueOrder } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';

export default function ResultForm({ report, patient, onFinalise }) {
  const { testGroups, reorderReportTests } = useApp();

  // 1. Initial order:
  // If report has explicit custom order, preserve its saved displayOrder.
  // Otherwise, default strictly to Test Catalogue order.
  const [orderedRows, setOrderedRows] = useState(() => {
    const rawTests = report.tests || [];
    if (report.hasCustomItemOrder) {
      return [...rawTests].sort(
        (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
      );
    }
    return sortTestsByCatalogueOrder(rawTests, testGroups);
  });

  // Keep orderedRows in sync if external report changes and user hasn't edited order locally
  useEffect(() => {
    const rawTests = report.tests || [];
    if (report.hasCustomItemOrder) {
      setOrderedRows(
        [...rawTests].sort(
          (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
        )
      );
    } else {
      setOrderedRows(sortTestsByCatalogueOrder(rawTests, testGroups));
    }
  }, [report.tests, report.hasCustomItemOrder, testGroups]);

  // 2. Controlled values keyed by reportItemId (or test.name)
  // so values remain permanently attached to their investigation row when dragged!
  const [valuesMap, setValuesMap] = useState(() => {
    const initial = {};
    (report.tests || []).forEach((t) => {
      const key = t.reportItemId || t.name;
      initial[key] = {
        value: t.value || '',
        remark: t.remark || '',
      };
    });
    return initial;
  });

  const updateFieldValue = (key, field, val) => {
    setValuesMap((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [field]: val,
      },
    }));
  };

  // Reorder & drag state
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isDirtyOrder, setIsDirtyOrder] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const moveRow = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= orderedRows.length) return;
    const next = [...orderedRows];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    setOrderedRows(next);
    setIsDirtyOrder(true);
    setOrderError('');
    setOrderSuccess(false);
  };

  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/plain', String(index));
    } catch {}
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    const next = [...orderedRows];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    setOrderedRows(next);
    setIsDirtyOrder(true);
    setOrderError('');
    setOrderSuccess(false);
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleSaveOrder = async () => {
    setSavingOrder(true);
    setOrderError('');
    setOrderSuccess(false);
    try {
      const orderedItemIds = orderedRows
        .map((t) => t.reportItemId)
        .filter(Boolean);

      if (orderedItemIds.length !== orderedRows.length) {
        throw new Error('Some investigations are missing report item IDs. Please save or refresh.');
      }

      await reorderReportTests(
        report.backendId || report.id || report.number,
        orderedItemIds
      );
      setSavingOrder(false);
      setIsDirtyOrder(false);
      setOrderSuccess(true);
      setTimeout(() => setOrderSuccess(false), 3500);
    } catch (err) {
      setSavingOrder(false);
      setOrderError(err.message || 'Failed to save investigation order. Please retry.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedTests = orderedRows.map((test) => {
      const key = test.reportItemId || test.name;
      const vals = valuesMap[key] || {};
      return {
        ...test,
        value: vals.value !== undefined ? vals.value : test.value || '',
        remark: vals.remark !== undefined ? vals.remark : test.remark || '',
      };
    });

    const updatedReport = {
      ...report,
      tests: updatedTests,
    };
    onFinalise(updatedReport, event);
  };

  return (
    <form className="panel result-form" onSubmit={handleSubmit}>
      <header>
        <div>
          <h2>
            {report.number} · {patientName(patient)}
          </h2>
          <p>{orderedRows.map((test) => test.name).join(', ')}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {report.hasCustomItemOrder && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 650,
                color: '#15803d',
                background: '#dcfce7',
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              Custom Order Saved
            </span>
          )}
          <span className="status draft">Draft</span>
        </div>
      </header>

      {/* Reorder Toolbar */}
      <div className="result-order-toolbar">
        <p className="reorder-instructions">
          <LuGripVertical /> Drag rows or use arrows to adjust investigation sequence for results and report.
        </p>
        <div className="order-actions-group">
          {orderSuccess && (
            <span style={{ fontSize: '12px', color: '#15803d', fontWeight: 600 }}>
              <LuCheck style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Order saved!
            </span>
          )}
          <button
            type="button"
            className={`save-order-btn ${isDirtyOrder ? 'is-dirty' : ''}`}
            onClick={handleSaveOrder}
            disabled={savingOrder || (!isDirtyOrder && !orderError)}
            title={isDirtyOrder ? 'Save changes to database' : 'Order is currently saved'}
          >
            <LuSave /> {savingOrder ? 'Saving Order...' : isDirtyOrder ? 'Save New Order' : 'Order Saved'}
          </button>
        </div>
      </div>

      {orderError && (
        <div className="reorder-error-banner" role="alert">
          <span>
            <LuCircleAlert style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            {orderError}
          </span>
          <button
            type="button"
            className="reorder-retry-btn"
            onClick={handleSaveOrder}
          >
            Retry
          </button>
        </div>
      )}

      {orderSuccess && (
        <div className="reorder-success-banner" role="status">
          <LuCheck /> Investigation order updated successfully. This sequence will appear in Result Entry and the generated report / PDF.
        </div>
      )}

      <div className="table-scroll">
        <table className="app-table result-table">
          <thead>
            <tr>
              <th className="th-drag">Order</th>
              <th>Investigation</th>
              <th>Observed result</th>
              <th>Unit</th>
              <th>Reference range</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {orderedRows.map((test, index) => {
              const rowKey = test.reportItemId || test.name;
              const currentVals = valuesMap[rowKey] || {
                value: test.value || '',
                remark: test.remark || '',
              };
              const isDragging = dragIndex === index;
              const isOver = dragOverIndex === index;

              return (
                <tr
                  key={rowKey}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`result-row ${isDragging ? 'is-dragging' : ''} ${
                    isOver ? 'is-drag-over' : ''
                  }`}
                >
                  <td className="td-drag">
                    <div className="drag-cell-content">
                      <span
                        className="row-drag-handle"
                        title="Drag to reorder investigation"
                      >
                        <LuGripVertical />
                      </span>
                      <span className="row-order-badge">#{index + 1}</span>
                      <div className="row-arrow-buttons">
                        <button
                          type="button"
                          className="row-arrow-btn"
                          disabled={index === 0}
                          onClick={() => moveRow(index, -1)}
                          title="Move up"
                        >
                          <LuArrowUp />
                        </button>
                        <button
                          type="button"
                          className="row-arrow-btn"
                          disabled={index === orderedRows.length - 1}
                          onClick={() => moveRow(index, 1)}
                          title="Move down"
                        >
                          <LuArrowDown />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <b>{test.name}</b>
                    {test.category && (
                      <small className="result-test-category">
                        {test.category}
                      </small>
                    )}
                  </td>
                  <td>
                    <input
                      name={test.name}
                      value={currentVals.value}
                      onChange={(e) =>
                        updateFieldValue(rowKey, 'value', e.target.value)
                      }
                      placeholder="Enter result"
                      required
                    />
                  </td>
                  <td>
                    <input
                      name={`${test.name}-unit`}
                      defaultValue={test.unit}
                      placeholder="Unit"
                      disabled
                      title="Unit is configured in test catalogue"
                    />
                  </td>
                  <td>
                    <input
                      name={`${test.name}-range`}
                      defaultValue={test.range}
                      placeholder="Reference range"
                      disabled
                      title="Reference range is configured in test catalogue"
                    />
                  </td>
                  <td>
                    <input
                      name={`${test.name}-remark`}
                      value={currentVals.remark}
                      onChange={(e) =>
                        updateFieldValue(rowKey, 'remark', e.target.value)
                      }
                      placeholder="Optional remark"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              fontWeight: 750,
              color: '#334b72',
            }}
          >
            Reported on:{' '}
            <input
              name="reportedOn"
              defaultValue={report.reportedOn || date()}
              style={{
                width: '110px',
                padding: '6px 8px',
                borderRadius: '6px',
                border: '1px solid #c7d3e8',
              }}
            />
          </label>
          <p style={{ margin: 0 }}>
            Verify observations, units, reference ranges and remarks before
            finalising.
          </p>
        </div>
        <button type="submit">Finalise report</button>
      </footer>
    </form>
  );
}
