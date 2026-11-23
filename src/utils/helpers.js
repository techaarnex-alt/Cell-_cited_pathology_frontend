import {
  STORAGE_KEY,
  CATALOGUE_VERSION,
  TEST_GROUPS,
  GROUP_CATEGORIES,
} from '../constants';

export const testKey = (name) =>
  String(name).trim().toLowerCase().replace(/[^a-z0-9]/g, '');

export const categoryForTest = (name, testGroups = TEST_GROUPS) => {
  const groups = Array.isArray(testGroups) && testGroups.length ? testGroups : TEST_GROUPS;
  const group = groups.find((item) => (item.tests || []).includes(name));
  return GROUP_CATEGORIES[group?.id] || 'General';
};

export const catalogueDetails = (test) => ({
  id: test.id || test.backendId || test._id || test.name,
  backendId: test.backendId || test._id || (test.id && String(test.id).length === 24 ? test.id : undefined),
  name: test.name,
  unit: test.unit || test.units || '',
  range: test.range || test.referenceRange || '',
  category: String(test.category || '').trim() || categoryForTest(test.name),
  rate: Math.max(0, Number(test.rate ?? test.price ?? 0) || 0),
  alertable: test.alertable !== false,
});

export const mergeCatalogue = (savedTests = [], applyCurrentReferences = false) => {
  const saved = savedTests.map(catalogueDetails);
  const map = new Map();
  saved.forEach((test) => {
    const key = testKey(test.name);
    if (!key) return;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, test);
    } else {
      map.set(key, {
        ...existing,
        ...test,
        rate: Number(test.rate || 0) > 0 ? Number(test.rate) : Number(existing.rate || 0),
        id: test.backendId || test.id || existing.id,
        backendId: test.backendId || existing.backendId,
      });
    }
  });
  return Array.from(map.values());
};

export const date = () =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date());

export const formatDisplayDate = (d = new Date()) => {
  try {
    const dt = d instanceof Date ? d : new Date(d);
    const day = dt.getDate();
    const month = dt.toLocaleString('en-US', { month: 'short' });
    const year = dt.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return '23 Nov 2026';
  }
};

export const makeId = (prefix, count) =>
  `${prefix}-${String(count + 1).padStart(4, '0')}`;

export const dateFromRecord = (value) => {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const str = String(value).trim();
  const parts = str.split(/[/.-]/).map(Number);
  if (parts.length === 3 && parts.every(Number.isFinite)) {
    if (parts[0] > 1000) return new Date(parts[0], parts[1] - 1, parts[2]);
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const isToday = (value) => {
  if (!value) return false;
  const todayFormatted = date();
  if (typeof value === 'string' && value.trim() === todayFormatted) return true;
  const d = dateFromRecord(value);
  if (!d || Number.isNaN(d.getTime())) return false;
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
};

export const startOfDay = (value) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate());

export const earningsForPeriod = (reports, doctorId, since) =>
  reports.reduce((total, report) => {
    const createdOn = dateFromRecord(report.createdOn);
    const matches =
      report.doctorId === doctorId ||
      (report.doctorBackendId && report.doctorBackendId === doctorId);
    if (!matches || !createdOn || createdOn < since) return total;
    return (
      total +
      (Number(report.fee || 0) * Number(report.doctorPercentage || 0)) / 100
    );
  }, 0);

export const patientName = (patient) =>
  [patient?.title, patient?.name].filter(Boolean).join(' ');

export const genderForTitle = (title) =>
  ({ 'Mr.': 'Male', 'Mrs.': 'Female', 'Ms.': 'Female', Master: 'Male' }[title] ||
  '');

export const numberFrom = (value) => {
  const match = String(value ?? '')
    .replace(/,/g, '')
    .match(/[-+]?\d*\.?\d+/);
  return match ? Number(match[0]) : null;
};

export const referralPercentage = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(100, Math.max(0, parsed)) : 0;
};

