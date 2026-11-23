import React from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import './Toast.css';

export default function Toast() {
  const { notice, setNotice } = useApp();

  if (!notice) return null;

  const noticeTitle =
    typeof notice === 'object' && notice !== null ? notice.title : '';
  const noticeText =
    typeof notice === 'object' && notice !== null
      ? notice.message
      : String(notice || '');
  const noticeType =
    typeof notice === 'object' && notice !== null
      ? notice.type || 'success'
      : String(notice).startsWith('⚠')
      ? 'warning'
      : 'info';

  const toastElement = (
    <div
      className={`toast toast-${noticeType}`}
      role="status"
      aria-live="polite"
    >
      <div className="toast-icon">
        {noticeType === 'success' ? '✓' : noticeType === 'warning' ? '⚠' : 'ℹ'}
      </div>
      <div className="toast-body">
        {noticeTitle && <div className="toast-title">{noticeTitle}</div>}
        <div className="toast-message">{noticeText}</div>
      </div>
      <button
        className="toast-close"
        onClick={() => setNotice('')}
        aria-label="Close notification"
        title="Dismiss"
      >
        ×
      </button>
    </div>
  );

  return createPortal(toastElement, document.body);
}
