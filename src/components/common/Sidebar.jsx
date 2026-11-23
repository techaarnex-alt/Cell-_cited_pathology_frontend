import React from 'react';
import { useApp } from '../../context/AppContext';
import { CellCitedMark, NavIcon } from './Icons';
import './Sidebar.css';

export default function Sidebar() {
  const { view, setView, handleLogout } = useApp();

  const navItems = [
    ['dashboard', 'Dashboard'],
    ['patients', 'Patients & Registration'],
    ['newreport', 'Test Booking'],
    ['billing', 'Billing'],
    ['results', 'Result entry'],
    ['reports', 'Reports'],
    ['doctors', 'Doctors'],
    ['tests', 'Test catalogue'],
    ['business', 'Business report'],
    ['profile', 'Profile'],
    ['setting', 'Settings'],
  ];

  return (
    <aside>
      <div className="brand">
        <CellCitedMark compact />
      </div>
      <nav>
        {navItems.map(([key, label]) => (
          <button
            key={key}
            className={view === key ? 'active' : ''}
            onClick={() => setView(key)}
          >
            <NavIcon name={key} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <button className="logout" onClick={handleLogout}>
        <NavIcon name="logout" />
        <span>Log out</span>
      </button>
      <p className="aarnex-credit">
        Created &amp; Designed by <b>Aarnex Tech</b>
      </p>
    </aside>
  );
}
