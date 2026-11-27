import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_TYPES } from '../../constants';
import { genderForTitle, patientName } from '../../utils/helpers';
import { LuSquarePen } from 'react-icons/lu';
import './EditPatientModal.css';

export default function EditPatientModal({ patient, isOpen, onClose }) {
  const { data, updatePatient } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    name: '',
    age: '',
    ageUnit: 'Years',
    gender: '',
    mobile: '',
    address: '',
    doctorId: '',
    sampleType: 'Blood',
    registeredOn: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Prefill all input fields whenever patient or isOpen changes
  useEffect(() => {
    if (patient) {
      const docId = typeof patient.doctorId === 'object'
        ? (patient.doctorId?._id || patient.doctorId?.id || '')
        : (patient.doctorId || '');

      setFormData({
        title: patient.title || '',
        name: patient.name || '',
        age: patient.age !== undefined && patient.age !== null ? patient.age : '',
        ageUnit: patient.ageUnit || 'Years',
        gender: patient.gender || '',
        mobile: patient.mobile || '',
        address: patient.address || '',
        doctorId: docId,
        sampleType: patient.sampleType || 'Blood',
        registeredOn: patient.registeredOn || '',
      });
      setError('');
    }
  }, [patient, isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !patient) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'title') {
        const autoGender = genderForTitle(value);
        if (autoGender) {
          updated.gender = autoGender;
        }
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Patient name is required.');
      return;
    }

    if (formData.age === '' || Number(formData.age) < 0) {
      setError('Please enter a valid age (0 or higher).');
      return;
    }

    if (!formData.gender) {
      setError('Please select a gender.');
      return;
    }

    setSubmitting(true);
    try {
      await updatePatient(patient.id, {
        title: formData.title,
        name: formData.name.trim(),
        age: Number(formData.age),
        ageUnit: formData.ageUnit,
        gender: formData.gender,
        mobile: formData.mobile.trim(),
        address: formData.address.trim(),
        doctorId: formData.doctorId || null,
        sampleType: formData.sampleType || 'Blood',
        registeredOn: formData.registeredOn.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update patient details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container edit-patient-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="modal-header-icon">
              <LuSquarePen size={20} color="#ffffff" />
            </div>
            <div>
              <span className="modal-eyebrow">UPDATE PATIENT RECORD</span>
              <h2>Edit Patient Details</h2>
              <p className="modal-subtext">
                Update information for <b>{patientName(patient)}</b> ({patient.id})
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

        <form onSubmit={handleSubmit} className="edit-patient-form">
          <div className="form-grid edit-patient-grid">
            {/* Patient ID: Displayed read-only */}
            <label>
              <span className="field-label">Patient ID</span>
              <input
                type="text"
                value={patient.id}
                disabled
                className="input-disabled"
                title="Patient ID is a system-generated unique identifier"
              />
            </label>

            {/* Title */}
            <label>
              <span className="field-label">
                Title <span className="required-star" style={{ fontWeight: 'bold', marginLeft: '3px' }}>*</span>
              </span>
              <select
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              >
                <option value="">Select title</option>
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Ms.">Ms.</option>
                <option value="Master">Master</option>
                <option value="Baby">Baby</option>
                <option value="Dr.">Dr.</option>
              </select>
            </label>

            {/* Patient Name */}
            <label>
              <span className="field-label">
                Patient Name <span className="required-star" style={{ fontWeight: 'bold', marginLeft: '3px' }}>*</span>
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter patient full name"
                required
              />
            </label>

            {/* Age */}
            <label>
              <span className="field-label">
                Age <span className="required-star" style={{ fontWeight: 'bold', marginLeft: '3px' }}>*</span>
              </span>
              <input
                type="number"
                name="age"
                min="0"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                required
              />
            </label>

            {/* Age Unit */}
            <label>
              <span className="field-label">Age Unit</span>
              <select
                name="ageUnit"
                value={formData.ageUnit}
                onChange={handleChange}
              >
                <option value="Years">Years</option>
                <option value="Months">Months</option>
                <option value="Days">Days</option>
              </select>
            </label>

            {/* Gender */}
            <label>
              <span className="field-label">
                Gender <span className="required-star" style={{ fontWeight: 'bold', marginLeft: '3px' }}>*</span>
              </span>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>

            {/* Mobile */}
            <label>
              <span className="field-label">
                Mobile <span className="required-star" style={{ fontWeight: 'bold', marginLeft: '3px' }}>*</span>
              </span>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                required
              />
            </label>

            {/* Referring Doctor */}
            <label>
              <span className="field-label">
                Referred by <span className="required-star" style={{ fontWeight: 'bold', marginLeft: '3px' }}>*</span>
              </span>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
              >
                <option value="">Self / direct walk-in</option>
                {data.doctors.map((doctor) => {
                  const docVal = doctor.id || doctor.backendId;
                  return (
                    <option key={docVal} value={docVal}>
                      {doctor.doctorCode ? `${doctor.doctorCode} · ` : ''}{doctor.name}{' '}
                      {doctor.referralPercentage ? `(${doctor.referralPercentage}%)` : ''}
                    </option>
                  );
                })}
              </select>
            </label>

            {/* Sample Type */}
            <label>
              <span className="field-label">Sample Type</span>
              <select
                name="sampleType"
                value={formData.sampleType}
                onChange={handleChange}
              >
                {SAMPLE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            {/* Registered On */}
            <label>
              <span className="field-label">Registered On</span>
              <input
                type="text"
                name="registeredOn"
                value={formData.registeredOn}
                onChange={handleChange}
                placeholder="DD/MM/YYYY"
              />
            </label>

            {/* Address */}
            <label className="wide">
              <span className="field-label">Address</span>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Patient address"
              />
            </label>
          </div>

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
              {submitting ? 'Saving changes...' : 'Save changes'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
