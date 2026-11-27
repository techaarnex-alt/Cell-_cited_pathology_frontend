import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { patientName } from '../../utils/helpers';
import { LuSquarePen } from 'react-icons/lu';
import ReportList from '../reports/ReportList';
import EditPatientModal from './EditPatientModal';
import EditReportModal from '../reports/EditReportModal';
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

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);

  if (!recordPatient) return null;

  return (
    <div className="page-container patient-record-container">
      <header className="page-head">
        <div>
          <span className="eyebrow">PATIENT RECORD</span>
          <h1>{patientName(recordPatient)}</h1>
          <p>
            {recordPatient.id} ·{' '}
            {recordPatient.mobile || 'No mobile number recorded'}
          </p>
        </div>
        <div className="patient-record-actions">
          <button className="secondary" onClick={() => setView('patients')}>
            Back to patients
          </button>
          <button
            type="button"
            className="edit-patient-circle-btn"
            onClick={() => setIsEditOpen(true)}
            title="Edit patient details"
            aria-label="Edit patient details"
          >
            <LuSquarePen size={20} />
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
          onEdit={(report) => setEditingReport(report)}
          onResults={(report) => {
            setSelectedId(report.id);
            setView('results');
          }}
        />
      </section>

      {isEditOpen && (
        <EditPatientModal
          patient={recordPatient}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
        />
      )}

      {editingReport && (
        <EditReportModal
          report={editingReport}
          patient={recordPatient}
          isOpen={Boolean(editingReport)}
          onClose={() => setEditingReport(null)}
        />
      )}
    </div>
  );
}
