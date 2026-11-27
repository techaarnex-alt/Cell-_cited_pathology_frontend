import React from 'react';
import { useApp } from '../../context/AppContext';
import { CellCitedMark, NavIcon } from './Icons';
import HamburgerIcon from './HamburgerIcon';
import { LuPlus } from 'react-icons/lu';
import './Sidebar.css';

export default function Sidebar() {
  const { view, setView, handleLogout, sidebarCollapsed, toggleSidebar } = useApp();

  const isExpanded = !sidebarCollapsed;

  const handleToggle = (e) => {
    e.stopPropagation();
    toggleSidebar();
  };

  const navItems = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'patients', label: 'Patients & Registration' },
    { key: 'newreport', label: 'Test Booking' },
    { key: 'billing', label: 'Billing & Invoicing' },
    { key: 'results', label: 'Result Entry' },
    { key: 'reports', label: 'Reports & Delivery' },
    { key: 'doctors', label: 'Referring Doctors' },
    { key: 'tests', label: 'Test Catalogue' },
    { key: 'business', label: 'Business Reports' },
    { key: 'profile', label: 'Laboratory Profile' },
    { key: 'setting', label: 'System Settings' },
    // { key: 'logout', label: 'Log out' },
  ];

  const handleNavClick = (key) => {
    const path = key === 'tests' ? '/test-catalogue' : (key === 'dashboard' ? '/' : `/${key}`);
    window.history.pushState({}, '', path);
    setView(key);
  };

  return (
    <div
      className={`sidebar-track ${sidebarCollapsed ? 'is-collapsed' : 'is-expanded'}`}
    >
      <aside
        className={`sidebar-aside ${sidebarCollapsed ? 'is-collapsed' : 'is-expanded'}`}
      >
        {/* Top Header with Hamburger Icon and Brand */}
        <div className="sidebar-header">
          {isExpanded ? (
            <div className="brand-expanded-area">
              <CellCitedMark compact />
              <button
                type="button"
                className="sidebar-toggle-btn"
                onClick={handleToggle}
                aria-label={sidebarCollapsed ? 'Lock sidebar open' : 'Collapse to icon rail'}
                title={sidebarCollapsed ? 'Lock sidebar open' : 'Collapse to icon rail'}
              >
                <HamburgerIcon size={20} />
              </button>
            </div>
          ) : (
            <div className="brand-collapsed-area">
              <button
                type="button"
                className="sidebar-toggle-btn-collapsed"
                onClick={handleToggle}
                aria-label="Expand sidebar"
                title="Expand sidebar"
              >
                <HamburgerIcon size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Labsmart-style Blue Action Button (+) */}
        <div className="sidebar-quick-action">
          <button
            type="button"
            className="sidebar-action-btn"
            onClick={() => handleNavClick('patients')}
            title="New Test Booking / Patient Registration (+)"
          >
            <LuPlus className="action-plus-icon" />
            {isExpanded && <span className="action-btn-text">New Booking</span>}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="sidebar-nav">
          {navItems.map(({ key, label }) => {
            const isActive = view === key;
            return (
              <button
                key={key}
                type="button"
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(key)}
                title={!isExpanded ? label : undefined}
              >
                <span className="sidebar-icon-wrapper">
                  <NavIcon name={key} />
                </span>
                {isExpanded && <span className="sidebar-nav-label">{label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer Area with Logout and Credit */}
        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-nav-item logout"
            onClick={handleLogout}
            title="Log out"
          >
            <span className="sidebar-icon-wrapper">
              <NavIcon name="logout" />
            </span>
            {isExpanded && <span className="sidebar-nav-label">Log out</span>}
          </button>
          {isExpanded && (
            <p className="aarnex-credit">
              Created &amp; Designed by <b>Aarnex Tech</b>
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
