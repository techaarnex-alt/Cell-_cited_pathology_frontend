import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useApp } from '../../context/AppContext';
import { SAMPLE_TYPES } from '../../constants';
import { date, genderForTitle } from '../../utils/helpers';
import PatientList from './PatientList';
import EditPatientModal from './EditPatientModal';
import CategoryInvestigationPicker from '../booking/CategoryInvestigationPicker';
import './Patients.css';

// Yup validation schema for patient registration
const patientRegistrationSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  firstName: yup
    .string()
    .trim()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .trim()
    .required('Last name is required'),
  age: yup
    .number()
    .typeError('Age must be a valid number')
    .required('Age is required')
    .min(0, 'Age cannot be negative')
    .max(150, 'Please enter a valid age'),
  ageUnit: yup.string().default('Years'),
  gender: yup.string().required('Gender is required'),
  mobile: yup
    .string()
    .trim()
    .required('Mobile number is required')
    .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
  doctorId: yup.string().nullable(),
  sampleType: yup.string().default('Blood'),
  collectedOn: yup.string().default(''),
  address: yup.string().nullable(),
  email: yup.string().nullable(),
  aadhaar: yup.string().nullable(),
  patientHistory: yup.string().nullable(),
  onlineReportRequested: yup.boolean().default(false),
});

const OPTIONAL_FIELDS = [
  {
    key: 'email',
    label: 'Email',
    type: 'input',
    inputType: 'email',
    placeholder: 'patient@example.com',
  },
  {
    key: 'address',
    label: 'Address',
    type: 'textarea',
    rows: 3,
    placeholder: 'Patient address (street, area, city, pin code)',
  },
  {
    key: 'aadhaar',
    label: 'Aadhaar',
    type: 'input',
    inputType: 'text',
    placeholder: '12-digit Aadhaar number',
    maxLength: 12,
  },
  {
    key: 'patientHistory',
    label: 'Patient history',
    type: 'textarea',
    rows: 2,
    placeholder: 'Previous medical history, clinical notes, chronic illness, allergies...',
  },
];

