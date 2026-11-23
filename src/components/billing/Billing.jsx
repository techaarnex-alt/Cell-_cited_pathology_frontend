import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { patientName } from '../../utils/helpers';
import './Billing.css';

export default function Billing({
  reports: propReports,
  patients: propPatients,
  onCollect: propOnCollect,
  onInvoice: propOnInvoice,
}) {
  const app = useApp();
  const reports = propReports || app.data.reports;
  const patients = propPatients || app.data.patients;
  const onCollect = propOnCollect || app.collectPayment;
  const onInvoice = propOnInvoice || app.openInvoice;

  const [selectedReportId, setSelectedReportId] = useState(() => {
    if (!reports.length) return '';
    const pending = reports.find((r) => {
      const f = Number(r.fee || 0);
      const d = Number(r.discount || 0);
      const p = Number(r.paid || 0);
      return Math.max(0, f - d - p) > 0;
    });
    return pending ? pending.id : reports[0].id;
  });

  const [patientFilter, setPatientFilter] = useState('');
  const [justCollectedId, setJustCollectedId] = useState(null);

  const activeReport =
    reports.find((r) => r.id === selectedReportId) ||
    (reports.length ? reports[0] : null);
  const activePatient = activeReport
    ? patients.find((p) => p.id === activeReport.patientId)
    : null;

  const reportFee = Number(activeReport?.fee || 0);
  const reportDisc = Number(activeReport?.discount || 0);
  const prevPaid = Number(activeReport?.paid || 0);
  const reportPaid = prevPaid;
  const netTotal = Math.max(0, reportFee - reportDisc);
  const currentDue = Math.max(0, netTotal - prevPaid);

  const isCollected = Boolean(
    activeReport &&
      ((activeReport.id === justCollectedId && currentDue === 0) ||
        (activeReport.isCollected && currentDue === 0) ||
        (prevPaid > 0 && currentDue === 0))
  );

  const [total, setTotal] = useState(() =>
    activeReport ? Number(activeReport.fee || 0).toFixed(2) : '0.00'
  );
  const [discount, setDiscount] = useState(() =>
    activeReport ? Number(activeReport.discount || 0).toFixed(2) : '0.00'
  );
  const [collectingNow, setCollectingNow] = useState(() => {
    if (!activeReport) return '0.00';
    const fee = Number(activeReport.fee || 0);
    const disc = Number(activeReport.discount || 0);
    const pPaid = Number(activeReport.paid || 0);
    const due = Math.max(0, fee - disc - pPaid);
    if (due > 0) return due.toFixed(2);
    if (pPaid === 0) return Math.max(0, fee - disc).toFixed(2);
    return '0.00';
  });
  const [paymentMode, setPaymentMode] = useState(
    () => activeReport?.paymentMethod || 'Cash'
  );

  useEffect(() => {
    if (activeReport) {
      const fee = Number(activeReport.fee || 0);
      const disc = Number(activeReport.discount || 0);
      const pPaid = Number(activeReport.paid || 0);
      const due = Math.max(0, fee - disc - pPaid);
      setTotal(fee.toFixed(2));
      setDiscount(disc.toFixed(2));
      if (due > 0) {
        setCollectingNow(due.toFixed(2));
      } else if (pPaid === 0) {
        setCollectingNow(Math.max(0, fee - disc).toFixed(2));
      } else {
        setCollectingNow('0.00');
      }
      setPaymentMode(activeReport.paymentMethod || 'Cash');
    }
  }, [
    activeReport?.id,
    activeReport?.paid,
    activeReport?.fee,
    activeReport?.discount,
  ]);

  const numTotal = Math.max(0, parseFloat(total) || 0);
  const numDiscount = Math.min(
    numTotal,
    Math.max(0, parseFloat(discount) || 0)
  );
  const numCollecting = Math.max(0, parseFloat(collectingNow) || 0);
  const liveNet = Math.max(0, numTotal - numDiscount);
  const newTotalPaid = Math.min(liveNet, prevPaid + numCollecting);
  const liveRemainingDue = Math.max(0, liveNet - newTotalPaid);
  const dueString = liveRemainingDue.toFixed(2);

  const handleTotalChange = (val) => {
    if (prevPaid > 0) return;
    setTotal(val);
    const t = Math.max(0, parseFloat(val) || 0);
    const d = Math.min(t, Math.max(0, parseFloat(discount) || 0));
    const net = Math.max(0, t - d);
    setCollectingNow(net.toFixed(2));
  };

  const handleDiscountChange = (val) => {
    if (prevPaid > 0) return;
    setDiscount(val);
    const dRaw = parseFloat(val);
    const d = isNaN(dRaw) ? 0 : Math.max(0, dRaw);
    const t = Math.max(0, parseFloat(total) || 0);
    const validDiscount = Math.min(t, d);
    const net = Math.max(0, t - validDiscount);
    setCollectingNow(net.toFixed(2));
  };

  const handleSavePayment = (event) => {
    event?.preventDefault?.();
    if (!activeReport || isCollected) return;
    if (numCollecting <= 0) {
      alert('Please enter an amount to collect.');
      return;
    }
    setJustCollectedId(activeReport.id);
    onCollect(activeReport, {
      total: numTotal,
      discount: numDiscount,
      collectingNow: numCollecting,
      received: newTotalPaid,
      paymentMode,
    });
  };

  const filterMatch = (report) => {
    if (!patientFilter.trim()) return true;
    const p = patients.find((pat) => pat.id === report.patientId);
    const name = p ? patientName(p) : '';
    const q = patientFilter.toLowerCase();
    return (
      report.number?.toLowerCase().includes(q) ||
      name.toLowerCase().includes(q) ||
      p?.mobile?.includes(q) ||
      p?.id?.toLowerCase().includes(q)
    );
  };

  const pendingReports = reports.filter((r) => {
    const feeNum = Number(r.fee || 0);
    const discNum = Number(r.discount || 0);
    const paidNum = Number(r.paid || 0);
    return Math.max(0, feeNum - discNum - paidNum) > 0;
  });

  const settledReports = reports.filter((r) => {
    const feeNum = Number(r.fee || 0);
    const discNum = Number(r.discount || 0);
    const paidNum = Number(r.paid || 0);
    return Math.max(0, feeNum - discNum - paidNum) === 0;
  });

  const filteredPending = pendingReports.filter(filterMatch);
  const filteredSettled = settledReports.filter(filterMatch);

  return (
    <div className="billing-section-container">
      <header className="page-head">
        <div>
          <span className="eyebrow">BILLING &amp; COLLECTION</span>
        </div>
      </header>

      <form className="billing-receipt-card" onSubmit={handleSavePayment}>
        <div className="billing-receipt-patient-row">
          <div className="billing-receipt-patient-header">
            <label className="billing-receipt-patient-label">
              <span>Patient with pending due / bill</span>
              <select
                className="billing-receipt-patient-select"
                value={activeReport?.id || ''}
                onChange={(event) => setSelectedReportId(event.target.value)}
              >
                {!reports.length && (
                  <option value="">No billing records found</option>
                )}
                {filteredPending.length > 0 && (
                  <optgroup label="⚠️ Outstanding Dues">
                    {filteredPending.map((report) => {
                      const patient = patients.find(
                        (p) => p.id === report.patientId
                      );
                      const pName = patient
                        ? patientName(patient)
                        : 'Patient unavailable';
                      const feeNum = Number(report.fee || 0);
                      const paidNum = Number(report.paid || 0);
                      const reportDue = Math.max(
                        0,
                        feeNum - Number(report.discount || 0) - paidNum
                      );
                      return (
                        <option key={report.id} value={report.id}>
                          {pName} · {report.number} (Total: ₹{feeNum.toFixed(2)}
                          {paidNum > 0 ? `, Paid: ₹${paidNum.toFixed(2)}` : ''}{' '}
                          | Due: ₹{reportDue.toFixed(2)})
                        </option>
                      );
                    })}
                  </optgroup>
                )}
                {filteredSettled.length > 0 && (
                  <optgroup label="✓ Settled / Fully Paid">
                    {filteredSettled.map((report) => {
                      const patient = patients.find(
                        (p) => p.id === report.patientId
                      );
                      const pName = patient
                        ? patientName(patient)
                        : 'Patient unavailable';
                      const feeNum = Number(report.fee || 0);
                      return (
                        <option key={report.id} value={report.id}>
                          {pName} · {report.number} (₹{feeNum.toFixed(2)} ·
                          Fully Paid)
                        </option>
                      );
                    })}
                  </optgroup>
                )}
              </select>
            </label>

            {reports.length > 4 && (
              <div className="billing-receipt-filter-box">
                <input
                  type="text"
                  placeholder="Filter patient / report..."
                  value={patientFilter}
                  onChange={(e) => setPatientFilter(e.target.value)}
                  className="billing-filter-input"
                  aria-label="Filter patient or report"
                />
              </div>
            )}
          </div>

          {activePatient && (
            <div className="billing-patient-meta">
              <span>
                Patient ID: <b>{activePatient.id}</b>
              </span>
              <span>
                Age / Gender:{' '}
                <b>
                  {activePatient.age} {activePatient.ageUnit || 'Years'} /{' '}
                  {activePatient.gender}
                </b>
              </span>
              <span>
                Mobile: <b>{activePatient.mobile || '—'}</b>
              </span>
              <span>
                Referred by: <b>{activePatient.reference || 'Self'}</b>
              </span>
              <span>
                Report no: <b>{activeReport.number}</b>
              </span>
              {currentDue > 0 ? (
                <span className="due-badge">
                  Outstanding Due: ₹{currentDue.toFixed(2)}
                </span>
              ) : (
                <span className="status final">✓ Fully Paid</span>
              )}
            </div>
          )}
        </div>

        {prevPaid > 0 && currentDue > 0 && (
          <div className="billing-due-alert-banner">
            <span className="billing-due-icon">₹</span>
            <div className="billing-due-text">
              <strong>
                Outstanding Due Clearance (Previous Payment: ₹
                {prevPaid.toFixed(2)})
              </strong>
              <span>
                Total service bill is <b>₹{reportFee.toFixed(2)}</b>. The
                patient previously paid <b>₹{prevPaid.toFixed(2)}</b>, leaving
                an outstanding balance of{' '}
                <b className="due-highlight">₹{currentDue.toFixed(2)}</b>. Input
                fields below are preset to collect this due. Full{' '}
                <b>₹{reportFee.toFixed(2)}</b> Tax Invoice will be generated
                upon complete payment.
              </span>
            </div>
          </div>
        )}

        <div className="billing-receipt-grid-row">
          <div className="billing-receipt-field">
            <label>Total Billed (₹)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={total}
              onChange={(e) => handleTotalChange(e.target.value)}
              placeholder="0.00"
              disabled={isCollected || prevPaid > 0}
              title={
                prevPaid > 0
                  ? 'Total billed is locked because a payment was already recorded'
                  : ''
              }
              required
            />
          </div>

          <div className="billing-receipt-field">
            <label>Discount (₹)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={discount}
              onChange={(e) => handleDiscountChange(e.target.value)}
              placeholder="0.00"
              disabled={isCollected || prevPaid > 0}
              title={
                prevPaid > 0
                  ? 'Discount is locked because a payment was already recorded'
                  : ''
              }
            />
          </div>

          <div className="billing-receipt-field">
            <label>Previously Paid (₹)</label>
            <input
              type="text"
              readOnly
              value={`₹${prevPaid.toFixed(2)}`}
              className="billing-readonly-input"
              title="Amount already paid towards this bill"
            />
          </div>

          <div className="billing-receipt-field">
            <label>
              {prevPaid > 0
                ? 'Collecting Due Amount (₹)'
                : 'Amount Collecting Now (₹)'}
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={currentDue > 0 ? currentDue : liveNet}
              value={collectingNow}
              onChange={(e) => setCollectingNow(e.target.value)}
              placeholder="0.00"
              disabled={isCollected}
              required
            />
          </div>
        </div>

        {!isCollected && (
          <div className="billing-calc-summary">
            <span>
              Total Bill: <b>₹{numTotal.toFixed(2)}</b>
            </span>
            {numDiscount > 0 && (
              <span>
                Discount: <b>−₹{numDiscount.toFixed(2)}</b>
              </span>
            )}
            <span>
              Net: <b>₹{liveNet.toFixed(2)}</b>
            </span>
            <span className="divider">|</span>
            <span>
              Previously Paid: <b>₹{prevPaid.toFixed(2)}</b>
            </span>
            <span>
              Collecting Now:{' '}
              <b className="collect-now-highlight">
                +₹{numCollecting.toFixed(2)}
              </b>
            </span>
            <span className="divider">→</span>
            <span>
              Total Paid After: <b>₹{newTotalPaid.toFixed(2)}</b>
            </span>
            <span>
              Remaining Due:{' '}
              <b
                className={
                  liveRemainingDue > 0 ? 'due-text-red' : 'due-text-green'
                }
              >
                ₹{dueString}
              </b>
            </span>
          </div>
        )}

        <div className="billing-receipt-bottom-row">
          <div className="billing-receipt-field">
            <label>Payment mode</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              disabled={isCollected}
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="billing-receipt-field billing-receipt-due">
            <label>
              {liveRemainingDue === 0
                ? 'Balance Due (Cleared)'
                : 'Remaining Due (₹)'}
            </label>
            <input
              type="text"
              readOnly
              value={dueString}
              className={`billing-due-input ${
                liveRemainingDue === 0 ? 'billing-due-input-cleared' : ''
              }`}
            />
          </div>

          <div className="billing-receipt-actions">
            <button
              type="submit"
              className={`billing-btn-save ${
                isCollected ? 'billing-btn-collected' : ''
              }`}
              disabled={isCollected || !activeReport || numCollecting <= 0}
              title={
                isCollected
                  ? 'Payment has already been completed in full'
                  : 'Record payment'
              }
            >
              {isCollected
                ? '✓ Paid in Full'
                : prevPaid > 0
                ? `Collect Due ₹${numCollecting.toFixed(2)}`
                : liveRemainingDue > 0
                ? `Collect ₹${numCollecting.toFixed(2)} (Partial Payment)`
                : `Collect ₹${numCollecting.toFixed(2)} (Full Payment)`}
            </button>
            <button
              type="button"
              className="secondary billing-btn-invoice"
              disabled={!activeReport || currentDue > 0}
              title={
                currentDue > 0
                  ? `Cannot generate invoice: Outstanding balance due of ₹${currentDue.toFixed(
                      2
                    )}. Complete full payment to generate the ₹${reportFee.toFixed(
                      2
                    )} Tax Invoice.`
                  : `View or print full ₹${reportFee.toFixed(2)} Tax Invoice`
              }
              onClick={() => onInvoice(activeReport)}
            >
              View / Print Invoice
            </button>
          </div>
        </div>

        {isCollected && (
          <div className="billing-collected-banner">
            <span className="billing-collected-icon">✓</span>
            <div className="billing-collected-text">
              <strong>Payment Completed in Full</strong>
              <span>
                Total service bill of ₹{reportFee.toFixed(2)} is fully paid (₹
                {reportPaid.toFixed(2)} received) via{' '}
                {activeReport?.paymentMethod || paymentMode} on{' '}
                {activeReport?.paidOn || 'record'}. Outstanding due is ₹0.00.
              </span>
            </div>
            <button
              type="button"
              className="billing-btn-save"
              style={{ marginLeft: 'auto', background: '#2563eb' }}
              onClick={() => onInvoice(activeReport)}
            >
              🖨️ View / Print Tax Invoice
            </button>
          </div>
        )}
      </form>

      <section className="panel billing-table-panel">
        <header className="billing-table-header">
          <div>
            <h2>Collection register</h2>
            <p>
              Click any patient row to review details, collect pending due or
              view full Tax Invoice.
            </p>
          </div>
          <span className="directory-count">{reports.length} bills</span>
        </header>

        <div className="table-scroll">
          <table className="app-table billing-table">
            <thead>
              <tr>
                <th>Report no.</th>
                <th>Patient</th>
                <th>Total billed</th>
                <th>Discount</th>
                <th>Received</th>
                <th>Balance due</th>
                <th>Payment mode</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {reports.length ? (
                reports.map((report) => {
                  const feeNum = Number(report.fee || 0);
                  const discNum = Number(report.discount || 0);
                  const paidNum = Number(report.paid || 0);
                  const reportDue = Math.max(0, feeNum - discNum - paidNum);
                  const patient = patients.find(
                    (p) => p.id === report.patientId
                  );
                  const isSelected = report.id === activeReport?.id;
                  return (
                    <tr
                      key={report.id}
                      className={isSelected ? 'billing-row-selected' : ''}
                      onClick={() => {
                        setSelectedReportId(report.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <b>{report.number}</b>
                      </td>
                      <td>
                        <b>
                          {patient
                            ? patientName(patient)
                            : 'Patient unavailable'}
                        </b>
                      </td>
                      <td>₹{feeNum.toFixed(2)}</td>
                      <td>{discNum > 0 ? `₹${discNum.toFixed(2)}` : '—'}</td>
                      <td>₹{paidNum.toFixed(2)}</td>
                      <td>
                        {reportDue > 0 ? (
                          <span
                            className="due-badge"
                            title="Click row to collect due"
                          >
                            ₹{reportDue.toFixed(2)} Due
                          </span>
                        ) : (
                          <span className="status final">Paid</span>
                        )}
                      </td>
                      <td>
                        <span className="payment-mode-tag">
                          {report.paymentMethod || 'Cash'}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className="secondary small"
                          disabled={reportDue > 0}
                          title={
                            reportDue > 0
                              ? `Cannot generate invoice: Collect balance due of ₹${reportDue.toFixed(
                                  2
                                )} first`
                              : `View or print full ₹${feeNum.toFixed(
                                  2
                                )} Tax Invoice`
                          }
                          onClick={() => onInvoice(report)}
                        >
                          {reportDue > 0 ? 'Due Pending' : 'Invoice'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="empty">
                    No billing records yet. Book tests for a patient to create a
                    bill.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
