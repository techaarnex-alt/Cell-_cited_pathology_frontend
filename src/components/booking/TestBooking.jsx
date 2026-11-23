import React from 'react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_TYPES } from '../../constants';
import { date, patientName } from '../../utils/helpers';
import InvestigationPicker from './InvestigationPicker';
import './TestBooking.css';

export default function TestBooking() {
  const {
    data,
    newReportPatientId,
    newReportDoctorId,
    setNewReportDoctorId,
    createReport,
    catalogue,
    testGroups,
    setBookingFee,
    setView,
  } = useApp();

  const selectedBookingPatient =
    data.patients.find((p) => p.id === newReportPatientId) ||
    (data.patients.length ? data.patients[0] : null);

  return (
    <>
      <header className="page-head">
        <div>
          <span className="eyebrow">TEST BOOKING</span>
        </div>
      </header>
      <form className="panel patient-form" onSubmit={createReport}>
        <fieldset>
          <legend>Patient and billing</legend>
          <div className="form-grid">
            <label className="wide">
              <span>Patient</span>
              <input
                type="hidden"
                name="patientId"
                value={selectedBookingPatient?.id || ''}
                required
              />
              <div className="test-booking-selected-patient-box">
                <div className="test-booking-patient-main">
                  <span className="test-booking-patient-name">
                    👤{' '}
                    <b>
                      {selectedBookingPatient
                        ? `${selectedBookingPatient.id} · ${patientName(
                            selectedBookingPatient
                          )}`
                        : 'No patient selected'}
                    </b>
                  </span>
                  <button
                    type="button"
                    className="secondary small"
                    onClick={() => setView('patients')}
                    title="Select a different patient from Registered Patients"
                  >
                    ⇄ Change patient from list
                  </button>
                </div>
                {selectedBookingPatient && (
                  <div
                    className="billing-patient-meta"
                    style={{ marginTop: '8px' }}
                  >
                    <span>
                      Patient ID: <b>{selectedBookingPatient.id}</b>
                    </span>
                    <span>
                      Name: <b>{patientName(selectedBookingPatient)}</b>
                    </span>
                    <span>
                      Age / Gender:{' '}
                      <b>
                        {selectedBookingPatient.age}{' '}
                        {selectedBookingPatient.ageUnit || 'Years'} /{' '}
                        {selectedBookingPatient.gender}
                      </b>
                    </span>
                    <span>
                      Mobile: <b>{selectedBookingPatient.mobile || '—'}</b>
                    </span>
                    <span>
                      Referred by:{' '}
                      <b>{selectedBookingPatient.reference || 'Self'}</b>
                    </span>
                  </div>
                )}
              </div>
            </label>
            <label>
              Referred by
              <select
                name="doctorId"
                value={
                  newReportDoctorId || selectedBookingPatient?.doctorId || ''
                }
                onChange={(event) => setNewReportDoctorId(event.target.value)}
              >
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
              <select
                name="sampleType"
                defaultValue={selectedBookingPatient?.sampleType || 'Blood'}
                key={selectedBookingPatient?.id}
              >
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
          </div>
        </fieldset>
        <InvestigationPicker
          key={`booking-picker-${selectedBookingPatient?.id || 'none'}-${
            testGroups.length
          }-${catalogue.length}`}
          catalogue={catalogue}
          testGroups={testGroups}
          booking
          onSelectionChange={(total) => setBookingFee(total)}
        />
        <button>Create draft report</button>
      </form>
    </>
  );
}
