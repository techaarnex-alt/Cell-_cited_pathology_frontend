import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import ReportList from './ReportList';
import EditReportModal from './EditReportModal';
import './Reports.css';

export default function Reports() {
  const { finalReports, data, openReport } = useApp();
  const [editingReport, setEditingReport] = useState(null);

  const editingPatient = editingReport
    ? data.patients.find(
        (p) => p.id === editingReport.patientId || p.backendId === editingReport.patientId
      )
    : null;

  return (
    <>
      <header className="page-head">
        <div>
          <span className="eyebrow">REPORTS</span>
        </div>
      </header>
      <section className="panel reports-panel">
        <ReportList
          reports={finalReports}
          patients={data.patients}
          onOpen={openReport}
          onEdit={(report) => setEditingReport(report)}
        />
      </section>

      {editingReport && (
        <EditReportModal
          report={editingReport}
          patient={editingPatient}
          isOpen={Boolean(editingReport)}
          onClose={() => setEditingReport(null)}
        />
      )}
    </>
  );
}
