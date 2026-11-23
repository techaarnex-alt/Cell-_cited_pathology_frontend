import React from 'react';
import { useApp } from '../../context/AppContext';
import ReportDocument from './ReportDocument';

export default function ReportPreview() {
  const {
    selected,
    selectedPatient,
    labProfile,
    testGroups,
    reportPrintMode,
    reportPrintOption,
    setReportPrintOption,
    setReportPrintMode,
    reportPdfMode,
    isGeneratingReportPdf,
    shareReportPdf,
    setView,
  } = useApp();

  if (!selected || !selectedPatient) {
    return (
      <div className="panel empty" style={{ margin: '20px auto', maxWidth: '600px', textAlign: 'center' }}>
        <p>No report selected for preview.</p>
        <button onClick={() => setView('reports')}>Back to reports</button>
      </div>
    );
  }

  return (
    <>
      <header className="page-head preview-head">
        <div>
          <span className="eyebrow">REPORT PREVIEW</span>
          <h1>{selected.number}</h1>
          <p>Choose a report print format.</p>
        </div>
        <div>
          <button className="secondary" onClick={() => setView('reports')}>
            Back to reports
          </button>
          <div className="report-print-control">
            <select
              aria-label="Letterhead print option"
              value={reportPrintOption}
              onChange={(event) => setReportPrintOption(event.target.value)}
            >
              <option value="with">With letterhead</option>
              <option value="without">Without letterhead</option>
            </select>
            <button onClick={() => setReportPrintMode(reportPrintOption)}>
              Print report
            </button>
            <button
              className="secondary"
              type="button"
              disabled={isGeneratingReportPdf}
              onClick={shareReportPdf}
            >
              {isGeneratingReportPdf ? 'Generating PDF…' : 'Share PDF'}
            </button>
          </div>
        </div>
      </header>

      <ReportDocument
        report={selected}
        patient={selectedPatient}
        labProfile={labProfile}
        testGroups={testGroups}
        withoutLetterhead={
          reportPrintMode === 'without' || reportPdfMode === 'without'
        }
        pdfExport={reportPdfMode !== null}
      />
    </>
  );
}
