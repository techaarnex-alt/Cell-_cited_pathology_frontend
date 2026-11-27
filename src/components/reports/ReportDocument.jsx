import React from 'react';
import { TEST_GROUPS as FALLBACK_TEST_GROUPS } from '../../constants';
import {
  testKey,
  categoryForTest,
  patientName,
  date,
  isOutsideReferenceRange,
  sortTestsByCatalogueOrder,
} from '../../utils/helpers';
import { DoctorSignature, LetterheadLogo } from '../common/Icons';
import './ReportDocument.css';

export default function ReportDocument({
  report,
  patient,
  testGroups = FALLBACK_TEST_GROUPS,
  labProfile = {},
  withoutLetterhead = false,
  pdfExport = false,
}) {
  if (!report || !patient) return null;

  const rawRows = report.tests || [];
  const groupsList =
    Array.isArray(testGroups) && testGroups.length
      ? testGroups
      : FALLBACK_TEST_GROUPS;

  // Preserve custom saved sequence if present; otherwise default to Catalogue order
  const effectiveRows = report.hasCustomItemOrder
    ? [...rawRows].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    : report.status !== 'Final'
    ? sortTestsByCatalogueOrder(rawRows, groupsList)
    : rawRows;

  const PAGE_SIZE = 10;
  const chunks = [];

  const getProfileForTest = (test) => {
    const cat = String(test.category || '').trim();
    if (cat && cat.toLowerCase() !== 'general') {
      return cat;
    }
    const matchedGroup = groupsList.find((g) =>
      (g.catalogTests || g.tests || []).some((t) => {
        const tName = typeof t === 'string' ? t : t?.name || t?.investigation || '';
        if (testKey(tName) === testKey(test.name)) return true;
        if (t?.parameters && Array.isArray(t.parameters)) {
          return t.parameters.some((p) => testKey(p.name) === testKey(test.name));
        }
        return false;
      })
    );
    if (matchedGroup) {
      return matchedGroup.name;
    }
    const fallbackCategory = categoryForTest(test.name, groupsList);
    if (fallbackCategory && fallbackCategory.toLowerCase() !== 'general') {
      return fallbackCategory;
    }
    return 'Clinical Pathology';
  };

  // Group consecutive rows sharing the same department so the saved row sequence is strictly preserved
  const consecutiveSections = [];
  effectiveRows.forEach((test) => {
    const dept = getProfileForTest(test);
    const lastSection = consecutiveSections[consecutiveSections.length - 1];
    if (lastSection && lastSection.department === dept) {
      lastSection.tests.push(test);
    } else {
      consecutiveSections.push({
        department: dept,
        tests: [test],
      });
    }
  });

  consecutiveSections.forEach((section) => {
    const { department, tests } = section;
    if (!tests.length) return;

    for (let i = 0; i < tests.length; i += PAGE_SIZE) {
      chunks.push({
        rows: tests.slice(i, i + PAGE_SIZE),
        department: i > 0 ? `${department} (Continued)` : department,
        isProfileEnd: i + PAGE_SIZE >= tests.length,
      });
    }
  });

  if (!chunks.length) {
    chunks.push({
      rows: [],
      department: 'Clinical Pathology',
      isProfileEnd: true,
    });
  }

  const labPhones =
    labProfile.phones && labProfile.phones.length
      ? labProfile.phones.join(' · ')
      : '9554448906 · 6307342505 · 8601463398';
  const labEmail = labProfile.email || 'ccpath11@gmail.com';
  const labAddress =
    labProfile.address ||
    'Shop No. 17, City Trade Centre, Lakhperabagh Chauraha, Barabanki - 225001';
  const labSignatory =
    labProfile.authorisedSignatory || 'Dr. Sanjay Singh, MBBS, MD Pathologist';

  return (
    <div
      className={`report-stack ${
        withoutLetterhead ? 'without-letterhead' : ''
      } ${pdfExport ? 'pdf-export' : ''}`}
    >
      {chunks.map((chunk, index) => {
        const first = index === 0;
        const last = index === chunks.length - 1;
        return (
          <article
            key={index}
            className={`report-paper ${
              first ? 'first-page' : 'continuation-page'
            }`}
          >
            <div className="report-art" aria-hidden="true">
              <img
                className="report-letterhead-image"
                src={`${import.meta.env.BASE_URL}report-letterhead.jpg`}
                alt=""
              />
              <div className="report-letterhead-clear-area" />
            </div>
            <div className="report-watermark" aria-hidden="true" />
            <div className="report-content">
              {first ? (
                <>
                  <header className="report-letterhead">
                    <div className="report-letterhead-brand">
                      <LetterheadLogo />
                      <span>
                        <b>Cell Cited</b>
                        <strong>
                          Pathology Lab <em>(CCPL)</em>
                        </strong>
                      </span>
                    </div>
                    <div className="report-letterhead-contact">
                      <b>
                        Pathology <i>•</i> Health Care
                      </b>
                      <span>{labPhones}</span>
                      <small>{labEmail}</small>
                    </div>
                    <p>{labAddress}</p>
                  </header>
                  <section className="patient-card">
                    <div>
                      <p>
                        <b>Patient ID :</b>
                        <span>{patient.id}</span>
                      </p>
                      <p>
                        <b>Patient Name :</b>
                        <span>{patientName(patient)}</span>
                      </p>
                      <p>
                        <b>Age / Gender :</b>
                        <span>
                          {patient.age} {patient.ageUnit || 'Years'} /{' '}
                          {patient.gender.toUpperCase()}
                        </span>
                      </p>
                      <p>
                        <b>Referred By :</b>
                        <span>{patient.reference || 'Self'}</span>
                      </p>
                      <p>
                        <b>Sample Type :</b>
                        <span>
                          {report.sampleType || patient?.sampleType || 'Blood'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p>
                        <b>Report No. :</b>
                        <span>{report.number}</span>
                      </p>
                      <p>
                        <b>Registered On :</b>
                        <span>
                          {report.registeredOn ||
                            report.createdOn ||
                            date()}
                        </span>
                      </p>
                      <p>
                        <b>Collected On :</b>
                        <span>
                          {report.collectedOn ||
                            report.createdOn ||
                            date()}
                        </span>
                      </p>
                      <p>
                        <b>Reported On :</b>
                        <span>{report.reportedOn || date()}</span>
                      </p>
                    </div>
                  </section>
                  <div className="report-title">
                    <span>Laboratory Examination Report</span>
                    <small>Verified laboratory result</small>
                  </div>
                </>
              ) : (
                <div className="continuation-title">
                  <b>Report No. : {report.number}</b>
                  <span>Continued</span>
                </div>
              )}
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Test Description</th>
                    <th>
                      Observe
                      <br />
                      Value
                    </th>
                    <th>Units</th>
                    <th>Biological Reference Range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="department">
                    <td colSpan="4">{chunk.department}</td>
                  </tr>
                  {chunk.rows.map((test) => {
                    const isOutOfRange = isOutsideReferenceRange(test);
                    return (
                      <tr
                        key={test.name}
                        className={isOutOfRange ? 'out-of-range' : ''}
                      >
                        <td>
                          <b>{test.name.toUpperCase()}</b>
                          <small>Method / As per laboratory protocol</small>
                        </td>
                        <td>
                          <b>{test.value || '—'}</b>
                        </td>
                        <td>{test.unit}</td>
                        <td>{test.range}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {(chunk.isProfileEnd || last) && (
                <div className="report-end">End of Report</div>
              )}
              <footer className="signature">
                <span className="signature-image">
                  <DoctorSignature />
                </span>
                <b>Pathologist</b>
                <strong>{labSignatory}</strong>
                <small>Computer-generated report · Authorised signatory</small>
              </footer>
            </div>
            <div className="report-page-number">
              Page {index + 1} of {chunks.length}
            </div>
          </article>
        );
      })}
    </div>
  );
}
