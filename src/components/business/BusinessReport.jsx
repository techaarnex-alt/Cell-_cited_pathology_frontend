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
    <div className="page-container business-container">
      <header className="page-head">
        <div>
          <span className="eyebrow">BUSINESS SUMMARY</span>
        </div>
      </header>

      <section className="metrics business-metrics">
        <article className="business-metric-card billed">
          <span className="business-metric-label">Total billed</span>
          <b className="business-metric-value">₹{billed.toFixed(2)}</b>
          <span className="business-metric-sub">Gross billed amount</span>
        </article>
        <article className="business-metric-card collected">
          <span className="business-metric-label">Collected</span>
          <b className="business-metric-value">₹{received.toFixed(2)}</b>
          <span className="business-metric-sub">Payment received</span>
        </article>
        <article className="business-metric-card balance">
          <span className="business-metric-label">Outstanding balance</span>
          <b className="business-metric-value">₹{balance.toFixed(2)}</b>
          <span className="business-metric-sub">Pending collection</span>
        </article>
      </section>

      <section className="panel business-summary-card">
        <header className="business-card-header">
          <div>
            <h2>Report &amp; Revenue activity</h2>
            <p className="summary-copy">
              {reports.length} report{reports.length === 1 ? '' : 's'} recorded.
              Payment collection is updated live from the Billing section.
            </p>
          </div>
          <span className="business-count-pill">{reports.length} Reports</span>
        </header>

        <div className="business-overview-stats">
          <div className="business-stat-row">
            <span>Collection Efficiency</span>
            <b>{billed > 0 ? `${((received / billed) * 100).toFixed(1)}%` : '100%'}</b>
          </div>
          <div className="business-stat-row">
            <span>Average Bill Value</span>
            <b>₹{reports.length > 0 ? (billed / reports.length).toFixed(2) : '0.00'}</b>
          </div>
          <div className="business-stat-row">
            <span>Pending Clearance</span>
            <b style={{ color: balance > 0 ? '#ea580c' : '#16a34a' }}>
              {balance > 0 ? `₹${balance.toFixed(2)}` : 'All Cleared ✓'}
            </b>
          </div>
        </div>
      </section>
    </div>
  );
}
