import React from 'react';
import { patientName } from '../../utils/helpers';
import './InvoiceDocument.css';

export default function InvoiceDocument({
  report,
  patient,
  labProfile = {},
}) {
  if (!report) return null;

  const fee = Number(report.fee || 0);
  const discount = Number(report.discount || 0);
  const paid = Number(report.paid || 0);
  const netFee = Math.max(0, fee - discount);
  const due = Math.max(0, netFee - paid);
  const tests = report.tests || [];
  const perTest = tests.length ? fee / tests.length : fee;
  const invoiceNo = `CCPL/INV/${String(report.number || '')
    .replace(/\D/g, '')
    .padStart(4, '0')}`;
  const labPhones =
    labProfile.phones && labProfile.phones.length
      ? labProfile.phones.join(' · ')
      : '9554448906 · 6307342505 · 8601463398';
  const labEmail = labProfile.email || 'ccpath11@gmail.com';
  const labAddress =
    labProfile.address ||
    'Shop No. 17, City Trade Centre, Lakhperabagh Chauraha, Barabanki - 225001';
  const labName =
    labProfile.name || 'CELL CITED PATHOLOGY LAB (CCPL)';

  const PAGE_SIZE = 10;
  const chunks = [];
  if (tests.length <= PAGE_SIZE) {
    chunks.push(tests);
  } else {
    for (let i = 0; i < tests.length; i += PAGE_SIZE) {
      chunks.push(tests.slice(i, i + PAGE_SIZE));
    }
  }
  if (!chunks.length) chunks.push([]);

  return (
    <div className="invoice-stack">
      {chunks.map((chunk, index) => {
        const isLast = index === chunks.length - 1;
        return (
          <article
            key={index}
            className={`invoice-document ${
              index === 0 ? 'first-page' : 'continuation-page'
            }`}
          >
            <header className="invoice-header">
              <div className="invoice-mark">CC</div>
              <div>
                <h2>{labName}</h2>
                <p>{labAddress}</p>
                <p>
                  {labPhones} · {labEmail}
                </p>
              </div>
              <div className="invoice-title">
                <b>TAX INVOICE</b>
                <span>Invoice no. {invoiceNo}</span>
                <span>
                  Date: {report.createdOn}
                  {chunks.length > 1
                    ? ` · Page ${index + 1} of ${chunks.length}`
                    : ''}
                </span>
              </div>
            </header>
            <section className="invoice-info">
              <div>
                <p>
                  <strong>Patient name</strong>:{' '}
                  {patientName(patient) || '—'}
                </p>
                <p>
                  <strong>Patient ID</strong>:{' '}
                  {patient?.id || report.patientId}
                </p>
                <p>
                  <strong>Age / Gender</strong>: {patient?.age || '—'}{' '}
                  {patient?.ageUnit || 'years'} / {patient?.gender || '—'}
                </p>
              </div>
              <div>
                <p>
                  <strong>Report no.</strong>: {report.number}
                </p>
                <p>
                  <strong>Referred by</strong>: {patient?.reference || 'Self'}
                </p>
                <p>
                  <strong>Payment mode</strong>:{' '}
                  {report.paymentMethod || 'Cash'}
                </p>
                <p>
                  <strong>Payment status</strong>:{' '}
                  <span className={`invoice-status ${due ? 'due' : 'paid'}`}>
                    {due ? 'PART PAYMENT / DUE' : 'PAID IN FULL'}
                  </span>
                </p>
              </div>
            </section>
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Laboratory service / investigation</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {chunk.map((test, itemIdx) => {
                  const globalIdx = index * PAGE_SIZE + itemIdx;
                  return (
                    <tr key={test.name}>
                      <td>{globalIdx + 1}</td>
                      <td>
                        <b>{test.name}</b>
                        <br />
                        <small>Laboratory investigation</small>
                      </td>
                      <td>
                        ₹
                        {(globalIdx === tests.length - 1
                          ? fee - perTest * (tests.length - 1)
                          : perTest
                        ).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {isLast && (
              <>
                <section className="invoice-summary">
                  <p>
                    <span>Subtotal</span>
                    <b>₹{fee.toFixed(2)}</b>
                  </p>
                  <p>
                    <span>Discount</span>
                    <b>₹{discount.toFixed(2)}</b>
                  </p>
                  <p className="grand">
                    <span>Grand total</span>
                    <span>₹{netFee.toFixed(2)}</span>
                  </p>
                  <p>
                    <span>Received</span>
                    <b>₹{paid.toFixed(2)}</b>
                  </p>
                  <p>
                    <span>Balance due</span>
                    <b>₹{due.toFixed(2)}</b>
                  </p>
                </section>
                <footer className="invoice-foot">
                  <div>
                    <b>
                      Thank you for choosing Cell Cited Pathology Lab.
                    </b>
                    <br />
                    This is a computer-generated invoice and does not require a
                    physical stamp.
                    <br />
                    Services once rendered are subject to laboratory terms and
                    conditions.
                  </div>
                  <div>
                    <b>Authorised Signatory</b>
                  </div>
                </footer>
              </>
            )}
          </article>
        );
      })}
    </div>
  );
}
