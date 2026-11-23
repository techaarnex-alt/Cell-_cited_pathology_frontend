import React from 'react';
import { useApp } from '../../context/AppContext';
import { patientName } from '../../utils/helpers';
import ReportList from '../reports/ReportList';
import './PatientRecord.css';

export default function PatientRecord() {
  const {
    recordPatient,
    data,
    setView,
    setNewReportPatientId,
    openReport,
    setSelectedId,
  } = useApp();

  if (!recordPatient) return null;

  return (
    <>
      <header className="page-head">
        <div>
          <span className="eyebrow">PATIENT RECORD</span>
          <h1>{patientName(recordPatient)}</h1>
          <p>
            {recordPatient.id} ·{' '}
            {recordPatient.mobile || 'No mobile number recorded'}
          </p>
        </div>
        <div>
          <button className="secondary" onClick={() => setView('patients')}>
            Back to patients
          </button>
          <button
            onClick={() => {
              setNewReportPatientId(recordPatient.id);
              setView('newreport');
            }}
          >
            + Test booking
          </button>
        </div>
      </header>

      <section className="panel patient-record">
        <div>
          <span>Patient ID</span>
          <b>{recordPatient.id}</b>
        </div>
        <div>
          <span>Age / gender</span>
          <b>
            {recordPatient.age} {recordPatient.ageUnit || 'Years'} /{' '}
            {recordPatient.gender}
          </b>
        </div>
        <div>
          <span>Mobile</span>
          <b>{recordPatient.mobile || '—'}</b>
        </div>
        <div>
          <span>Sample type</span>
          <b>{recordPatient.sampleType || 'Blood'}</b>
        </div>
        <div>
          <span>Registered on</span>
          <b>{recordPatient.registeredOn || '—'}</b>
        </div>
        <div>
          <span>Referred by</span>
          <b>{recordPatient.reference || 'Self'}</b>
        </div>
        <div>
          <span>Address</span>
          <b>{recordPatient.address || '—'}</b>
        </div>
      </section>

      <section className="panel">
        <h2>Report history</h2>
        <ReportList
          reports={data.reports.filter(
            (report) => report.patientId === recordPatient.id
          )}
          patients={data.patients}
          onOpen={openReport}
          onResults={(report) => {
            setSelectedId(report.id);
            setView('results');
          }}
        />
      </section>
    </>
  );
}
