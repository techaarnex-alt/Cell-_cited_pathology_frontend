import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import { api } from '../api';
import {
  STORAGE_KEY,
  CATALOGUE_VERSION,
  DEFAULT_USER,
  DEFAULT_LAB_PROFILE,
  TEST_GROUPS as FALLBACK_TEST_GROUPS,
} from '../constants';
import {
  load,
  normalise,
  normaliseDoctor,
  mergeDoctors,
  mergeCatalogue,
  catalogueDetails,
  patientName,
  date,
  isToday,
  makeId,
  printDocument,
} from '../utils/helpers';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const getInitialView = () => {
    try {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/test-catalogue') || pathname.startsWith('/tests')) return 'tests';
      if (pathname.startsWith('/patients')) return 'patients';
      if (pathname.startsWith('/billing')) return 'billing';
      if (pathname.startsWith('/results')) return 'results';
      if (pathname.startsWith('/reports')) return 'reports';
      if (pathname.startsWith('/doctors')) return 'doctors';
      if (pathname.startsWith('/business')) return 'business';
      if (pathname.startsWith('/profile')) return 'profile';
      if (pathname.startsWith('/setting')) return 'setting';
      if (pathname.startsWith('/newreport')) return 'newreport';
    } catch {}
    return 'dashboard';
  };

  const [data, setData] = useState(load);
  const [view, setView] = useState(getInitialView);
  const [selectedId, setSelectedId] = useState(null);
  const [invoiceId, setInvoiceId] = useState(null);
  const [patientRecordId, setPatientRecordId] = useState(null);
  const [newReportPatientId, setNewReportPatientId] = useState('');
  const [newReportDoctorId, setNewReportDoctorId] = useState('');
  const [bookingFee, setBookingFee] = useState(0);
  const [testBookingLoading, setTestBookingLoading] = useState(false);
  const [testBookingApiInfo, setTestBookingApiInfo] = useState(null);
  const [testBookingRawJson, setTestBookingRawJson] = useState(null);
  const [showApiResponse, setShowApiResponse] = useState(false);
  const [bookingPickerKey, setBookingPickerKey] = useState(0);
  const [registrationGender, setRegistrationGender] = useState('');
  const [reportPrintMode, setReportPrintMode] = useState(null);
  const [reportPrintOption, setReportPrintOption] = useState('with');
  const [reportPdfMode, setReportPdfMode] = useState(null);
  const [isGeneratingReportPdf, setIsGeneratingReportPdf] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');
  const registrationRef = useRef(null);
  const [notice, setNotice] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'forgot' | 'reset'
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authNotice, setAuthNotice] = useState('');
  const [authNoticeType, setAuthNoticeType] = useState('error');
  const [loginError, setLoginError] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('cell-cited-sidebar-collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('cell-cited-sidebar-collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const [loggedIn, setLoggedIn] = useState(
    () =>
      localStorage.getItem('cell-cited-session') === 'active' ||
      sessionStorage.getItem('cell-cited-session') === 'active'
  );
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved =
        localStorage.getItem('cell-cited-user') ||
        sessionStorage.getItem('cell-cited-user');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_USER,
          ...parsed,
          laboratory: {
            ...DEFAULT_USER.laboratory,
            ...(parsed.laboratory || {}),
          },
        };
      }
    } catch {}
    return DEFAULT_USER;
  });
  const [labProfile, setLabProfile] = useState(DEFAULT_LAB_PROFILE);
  const [testGroups, setTestGroups] = useState([]);

  // Ensure no test groups are read/stored in localStorage
  useEffect(() => {
    try {
      localStorage.removeItem('cell-cited-test-groups');
    } catch {}
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/test-catalogue') || pathname.startsWith('/tests')) {
        setView('tests');
      } else if (pathname.startsWith('/patients')) {
        setView('patients');
      } else if (pathname.startsWith('/billing')) {
        setView('billing');
      } else if (pathname.startsWith('/results')) {
        setView('results');
      } else if (pathname.startsWith('/reports')) {
        setView('reports');
      } else if (pathname.startsWith('/doctors')) {
        setView('doctors');
      } else if (pathname.startsWith('/business')) {
        setView('business');
      } else if (pathname.startsWith('/profile')) {
        setView('profile');
      } else if (pathname.startsWith('/setting')) {
        setView('setting');
      } else if (pathname.startsWith('/newreport')) {
        setView('newreport');
      } else if (pathname === '/' || pathname === '/dashboard') {
        setView('dashboard');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (newReportPatientId) {
      const patient = data.patients.find((p) => p.id === newReportPatientId);
      if (patient) {
        setNewReportDoctorId(patient.doctorId || '');
      }
    } else {
      setNewReportDoctorId('');
    }
  }, [newReportPatientId, data.patients]);

  const loadTestBookingData = async () => {
    try {
      setTestBookingLoading(true);
      const token = sessionStorage.getItem('cell-cited-token');
      const authHeaders = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const [groupRes, doctorsData, testsData] = await Promise.all([
        fetch('/api/v1/test-groups', { headers: authHeaders })
          .then((r) => r.json())
          .catch(() => null),
        api.getDoctors().catch(() => null),
        api.getTests().catch(() => null),
      ]);

      const fetchedGroups = groupRes?.data || [];
      if (groupRes) {
        setTestBookingRawJson(groupRes);
        setTestBookingApiInfo({
          status: 'success',
          count: Array.isArray(fetchedGroups) ? fetchedGroups.length : 0,
          message: groupRes.message || 'Test groups retrieved successfully',
        });
      }

      if (Array.isArray(fetchedGroups) && fetchedGroups.length) {
        const processedGroups = fetchedGroups.map((g, idx) => ({
          id: g.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          backendId: g._id,
          name: g.name,
          order: g.order !== undefined ? g.order : idx + 1,
          description: g.description,
          category: g.category,
          catalogTests: Array.isArray(g.tests) ? g.tests : [],
          tests:
            g.testNames && g.testNames.length
              ? g.testNames
              : Array.isArray(g.testIds)
              ? g.testIds.map((t) => (typeof t === 'object' && t ? t.name : t))
              : (g.tests || []).map((t) => (typeof t === 'object' && t ? t.name : t)),
          testObjects: Array.isArray(g.testIds) ? g.testIds : [],
          rawGroup: g,
        }));
        setTestGroups(processedGroups);

        const extractedTests = fetchedGroups.flatMap((g) =>
          (Array.isArray(g.testIds) ? g.testIds : []).map((t) => ({
            id: t._id,
            backendId: t._id,
            name: t.name,
            category: t.category || g.category,
            unit: t.unit || '',
            range: t.referenceRange || '',
            rate: t.rate || 0,
            alertable: t.alertable !== false,
          }))
        );

        setData((current) => {
          const next = { ...current };
          let changed = false;
          if (
            extractedTests.length ||
            (Array.isArray(testsData) && testsData.length)
          ) {
            const allNewTests = [
              ...(Array.isArray(testsData)
                ? testsData.map((t) => ({
                    id: t._id,
                    backendId: t._id,
                    name: t.name,
                    category: t.category,
                    unit: t.unit || '',
                    range: t.referenceRange || '',
                    rate: t.rate || 0,
                    alertable: t.alertable !== false,
                  }))
                : []),
              ...extractedTests,
            ];
            next.tests = mergeCatalogue(allNewTests);
            changed = true;
          }
          if (Array.isArray(doctorsData) && doctorsData.length) {
            next.doctors = mergeDoctors(
              doctorsData.map((d) => ({
                id: d._id,
                backendId: d._id,
                doctorCode: d.doctorCode,
                name: d.name,
                specialty: d.specialty || '',
                mobile: d.mobile || '',
                address: d.address || '',
                referralPercentage: d.referralPercentage || 0,
              }))
            );
            changed = true;
          }
          if (changed) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          }
          return next;
        });
      }
    } catch (err) {
      console.warn('Backend loadTestBookingData error:', err);
    } finally {
      setTestBookingLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'newreport') {
      loadTestBookingData();
    }
  }, [view]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => {
      setNotice('');
    }, 6000);
    return () => clearTimeout(timer);
  }, [notice]);

  const save = (next) => {
    const updated = normalise(typeof next === 'function' ? next(data) : next);
    setData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const syncWithBackend = async () => {
    try {
      const [
        fetchedPatients,
        fetchedReports,
        fetchedDoctors,
        fetchedTests,
        fetchedGroups,
        fetchedLab,
        fetchedMe,
      ] = await Promise.all([
        api.getPatients({ limit: 100 }).catch(() => null),
        api.getReports({ limit: 100 }).catch(() => null),
        api.getDoctors().catch(() => null),
        api.getTests().catch(() => null),
        api.getTestGroups().catch(() => null),
        api.getLaboratory().catch(() => null),
        api.getMe().catch(() => null),
      ]);

      if (fetchedMe) {
        setCurrentUser((prev) => ({
          ...prev,
          ...fetchedMe,
          laboratory: {
            ...prev.laboratory,
            ...(fetchedMe.laboratory || {}),
          },
        }));
        try {
          sessionStorage.setItem('cell-cited-user', JSON.stringify(fetchedMe));
        } catch {}
      }

      if (fetchedLab) {
        setLabProfile({
          name: fetchedLab.name || 'Cell Cited Pathology Lab (CCPL)',
          tagline:
            fetchedLab.tagline || 'Pathology & Healthcare Diagnostic Centre',
          address:
            fetchedLab.address ||
            'Shop No. 17, City Trade Centre, Lakhperabagh Chauraha, Barabanki - 225001',
          phones:
            fetchedLab.phones && fetchedLab.phones.length
              ? fetchedLab.phones
              : ['9554448906', '6307342505', '8601463398'],
          email: fetchedLab.email || 'ccpath11@gmail.com',
          certificateNumber:
            fetchedLab.medicalCertificate || 'CMEE26151240',
          registrationAuthority:
            fetchedLab.registrationDetails ||
            'Provisional registration certificate issued by Office of the Chief Medical Officer, Barabanki',
          signatory: fetchedLab.signatory || {
            name: 'Dr. Sanjay Singh',
            degrees: 'MBBS, MD Pathologist',
            designation: 'Consultant Pathologist',
          },
          authorisedSignatory:
            fetchedLab.authorisedSignatory ||
            'Dr. Sanjay Singh, MBBS, MD Pathologist',
        });
      }

      if (Array.isArray(fetchedGroups) && fetchedGroups.length) {
        const processedGroups = fetchedGroups.map((g, idx) => ({
          id: g.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          backendId: g._id,
          name: g.name,
          order: g.order !== undefined ? g.order : idx + 1,
          description: g.description,
          category: g.category,
          catalogTests: Array.isArray(g.tests) ? g.tests : [],
          tests:
            g.testNames && g.testNames.length
              ? g.testNames
              : Array.isArray(g.testIds)
              ? g.testIds.map((t) => (typeof t === 'object' && t ? t.name : t))
              : (g.tests || []).map((t) => (typeof t === 'object' && t ? t.name : t)),
          testObjects: Array.isArray(g.testIds) ? g.testIds : [],
          rawGroup: g,
        }));
        setTestGroups(processedGroups);
      }

      setData((current) => {
        let changed = false;
        const next = { ...current };

        if (Array.isArray(fetchedPatients) && fetchedPatients.length) {
          next.patients = fetchedPatients.map((p) => ({
            id: p.patientNumber || p._id,
            backendId: p._id,
            title: p.title || '',
            name: p.name,
            age: p.age,
            ageUnit: p.ageUnit || 'Years',
            gender: p.gender,
            mobile: p.mobile || '',
            doctorId: p.doctorId?._id || p.doctorId || '',
            reference: p.doctorNameSnapshot || p.doctorId?.name || 'Self',
            address: p.address || '',
            sampleType: p.sampleType || 'Blood',
            registeredOn:
              p.registeredOn ||
              (p.createdAt
                ? new Intl.DateTimeFormat('en-IN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  }).format(new Date(p.createdAt))
                : date()),
            createdAt: p.createdAt,
          }));
          changed = true;
        }

        if (Array.isArray(fetchedReports) && fetchedReports.length) {
          next.reports = fetchedReports.map((r) => {
            const existingLocal = (current.reports || []).find(
              (lr) =>
                lr.id === r._id ||
                lr.backendId === r._id ||
                lr.number === r.reportNumber
            );
            const reportFee = Number(
              r.fee !== undefined ? r.fee : existingLocal?.fee || 0
            );
            const reportDiscount = Number(
              r.discount !== undefined
                ? r.discount
                : existingLocal?.discount || 0
            );
            const reportPaid = Number(
              r.paid !== undefined ? r.paid : existingLocal?.paid || 0
            );
            const reportDue = Math.max(
              0,
              reportFee - reportDiscount - reportPaid
            );
            return {
              id: r._id,
              backendId: r._id,
              number: r.reportNumber,
              patientId:
                r.patientSnapshot?.patientNumber ||
                r.patientId?._id ||
                r.patientId,
              status: r.status,
              createdOn: new Intl.DateTimeFormat('en-IN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              }).format(new Date(r.createdAt)),
              registeredOn:
                r.registeredOn ||
                (r.createdAt
                  ? new Intl.DateTimeFormat('en-IN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    }).format(new Date(r.createdAt))
                  : date()),
              createdAt: r.createdAt,
              reportedOn: r.reportedOn || existingLocal?.reportedOn || '',
              fee: reportFee,
              discount: reportDiscount,
              paid: reportPaid,
              paymentMethod:
                r.paymentMethod || existingLocal?.paymentMethod || 'Cash',
              paidOn: r.paidOn || existingLocal?.paidOn || '',
              isCollected: Boolean(
                r.isCollected ||
                  existingLocal?.isCollected ||
                  (reportPaid > 0 && reportDue === 0)
              ),
              doctorId: r.doctorId || '',
              doctorPercentage: r.doctorSnapshot?.referralPercentage || 0,
              testGroups: r.testGroupNames || [],
              hasCustomItemOrder: Boolean(r.hasCustomItemOrder),
              tests: (r.items || []).map((item) => ({
                name: item.testNameSnapshot,
                unit: item.unitSnapshot,
                range: item.rangeSnapshot,
                value: item.value || '',
                remark: item.remark || '',
                rate: item.rateSnapshot,
                alertable: item.alertableSnapshot,
                reportItemId: item._id,
                testId: item.testId,
                category: item.categorySnapshot || '',
                displayOrder: item.displayOrder !== undefined ? item.displayOrder : 0,
              })),
            };
          });
          changed = true;
        }

        if (Array.isArray(fetchedDoctors) && fetchedDoctors.length) {
          next.doctors = mergeDoctors(
            fetchedDoctors.map((d) => ({
              id: d._id,
              backendId: d._id,
              doctorCode: d.doctorCode,
              name: d.name,
              specialty: d.specialty || '',
              mobile: d.mobile || '',
              address: d.address || '',
              referralPercentage: d.referralPercentage || 0,
            }))
          );
          changed = true;
        }

        const groupTests = (
          Array.isArray(fetchedGroups) ? fetchedGroups : []
        ).flatMap((g) =>
          (Array.isArray(g.testIds) ? g.testIds : []).map((t) => ({
            id: t._id,
            backendId: t._id,
            name: t.name,
            category: t.category || g.category,
            unit: t.unit || '',
            range: t.referenceRange || '',
            rate: t.rate || 0,
            alertable: t.alertable !== false,
          }))
        );

        if (
          groupTests.length ||
          (Array.isArray(fetchedTests) && fetchedTests.length)
        ) {
          next.tests = mergeCatalogue([
            ...(Array.isArray(fetchedTests)
              ? fetchedTests.map((t) => ({
                  id: t._id,
                  backendId: t._id,
                  code: t.code || t.testCode || '',
                  name: t.name || t.investigation,
                  investigation: t.investigation || t.name,
                  category: t.category || 'General',
                  unit: t.unit || '',
                  range: t.referenceRange || t.range || '',
                  rate: t.rate !== undefined ? Number(t.rate) : Number(t.pricing?.mrp || t.pricing?.net || 0),
                  alertable: t.alertable !== false,
                  method: t.method || '',
                  sampleInstructions: t.sampleInstructions || '',
                }))
              : []),
            ...groupTests,
          ]);
          changed = true;
        }

        if (changed) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
        return next;
      });
    } catch {
      // Backend sync optional fallback
    }
  };

  useEffect(() => {
    if (loggedIn) {
      syncWithBackend();
    }
  }, [loggedIn]);

  useEffect(() => {
    if (
      loggedIn &&
      [
        'dashboard',
        'patients',
        'newreport',
        'tests',
        'doctors',
        'reports',
        'billing',
      ].includes(view)
    ) {
      syncWithBackend();
    }
  }, [view, loggedIn]);

  useEffect(() => {
    const syncStorage = (event) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        setData(normalise(JSON.parse(event.newValue)));
      } catch {}
    };
    window.addEventListener('storage', syncStorage);
    return () => window.removeEventListener('storage', syncStorage);
  }, []);

  // Computed state
  const selected = data.reports.find((report) => report.id === selectedId);
  const selectedPatient =
    selected &&
    data.patients.find((patient) => patient.id === selected.patientId);
  const invoiceReport = data.reports.find((report) => report.id === invoiceId);
  const invoicePatient =
    invoiceReport &&
    data.patients.find((patient) => patient.id === invoiceReport.patientId);
  const recordPatient = data.patients.find(
    (patient) => patient.id === patientRecordId
  );
  const finalReports = data.reports.filter(
    (report) => report.status === 'Final'
  );
  const totalPatients = data.patients.length;
  const todayPatients = data.patients.filter((p) =>
    isToday(p.registeredOn || p.createdOn || p.createdAt)
  ).length;
  const todayBookings = data.reports.filter((r) =>
    isToday(r.registeredOn || r.createdOn || r.createdAt)
  ).length;
  const pendingReports = data.reports.filter(
    (report) => report.status === 'Draft' || report.status === 'Pending'
  ).length;
  const todayRevenue = data.reports.reduce((total, r) => {
    const paid = Number(r.paid || 0);
    if (paid <= 0) return total;
    const isPaidToday =
      isToday(r.paidOn) ||
      (!r.paidOn && isToday(r.registeredOn || r.createdOn || r.createdAt));
    return isPaidToday ? total + paid : total;
  }, 0);
  const todayRelease = data.reports.filter(
    (r) =>
      (r.status === 'Final' || r.status === 'Completed') &&
      isToday(r.createdOn || r.createdAt || r.registeredOn)
  ).length;
  const latestReport =
    data.reports && data.reports.length > 0 ? data.reports[0] : null;
  const latestPatient = latestReport
    ? data.patients.find((p) => p.id === latestReport.patientId)
    : null;
  const catalogue = data.tests;

  const chosenInvestigations = (form) => {
    const individuallySelected = form.getAll('tests');
    const selectedGroupIds = form.getAll('testGroups');
    const groupedTests = testGroups
      .filter(
        (group) =>
          selectedGroupIds.includes(group.id) ||
          selectedGroupIds.includes(group.name)
      )
      .flatMap((group) => group.tests || []);
    const names = new Set([...individuallySelected, ...groupedTests]);

    const resolvedTests = Array.from(names).map((name) => {
      const cleanLower = String(name || '').trim().toLowerCase();

      // 1. Search in testGroups.tests (rich nested tests with parameters & rates, e.g. Hemoglobin Rs.500)
      for (const group of testGroups) {
        if (Array.isArray(group.tests)) {
          const matchedTest = group.tests.find((t) => {
            const tName =
              typeof t === 'string' ? t : t?.name || t?.investigation;
            return String(tName || '').trim().toLowerCase() === cleanLower;
          });
          if (matchedTest && typeof matchedTest === 'object') {
            let rate = 0;
            let unit = matchedTest.unit || '';
            let range = matchedTest.referenceRange || '';

            if (
              Array.isArray(matchedTest.parameters) &&
              matchedTest.parameters.length > 0
            ) {
              const pWithRate = matchedTest.parameters.find(
                (p) =>
                  p &&
                  p.rate !== undefined &&
                  p.rate !== null &&
                  Number(p.rate) > 0
              );
              if (pWithRate) rate = Number(pWithRate.rate);
              else if (matchedTest.parameters[0]?.rate !== undefined)
                rate = Number(matchedTest.parameters[0].rate);

              if (!unit && matchedTest.parameters[0]?.unit)
                unit = matchedTest.parameters[0].unit;
              if (!range && matchedTest.parameters[0]?.referenceRange)
                range = matchedTest.parameters[0].referenceRange;
            }
            if (!rate && matchedTest.rate) rate = Number(matchedTest.rate);
            if (!rate && matchedTest.pricing?.mrp)
              rate = Number(matchedTest.pricing.mrp);

            return {
              id: matchedTest._id || matchedTest.id || name,
              name: matchedTest.name || name,
              category: group.name,
              unit,
              range,
              rate,
            };
          }
        }
      }

      // 2. Search in catalogue (data.tests)
      const match = catalogue.find(
        (t) =>
          (t.name || t.investigation || '').trim().toLowerCase() === cleanLower
      );
      if (match) {
        return {
          id: match.id || match._id || name,
          name: match.name || name,
          category: match.category || 'General',
          unit: match.unit || '',
          range: match.range || match.referenceRange || '',
          rate: Number(match.rate || 0),
        };
      }

      return { name, rate: 0, unit: '', range: '' };
    });

    const groups = new Set([
      ...selectedGroupIds,
      ...resolvedTests.map((t) => t.category).filter(Boolean),
    ]);

    return {
      tests: resolvedTests,
      groups: Array.from(groups),
    };
  };

  const registerPatient = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const chosen = chosenInvestigations(form);
    if (!chosen.tests.length) {
      setNotice({
        title: 'Validation',
        message: 'Choose at least one test for this visit.',
        type: 'warning',
      });
      return;
    }
    const doctorId = String(form.get('doctorId') || '');
    const referringDoctor = data.doctors.find(
      (doctor) => doctor.id === doctorId || doctor.backendId === doctorId
    );

    const title = String(form.get('title') || '');
    const rawName = String(form.get('name') || '').trim();
    const firstName = String(form.get('firstName') || '').trim();
    const lastName = String(form.get('lastName') || '').trim();
    const name = rawName || [firstName, lastName].filter(Boolean).join(' ');
    const age = Number(form.get('age'));
    const ageUnit = String(form.get('ageUnit') || 'Years');
    const gender = String(form.get('gender') || '');
    const mobile = String(form.get('mobile') || '').trim();
    const email = String(form.get('email') || '').trim();
    const aadhaar = String(form.get('aadhaar') || '').trim();
    const patientHistory = String(form.get('patientHistory') || '').trim();
    const onlineReportRequested =
      form.get('onlineReportRequested') === 'on' ||
      form.get('onlineReportRequested') === 'true' ||
      Boolean(form.get('onlineReportRequested'));
    const address = String(form.get('address') || '').trim();
    const sampleType =
      String(form.get('sampleType') || 'Blood').trim() || 'Blood';
    const registeredOn =
      String(form.get('registeredOn') || date()).trim() || date();
    const collectedOn =
      String(form.get('collectedOn') || registeredOn).trim() || registeredOn;
    const reportedOn = String(form.get('reportedOn') || '').trim();
    const feeOverrideRaw = form.get('feeOverride');
    const feeOverride = feeOverrideRaw !== null && feeOverrideRaw !== '' ? Number(feeOverrideRaw) : null;
    const paidAmount = Number(form.get('paidAmount') || 0);

    let backendResult = null;
    let apiMsg = '';
    let apiErr = '';
    try {
      backendResult = await api.createPatient({
        title,
        name,
        age,
        ageUnit,
        gender,
        mobile,
        email,
        aadhaar,
        patientHistory,
        onlineReportRequested,
        address,
        sampleType,
        registeredOn,
        collectedOn,
        reportedOn,
        feeOverride: feeOverride !== null ? feeOverride : undefined,
        doctorId:
          referringDoctor?.backendId ||
          (referringDoctor?.id?.length === 24 ? referringDoctor.id : undefined),
        tests: chosen.tests.map((t) => t.name),
        testGroups: chosen.groups,
      });
      if (backendResult) {
        apiMsg = backendResult._apiMessage || 'Patient registered successfully';
      }
    } catch (err) {
      console.warn('Backend registration fallback:', err);
      apiErr = err.message || 'Server connection error';
    }

    const createdPatient = backendResult?.patient;
    const createdReport = backendResult?.report;

    const patient = {
      id: createdPatient?.patientNumber || makeId('CCPL', data.patients.length),
      backendId: createdPatient?._id,
      title,
      name,
      age,
      ageUnit,
      gender,
      mobile,
      email,
      aadhaar,
      patientHistory,
      onlineReportRequested,
      sampleType,
      registeredOn,
      doctorId: referringDoctor?.id || '',
      reference: referringDoctor?.name || 'Self',
      address,
    };

    const report = createdReport
      ? {
          id: createdReport._id,
          backendId: createdReport._id,
          number: createdReport.reportNumber,
          patientId: patient.id,
          sampleType,
          registeredOn: createdReport.registeredOn || registeredOn,
          collectedOn: createdReport.collectedOn || collectedOn,
          reportedOn: createdReport.reportedOn || reportedOn,
          status: createdReport.status || 'Draft',
          createdOn: registeredOn,
          fee: Number(createdReport.fee || 0),
          paid: Number(createdReport.paid || 0),
          doctorId: referringDoctor?.id || '',
          doctorPercentage: referringDoctor?.referralPercentage || 0,
          testGroups: chosen.groups,
          hasCustomItemOrder: Boolean(createdReport.hasCustomItemOrder),
          tests: (createdReport.items || []).map((i) => ({
            name: i.testNameSnapshot,
            unit: i.unitSnapshot,
            range: i.rangeSnapshot,
            value: i.value || '',
            remark: i.remark || '',
            rate: i.rateSnapshot,
            alertable: i.alertableSnapshot,
            reportItemId: i._id,
            testId: i.testId,
            category: i.categorySnapshot || '',
            displayOrder: i.displayOrder !== undefined ? i.displayOrder : 0,
          })),
        }
      : {
          id: crypto.randomUUID(),
          number: makeId('CCPL-R', data.reports.length),
          patientId: patient.id,
          sampleType,
          registeredOn,
          collectedOn,
          reportedOn,
          status: 'Draft',
          createdOn: registeredOn,
          fee:
            feeOverride !== null
              ? feeOverride
              : chosen.tests.reduce(
                  (total, test) => total + Number(test.rate || 0),
                  0
                ),
          paid: paidAmount,
          doctorId: referringDoctor?.id || '',
          doctorPercentage: referringDoctor?.referralPercentage || 0,
          testGroups: chosen.groups,
          tests: chosen.tests.map((test) => ({ ...test, value: '' })),
        };

    save({
      ...data,
      patients: [patient, ...data.patients],
      reports: [report, ...data.reports],
    });
    formElement?.reset?.();
    setRegistrationGender('');
    setBookingPickerKey((key) => key + 1);

    if (backendResult) {
      setNotice({
        message: apiMsg || 'Patient registered successfully',
        type: 'success',
      });
    } else if (apiErr) {
      setNotice({
        message: apiErr,
        type: 'warning',
      });
    } else {
      setNotice({
        message: 'Patient registered successfully',
        type: 'success',
      });
    }
  };

  const updatePatient = async (patientId, payload) => {
    const existing = data.patients.find(
      (p) => p.id === patientId || p.backendId === patientId
    );
    const identifier = existing?.backendId || patientId;

    let backendResult = null;
    let apiMsg = '';
    let apiErr = '';

    try {
      backendResult = await api.updatePatient(identifier, payload);
      if (backendResult) {
        apiMsg = backendResult._apiMessage || 'Patient updated successfully';
      }
    } catch (err) {
      console.warn('Backend updatePatient fallback:', err);
      apiErr = err.message || 'Server connection error';
    }

    const referringDoctor = data.doctors.find(
      (doc) => doc.id === payload.doctorId || doc.backendId === payload.doctorId
    );

    const updatedPatient = {
      ...existing,
      ...payload,
      id: existing?.id || patientId,
      backendId: existing?.backendId || (backendResult?._id ? backendResult._id : undefined),
      title: payload.title !== undefined ? payload.title : existing?.title || '',
      name: payload.name !== undefined ? payload.name.trim() : existing?.name || '',
      age: payload.age !== undefined ? Number(payload.age) : existing?.age,
      ageUnit: payload.ageUnit || existing?.ageUnit || 'Years',
      gender: payload.gender || existing?.gender || '',
      mobile: payload.mobile !== undefined ? payload.mobile.trim() : existing?.mobile || '',
      email: payload.email !== undefined ? payload.email.trim() : existing?.email || '',
      aadhaar: payload.aadhaar !== undefined ? payload.aadhaar.trim() : existing?.aadhaar || '',
      patientHistory: payload.patientHistory !== undefined ? payload.patientHistory.trim() : existing?.patientHistory || '',
      onlineReportRequested: payload.onlineReportRequested !== undefined ? Boolean(payload.onlineReportRequested) : existing?.onlineReportRequested || false,
      address: payload.address !== undefined ? payload.address.trim() : existing?.address || '',
      sampleType: payload.sampleType !== undefined ? payload.sampleType : existing?.sampleType || 'Blood',
      registeredOn: payload.registeredOn !== undefined ? payload.registeredOn : existing?.registeredOn || '',
      doctorId: referringDoctor?.id || payload.doctorId || '',
      reference: referringDoctor?.name || (payload.doctorId ? 'Self' : existing?.reference || 'Self'),
    };

    save((current) => ({
      ...current,
      patients: current.patients.map((p) =>
        p.id === updatedPatient.id || (updatedPatient.backendId && p.backendId === updatedPatient.backendId)
          ? updatedPatient
          : p
      ),
      reports: current.reports.map((r) =>
        r.patientId === updatedPatient.id
          ? {
              ...r,
              sampleType: updatedPatient.sampleType || r.sampleType,
            }
          : r
      ),
    }));

    if (backendResult) {
      setNotice({
        message: apiMsg || 'Patient details updated successfully',
        type: 'success',
      });
    } else if (apiErr) {
      setNotice({
        message: `Saved locally: ${apiErr}`,
        type: 'warning',
      });
    } else {
      setNotice({
        message: 'Patient details updated successfully',
        type: 'success',
      });
    }

    return updatedPatient;
  };

  const updateReport = async (reportId, payload) => {
    const existing = data.reports.find(
      (r) => r.id === reportId || r.backendId === reportId || r.number === reportId
    );
    const identifier = existing?.backendId || existing?.id || reportId;

    let backendResult = null;
    let apiMsg = '';
    let apiErr = '';

    try {
      backendResult = await api.updateReport(identifier, payload);
      if (backendResult) {
        apiMsg = backendResult._apiMessage || 'Report updated successfully';
      }
    } catch (err) {
      console.warn('Backend updateReport fallback:', err);
      apiErr = err.message || 'Server connection error';
    }

    const updatedReport = {
      ...existing,
      ...payload,
      id: existing?.id || reportId,
      backendId: existing?.backendId || backendResult?._id,
      number: existing?.number || reportId,
      status: payload.status || existing?.status || 'Final',
      sampleType: payload.sampleType || existing?.sampleType || 'Blood',
      reportedOn: payload.reportedOn !== undefined ? payload.reportedOn : existing?.reportedOn,
      fee: payload.fee !== undefined ? Number(payload.fee) : existing?.fee,
      discount: payload.discount !== undefined ? Number(payload.discount) : existing?.discount,
      paid: payload.paid !== undefined ? Number(payload.paid) : existing?.paid,
      tests: (existing?.tests || []).map((t) => {
        const itemInput = (payload.items || payload.tests || []).find(
          (item) =>
            item.name?.toLowerCase() === t.name?.toLowerCase() ||
            item.testName?.toLowerCase() === t.name?.toLowerCase() ||
            (item.reportItemId && item.reportItemId === t.reportItemId)
        );
        if (itemInput) {
          return {
            ...t,
            value: itemInput.value !== undefined ? itemInput.value : t.value,
            unit: itemInput.unit !== undefined ? itemInput.unit : t.unit,
            range: itemInput.range || itemInput.referenceRange || t.range,
            remark: itemInput.remark !== undefined ? itemInput.remark : t.remark,
          };
        }
        return t;
      }),
    };

    save((current) => ({
      ...current,
      reports: current.reports.map((r) =>
        r.id === updatedReport.id || r.backendId === updatedReport.backendId || r.number === updatedReport.number
          ? updatedReport
          : r
      ),
    }));

    if (backendResult) {
      setNotice({
        message: apiMsg || 'Report updated successfully',
        type: 'success',
      });
    } else if (apiErr) {
      setNotice({
        message: `Saved locally: ${apiErr}`,
        type: 'warning',
      });
    } else {
      setNotice({
        message: 'Report updated successfully',
        type: 'success',
      });
    }

    return updatedReport;
  };

  const finalise = async (report, event) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const customReportedOn =
      String(values.get('reportedOn') || date()).trim() || date();
    const tests = report.tests.map((test) => ({
      ...test,
      value: String(values.get(test.name) || '').trim(),
      unit: String(values.get(`${test.name}-unit`) || test.unit || '').trim(),
      range: String(values.get(`${test.name}-range`) || test.range || '').trim(),
      remark: String(values.get(`${test.name}-remark`) || '').trim(),
    }));
    if (tests.some((test) => !test.value)) {
      setNotice('Enter every observed value before finalising.');
      return;
    }

    const targetId =
      report.backendId || (report.id?.length === 24 ? report.id : null);
    if (targetId) {
      try {
        const resultsPayload = tests.map((t) => ({
          reportItemId: t.reportItemId,
          testName: t.name,
          value: t.value,
          unit: t.unit,
          referenceRange: t.range,
          remark: t.remark,
        }));
        await api.finalizeReport(targetId, {
          items: resultsPayload,
          reportedOn: customReportedOn,
        });
      } catch (err) {
        console.warn('Backend finalise error:', err);
      }
    }

    const updated = {
      ...report,
      status: 'Final',
      reportedOn: customReportedOn,
      tests,
    };
    save({
      ...data,
      reports: data.reports.map((item) =>
        item.id === report.id ? updated : item
      ),
    });
    setSelectedId(updated.id);
    setView('preview');
    setNotice('Report finalised and ready to print.');
  };

  const openReport = (report) => {
    setSelectedId(report.id);
    setView('preview');
  };

  const openInvoice = (report) => {
    const fee = Number(report.fee || 0);
    const discount = Number(report.discount || 0);
    const paid = Number(report.paid || 0);
    const due = Math.max(0, fee - discount - paid);
    if (due > 0) {
      setNotice(
        `Collect remaining balance of ₹${due.toFixed(
          2
        )} before generating the invoice for ${report.number}.`
      );
      return;
    }
    setInvoiceId(report.id);
    setView('invoice');
  };

  const reorderReportTests = async (reportId, orderedItemIds) => {
    try {
      const targetId = String(reportId);
      const res = await api.reorderReportItems(targetId, orderedItemIds);
      if (res) {
        setData((current) => {
          const next = { ...current };
          next.reports = (next.reports || []).map((r) => {
            if (
              String(r.id) === targetId ||
              String(r.backendId) === targetId ||
              String(r.number) === targetId
            ) {
              const updatedItems = res.items || [];
              const testMap = new Map();
              (r.tests || []).forEach((t) =>
                testMap.set(String(t.reportItemId || t.name), t)
              );

              const newTests = updatedItems.map((item) => {
                const existing =
                  testMap.get(String(item._id)) ||
                  testMap.get(item.testNameSnapshot);
                return {
                  ...(existing || {}),
                  name: item.testNameSnapshot,
                  unit: item.unitSnapshot,
                  range: item.rangeSnapshot,
                  value:
                    item.value !== undefined ? item.value : existing?.value || '',
                  remark:
                    item.remark !== undefined
                      ? item.remark
                      : existing?.remark || '',
                  rate: item.rateSnapshot,
                  alertable: item.alertableSnapshot,
                  reportItemId: item._id,
                  testId: item.testId,
                  category: item.categorySnapshot || existing?.category || '',
                  displayOrder: item.displayOrder,
                };
              });

              return {
                ...r,
                hasCustomItemOrder: true,
                tests: newTests,
              };
            }
            return r;
          });
          return next;
        });
        setNotice({
          message: 'Investigation order saved successfully.',
          type: 'success',
        });
        return res;
      }
    } catch (err) {
      console.warn('Backend reorderReportTests error:', err);
      throw err;
    }
  };

  const shareReportPdf = async () => {
    if (!selected) return;
    const outputMode = reportPrintOption;
    const fileName = `CCPL-Report-${selected.number}${
      outputMode === 'without' ? '-without-letterhead' : ''
    }.pdf`;
    setReportPdfMode(outputMode);
    setIsGeneratingReportPdf(true);
    try {
      await new Promise((resolve) =>
        window.requestAnimationFrame(() =>
          window.requestAnimationFrame(resolve)
        )
      );
      const reportElement = document.querySelector('.report-stack');
      if (!reportElement) throw new Error('Report preview is unavailable.');
      const { default: html2pdf } = await import('html2pdf.js');
      const pdf = await html2pdf()
        .set({
          margin: 0,
          filename: fileName,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'] },
        })
        .from(reportElement)
        .outputPdf('blob');
      const file = new File([pdf], fileName, { type: 'application/pdf' });
      if (navigator.canShare?.({ files: [file] }) && navigator.share) {
        try {
          await navigator.share({
            files: [file],
            title: `Report ${selected.number}`,
          });
        } catch (error) {
          if (error?.name !== 'AbortError') throw error;
        }
      } else {
        const downloadUrl = URL.createObjectURL(pdf);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
        setNotice('PDF generated and downloaded. It is ready to share.');
      }
    } catch {
      setNotice('Unable to generate the PDF. Please try again.');
    } finally {
      setReportPdfMode(null);
      setIsGeneratingReportPdf(false);
    }
  };

  const printCatalogue = () => {
    document.body.classList.add('print-catalogue');
    printDocument('CCPL-Test-Availability');
    window.setTimeout(
      () => document.body.classList.remove('print-catalogue'),
      1000
    );
  };

  const createReport = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const patientId = form.get('patientId');
    const chosen = chosenInvestigations(form);
    if (!patientId || !chosen.tests.length) {
      setNotice({
        title: 'Validation',
        message:
          'Choose a patient and at least one test group or individual investigation.',
        type: 'warning',
      });
      return;
    }
    const patient = data.patients.find((item) => item.id === patientId);
    const formDoctorId = String(
      form.get('doctorId') || newReportDoctorId || ''
    ).trim();
    const doctorIdToUse = formDoctorId || patient?.doctorId || '';
    const referringDoctor = data.doctors.find(
      (doctor) => doctor.id === doctorIdToUse || doctor.backendId === doctorIdToUse
    );
    const inputFee = Number(form.get('fee') || 0);
    const calculatedFee = chosen.tests.reduce(
      (total, test) => total + Number(test.rate || 0),
      0
    );
    const fee = inputFee > 0 ? inputFee : calculatedFee;
    const sampleType =
      String(form.get('sampleType') || patient?.sampleType || 'Blood').trim() ||
      'Blood';
    const registeredOn =
      String(
        form.get('registeredOn') || patient?.registeredOn || date()
      ).trim() || date();
    const collectedOn =
      String(form.get('collectedOn') || registeredOn).trim() || registeredOn;
    const reportedOn = String(form.get('reportedOn') || '').trim();

    let backendReport = null;
    let apiMsg = '';
    let apiErr = '';
    try {
      const patientIdentifier = patient?.backendId || patient?.id;
      const backendDoctorId =
        referringDoctor?.backendId ||
        (referringDoctor?.id?.length === 24 ? referringDoctor.id : undefined);
      try {
        backendReport = await api.createReport({
          patientId: patientIdentifier,
          doctorId: backendDoctorId,
          feeOverride: fee,
          sampleType,
          registeredOn,
          collectedOn,
          reportedOn,
          tests: chosen.tests.map((t) => t.name),
          testGroups: chosen.groups,
        });
      } catch (innerErr) {
        if (
          patient &&
          (innerErr.message?.toLowerCase().includes('not found') ||
            innerErr.status === 404)
        ) {
          const regResult = await api.createPatient({
            title: patient.title || '',
            name: patient.name,
            age: patient.age,
            ageUnit: patient.ageUnit || 'Years',
            gender: patient.gender,
            mobile: patient.mobile || '',
            address: patient.address || '',
            sampleType,
            registeredOn,
            collectedOn,
            reportedOn,
            doctorId: backendDoctorId,
            tests: [],
          });
          if (regResult?.patient?._id) {
            patient.backendId = regResult.patient._id;
            backendReport = await api.createReport({
              patientId: regResult.patient._id,
              doctorId: backendDoctorId,
              feeOverride: fee,
              sampleType,
              registeredOn,
              collectedOn,
              reportedOn,
              tests: chosen.tests.map((t) => t.name),
              testGroups: chosen.groups,
            });
          }
        } else {
          throw innerErr;
        }
      }

      if (backendReport) {
        apiMsg = backendReport._apiMessage || 'Draft report created successfully';
      }
    } catch (err) {
      console.warn('Backend create report fallback:', err);
      apiErr = err.message || 'Server connection error';
    }

    const report = backendReport
      ? {
          id: backendReport._id,
          backendId: backendReport._id,
          number: backendReport.reportNumber,
          patientId,
          sampleType,
          registeredOn: backendReport.registeredOn || registeredOn,
          collectedOn: backendReport.collectedOn || collectedOn,
          reportedOn: backendReport.reportedOn || reportedOn,
          status: backendReport.status || 'Draft',
          createdOn: registeredOn,
          fee: Number(backendReport.fee || fee || 0),
          paid: Number(backendReport.paid || 0),
          doctorId: referringDoctor?.id || backendReport.doctorId || '',
          doctorBackendId: referringDoctor?.backendId,
          doctorPercentage:
            referringDoctor?.referralPercentage ??
            backendReport.doctorSnapshot?.referralPercentage ??
            0,
          testGroups: chosen.groups,
          hasCustomItemOrder: Boolean(backendReport.hasCustomItemOrder),
          tests: (backendReport.items || []).map((i) => ({
            name: i.testNameSnapshot,
            unit: i.unitSnapshot,
            range: i.rangeSnapshot,
            value: i.value || '',
            remark: i.remark || '',
            rate: i.rateSnapshot,
            alertable: i.alertableSnapshot,
            reportItemId: i._id,
            testId: i.testId,
            category: i.categorySnapshot || '',
            displayOrder: i.displayOrder !== undefined ? i.displayOrder : 0,
          })),
        }
      : {
          id: crypto.randomUUID(),
          number: makeId('CCPL-R', data.reports.length),
          patientId,
          sampleType,
          registeredOn,
          collectedOn,
          reportedOn,
          status: 'Draft',
          createdOn: registeredOn,
          fee,
          paid: 0,
          doctorId: referringDoctor?.id || '',
          doctorBackendId: referringDoctor?.backendId,
          doctorPercentage: referringDoctor?.referralPercentage || 0,
          testGroups: chosen.groups,
          tests: chosen.tests.map((test) => ({ ...test, value: '' })),
        };

    const updatedPatients = data.patients.map((p) => {
      if (p.id === patientId && referringDoctor) {
        return {
          ...p,
          doctorId: referringDoctor.id,
          reference: referringDoctor.name,
        };
      }
      return p;
    });

    save({
      ...data,
      patients: updatedPatients,
      reports: [report, ...data.reports],
    });
    formElement?.reset?.();
    setNewReportPatientId('');
    setNewReportDoctorId('');
    setBookingFee(0);

    if (backendReport) {
      setNotice({
        message: apiMsg || 'Draft report created successfully',
        type: 'success',
      });
    } else if (apiErr) {
      setNotice({
        message: apiErr,
        type: 'warning',
      });
    } else {
      setNotice({
        message: 'Draft report created successfully',
        type: 'success',
      });
    }

    setView('results');
  };

  const addTest = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const test = catalogueDetails({
      code: String(form.get('code') || '').trim().toUpperCase(),
      name: String(form.get('name') || '').trim(),
      category: String(form.get('category') || '').trim(),
      unit: String(form.get('unit') || '').trim(),
      range: String(form.get('range') || '').trim(),
      rate: form.get('rate'),
    });
    if (!test.name) return;
    if (
      catalogue.some(
        (item) => (item.name || '').toLowerCase() === test.name.toLowerCase()
      )
    ) {
      setNotice('This investigation already exists.');
      return;
    }
    let backendTest = null;
    try {
      backendTest = await api.createTest({
        code: test.code,
        name: test.name,
        category: test.category || 'Biochemistry',
        unit: test.unit || '',
        referenceRange: test.range,
        rate: Number(test.rate || 0),
      });
      setNotice(`✓ ${test.name} added to the test catalogue.`);
    } catch (err) {
      console.warn('Backend add test fallback:', err);
      setNotice(`${test.name} added to the test catalogue.`);
    }
    const saved = {
      ...test,
      backendId: backendTest?._id,
      id: backendTest?._id || test.name,
    };
    save({ ...data, tests: [...catalogue, saved] });
    formElement?.reset?.();
  };

  const saveTest = async (originalName, draft) => {
    const updated = catalogueDetails({ ...draft, name: originalName });
    const existing = catalogue.find((t) => t.name === originalName);
    const targetId =
      existing?.backendId ||
      (existing?.id && String(existing.id).length === 24
        ? existing.id
        : null) ||
      originalName;
    let savedBackendId = existing?.backendId;
    try {
      const backendTest = await api.updateTest(targetId, {
        name: updated.name,
        category: updated.category,
        unit: updated.unit,
        referenceRange: updated.range,
        rate: Number(updated.rate || 0),
        alertable: updated.alertable !== false,
      });
      if (backendTest?._id) {
        savedBackendId = backendTest._id;
        updated.backendId = backendTest._id;
        updated.id = backendTest._id;
      }
      setNotice(`✓ ${updated.name} updated successfully.`);
    } catch (err) {
      console.warn('Backend update test fallback:', err);
      setNotice(`${updated.name} updated.`);
    }
    save({
      ...data,
      tests: catalogue.map((test) =>
        test.name === originalName
          ? {
              ...updated,
              backendId: savedBackendId,
              id: savedBackendId || test.id,
            }
          : test
      ),
    });
  };

  const removeTest = async (name) => {
    const existing = catalogue.find((t) => t.name === name);
    const targetId =
      existing?.backendId ||
      (existing?.id && String(existing.id).length === 24
        ? existing.id
        : null) ||
      name;
    try {
      await api.deleteTest(targetId);
      setNotice(`✓ ${name} removed from the catalogue.`);
    } catch (err) {
      console.warn('Backend delete test fallback:', err);
      setNotice(`${name} removed from the catalogue.`);
    }
    save({ ...data, tests: catalogue.filter((test) => test.name !== name) });
  };

  const addDoctor = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const raw = {
      name: String(form.get('name')).trim(),
      specialty: String(form.get('specialty')).trim(),
      mobile: String(form.get('mobile')).trim(),
      address: String(form.get('address')).trim(),
      referralPercentage: form.get('referralPercentage'),
    };
    if (!raw.name) return;
    let backendDoctor = null;
    try {
      backendDoctor = await api.createDoctor({
        name: raw.name,
        specialty: raw.specialty,
        mobile: raw.mobile,
        address: raw.address,
        referralPercentage: Number(raw.referralPercentage || 0),
      });
    } catch (err) {
      console.warn('Backend add doctor fallback:', err);
    }
    const doctor = normaliseDoctor({
      id: backendDoctor?._id || crypto.randomUUID(),
      backendId: backendDoctor?._id,
      doctorCode:
        backendDoctor?.doctorCode || makeId('DR', data.doctors.length),
      name: raw.name,
      specialty: raw.specialty,
      mobile: raw.mobile,
      address: raw.address,
      referralPercentage: raw.referralPercentage,
    });
    save({ ...data, doctors: [doctor, ...data.doctors] });
    formElement?.reset?.();
    setNotice(`${doctor.name} saved to the referring doctor directory.`);
  };

  const updateDoctor = async (doctorId, draft) => {
    const updated = normaliseDoctor({ ...draft, id: doctorId });
    if (!updated.name) {
      setNotice('A doctor or organisation name is required.');
      return;
    }
    const existing = data.doctors.find((d) => d.id === doctorId);
    if (existing?.backendId || (doctorId && doctorId.length === 24)) {
      try {
        await api.updateDoctor(existing?.backendId || doctorId, {
          name: updated.name,
          specialty: updated.specialty,
          mobile: updated.mobile,
          address: updated.address,
          referralPercentage: Number(updated.referralPercentage || 0),
        });
      } catch (err) {
        console.warn('Backend update doctor fallback:', err);
      }
    }
    save({
      ...data,
      doctors: data.doctors.map((doctor) =>
        doctor.id === doctorId ? updated : doctor
      ),
    });
    setNotice(`${updated.name} updated.`);
  };

  const collectPayment = async (report, paymentData) => {
    const isObject = typeof paymentData === 'object' && paymentData !== null;
    const prevPaid = Number(report.paid || 0);
    const numTotal =
      isObject && paymentData.total !== undefined
        ? Number(paymentData.total)
        : Number(report.fee || 0);
    const numDiscount =
      isObject && paymentData.discount !== undefined
        ? Number(paymentData.discount)
        : Number(report.discount || 0);
    const paymentMethod =
      (isObject && (paymentData.paymentMode || paymentData.paymentMethod)) ||
      report.paymentMethod ||
      'Cash';

    let collectingNow = 0;
    if (isObject) {
      if (paymentData.collectingNow !== undefined) {
        collectingNow = Number(paymentData.collectingNow);
      } else if (paymentData.amount !== undefined) {
        collectingNow = Number(paymentData.amount);
      } else if (paymentData.received !== undefined) {
        const rVal = Number(paymentData.received);
        collectingNow = rVal >= prevPaid ? rVal - prevPaid : rVal;
      }
    } else {
      collectingNow = Number(paymentData || 0);
    }
    collectingNow = Math.max(0, collectingNow);

    const netPayable = Math.max(0, numTotal - numDiscount);
    const newTotalPaid = Math.min(netPayable, prevPaid + collectingNow);
    const newDue = Math.max(0, netPayable - newTotalPaid);

    if (report.backendId || (report.id && report.id.length === 24)) {
      try {
        const invoices = await api.getInvoices({
          reportId: report.backendId || report.id,
        });
        if (Array.isArray(invoices) && invoices.length) {
          await api.recordPayment(invoices[0]._id, {
            amount: collectingNow,
            method: paymentMethod,
            discount: numDiscount,
          });
        }
      } catch (err) {
        console.warn('Backend payment recording fallback:', err);
      }
    }

    save({
      ...data,
      reports: data.reports.map((item) =>
        item.id === report.id
          ? {
              ...item,
              fee: numTotal,
              discount: numDiscount,
              paid: newTotalPaid,
              paymentMethod: paymentMethod,
              paidOn: date(),
              isCollected: newDue === 0,
            }
          : item
      ),
    });

    const p = data.patients.find((item) => item.id === report.patientId);
    const pName = p ? patientName(p) : 'Patient';
    if (newDue === 0) {
      setNotice({
        title: 'Payment complete',
        message:
          prevPaid > 0
            ? `Due cleared: ₹${collectingNow.toFixed(
                2
              )} collected for ${pName} (${
                report.number
              }). Full bill of ₹${numTotal.toFixed(
                2
              )} is now Paid in Full. Tax Invoice is ready to print.`
            : `Full payment of ₹${collectingNow.toFixed(
                2
              )} recorded for ${pName} (${
                report.number
              }). Tax Invoice is ready to print.`,
        type: 'success',
      });
    } else {
      setNotice({
        title: 'Partial payment recorded',
        message: `Partial payment of ₹${collectingNow.toFixed(
          2
        )} recorded for ${pName} (${
          report.number
        }). Remaining due: ₹${newDue.toFixed(
          2
        )}. Tax invoice will be generated upon full payment.`,
        type: 'warning',
      });
    }
  };

  useEffect(() => {
    if (!reportPrintMode || !selected) return;
    printDocument(
      `CCPL-Report-${selected.number}${
        reportPrintMode === 'without' ? '-without-letterhead' : ''
      }`
    );
    setReportPrintMode(null);
  }, [reportPrintMode, selected]);

  const handleLogin = async (event) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const username = String(values.get('username') || '').trim();
    const password = String(values.get('password') || '').trim();
    setLoginError('');

    if (!username || !password) {
      setLoginError('Please enter username/email and password.');
      return;
    }

    try {
      setAuthLoading(true);
      const loginRes = await api.login(username, password);
      if (!loginRes || !loginRes.user) {
        throw new Error('Invalid login response from server.');
      }
      setCurrentUser(loginRes.user);
      if (loginRes.user.laboratory) {
        const lab = loginRes.user.laboratory;
        setLabProfile((prev) => ({
          ...prev,
          name: lab.name || prev.name,
          address: lab.address || prev.address,
          phones:
            lab.phones && lab.phones.length ? lab.phones : prev.phones,
          email: lab.email || prev.email,
          certificateNumber: lab.medicalCertificate || prev.certificateNumber,
          authorisedSignatory:
            lab.authorisedSignatory || prev.authorisedSignatory,
          registrationAuthority:
            lab.registrationDetails || prev.registrationAuthority,
        }));
      }
      sessionStorage.setItem('cell-cited-session', 'active');
      setLoggedIn(true);
      setLoginError('');
      setNotice('Connected to Cell Cited Pathology Lab (MongoDB Atlas).');
    } catch (err) {
      setLoggedIn(false);
      sessionStorage.removeItem('cell-cited-session');
      sessionStorage.removeItem('cell-cited-token');
      sessionStorage.removeItem('cell-cited-user');
      setLoginError(err.message || 'Invalid username or password');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSendOtp = async (event) => {
    event.preventDefault();
    const identifier = forgotIdentifier.trim();
    if (!identifier) return;

    try {
      setAuthLoading(true);
      setAuthNotice('');
      const isEmail = identifier.includes('@');
      const payload = isEmail ? { email: identifier } : { username: identifier };
      const res = await api.forgetPassword(payload);

      const emailReturned = res?.email || identifier;
      setMaskedEmail(emailReturned);
      setAuthMode('reset');

      let msg = `OTP sent to ${emailReturned}. Valid for 10 minutes.`;
      if (res?.devOtp) {
        msg += ` [Dev OTP: ${res.devOtp}]`;
      }
      setAuthNotice(msg);
      setAuthNoticeType('success');
    } catch (err) {
      setAuthNotice(
        err.message ||
          'Failed to send OTP. Please check the email/username and try again.'
      );
      setAuthNoticeType('error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const identifier = forgotIdentifier.trim();
    if (!identifier) return;

    try {
      setAuthLoading(true);
      setAuthNotice('');
      const isEmail = identifier.includes('@');
      const payload = isEmail ? { email: identifier } : { username: identifier };
      const res = await api.forgetPassword(payload);

      let msg = `A new OTP has been sent to ${res?.email || identifier}.`;
      if (res?.devOtp) {
        msg += ` [Dev OTP: ${res.devOtp}]`;
      }
      setAuthNotice(msg);
      setAuthNoticeType('success');
    } catch (err) {
      setAuthNotice(err.message || 'Failed to resend OTP.');
      setAuthNoticeType('error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    if (newPassword.length < 6) {
      setAuthNotice('Password must be at least 6 characters long.');
      setAuthNoticeType('error');
      return;
    }
    if (newPassword !== confirmPassword) {
      setAuthNotice('Passwords do not match. Please re-enter.');
      setAuthNoticeType('error');
      return;
    }
    if (!resetOtp.trim()) {
      setAuthNotice('Please enter the 6-digit OTP code.');
      setAuthNoticeType('error');
      return;
    }

    try {
      setAuthLoading(true);
      setAuthNotice('');
      const identifier = forgotIdentifier.trim();
      const isEmail = identifier.includes('@');
      const payload = {
        ...(isEmail ? { email: identifier } : { username: identifier }),
        otp: resetOtp.trim(),
        newPassword,
      };

      await api.resetPassword(payload);

      setAuthMode('login');
      setResetOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setNotice({
        title: 'Password reset successful',
        message:
          'Your password has been reset successfully! You can now log in with your new password.',
        type: 'success',
      });
    } catch (err) {
      setAuthNotice(
        err.message || 'Failed to reset password. Please verify the OTP.'
      );
      setAuthNoticeType('error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      try {
        localStorage.clear();
      } catch (_) {}
      try {
        sessionStorage.clear();
      } catch (_) {}
      setLoggedIn(false);
      setView('dashboard');
    }
  };

  const value = {
    data,
    setData,
    view,
    setView,
    selectedId,
    setSelectedId,
    invoiceId,
    setInvoiceId,
    patientRecordId,
    setPatientRecordId,
    newReportPatientId,
    setNewReportPatientId,
    newReportDoctorId,
    setNewReportDoctorId,
    bookingFee,
    setBookingFee,
    testBookingLoading,
    setTestBookingLoading,
    testBookingApiInfo,
    setTestBookingApiInfo,
    testBookingRawJson,
    setTestBookingRawJson,
    showApiResponse,
    setShowApiResponse,
    bookingPickerKey,
    setBookingPickerKey,
    registrationGender,
    setRegistrationGender,
    reportPrintMode,
    setReportPrintMode,
    reportPrintOption,
    setReportPrintOption,
    reportPdfMode,
    setReportPdfMode,
    isGeneratingReportPdf,
    setIsGeneratingReportPdf,
    patientSearch,
    setPatientSearch,
    registrationRef,
    notice,
    setNotice,
    showPassword,
    setShowPassword,
    authMode,
    setAuthMode,
    forgotIdentifier,
    setForgotIdentifier,
    maskedEmail,
    setMaskedEmail,
    resetOtp,
    setResetOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showNewPassword,
    setShowNewPassword,
    authLoading,
    setAuthLoading,
    authNotice,
    setAuthNotice,
    authNoticeType,
    setAuthNoticeType,
    loginError,
    setLoginError,
    loggedIn,
    setLoggedIn,
    currentUser,
    setCurrentUser,
    labProfile,
    setLabProfile,
    testGroups,
    setTestGroups,
    sidebarCollapsed,
    setSidebarCollapsed,
    toggleSidebar,

    // Computed
    selected,
    selectedPatient,
    invoiceReport,
    invoicePatient,
    recordPatient,
    finalReports,
    totalPatients,
    todayPatients,
    todayBookings,
    pendingReports,
    todayRevenue,
    todayRelease,
    latestReport,
    latestPatient,
    catalogue,

    // Methods
    save,
    syncWithBackend,
    loadTestBookingData,
    chosenInvestigations,
    registerPatient,
    updatePatient,
    updateReport,
    finalise,
    openReport,
    openInvoice,
    shareReportPdf,
    printCatalogue,
    createReport,
    addTest,
    saveTest,
    removeTest,
    addDoctor,
    updateDoctor,
    collectPayment,
    handleLogin,
    handleLogout,
    handleSendOtp,
    handleResendOtp,
    handleResetPassword,
    reorderReportTests,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
