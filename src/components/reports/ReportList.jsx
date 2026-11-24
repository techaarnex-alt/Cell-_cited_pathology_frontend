import React from 'react';
import { patientName } from '../../utils/helpers';
import { LuSquarePen } from 'react-icons/lu';

function formatInvestigations(tests = []) {
  const names = (tests || [])
    .map((test) => (typeof test === 'object' ? test.name : test))
    .filter(Boolean);
  if (names.length <= 2) {
    return names.join(', ');
  }
  return `${names.slice(0, 2).join(', ')}, .....`;
}

function allInvestigations(tests = []) {
  return (tests || [])
    .map((test) => (typeof test === 'object' ? test.name : test))
    .filter(Boolean)
    .join(', ');
}

export default function ReportList({ reports, patients, onOpen, onResults, onEdit }) {
  return (
    <div className="table-scroll">
      <table className="app-table">
        <thead>
          <tr>
            <th>Report no.</th>
            <th>Patient</th>
            <th>Investigations</th>
            <th>Created</th>
            <th>Status</th>
            <th style={{ textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.length ? (
            reports.map((report) => {
              const patient = patients.find(
                (item) => item.id === report.patientId
              );
              return (
                <tr key={report.id}>
                  <td>
                    <b>{report.number}</b>
                  </td>
                  <td>{patientName(patient) || 'Patient unavailable'}</td>
                  <td>
                    {report.testGroups?.length ? (
                      <small className="group-summary">
                        Groups: {report.testGroups.join(' · ')}
                      </small>
                    ) : null}
                    <span
                      title={allInvestigations(report.tests)}
                      style={{
                        cursor: (report.tests?.length || 0) > 2 ? 'help' : 'inherit',
                      }}
                    >
                      {formatInvestigations(report.tests)}
                    </span>
                  </td>
                  <td>{report.createdOn}</td>
                  <td>
                    <span className={`status ${report.status.toLowerCase()}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="report-actions-cell">
                    {report.status === 'Final' ? (
                      <button
                        type="button"
                        className="secondary small"
                        onClick={() => onOpen(report)}
                        title="Preview report"
                      >
                        Preview
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="secondary small"
                        onClick={() => onResults?.(report)}
                        title="Enter results"
                      >
                        Enter results
                      </button>
                    )}
                    {onEdit && (
                      <button
                        type="button"
                        className="secondary small report-edit-btn"
                        onClick={() => onEdit(report)}
                        title="Edit report details & observed results"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                      >
                        <LuSquarePen size={13} />
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="empty">
                No reports created yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
