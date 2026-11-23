import React from 'react';
import { formatDisplayDate } from '../../utils/helpers';
import './Topbar.css';

export default function Topbar() {
  return (
    <header className="app-topbar">
      <div>
        <span className="topbar-kicker">WELCOME TO CELL CITED PATHOLOGY LAB</span>
      </div>
      <div className="topbar-actions">
        <span className="topbar-date" title="Today's Date">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="calendar-icon"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{formatDisplayDate()}</span>
        </span>
      </div>
    </header>
  );
}
