import React from 'react';
import { TEST_GROUPS as FALLBACK_TEST_GROUPS } from '../../constants';
import {
  testKey,
  categoryForTest,
  patientName,
  date,
  isOutsideReferenceRange,
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

  const rows = report.tests || [];
  const groupsList =
    Array.isArray(testGroups) && testGroups.length
      ? testGroups
      : FALLBACK_TEST_GROUPS;
  const PAGE_SIZE = 10;
  const chunks = [];

  const getProfileForTest = (test) => {
    const matchedGroup = groupsList.find((g) =>
      (g.tests || []).some((tName) => testKey(tName) === testKey(test.name))
    );
    if (matchedGroup) {
      return matchedGroup.name;
    }
    const cat = String(test.category || '').trim();
    if (cat && cat.toLowerCase() !== 'general') {
      return cat;
    }
    const fallbackCategory = categoryForTest(test.name, groupsList);
    if (fallbackCategory && fallbackCategory.toLowerCase() !== 'general') {
      return fallbackCategory;
    }
    return 'Clinical Pathology';
  };

  const profileMap = new Map();
  rows.forEach((test) => {
    const profileName = getProfileForTest(test);
    if (!profileMap.has(profileName)) {
      profileMap.set(profileName, []);
    }
    profileMap.get(profileName).push(test);
  });

  const orderedProfiles = [];
  (report.testGroups || []).forEach((groupName) => {
    const g = groupsList.find(
      (item) => item.name === groupName || item.id === groupName
    );
    const resolved = g ? g.name : groupName;
    if (profileMap.has(resolved) && !orderedProfiles.includes(resolved)) {
      orderedProfiles.push(resolved);
    }
  });
  groupsList.forEach((g) => {
    if (profileMap.has(g.name) && !orderedProfiles.includes(g.name)) {
      orderedProfiles.push(g.name);
    }
  });
  profileMap.forEach((_, name) => {
    if (!orderedProfiles.includes(name)) {
      orderedProfiles.push(name);
    }
  });

  orderedProfiles.forEach((profileName) => {
    const tests = profileMap.get(profileName) || [];
    if (!tests.length) return;

    for (let i = 0; i < tests.length; i += PAGE_SIZE) {
      chunks.push({
        rows: tests.slice(i, i + PAGE_SIZE),
        department: i > 0 ? `${profileName} (Continued)` : profileName,
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
