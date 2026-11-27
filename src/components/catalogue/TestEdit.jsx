import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { REQUIRED_CATEGORIES } from './CategoryNav';
import {
  LuArrowLeft,
  LuSave,
  LuPlus,
  LuTrash2,
  LuArrowUp,
  LuArrowDown,
  LuLayers,
  LuCheck,
  LuX,
  LuGripVertical,
} from 'react-icons/lu';

export default function TestEdit({
  testId, // null if creating new
  category,
  onBack,
  onSaveSuccess,
  isNew = false,
}) {
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    code: '',
    category: category && category !== 'All' ? category : 'Haematology',
    testType: 'single_parameter',
    unit: '',
    inputType: 'numeric',
    defaultResult: '',
    referenceRange: '',
    rate: 0,
    optional: false,
    alertable: true,
    status: 'active',
    orderable: true,
    order: 1,
    note: '',
    parameters: [],
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [availableTests, setAvailableTests] = useState([]);
  const [showAddParamModal, setShowAddParamModal] = useState(false);
  const [newParamForm, setNewParamForm] = useState({
    name: '',
    testId: '',
    unit: '',
    referenceRange: '',
    rate: 0,
    inputType: 'numeric',
    defaultResult: '',
    optional: false,
  });

  // Load test details if editing
  useEffect(() => {
    if (!isNew && testId) {
      setLoading(true);
      setError('');
      api.getCatalogueTest(testId)
        .then((data) => {
          setFormData({
            ...data,
            name: data.name || '',
            shortName: data.shortName || '',
            code: data.code || '',
            category: data.category || (category !== 'All' ? category : 'Haematology'),
            testType: data.testType || (data.parameters?.length > 1 ? 'multi_parameter' : 'single_parameter'),
            unit: data.unit || data.parameters?.[0]?.unit || '',
            inputType: data.inputType || 'numeric',
            defaultResult: data.defaultResult || '',
            referenceRange: data.referenceRange || data.parameters?.[0]?.referenceRange || '',
            rate: data.rate !== undefined ? data.rate : 0,
            optional: Boolean(data.optional),
            alertable: data.alertable !== false,
            status: data.status || 'active',
            orderable: data.orderable !== false,
            order: data.order || 1,
            note: data.note || '',
            parameters: Array.isArray(data.parameters) ? data.parameters : [],
          });
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || 'Failed to load test details');
          setLoading(false);
        });
    }
  }, [testId, isNew, category]);

  // Load individual tests from `tests` collection for linking
  useEffect(() => {
    api.getTests({ limit: 500 })
      .then((res) => {
        if (Array.isArray(res?.tests)) {
          setAvailableTests(res.tests);
        } else if (Array.isArray(res)) {
          setAvailableTests(res);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Reorder parameter in list
  const moveParam = (index, direction) => {
    const nextParams = [...formData.parameters];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= nextParams.length) return;

    const temp = nextParams[index];
    nextParams[index] = nextParams[targetIndex];
    nextParams[targetIndex] = temp;

    // Re-assign order numbers
    nextParams.forEach((p, idx) => {
      p.order = idx + 1;
    });

    setFormData((prev) => ({ ...prev, parameters: nextParams }));
  };

  // Remove parameter
  const removeParam = (index) => {
    const nextParams = formData.parameters.filter((_, idx) => idx !== index);
    nextParams.forEach((p, idx) => {
      p.order = idx + 1;
    });
    setFormData((prev) => ({
      ...prev,
      parameters: nextParams,
      testType: nextParams.length <= 1 ? 'single_parameter' : prev.testType,
    }));
  };

  // Handle selecting an existing test to auto-populate new parameter
  const handleSelectLinkedTest = (e) => {
    const selectedId = e.target.value;
    const linked = availableTests.find((t) => String(t._id || t.id) === String(selectedId));

    if (linked) {
      setNewParamForm((prev) => ({
        ...prev,
        testId: selectedId,
        name: prev.name || linked.name || linked.investigation || '',
        unit: linked.unit || prev.unit,
        referenceRange: linked.referenceRange || prev.referenceRange,
        rate: linked.rate !== undefined ? linked.rate : prev.rate,
      }));
    } else {
      setNewParamForm((prev) => ({ ...prev, testId: '' }));
    }
  };

  // Add parameter to test
  const handleAddParameter = (e) => {
    e.preventDefault();
    if (!newParamForm.name.trim()) return;

    const newParam = {
      ...newParamForm,
      order: formData.parameters.length + 1,
      rate: Number(newParamForm.rate) || 0,
      optional: Boolean(newParamForm.optional),
    };

    const nextParams = [...formData.parameters, newParam];
    setFormData((prev) => ({
      ...prev,
      parameters: nextParams,
      testType: nextParams.length > 1 ? 'multi_parameter' : prev.testType,
    }));

    // Reset modal
    setNewParamForm({
      name: '',
      testId: '',
      unit: '',
      referenceRange: '',
      rate: 0,
      inputType: 'numeric',
      defaultResult: '',
      optional: false,
    });
    setShowAddParamModal(false);
  };

  // Submit test form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Test name is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const payload = {
        ...formData,
        name: formData.name.trim(),
        shortName: formData.shortName.trim(),
        code: formData.code.trim().toUpperCase(),
        rate: Number(formData.rate) || 0,
        order: Number(formData.order) || 1,
        optional: Boolean(formData.optional),
        alertable: Boolean(formData.alertable),
        orderable: Boolean(formData.orderable),
        parameters: formData.parameters.map((p, idx) => ({
          ...p,
          order: idx + 1,
          rate: Number(p.rate) || 0,
          optional: Boolean(p.optional),
        })),
      };

      let result;
      if (isNew) {
        result = await api.createCatalogueTest(payload.category, payload);
      } else {
        result = await api.updateCatalogueTest(testId, payload);
      }

      setSaving(false);
      onSaveSuccess(result, isNew ? 'created' : 'updated');
    } catch (err) {
      setSaving(false);
      setError(err.message || 'Failed to save test');
    }
  };

  if (loading) {
    return (
      <div className="catalogue-view-container">
        <div className="catalogue-loading-state">
          <div className="catalogue-spinner" />
          <p>Loading test configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="catalogue-view-container">
      {/* Header */}
      <div className="catalogue-view-header">
        <div className="view-header-left">
          <button type="button" className="cat-btn-back" onClick={onBack} title="Cancel and go back">
            <LuArrowLeft /> Cancel
          </button>
          <h1>{isNew ? 'Add New Laboratory Test' : `Edit Test: ${formData.name}`}</h1>
        </div>

        <div className="view-header-actions">
          <button
            type="button"
            className="cat-btn-primary"
            onClick={handleSubmit}
            disabled={saving}
          >
            <LuSave /> {saving ? 'Saving...' : (isNew ? 'Create Test' : 'Save Changes')}
          </button>
        </div>
      </div>

      {error && <div className="catalogue-error-banner">{error}</div>}

      <form className="catalogue-edit-form" onSubmit={handleSubmit}>
        {/* Basic Details Panel */}
        <div className="catalogue-details-panel">
          <h2 className="section-title">Test Information</h2>
          <div className="catalogue-form-grid">
            <label className="form-field">
              <span className="field-label">
                Test Name <span className="required-star">*</span>
              </span>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Total Bilirubin"
                required
              />
            </label>

            <label className="form-field">
              <span className="field-label">Short Name / Abbreviation</span>
              <input
                type="text"
                value={formData.shortName}
                onChange={(e) => handleChange('shortName', e.target.value)}
                placeholder="e.g. TBIL"
              />
            </label>

            <label className="form-field">
              <span className="field-label">Test Code</span>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                placeholder="e.g. BC005"
                style={{ textTransform: 'uppercase' }}
              />
            </label>

            <label className="form-field">
              <span className="field-label">Category</span>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {REQUIRED_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span className="field-label">Test Type</span>
              <select
                value={formData.testType}
                onChange={(e) => handleChange('testType', e.target.value)}
              >
                <option value="single_parameter">Single Parameter</option>
                <option value="multi_parameter">Multi-Parameter</option>
                <option value="panel">Panel / Profile</option>
                <option value="document">Document / Descriptive</option>
              </select>
            </label>

            <label className="form-field">
              <span className="field-label">Rate / Price (₹)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.rate}
                onChange={(e) => handleChange('rate', e.target.value)}
              />
            </label>

            <label className="form-field">
              <span className="field-label">Display Order</span>
              <input
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) => handleChange('order', e.target.value)}
              />
            </label>

            <label className="form-field">
              <span className="field-label">Status</span>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <option value="active">Active</option>
                <option value="needs_review">Needs Review</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </div>

          {/* Single parameter configurations */}
          {formData.testType === 'single_parameter' && (
            <div className="catalogue-form-grid mt-4">
              <label className="form-field">
                <span className="field-label">Unit</span>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  placeholder="e.g. mg/dL, g/dL"
                />
              </label>

              <label className="form-field">
                <span className="field-label">Reference Range</span>
                <input
                  type="text"
                  value={formData.referenceRange}
                  onChange={(e) => handleChange('referenceRange', e.target.value)}
                  placeholder="e.g. 0.2–1.2"
                />
              </label>

              <label className="form-field">
                <span className="field-label">Input Type</span>
                <select
                  value={formData.inputType}
                  onChange={(e) => handleChange('inputType', e.target.value)}
                >
                  <option value="numeric">Numeric</option>
                  <option value="text">Text / Free text</option>
                  <option value="qualitative">Qualitative / Dropdown</option>
                  <option value="document">Document / Template</option>
                </select>
              </label>

              <label className="form-field">
                <span className="field-label">Default Result</span>
                <input
                  type="text"
                  value={formData.defaultResult}
                  onChange={(e) => handleChange('defaultResult', e.target.value)}
                  placeholder="e.g. Negative"
                />
              </label>
            </div>
          )}

          {/* Toggles */}
          <div className="catalogue-checkbox-row mt-4">
            <label className="cat-checkbox-label">
              <input
                type="checkbox"
                checked={formData.orderable}
                onChange={(e) => handleChange('orderable', e.target.checked)}
              />
              <span>Orderable (Available in Test Booking)</span>
            </label>

            <label className="cat-checkbox-label">
              <input
                type="checkbox"
                checked={formData.alertable}
                onChange={(e) => handleChange('alertable', e.target.checked)}
              />
              <span>Alertable (Highlight out-of-range abnormal results)</span>
            </label>

            <label className="cat-checkbox-label">
              <input
                type="checkbox"
                checked={formData.optional}
                onChange={(e) => handleChange('optional', e.target.checked)}
              />
              <span>Optional test</span>
            </label>
          </div>

          <label className="form-field mt-4">
            <span className="field-label">Clinical Notes / Sample Instructions</span>
            <textarea
              rows="2"
              value={formData.note}
              onChange={(e) => handleChange('note', e.target.value)}
              placeholder="e.g. Fasting 10-12 hours required before blood draw."
            />
          </label>
        </div>

        {/* Multi-Parameter Management Panel */}
        <div className="catalogue-parameters-panel mt-6">
          <div className="panel-header-with-action">
            <div>
              <h2 className="section-title">
                <LuLayers /> Nested Parameters ({formData.parameters.length})
              </h2>
              <span className="subtext">
                Manage components reported under this test. Add, reorder, or remove parameters.
              </span>
            </div>

            <button
              type="button"
              className="cat-btn-secondary"
              onClick={() => setShowAddParamModal(true)}
            >
              <LuPlus /> Add Parameter
            </button>
          </div>

          {formData.parameters.length > 0 ? (
            <div className="table-scroll mt-3">
              <table className="app-table catalogue-parameters-edit-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Order</th>
                    <th>Parameter Name</th>
                    <th>Unit</th>
                    <th>Reference Range</th>
                    <th>Input Type</th>
                    <th>Rate (₹)</th>
                    <th>Optional</th>
                    <th style={{ width: '100px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.parameters.map((param, pIdx) => (
                    <tr key={param.id || param._id || pIdx}>
                      <td>
                        <div className="reorder-mini-group">
                          <span className="order-number">#{pIdx + 1}</span>
                          <button
                            type="button"
                            className="order-arrow-btn"
                            disabled={pIdx === 0}
                            onClick={() => moveParam(pIdx, -1)}
                            title="Move up"
                          >
                            <LuArrowUp />
                          </button>
                          <button
                            type="button"
                            className="order-arrow-btn"
                            disabled={pIdx === formData.parameters.length - 1}
                            onClick={() => moveParam(pIdx, 1)}
                            title="Move down"
                          >
                            <LuArrowDown />
                          </button>
                        </div>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={param.name || ''}
                          onChange={(e) => {
                            const next = [...formData.parameters];
                            next[pIdx] = { ...next[pIdx], name: e.target.value };
                            setFormData((prev) => ({ ...prev, parameters: next }));
                          }}
                          placeholder="Parameter name"
                          className="param-inline-input font-medium"
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={param.unit || ''}
                          onChange={(e) => {
                            const next = [...formData.parameters];
                            next[pIdx] = { ...next[pIdx], unit: e.target.value };
                            setFormData((prev) => ({ ...prev, parameters: next }));
                          }}
                          placeholder="Unit"
                          className="param-inline-input"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={param.referenceRange || ''}
                          onChange={(e) => {
                            const next = [...formData.parameters];
                            next[pIdx] = { ...next[pIdx], referenceRange: e.target.value };
                            setFormData((prev) => ({ ...prev, parameters: next }));
                          }}
                          placeholder="Reference range"
                          className="param-inline-input"
                        />
                      </td>
                      <td>
                        <select
                          value={param.inputType || 'numeric'}
                          onChange={(e) => {
                            const next = [...formData.parameters];
                            next[pIdx] = { ...next[pIdx], inputType: e.target.value };
                            setFormData((prev) => ({ ...prev, parameters: next }));
                          }}
                          className="param-inline-select"
                        >
                          <option value="numeric">Numeric</option>
                          <option value="text">Text</option>
                          <option value="qualitative">Qualitative</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          value={param.rate !== undefined ? param.rate : 0}
                          onChange={(e) => {
                            const next = [...formData.parameters];
                            next[pIdx] = { ...next[pIdx], rate: Number(e.target.value) };
                            setFormData((prev) => ({ ...prev, parameters: next }));
                          }}
                          className="param-inline-input"
                          style={{ width: '70px' }}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={Boolean(param.optional)}
                          onChange={(e) => {
                            const next = [...formData.parameters];
                            next[pIdx] = { ...next[pIdx], optional: e.target.checked };
                            setFormData((prev) => ({ ...prev, parameters: next }));
                          }}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="cat-action-btn delete small"
                          onClick={() => removeParam(pIdx)}
                          title="Remove parameter"
                        >
                          <LuTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="catalogue-empty-params">
              <p>No parameters added yet. Click "+ Add Parameter" to link or create parameters.</p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="catalogue-form-actions mt-6">
          <button type="button" className="cat-btn-secondary" onClick={onBack}>
            Cancel
          </button>
          <button type="submit" className="cat-btn-primary" disabled={saving}>
            <LuSave /> {saving ? 'Saving...' : (isNew ? 'Create Test' : 'Save Changes')}
          </button>
        </div>
      </form>

      {/* Add Parameter Modal */}
      {showAddParamModal && (
        <div className="cat-modal-backdrop" onClick={() => setShowAddParamModal(false)}>
          <div className="cat-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="cat-modal-header">
              <h3>Add Parameter</h3>
              <button
                type="button"
                className="cat-modal-close"
                onClick={() => setShowAddParamModal(false)}
              >
                <LuX />
              </button>
            </div>

            <form onSubmit={handleAddParameter} className="cat-modal-form">
              <label className="form-field">
                <span className="field-label">Link from Existing Tests Collection (Optional)</span>
                <select
                  value={newParamForm.testId}
                  onChange={handleSelectLinkedTest}
                >
                  <option value="">-- Choose existing test to copy --</option>
                  {availableTests.map((t) => (
                    <option key={t._id || t.id} value={t._id || t.id}>
                      {t.name || t.investigation} ({t.category || 'General'})
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span className="field-label">
                  Parameter Name <span className="required-star">*</span>
                </span>
                <input
                  type="text"
                  value={newParamForm.name}
                  onChange={(e) =>
                    setNewParamForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. Neutrophils"
                  required
                />
              </label>

              <div className="form-row-2">
                <label className="form-field">
                  <span className="field-label">Unit</span>
                  <input
                    type="text"
                    value={newParamForm.unit}
                    onChange={(e) =>
                      setNewParamForm((p) => ({ ...p, unit: e.target.value }))
                    }
                    placeholder="e.g. %"
                  />
                </label>

                <label className="form-field">
                  <span className="field-label">Reference Range</span>
                  <input
                    type="text"
                    value={newParamForm.referenceRange}
                    onChange={(e) =>
                      setNewParamForm((p) => ({
                        ...p,
                        referenceRange: e.target.value,
                      }))
                    }
                    placeholder="e.g. 40–70"
                  />
                </label>
              </div>

              <div className="form-row-2">
                <label className="form-field">
                  <span className="field-label">Input Type</span>
                  <select
                    value={newParamForm.inputType}
                    onChange={(e) =>
                      setNewParamForm((p) => ({
                        ...p,
                        inputType: e.target.value,
                      }))
                    }
                  >
                    <option value="numeric">Numeric</option>
                    <option value="text">Text</option>
                    <option value="qualitative">Qualitative</option>
                  </select>
                </label>

                <label className="form-field">
                  <span className="field-label">Rate (₹)</span>
                  <input
                    type="number"
                    min="0"
                    value={newParamForm.rate}
                    onChange={(e) =>
                      setNewParamForm((p) => ({
                        ...p,
                        rate: Number(e.target.value),
                      }))
                    }
                  />
                </label>
              </div>

              <label className="cat-checkbox-label mt-2">
                <input
                  type="checkbox"
                  checked={newParamForm.optional}
                  onChange={(e) =>
                    setNewParamForm((p) => ({
                      ...p,
                      optional: e.target.checked,
                    }))
                  }
                />
                <span>Optional parameter in test booking</span>
              </label>

              <div className="cat-modal-actions mt-4">
                <button
                  type="button"
                  className="cat-btn-secondary"
                  onClick={() => setShowAddParamModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="cat-btn-primary">
                  Add Parameter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
