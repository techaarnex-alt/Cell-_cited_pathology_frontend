import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_TYPES } from '../../constants';
import { patientName } from '../../utils/helpers';
import { LuSquarePen } from 'react-icons/lu';
import './EditReportModal.css';

export default function EditReportModal({ report, patient, isOpen, onClose }) {
  const { updateReport } = useApp();

  const [formData, setFormData] = useState({
    status: 'Final',
    sampleType: 'Blood',
    reportedOn: '',
    collectedOn: '',
    fee: 0,
    tests: [],
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (report) {
      setFormData({
        status: report.status || 'Final',
        sampleType: report.sampleType || 'Blood',
        reportedOn: report.reportedOn || '',
        collectedOn: report.collectedOn || '',
        fee: report.fee !== undefined ? report.fee : 0,
        tests: (report.tests || []).map((t) => ({
          name: t.name || '',
          value: t.value || '',
          unit: t.unit || '',
          range: t.range || '',
          remark: t.remark || '',
          reportItemId: t.reportItemId || '',
        })),
      });
      setError('');
    }
  }, [report, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !report) return null;

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestValueChange = (index, field, value) => {
    setFormData((prev) => {
      const nextTests = [...prev.tests];
      nextTests[index] = { ...nextTests[index], [field]: value };
      return { ...prev, tests: nextTests };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    setSubmitting(true);
    try {
      await updateReport(report.id, {
        status: formData.status,
        sampleType: formData.sampleType,
        reportedOn: formData.reportedOn.trim(),
        collectedOn: formData.collectedOn.trim(),
        fee: Number(formData.fee),
        items: formData.tests.map((t) => ({
          reportItemId: t.reportItemId,
          testName: t.name,
          value: t.value.trim(),
          unit: t.unit.trim(),
          referenceRange: t.range.trim(),
          remark: t.remark.trim(),
        })),
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container edit-report-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="modal-header-icon">
              <LuSquarePen size={20} color="#ffffff" />
            </div>
            <div>
              <span className="modal-eyebrow">UPDATE INVESTIGATION REPORT</span>
              <h2>Edit Report: {report.number}</h2>
              <p className="modal-subtext">
                Patient: <b>{patientName(patient)}</b> ({report.patientId})
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </header>

        {error && <div className="modal-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="edit-report-form">
          <div className="form-grid edit-report-meta-grid">
            <label>
              Report number
              <input
                type="text"
                value={report.number}
                disabled
                className="input-disabled"
              />
            </label>

            <label>
              Status
              <select
                name="status"
                value={formData.status}
                onChange={handleFieldChange}
              >
                <option value="Final">Final</option>
                <option value="Draft">Draft</option>
              </select>
            </label>

            <label>
              Sample type
              <select
                name="sampleType"
                value={formData.sampleType}
                onChange={handleFieldChange}
              >
                {SAMPLE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Reported on
              <input
                type="text"
                name="reportedOn"
                value={formData.reportedOn}
                onChange={handleFieldChange}
                placeholder="DD/MM/YYYY"
              />
            </label>

            <label>
              Collected on
              <input
                type="text"
                name="collectedOn"
                value={formData.collectedOn}
                onChange={handleFieldChange}
                placeholder="DD/MM/YYYY"
              />
            </label>

            <label>
              Total Fee (₹)
              <input
                type="number"
                name="fee"
                min="0"
                step="0.01"
                value={formData.fee}
                onChange={handleFieldChange}
              />
            </label>
          </div>

          <fieldset className="edit-report-items-section">
            <legend>Observed Investigation Results ({formData.tests.length} tests)</legend>
            <p className="field-help" style={{ margin: '0 0 12px', fontSize: '12.5px', color: '#64748b' }}>
              Modify observed test values and clinical remarks. Reference ranges and units are pulled from catalogue.
            </p>

            <div className="table-scroll">
              <table className="app-table edit-report-table">
                <thead>
                  <tr>
                    <th>Investigation</th>
                    <th>Observed result</th>
                    <th>Unit</th>
                    <th>Reference range</th>
                    <th>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.tests.map((test, index) => (
                    <tr key={test.name || index}>
                      <td>
                        <b>{test.name}</b>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={test.value}
                          onChange={(e) =>
                            handleTestValueChange(index, 'value', e.target.value)
                          }
                          placeholder="Observed value"
                          className="report-val-input"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={test.unit}
                          disabled
                          className="input-disabled"
                          title="Unit is configured in catalogue"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={test.range}
                          disabled
                          className="input-disabled"
                          title="Reference range"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={test.remark}
                          onChange={(e) =>
                            handleTestValueChange(index, 'remark', e.target.value)
                          }
                          placeholder="Optional remark"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </fieldset>

          <footer className="modal-actions">
            <button
              type="button"
              className="secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Saving report...' : 'Save changes'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
