import React from 'react';
import { useApp } from '../../context/AppContext';
import { printDocument } from '../../utils/helpers';
import InvoiceDocument from './InvoiceDocument';

export default function InvoicePreview() {
  const { invoiceReport, invoicePatient, labProfile, setView } = useApp();

  if (!invoiceReport) {
    return (
      <div className="panel empty" style={{ margin: '20px auto', maxWidth: '600px', textAlign: 'center' }}>
        <p>No invoice selected.</p>
        <button onClick={() => setView('billing')}>Back to billing</button>
      </div>
    );
  }

  return (
    <div className="page-container preview-container">
      <header className="page-head preview-head">
        <div>
          <span className="eyebrow">INVOICE</span>
          <h1>{invoiceReport.number}</h1>
        </div>
        <div>
          <button className="secondary" onClick={() => setView('billing')}>
            Back to billing
          </button>
          <button
            onClick={() =>
              printDocument(`CCPL-Invoice-${invoiceReport.number}`)
            }
          >
            Print / Save PDF
          </button>
        </div>
      </header>

      <InvoiceDocument
        report={invoiceReport}
        patient={invoicePatient}
        labProfile={labProfile}
      />
    </div>
  );
}
