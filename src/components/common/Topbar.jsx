import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatDisplayDate } from '../../utils/helpers';
import HamburgerIcon from './HamburgerIcon';
import { LuCalendar } from 'react-icons/lu';
import UserProfileMenu from './UserProfileMenu';
import './Topbar.css';

export default function Topbar() {
  const { view, setView, toggleSidebar, sidebarCollapsed } = useApp();

  const viewTitles = {
    dashboard: 'Dashboard Overview',
    patients: 'Patients & Registration',
    patientrecord: 'Patient Health Record',
    newreport: 'Test Booking / Investigation Entry',
    billing: 'Billing & Invoicing',
    results: 'Laboratory Result Entry',
    reports: 'Reports & Delivery',
    preview: 'Report Preview',
    invoice: 'Invoice Preview',
    doctors: 'Referring Doctors',
    tests: 'Test Catalogue & Pricing',
    business: 'Business Intelligence & Revenue',
    profile: 'Laboratory Profile',
    setting: 'System Settings',
  };

  const title = viewTitles[view] || 'Cell Cited Pathology Laboratory';

  return (
    <header className="app-topbar">
      <div className="topbar-left">
        {/* <button
          type="button"
          className="topbar-toggle-btn"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <HamburgerIcon size={18} />
        </button> */}

        <nav className="topbar-breadcrumbs" aria-label="Breadcrumb">
          <span
            className="breadcrumb-kicker"
            onClick={() => {
              window.history.pushState({}, '', '/');
              setView('dashboard');
            }}
            title="Go to Dashboard Overview"
          >
            CCPL
          </span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{title}</span>
        </nav>
      </div>

      <div className="topbar-actions">
        <span className="topbar-status-badge" title="Diagnostic System Online">
          <span className="status-dot-pulse"></span>
          <span>Online</span>
        </span>

        <span className="topbar-date" title="Today's Operating Date">
          <LuCalendar className="calendar-icon" />
          <span>{formatDisplayDate()}</span>
        </span>

        <UserProfileMenu />
      </div>
    </header>
  );
}
