import React from 'react';
import { useApp } from '../../context/AppContext';
import ResultForm from './ResultForm';
import './ResultEntry.css';

export default function ResultEntry() {
  const { data, finalise } = useApp();

  const draftReports = data.reports.filter(
    (report) => report.status === 'Draft' || report.status === 'Pending'
  );

  return (
    <>
      <header className="page-head">
        <div>
          <span className="eyebrow">RESULT ENTRY</span>
        </div>
      </header>

      {draftReports.length ? (
        draftReports.map((report) => (
          <ResultForm
            key={report.id}
            report={report}
            patient={data.patients.find(
              (patient) => patient.id === report.patientId
            )}
            onFinalise={finalise}
          />
        ))
      ) : (
        <section className="panel empty">
          No draft reports waiting for results.
        </section>
      )}
    </>
  );
}
