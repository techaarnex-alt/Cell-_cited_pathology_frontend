import React from 'react';
import { patientName, date } from '../../utils/helpers';

export default function ResultForm({ report, patient, onFinalise }) {
  return (
    <form
      className="panel result-form"
      onSubmit={(event) => onFinalise(report, event)}
    >
      <header>
        <div>
          <h2>
            {report.number} · {patientName(patient)}
          </h2>
          <p>{report.tests.map((test) => test.name).join(', ')}</p>
        </div>
        <span className="status draft">Draft</span>
      </header>
      <div className="table-scroll">
        <table className="app-table result-table">
          <thead>
            <tr>
              <th>Investigation</th>
              <th>Observed result</th>
              <th>Unit</th>
              <th>Reference range</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {report.tests.map((test) => (
              <tr key={test.name}>
                <td>
                  <b>{test.name}</b>
                </td>
                <td>
                  <input
                    name={test.name}
                    defaultValue={test.value}
                    placeholder="Enter result"
                    required
                  />
                </td>
                <td>
                  <input
                    name={`${test.name}-unit`}
                    defaultValue={test.unit}
                    placeholder="Unit"
                    disabled
                    title="Unit is configured in test catalogue"
                  />
                </td>
                <td>
                  <input
                    name={`${test.name}-range`}
                    defaultValue={test.range}
                    placeholder="Reference range"
                    disabled
                    title="Reference range is configured in test catalogue"
                  />
                </td>
                <td>
                  <input
                    name={`${test.name}-remark`}
                    defaultValue={test.remark}
                    placeholder="Optional remark"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              fontWeight: 750,
              color: '#334b72',
            }}
          >
            Reported on:{' '}
            <input
              name="reportedOn"
              defaultValue={report.reportedOn || date()}
              style={{
                width: '110px',
                padding: '6px 8px',
                borderRadius: '6px',
                border: '1px solid #c7d3e8',
              }}
            />
          </label>
          <p style={{ margin: 0 }}>
            Verify observations, units, reference ranges and remarks before
            finalising.
          </p>
        </div>
        <button>Finalise report</button>
      </footer>
    </form>
  );
}
