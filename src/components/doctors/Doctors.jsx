import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  startOfDay,
  earningsForPeriod,
  dateFromRecord,
} from '../../utils/helpers';
import './Doctors.css';

export function DoctorRow({ doctor, reports, onSave }) {
  const [draft, setDraft] = useState(doctor);
  useEffect(() => setDraft(doctor), [doctor]);

  const update = (field, value) =>
    setDraft((current) => ({ ...current, [field]: value }));

  const isChanged = [
    'name',
    'specialty',
    'mobile',
    'address',
    'referralPercentage',
  ].some(
    (field) => String(draft[field] ?? '') !== String(doctor[field] ?? '')
  );

  const today = startOfDay(new Date());
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const formatEarnings = (value) => `₹${value.toFixed(2)}`;

  const todayEarnings = earningsForPeriod(
    reports.filter(
      (report) =>
        dateFromRecord(report.createdOn)?.getTime() === today.getTime()
    ),
    doctor.id,
    today
  );
  const weeklyEarnings = earningsForPeriod(reports, doctor.id, weekStart);
  const monthlyEarnings = earningsForPeriod(reports, doctor.id, monthStart);

  return (
    <tr>
      <td>
        <input
          aria-label={`Name for ${doctor.name}`}
          value={draft.name}
          onChange={(event) => update('name', event.target.value)}
          placeholder="Doctor or clinic name"
        />
        <small>{doctor.doctorCode} · Referring doctor</small>
      </td>
      <td>
        <input
          aria-label={`Specialty for ${doctor.name}`}
          value={draft.specialty}
          onChange={(event) => update('specialty', event.target.value)}
          placeholder="Specialty"
        />
      </td>
      <td>
        <input
          aria-label={`Mobile for ${doctor.name}`}
          value={draft.mobile}
          onChange={(event) => update('mobile', event.target.value)}
          inputMode="numeric"
          placeholder="Mobile number"
        />
      </td>
      <td>
        <input
          aria-label={`Clinic address for ${doctor.name}`}
          value={draft.address}
          onChange={(event) => update('address', event.target.value)}
          placeholder="Clinic / hospital address"
        />
      </td>
      <td>
        <label className="percentage-field">
          <input
            aria-label={`Referral percentage for ${doctor.name}`}
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={draft.referralPercentage}
            onChange={(event) =>
              update('referralPercentage', event.target.value)
            }
          />
          <span>%</span>
        </label>
      </td>
      <td className="earnings-cell">
        <b>{formatEarnings(todayEarnings)}</b>
        <small>Today</small>
      </td>
      <td className="earnings-cell">
        <b>{formatEarnings(weeklyEarnings)}</b>
        <small>This week</small>
      </td>
      <td className="earnings-cell">
        <b>{formatEarnings(monthlyEarnings)}</b>
        <small>This month</small>
      </td>
      <td>
        <button
          type="button"
          className="secondary percentage-save"
          disabled={!isChanged}
          onClick={() => onSave(doctor.id, draft)}
        >
          Save
        </button>
      </td>
    </tr>
  );
}

export default function Doctors({
  doctors: propDoctors,
  reports: propReports,
  onSave: propOnSave,
}) {
  const app = useApp();
  const doctors = propDoctors || app.data.doctors;
  const reports = propReports || app.data.reports;
  const onSave = propOnSave || app.updateDoctor;
  const addDoctor = app.addDoctor;

  return (
    <>
      <header className="page-head">
        <div>
          <span className="eyebrow">REFERRING DOCTORS</span>
        </div>
      </header>

      <form className="panel catalogue-form doctor-form" onSubmit={addDoctor}>
        <header>
          <div>
            <h2>Add referring doctor</h2>
            <p>
              Save the clinic contact and referral percentage for future
              reference.
            </p>
          </div>
        </header>
        <div className="form-grid doctor-add-grid">
          <label>
            Doctor name
            <input
              name="name"
              placeholder="e.g. Dr. A. Sharma"
              required
            />
          </label>
          <label>
            Specialty
            <input
              name="specialty"
              placeholder="e.g. General Medicine"
            />
          </label>
          <label>
            Mobile
            <input
              name="mobile"
              inputMode="numeric"
              placeholder="10-digit mobile number"
            />
          </label>
          <label>
            Referral percentage
            <input
              name="referralPercentage"
              type="number"
              min="0"
              max="100"
              step="0.01"
              defaultValue="0"
            />
            <small>0–100% of the agreed referral share</small>
          </label>
          <label className="wide">
            Clinic address
            <input
              name="address"
              placeholder="Clinic / hospital address"
            />
          </label>
        </div>
        <button>Save doctor</button>
      </form>

      <section className="panel doctor-directory">
        <header className="doctor-directory-head">
          <div>
            <h2>Saved referring doctors</h2>
            <p>
              Edit a name, specialty, mobile number, clinic address, or agreed
              referral percentage, then save the row.
            </p>
          </div>
          <span className="directory-count">{doctors.length} saved</span>
        </header>

        <div className="table-scroll">
          <table className="app-table doctors-table">
            <thead>
              <tr>
                <th>Doctor / organisation</th>
                <th>Specialty</th>
                <th>Mobile</th>
                <th>Clinic address</th>
                <th>Referral percentage</th>
                <th>Today</th>
                <th>This week</th>
                <th>This month</th>
                <th aria-label="Save doctor" />
              </tr>
            </thead>
            <tbody>
              {doctors.length ? (
                doctors.map((doctor) => (
                  <DoctorRow
                    key={doctor.id}
                    doctor={doctor}
                    reports={reports}
                    onSave={onSave}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="empty">
                    No referring doctors saved yet. Add a doctor above to see
                    them in this directory.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
