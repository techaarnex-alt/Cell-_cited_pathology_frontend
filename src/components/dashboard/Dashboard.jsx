import React from 'react';
import { useApp } from '../../context/AppContext';
import { patientName } from '../../utils/helpers';
import './Dashboard.css';

export default function Dashboard() {
  const {
    totalPatients,
    todayPatients,
    todayBookings,
    pendingReports,
    todayRelease,
    data,
    latestReport,
    latestPatient,
    setView,
  } = useApp();

  return (
    <>
      <header className="page-head">
        <div>
          <span className="eyebrow">OPERATIONS / OVERVIEW</span>
        </div>
        <button onClick={() => setView('patients')}>+ New patient</button>
      </header>

      <section className="metrics dashboard-metrics">
        <article
          onClick={() => setView('patients')}
          style={{ cursor: 'pointer' }}
          title="View all patients"
        >
          <span className="metric-label">Total patients</span>
          <b className="metric-number">{totalPatients}</b>
          <span className="metric-sub">Open patient records</span>
        </article>
        <article
          onClick={() => setView('patients')}
          style={{ cursor: 'pointer' }}
          title="View today's patients"
        >
          <span className="metric-label">Today's patients</span>
          <b className="metric-number">{todayPatients}</b>
          <span className="metric-sub">Registered today</span>
        </article>
        <article
          onClick={() => setView('newreport')}
          style={{ cursor: 'pointer' }}
          title="View today's bookings"
        >
          <span className="metric-label">Today's bookings</span>
          <b className="metric-number">{todayBookings}</b>
          <span className="metric-sub">Tests booked today</span>
        </article>
        <article
          onClick={() => setView('results')}
          style={{ cursor: 'pointer' }}
          title="View and enter results for pending reports"
        >
          <span className="metric-label">Pending reports</span>
          <b className="metric-number">{pendingReports}</b>
          <span className="metric-sub">Awaiting result entry</span>
        </article>
        <article
          onClick={() => setView('reports')}
          style={{ cursor: 'pointer' }}
          title="View final reports released today"
        >
          <span className="metric-label">Today's release</span>
          <b className="metric-number">{todayRelease}</b>
          <span className="metric-sub">Final reports released</span>
        </article>
      </section>

      <div className="dashboard-split-grid">
        {/* Left Column: Quick Actions */}
        <section className="panel quick-actions-panel">
          <span className="eyebrow">QUICK ACTIONS</span>
          <h2>Open a workspace</h2>
          <div className="quick-actions-grid">
            <div
              className="action-card"
              onClick={() => setView('patients')}
              role="button"
              tabIndex={0}
              title="Open Patients & Registration"
            >
              <div className="action-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
              </div>
              <div className="action-content">
                <b>Patients &amp; Registration</b>
                <p>Register or update patient details</p>
              </div>
              <span className="action-chevron">›</span>
            </div>

            <div
              className="action-card"
              onClick={() => setView('newreport')}
              role="button"
              tabIndex={0}
              title="Open Test Booking"
            >
              <div className="action-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 3v6l-4 7.1A3.2 3.2 0 0 0 7.8 21h8.4a3.2 3.2 0 0 0 2.8-4.9L15 9V3" />
                  <path d="M8 3h8M8.5 16h7" />
                </svg>
              </div>
              <div className="action-content">
                <b>Test booking</b>
                <p>Book laboratory investigations</p>
              </div>
              <span className="action-chevron">›</span>
            </div>

            <div
              className="action-card"
              onClick={() => setView('results')}
              role="button"
              tabIndex={0}
              title="Open Result Entry"
            >
              <div className="action-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="action-content">
                <b>Result entry</b>
                <p>Enter and finalise results</p>
              </div>
              <span className="action-chevron">›</span>
            </div>

            <div
              className="action-card"
              onClick={() => setView('reports')}
              role="button"
              tabIndex={0}
              title="View Reports"
            >
              <div className="action-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <div className="action-content">
                <b>View reports</b>
                <p>Review, print, or edit reports</p>
              </div>
              <span className="action-chevron">›</span>
            </div>
          </div>
        </section>

        {/* Right Column: Report Activity */}
        <section className="panel report-activity-panel">
          <span className="eyebrow">REPORT ACTIVITY</span>
          <h2>Today's report status</h2>
          <div className="report-activity-list">
            <div
              className="activity-item"
              onClick={() => setView('newreport')}
              role="button"
              tabIndex={0}
              title="View today's bookings"
            >
              <span className="activity-dot dot-blue">●</span>
              <div className="activity-content">
                <b>Today's booking</b>
                <p>New investigation requests</p>
              </div>
              <div className="activity-meta">
                <span className="activity-count">{todayBookings}</span>
                <span className="activity-arrow">›</span>
              </div>
            </div>

            <div
              className="activity-item"
              onClick={() => setView('reports')}
              role="button"
              tabIndex={0}
              title="View recent reports"
            >
              <span className="activity-dot dot-green">●</span>
              <div className="activity-content">
                <b>Recent reports</b>
                <p>
                  {latestReport
                    ? `Latest: ${latestReport.number} · ${
                        patientName(latestPatient) || 'Patient'
                      }`
                    : 'No recent reports created yet'}
                </p>
              </div>
              <div className="activity-meta">
                <span className="activity-count">{data.reports.length}</span>
                <span className="activity-arrow">›</span>
              </div>
            </div>

            <div
              className="activity-item"
              onClick={() => setView('results')}
              role="button"
              tabIndex={0}
              title="View pending reports"
            >
              <span className="activity-dot dot-amber">●</span>
              <div className="activity-content">
                <b>Pending reports</b>
                <p>Reports awaiting result entry</p>
              </div>
              <div className="activity-meta">
                <span className="activity-count">{pendingReports}</span>
                <span className="activity-arrow">›</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
