import React from 'react';
import { useApp } from '../../context/AppContext';
import './BusinessReport.css';

export default function BusinessReport({ reports: propReports }) {
  const app = useApp();
  const reports = propReports || app.data.reports;

  const billed = reports.reduce(
    (sum, report) =>
      sum + (Number(report.fee || 0) - Number(report.discount || 0)),
    0
  );
  const received = reports.reduce(
    (sum, report) => sum + Number(report.paid || 0),
    0
  );
  const balance = billed - received;

  return (
    <>
      <header className="page-head">
        <div>
          <span className="eyebrow">BUSINESS SUMMARY</span>
        </div>
      </header>

      <section className="metrics business-metrics">
        <article>
          <b>₹{billed.toFixed(2)}</b>
          <span>Total billed</span>
        </article>
        <article>
          <b>₹{received.toFixed(2)}</b>
          <span>Collected</span>
        </article>
        <article>
          <b>₹{balance.toFixed(2)}</b>
          <span>Outstanding balance</span>
        </article>
      </section>

      <section className="panel">
        <h2>Report activity</h2>
        <p className="summary-copy">
          {reports.length} report{reports.length === 1 ? '' : 's'} recorded.
          Payment collection is updated from the Billing section.
        </p>
      </section>
    </>
  );
}