export default function Patients() {
  const {
    data,
    setView,
    setPatientRecordId,
    setNewReportPatientId,
    patientSearch,
    setPatientSearch,
    registrationRef,
    registerPatient,
    registrationGender,
    setRegistrationGender,
    bookingPickerKey,
    catalogue,
    testGroups,
    setBookingFee,
  } = useApp();

  const [editingPatient, setEditingPatient] = useState(null);
  const [isMobileFocused, setIsMobileFocused] = useState(false);

  const [activeFields, setActiveFields] = useState([]);

  const handleAddField = (fieldKey) => {
    setActiveFields((prev) => (prev.includes(fieldKey) ? prev : [...prev, fieldKey]));
  };

  const handleRemoveField = (fieldKey) => {
    setActiveFields((prev) => prev.filter((k) => k !== fieldKey));
    setValue(fieldKey, '');
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(patientRegistrationSchema),
    defaultValues: {
      title: '',
      firstName: '',
      lastName: '',
      age: '',
      ageUnit: 'Years',
      gender: '',
      mobile: '',
      doctorId: '',
      sampleType: 'Blood',
      collectedOn: date(),
      address: '',
      email: '',
      aadhaar: '',
      patientHistory: '',
      onlineReportRequested: false,
    },
    mode: 'onBlur',
  });

  // Watch mobile number for real-time search & dropdown
  const watchedMobile = watch('mobile') || '';
  const digitsOnly = watchedMobile.replace(/\D/g, '');
  const searchStr = watchedMobile.trim().toLowerCase();

  const matchingPatients =
    digitsOnly.length >= 2 || searchStr.length >= 2
      ? data.patients
        .filter((p) => {
          const pMobile = (p.mobile || '').replace(/\D/g, '');
          const pName = (p.name || '').toLowerCase();
          const pId = (p.id || '').toLowerCase();
          return (
            (digitsOnly && pMobile.includes(digitsOnly)) ||
            pName.includes(searchStr) ||
            pId.includes(searchStr)
          );
        })
        .slice(0, 20)
      : [];

  const handleSelectPatient = (patient) => {
    setIsMobileFocused(false);
    setPatientRecordId(patient.id);
    setView('patientrecord');
  };

  // Automatically update gender when title is selected
  const watchedTitle = watch('title');
  useEffect(() => {
    if (watchedTitle) {
      const g = genderForTitle(watchedTitle);
      if (g) {
        setValue('gender', g, { shouldValidate: true });
        setRegistrationGender(g);
      }
    }
  }, [watchedTitle, setValue, setRegistrationGender]);

  const onFormSubmit = async (formData, event) => {
    if (registrationRef.current) {
      const syntheticEvent = {
        preventDefault: () => { },
        currentTarget: registrationRef.current,
      };
      await registerPatient(syntheticEvent);
    }
  };

  return (
    <div className="page-container patients-container">
      <header className="page-head">
        <div>
          <span className="eyebrow">PATIENTS</span>
        </div>
        <button
          onClick={() =>
            registrationRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }
        >
          + Register patient
        </button>
      </header>

      {/* Registered patients table commented out as requested.
          Mobile search option with dropdown is now used to find & open existing records. */}
      {/*
      <section className="panel patient-register">
        <header className="patient-list-header">
          <div>
            <h2>Registered patients</h2>
            <p>Find a patient by name, patient ID, mobile number or referring doctor.</p>
          </div>
          <span className="registered-count-badge">
            {data.patients.length} {data.patients.length === 1 ? 'patient' : 'patients'}
          </span>
        </header>

        <PatientList
          patients={data.patients}
          reports={data.reports}
          searchQuery={patientSearch}
          onSearchChange={setPatientSearch}
          onOpen={(patient) => {
            setPatientRecordId(patient.id);
            setView('patientrecord');
          }}
          onEdit={(patient) => setEditingPatient(patient)}
          onNewReport={(patient) => {
            setNewReportPatientId(patient.id);
            setView('newreport');
          }}
          onClearSearch={() => setPatientSearch('')}
        />
      </section>
      */}

      {editingPatient && (
        <EditPatientModal
          patient={editingPatient}
          isOpen={Boolean(editingPatient)}
          onClose={() => setEditingPatient(null)}
        />
      )}

      <form
        ref={registrationRef}
        className="panel patient-form patient-visit-form"
        onSubmit={handleSubmit(onFormSubmit)}
        noValidate
      >
        <div className="patient-form-title-bar">
          <div className="step-circle">1</div>
          <h2>Patient details</h2>
        </div>

        <div className="form-grid patient-details-grid">
          {/* Mobile number - FIRST FIELD */}
          <label className="mobile-field-label">
            <span className="field-label">
              Mobile number <span className="required-star" style={{ fontWeight: 'bold' }}>*</span>
            </span>
            <div
              className={`mobile-input-wrapper ${errors.mobile ? 'input-error' : ''} ${isMobileFocused ? 'is-focused' : ''
                }`}
            >
              <div className="mobile-prefix">+91</div>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="10-digit mobile number"
                {...register('mobile')}
                onFocus={() => setIsMobileFocused(true)}
                onBlur={() => {
                  setTimeout(() => setIsMobileFocused(false), 250);
                }}
                className="mobile-input-field"
                autoComplete="off"
              />
              <div className="mobile-input-icons">
                {digitsOnly.length === 10 && (
                  <span className="mobile-valid-check" title="10-digit mobile number">✓</span>
                )}
                <span className="mobile-search-icon" title="Search patient by mobile or name">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </span>
              </div>

              {/* Dropdown list of matching patients */}
              {isMobileFocused && matchingPatients.length > 0 && (
                <div className="mobile-dropdown-menu">
                  {matchingPatients.map((patient) => {
                    const formattedAge = patient.age
                      ? `${patient.age} ${patient.ageUnit === 'Months'
                        ? 'MTH'
                        : patient.ageUnit === 'Days'
                          ? 'DAYS'
                          : 'YRS'
                      }`
                      : '';
                    const genderChar = patient.gender
                      ? `/${patient.gender.charAt(0).toUpperCase()}`
                      : '';
                    const regDate = patient.registeredOn || '';

                    return (
                      <div
                        key={patient.id}
                        className="mobile-dropdown-item"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectPatient(patient);
                        }}
                      >
                        <div className="mobile-dropdown-name">{patient.name}</div>
                        <div className="mobile-dropdown-meta">
                          <span>
                            {formattedAge}
                            {genderChar} {regDate}
                          </span>
                          {patient.id && (
                            <span className="mobile-dropdown-pid">· ID: {patient.id}</span>
                          )}
                          {patient.mobile && (
                            <span className="mobile-dropdown-phone">· {patient.mobile}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div className="mobile-dropdown-footer">
                    Note: Only recent 20 records are shown here.
                  </div>
                </div>
              )}

              {/* No match hint if typed 3+ digits */}
              {isMobileFocused && digitsOnly.length >= 3 && matchingPatients.length === 0 && (
                <div className="mobile-dropdown-menu mobile-dropdown-empty">
                  No registered patient found with this mobile number. You can fill details below to register a new patient.
                </div>
              )}
            </div>
            {errors.mobile && (
              <span className="form-field-error">{errors.mobile.message}</span>
            )}
          </label>

          {/* Title */}
          <label>
            <span className="field-label">
              Title <span className="required-star" style={{ fontWeight: 'bold' }}>*</span>
            </span>
            <select
              {...register('title')}
              className={errors.title ? 'input-error' : ''}
            >
              <option value="">Select title</option>
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Ms.">Ms.</option>
              <option value="Master">Master</option>
              <option value="Baby">Baby</option>
              <option value="Dr.">Dr.</option>
            </select>
            {errors.title && (
              <span className="form-field-error">{errors.title.message}</span>
            )}
          </label>

          {/* First Name */}
          <label>
            <span className="field-label">
              First name <span className="required-star" style={{ fontWeight: 'bold' }}>*</span>
            </span>
            <input
              {...register('firstName')}
              placeholder="First name"
              className={errors.firstName ? 'input-error' : ''}
            />
            {errors.firstName && (
              <span className="form-field-error">{errors.firstName.message}</span>
            )}
          </label>

          {/* Last Name */}
          <label>
            <span className="field-label">
              Last name <span className="required-star" style={{ fontWeight: 'bold' }}>*</span>
            </span>
            <input
              {...register('lastName')}
              placeholder="Last name"
              className={errors.lastName ? 'input-error' : ''}
            />
            {errors.lastName && (
              <span className="form-field-error">{errors.lastName.message}</span>
            )}
          </label>

          {/* Age */}
          <label>
            <span className="field-label">
              Age <span className="required-star" style={{ fontWeight: 'bold' }}>*</span>
            </span>
            <input
              type="number"
              min="0"
              placeholder="Age"
              {...register('age')}
              className={errors.age ? 'input-error' : ''}
            />
            {errors.age && (
              <span className="form-field-error">{errors.age.message}</span>
            )}
          </label>

          {/* Age unit */}
          <label>
            <span className="field-label">Age unit</span>
            <select {...register('ageUnit')}>
              <option value="Years">Years</option>
              <option value="Months">Months</option>
              <option value="Days">Days</option>
            </select>
            {errors.ageUnit && (
              <span className="form-field-error">{errors.ageUnit.message}</span>
            )}
          </label>

          {/* Gender */}
          <label>
            <span className="field-label">
              Gender <span className="required-star" style={{ fontWeight: 'bold' }}>*</span>
            </span>
            <select
              {...register('gender')}
              className={errors.gender ? 'input-error' : ''}
            >
              <option value="">Select gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <span className="form-field-error">{errors.gender.message}</span>
            )}
          </label>

          {/* Referred By */}
          <label>
            <span className="field-label">
              Referred by <span className="required-star" style={{ fontWeight: 'bold' }}>*</span>
            </span>
            <select
              {...register('doctorId')}
              className={errors.doctorId ? 'input-error' : ''}
            >
              <option value="">Self / direct walk-in</option>
              {data.doctors.map((doctor) => (
                <option value={doctor.id} key={doctor.id}>
                  {doctor.doctorCode} · {doctor.name} ({doctor.referralPercentage}%)
                </option>
              ))}
            </select>
            {errors.doctorId && (
              <span className="form-field-error">{errors.doctorId.message}</span>
            )}
          </label>

          {/* Sample Type */}
          <label>
            <span className="field-label">Sample type</span>
            <select {...register('sampleType')}>
              {SAMPLE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          {/* Collected on */}
          <label>
            <span className="field-label">Collected on</span>
            <input
              {...register('collectedOn')}
              placeholder="DD/MM/YYYY"
            />
          </label>

        </div>

        {/* Dynamic Optional Patient Fields & Online Report Requested (LabSmart-style) */}
        <div className="patient-optional-section">
          {/* Online report requested checkbox */}
          <div className="patient-online-report-row">
            <label className="online-report-checkbox-label">
              <input
                type="checkbox"
                {...register('onlineReportRequested')}
                className="online-report-checkbox"
              />
              <span className="online-report-text">Online report requested</span>
            </label>
          </div>

          {/* Active Dynamic Fields (Input / Textarea with Optional badge & Remove button) */}
          {activeFields.length > 0 && (
            <div className="active-optional-fields-list">
              {activeFields.map((fieldKey) => {
                const config = OPTIONAL_FIELDS.find((f) => f.key === fieldKey);
                if (!config) return null;
                return (
                  <div key={fieldKey} className="optional-field-card">
                    <div className="optional-field-header">
                      <div className="optional-field-title-group">
                        <span className="optional-field-label">{config.label}</span>
                        <span className="optional-badge">Optional</span>
                      </div>
                      <button
                        type="button"
                        className="remove-optional-btn"
                        onClick={() => handleRemoveField(fieldKey)}
                        title={`Remove ${config.label}`}
                      >
                        ✕ Remove
                      </button>
                    </div>
                    {config.type === 'textarea' ? (
                      <textarea
                        {...register(fieldKey)}
                        rows={config.rows || 3}
                        placeholder={config.placeholder}
                        className="optional-textarea-field"
                      />
                    ) : (
                      <input
                        type={config.inputType || 'text'}
                        {...register(fieldKey)}
                        placeholder={config.placeholder}
                        maxLength={config.maxLength}
                        className="optional-input-field"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Inactive Optional Pills (+ Email, + Address, + Aadhaar, + Patient history) */}
          {OPTIONAL_FIELDS.some((f) => !activeFields.includes(f.key)) && (
            <div className="optional-pills-row">
              {OPTIONAL_FIELDS.filter((f) => !activeFields.includes(f.key)).map((field) => (
                <button
                  key={field.key}
                  type="button"
                  className="optional-add-pill-btn"
                  onClick={() => handleAddField(field.key)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="pill-plus-icon"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  <span>{field.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Category & Investigation Picker (10 Main Pathology Groups) */}
        {/* <fieldset className="visit-tests">
          <legend>Select tests for this visit</legend>
          <p className="field-help">
            Choose a category from the 10 main groups below to open investigations with rates. A draft report and billing entry will be created from these selections.
          </p>
          <CategoryInvestigationPicker
            key={bookingPickerKey}
            catalogue={catalogue}
            testGroups={testGroups}
            onSelectionChange={(total) => setBookingFee && setBookingFee(total)}
          />
        </fieldset> */}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving patient...' : 'Save patient'}
        </button>
      </form>
    </div>
  );
}
