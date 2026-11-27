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
  id: test.id || test.backendId || test._id || test.name || test.investigation,
  backendId: test.backendId || test._id || (test.id && String(test.id).length === 24 ? test.id : undefined),
  code: test.code || test.testCode || '',
  testCode: test.testCode || test.code || '',
  name: test.name || test.investigation || '',
  investigation: test.investigation || test.name || '',
  unit: test.unit || test.units || '',
  range: test.range || test.referenceRange || '',
  referenceRange: test.referenceRange || test.range || '',
  category: String(test.category || '').trim() || categoryForTest(test.name || test.investigation),
  rate: Math.max(0, Number(test.rate ?? (test.pricing?.mrp !== undefined ? test.pricing.mrp : test.price) ?? 0) || 0),
  alertable: test.alertable !== false,
  method: test.method || '',
  sampleInstructions: test.sampleInstructions || '',
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
  const originalTitle = document.title;
  // Temporarily clear the document title so browsers don't print the title in the header
  document.title = ' ';
  window.print();
  // window.setTimeout(() => {
  //   document.title = originalTitle;
  // }, 1000);
};

export const sortTestsByCatalogueOrder = (items = [], testGroups = []) => {
  if (!Array.isArray(items) || items.length <= 1) return items;
  if (!Array.isArray(testGroups) || testGroups.length === 0) return items;

  const orderMap = new Map();

  const setEntry = (key, entry) => {
    if (!key) return;
    const strKey = String(key).trim();
    if (!strKey) return;
    if (!orderMap.has(strKey)) orderMap.set(strKey, entry);
    const norm = testKey(strKey);
    if (norm && !orderMap.has(norm)) orderMap.set(norm, entry);
  };

  testGroups.forEach((g, gIdx) => {
    if (!g) return;
    const catOrder = Number.isFinite(g.order) ? g.order : gIdx + 1;
    const categoryName = g.name || 'General';

    setEntry(g.name, { catOrder, testOrder: 0, paramOrder: 0, category: categoryName });
    if (g._id) setEntry(String(g._id), { catOrder, testOrder: 0, paramOrder: 0, category: categoryName });
    if (g.id) setEntry(String(g.id), { catOrder, testOrder: 0, paramOrder: 0, category: categoryName });

    const tests = Array.isArray(g.catalogTests)
      ? g.catalogTests
      : Array.isArray(g.tests)
      ? g.tests
      : [];

    tests.forEach((t, tIdx) => {
      if (!t) return;
      const testOrder = typeof t === 'object' && Number.isFinite(t.order) ? t.order : tIdx + 1;
      const tName = typeof t === 'string' ? t : t.name || t.investigation || '';
      const tId = typeof t === 'object' ? (t._id || t.id) : null;

      if (typeof t === 'object' && Array.isArray(t.parameters) && t.parameters.length > 0) {
        t.parameters.forEach((p, pIdx) => {
          if (!p) return;
          const paramOrder = Number.isFinite(p.order) ? p.order : pIdx + 1;
          const pName = p.name || '';
          const pTestId = p.testId ? (p.testId.$oid || String(p.testId)) : null;
          const pId = p._id ? (p._id.$oid || String(p._id)) : p.id;

          const pEntry = {
            catOrder,
            testOrder,
            paramOrder,
            category: categoryName,
            parentTestName: tName,
          };

          if (pName) setEntry(pName, pEntry);
          if (pTestId) setEntry(pTestId, pEntry);
          if (pId) setEntry(pId, pEntry);
        });
      }

      const tEntry = {
        catOrder,
        testOrder,
        paramOrder: 0,
        category: categoryName,
      };
      if (tName) setEntry(tName, tEntry);
      if (typeof t === 'object' && t.shortName) setEntry(t.shortName, tEntry);
      if (tId) setEntry(String(tId), tEntry);
    });
  });

  const getOrderTuple = (testItem) => {
    const DEFAULT_ORDER = 99999;
    if (!testItem) return { catOrder: DEFAULT_ORDER, testOrder: DEFAULT_ORDER, paramOrder: DEFAULT_ORDER };

    const idCandidates = [
      testItem.testId ? String(testItem.testId) : null,
      testItem.reportItemId ? String(testItem.reportItemId) : null,
      testItem._id ? String(testItem._id) : null,
      testItem.id ? String(testItem.id) : null,
    ].filter(Boolean);

    for (const id of idCandidates) {
      if (orderMap.has(id)) return orderMap.get(id);
    }

    const nameCandidates = [
      testItem.testNameSnapshot,
      testItem.name,
      testItem.investigation,
    ].filter(Boolean);

    for (const name of nameCandidates) {
      const rawKey = String(name).trim();
      if (orderMap.has(rawKey)) return orderMap.get(rawKey);
      const normKey = testKey(rawKey);
      if (orderMap.has(normKey)) return orderMap.get(normKey);
    }

    const cat = testItem.categorySnapshot || testItem.category || '';
    if (cat) {
      const catEntry = orderMap.get(cat) || orderMap.get(testKey(cat));
      if (catEntry) {
        return { catOrder: catEntry.catOrder, testOrder: DEFAULT_ORDER, paramOrder: DEFAULT_ORDER };
      }
    }

    return { catOrder: DEFAULT_ORDER, testOrder: DEFAULT_ORDER, paramOrder: DEFAULT_ORDER };
  };

  return [...items].sort((a, b) => {
    const orderA = getOrderTuple(a);
    const orderB = getOrderTuple(b);

    if (orderA.catOrder !== orderB.catOrder) return orderA.catOrder - orderB.catOrder;
    if (orderA.testOrder !== orderB.testOrder) return orderA.testOrder - orderB.testOrder;
    if (orderA.paramOrder !== orderB.paramOrder) return orderA.paramOrder - orderB.paramOrder;
    return 0;
  });
};