export const normaliseDoctor = (doctor = {}, index = 0) => ({
  ...doctor,
  id: String(
    doctor.id ||
      `legacy-doctor-${index}-${String(doctor.name || doctor.doctorName || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')}`
  ),
  doctorCode: String(
    doctor.doctorCode ||
      doctor.code ||
      `DR-${String(index + 1).padStart(3, '0')}`
  ),
  name: String(doctor.name || doctor.doctorName || '').trim(),
  specialty: String(doctor.specialty || doctor.specialisation || '').trim(),
  mobile: String(doctor.mobile || doctor.phone || '').trim(),
  address: String(doctor.address || doctor.clinicAddress || '').trim(),
  referralPercentage: referralPercentage(
    doctor.referralPercentage ?? doctor.percentage ?? doctor.commissionPercentage
  ),
});

export const mergeDoctors = (savedDoctors = []) => {
  const doctors = savedDoctors
    .map(normaliseDoctor)
    .filter((doctor) => doctor.name);
  const map = new Map();
  doctors.forEach((doc) => {
    const key = (doc.name || '').trim().toLowerCase();
    if (!key) return;
    if (!map.has(key)) {
      map.set(key, doc);
    } else {
      map.set(key, { ...map.get(key), ...doc });
    }
  });
  return Array.from(map.values());
};

export const isOutsideReferenceRange = (test) => {
  if (test.alertable === false) return false;
  const observed = numberFrom(test.value);
  const range = String(test.range ?? '');
  if (!Number.isFinite(observed) || !range) return false;

  const upperLimit = range.match(/[<≤]\s*(\d*\.?\d+)/);
  if (upperLimit) return observed > Number(upperLimit[1]);

  const lowerLimit = range.match(/[>≥]\s*(\d*\.?\d+)/);
  if (lowerLimit) return observed < Number(lowerLimit[1]);

  const intervals = [
    ...range.matchAll(/(\d*\.?\d+)\s*(?:–|-|to)\s*(\d*\.?\d+)/gi),
  ]
    .map((match) => [Number(match[1]), Number(match[2])])
    .filter(([low, high]) => Number.isFinite(low) && Number.isFinite(high));
  if (intervals.length === 1)
    return observed < intervals[0][0] || observed > intervals[0][1];
  return intervals.length
    ? observed > Math.max(...intervals.map(([, high]) => high))
    : false;
};

export const normalise = (value = {}) => ({
  catalogueVersion: CATALOGUE_VERSION,
  patients: Array.isArray(value.patients)
    ? value.patients.map((patient) => ({
        ...patient,
        sampleType: patient.sampleType || 'Blood',
        registeredOn:
          patient.registeredOn || patient.createdOn || date(),
      }))
    : [],
  reports: Array.isArray(value.reports)
    ? value.reports.map((report) => ({
        ...report,
        sampleType: report.sampleType || 'Blood',
        registeredOn:
          report.registeredOn || report.createdOn || date(),
        collectedOn:
          report.collectedOn || report.createdOn || date(),
        reportedOn: report.reportedOn || '',
        fee: Number(report.fee || 0),
        discount: Number(report.discount || 0),
        paid: Number(report.paid || 0),
        paymentMethod: report.paymentMethod || 'Cash',
        testGroups: Array.isArray(report.testGroups)
          ? report.testGroups
          : [],
        tests: Array.isArray(report.tests) ? report.tests : [],
      }))
    : [],
  doctors: mergeDoctors(
    Array.isArray(value.doctors) ? value.doctors : []
  ),
  tests: mergeCatalogue(
    Array.isArray(value.tests) ? value.tests : [],
    Number(value.catalogueVersion || 0) < CATALOGUE_VERSION
  ),
});

export const load = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return normalise(JSON.parse(saved));
    return normalise();
  } catch {
    return normalise();
  }
};

export const printDocument = (name) => {
  const title = document.title;
  document.title = name.replace(/[^a-z0-9_-]/gi, '-');
  window.print();
  window.setTimeout(() => {
    document.title = title;
  }, 800);
};
