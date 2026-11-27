import React from 'react';
import { useApp } from './context/AppContext';
import Topbar from './components/common/Topbar';
import Sidebar from './components/common/Sidebar';
import Toast from './components/common/Toast';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import Patients from './components/patients/Patients';
import PatientRecord from './components/patients/PatientRecord';
import TestBooking from './components/booking/TestBooking';
import Billing from './components/billing/Billing';
import ResultEntry from './components/results/ResultEntry';
import Reports from './components/reports/Reports';
import ReportPreview from './components/reports/ReportPreview';
import InvoicePreview from './components/billing/InvoicePreview';
import Doctors from './components/doctors/Doctors';
import TestCatalogue from './components/catalogue/TestCatalogue';
import BusinessReport from './components/business/BusinessReport';
import Profile from './components/profile/Profile';
import Settings from './components/settings/Settings';

export default function App() {
  const { loggedIn, view, sidebarCollapsed } = useApp();

  if (!loggedIn) {
    return (
      <>
        <Toast />
        <Login />
      </>
    );
  }

  return (
    <>
      <Toast />
      <div className={`app-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Sidebar />
        <main className="workspace">
          <Topbar />
          <div className="workspace-content">
            {view === 'dashboard' && <Dashboard />}
            {view === 'patients' && <Patients />}
            {view === 'patientrecord' && <PatientRecord />}
            {view === 'newreport' && <TestBooking />}
            {view === 'billing' && <Billing />}
            {view === 'results' && <ResultEntry />}
            {view === 'reports' && <Reports />}
            {view === 'preview' && <ReportPreview />}
            {view === 'invoice' && <InvoicePreview />}
            {view === 'doctors' && <Doctors />}
            {view === 'tests' && <TestCatalogue />}
            {view === 'business' && <BusinessReport />}
            {view === 'profile' && <Profile />}
            {view === 'setting' && <Settings />}
          </div>
        </main>
      </div>
    </>
  );
}
