import React from 'react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_TYPES } from '../../constants';
import { date, genderForTitle } from '../../utils/helpers';
import PatientList from './PatientList';
import InvestigationPicker from '../booking/InvestigationPicker';
import './Patients.css';

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
  } = useApp();

  return (
    <>
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

      <section className="panel patient-register">
        <header className="patient-list-header">
          <div>
            <h2>Registered patients</h2>
            <p>
              Find a patient by name, patient ID, mobile number or referring
              doctor.
            </p>
          </div>
          <span className="registered-count-badge">
            {data.patients.length} patients
          </span>
        </header>

        <div className="patient-search-box-container">
          <div className="patient-search-input-wrapper">
            <span className="patient-search-icon">🔍</span>
            <input
              type="text"
              className="patient-search-input"
              placeholder="Search by patient name, ID (e.g. CCPL-0012), mobile or doctor..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
            />
            {patientSearch && (
              <button
                type="button"
                className="patient-search-clear-btn"
                onClick={() => setPatientSearch('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <PatientList
          patients={data.patients}
          reports={data.reports}
          search={patientSearch}
          onOpen={(patient) => {
            setPatientRecordId(patient.id);
            setView('patientrecord');
          }}
          onNewReport={(patient) => {
            setNewReportPatientId(patient.id);
            setView('newreport');
          }}
          onClearSearch={() => setPatientSearch('')}
        />
      </section>

      <form
        ref={registrationRef}
        className="panel patient-form patient-visit-form"
        onSubmit={registerPatient}
      >
        <h2>Patient registration</h2>
        <div className="form-grid patient-details-grid">
          <label>
            Title
            <select
              name="title"
              defaultValue=""
              onChange={(event) =>
                setRegistrationGender(genderForTitle(event.target.value))
              }
            >
              <option value="">Select title</option>
              <option>Mr.</option>
              <option>Mrs.</option>
              <option>Ms.</option>
              <option>Master</option>
              <option>Baby</option>
              <option>Dr.</option>
            </select>
          </label>
          <label>
            Patient name
            <input name="name" required />
          </label>
          <label>
            Age
            <input name="age" type="number" min="0" required />
          </label>
          <label>
            Age unit
            <select name="ageUnit" defaultValue="Years">
              <option>Years</option>
              <option>Months</option>
              <option>Days</option>
            </select>
          </label>
          <label>
            Gender
            <select
              name="gender"
              value={registrationGender}
              onChange={(event) => setRegistrationGender(event.target.value)}
              required
            >
              <option value="" disabled>
                Select gender
              </option>
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </select>
          </label>
          <label>
            Mobile
            <input
              name="mobile"
              type="tel"
              inputMode="numeric"
              placeholder="10-digit mobile number"
            />
          </label>
          <label>
            Referred by
            <select name="doctorId" defaultValue="">
              <option value="">Self / direct walk-in</option>
              {data.doctors.map((doctor) => (
                <option value={doctor.id} key={doctor.id}>
                  {doctor.doctorCode} · {doctor.name} (
                  {doctor.referralPercentage}%)
                </option>
              ))}
            </select>
          </label>
          <label>
            Sample type
            <select name="sampleType" defaultValue="Blood">
              {SAMPLE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label>
            Collected on
            <input
              name="collectedOn"
              defaultValue={date()}
              placeholder="DD/MM/YYYY"
            />
          </label>
          <label className="wide">
            Address
            <input name="address" placeholder="Patient address (optional)" />
          </label>
        </div>

        <fieldset className="visit-tests">
          <legend>Select tests for this visit</legend>
          <p className="field-help">
            Choose one or more tests. A draft report and billing entry will be
            created from these selections.
          </p>
          <InvestigationPicker
            key={bookingPickerKey}
            catalogue={catalogue}
            testGroups={testGroups}
            booking
          />
        </fieldset>

        <button>Save patient</button>
      </form>
    </>
  );
}
