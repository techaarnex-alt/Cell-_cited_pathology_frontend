import React from 'react';
import { useApp } from '../../context/AppContext';
import ReportList from './ReportList';
import './Reports.css';

export default function Reports() {
  const { finalReports, data, openReport } = useApp();

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
        />
      </section>
    </>
  );
}
