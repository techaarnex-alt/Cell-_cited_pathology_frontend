import React from 'react';
import { patientName } from '../../utils/helpers';

export default function ReportList({ reports, patients, onOpen, onResults }) {
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
            <th />
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
                    {report.tests.map((test) => test.name).join(', ')}
                  </td>
                  <td>{report.createdOn}</td>
                  <td>
                    <span className={`status ${report.status.toLowerCase()}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>
                    {report.status === 'Final' ? (
                      <button
                        className="secondary small"
                        onClick={() => onOpen(report)}
                      >
                        Preview
                      </button>
                    ) : (
                      <button
                        className="secondary small"
                        onClick={() => onResults?.(report)}
                      >
                        Enter results
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
