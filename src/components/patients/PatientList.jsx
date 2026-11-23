import React, { useState, useMemo, useEffect } from 'react';
import { patientName } from '../../utils/helpers';

export default function PatientList({
  patients,
  reports,
  search = '',
  onOpen,
  onNewReport,
  onClearSearch,
}) {
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const query = search.trim().toLowerCase();

  useEffect(() => {
    setPage(1);
  }, [query]);

  const filteredPatients = useMemo(() => {
    if (!query) return patients;
    const tokens = query.split(/\s+/).filter(Boolean);
    return patients.filter((patient) => {
      const pName = patientName(patient) || patient.name || '';
      const pId = patient.id || patient.patientNumber || '';
      const pMobile = patient.mobile || '';
      const pRef =
        patient.reference ||
        patient.doctorNameSnapshot ||
        (typeof patient.doctorId === 'object' ? patient.doctorId?.name : '') ||
        '';
      const pAddress = patient.address || '';
      const combined = `${pId} ${pName} ${pMobile} ${pRef} ${pAddress}`.toLowerCase();
      return tokens.every((token) => combined.includes(token));
    });
  }, [patients, query]);

  const totalItems = filteredPatients.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);
  const visiblePatients = filteredPatients.slice(startIndex, endIndex);

  return (
    <>
      <div className="table-scroll">
        <table className="app-table patient-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Age / gender</th>
              <th>Mobile</th>
              <th>Referred by</th>
              <th>Selected tests</th>
              {(onOpen || onNewReport) && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {visiblePatients.length ? (
              visiblePatients.map((patient) => {
                const patientReports = reports.filter(
                  (report) => report.patientId === patient.id
                );
                const latestReport = patientReports[0];
                return (
                  <tr key={patient.id}>
                    <td>
                      <b>{patient.id}</b>
                    </td>
                    <td>{patientName(patient)}</td>
                    <td>
                      {patient.age} {patient.ageUnit || 'Years'} / {patient.gender}
                    </td>
                    <td>{patient.mobile || '—'}</td>
                    <td>
                      {patient.reference ||
                        (typeof patient.doctorId === 'object'
                          ? patient.doctorId?.name
                          : '') ||
                        'Self'}
                    </td>
                    <td>
                      {latestReport?.tests?.length
                        ? `${latestReport.tests.length} test${
                            latestReport.tests.length === 1 ? '' : 's'
                          } selected`
                        : 'No tests selected'}
                    </td>
                    {(onOpen || onNewReport) && (
                      <td className="patient-actions">
                        {onOpen && (
                          <button
                            type="button"
                            className="secondary small"
                            onClick={() => onOpen(patient)}
                          >
                            Open record
                          </button>
                        )}
                        {onNewReport && (
                          <button
                            type="button"
                            className="small"
                            onClick={() => onNewReport(patient)}
                          >
                            Test booking
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={onOpen || onNewReport ? 7 : 6}
                  className="empty"
                  style={{ padding: '28px', textAlign: 'center' }}
                >
                  {query ? (
                    <div>
                      <p
                        style={{
                          margin: '0 0 10px',
                          color: '#64748b',
                          fontSize: '13.5px',
                        }}
                      >
                        No patients matching <b>"{search}"</b>
                      </p>
                      {onClearSearch && (
                        <button
                          type="button"
                          className="secondary small"
                          onClick={onClearSearch}
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  ) : (
                    'No patients registered yet.'
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalItems > 0 && (
        <div className="table-pagination-bar">
          <div className="table-pagination-info">
            <span>
              Showing <b>{startIndex + 1}–{endIndex}</b> of <b>{totalItems}</b>{' '}
              patients
              {query && ` (filtered from ${patients.length} total)`}
            </span>
          </div>

          <div className="table-pagination-controls">
            <button
              type="button"
              className="table-page-btn"
              disabled={currentPage <= 1}
              onClick={() => setPage(1)}
              title="First page"
            >
              «
            </button>
            <button
              type="button"
              className="table-page-btn"
              disabled={currentPage <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              title="Previous page"
            >
              ‹ Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              if (totalPages > 7) {
                if (
                  p !== 1 &&
                  p !== totalPages &&
                  Math.abs(p - currentPage) > 2
                ) {
                  if (p === 2 || p === totalPages - 1) {
                    return (
                      <span
                        key={p}
                        style={{ padding: '0 4px', color: '#94a3b8' }}
                      >
                        …
                      </span>
                    );
                  }
                  return null;
                }
              }
              return (
                <button
                  key={p}
                  type="button"
                  className={`table-page-btn ${
                    p === currentPage ? 'active' : ''
                  }`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              );
            })}

            <button
              type="button"
              className="table-page-btn"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setPage((prev) => Math.min(totalPages, prev + 1))
              }
              title="Next page"
            >
              Next ›
            </button>
            <button
              type="button"
              className="table-page-btn"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(totalPages)}
              title="Last page"
            >
              »
            </button>
          </div>
        </div>
      )}
    </>
  );
}
