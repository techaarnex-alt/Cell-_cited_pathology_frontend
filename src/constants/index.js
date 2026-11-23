export const STORAGE_KEY = 'cell-cited-pathology-workflow-v1';
export const CATALOGUE_VERSION = 2;

export const SAMPLE_TYPES = [
  'Blood',
  'Body Fluid',
  'Bone Marrow',
  'Cytology',
  'Other Specimens',
  'Pus / Discharge',
  'Semen',
  'Skin / Hair / Nail',
  'Sputum',
  'Stool',
  'Swab',
  'Tissue / Biopsy',
  'Urine',
];

export const DEFAULT_USER = {
  id: '6afea8aca66c8e089c37e22f',
  name: 'Super Administrator',
  username: 'admin',
  email: 'admin@cellcited.com',
  role: 'administrator',
  laboratory: {
    _id: '6afea89e3c0b9ae4477e9de8',
    name: 'Cell Cited Pathology Lab (CCPL)',
    code: 'CCPL',
    address: 'Shop No. 17, City Trade Centre, Lakhperabagh Chauraha, Barabanki - 225001',
    phones: ['9554448906', '6307342505', '8601463398'],
    email: 'ccpath11@gmail.com',
    medicalCertificate: 'CMEE26151240',
    authorisedSignatory: 'Dr. Sanjay Singh, MBBS, MD Pathologist',
    registrationDetails: 'Provisional registration certificate issued by Office of the Chief Medical Officer, Barabanki',
    letterheadAssetUrl: '/report-letterhead.jpg',
    watermarkAssetUrl: '/report-watermark.png',
    timezone: 'Asia/Kolkata',
    isActive: true,
    createdAt: '2026-11-19T07:43:26.411Z',
    updatedAt: '2026-11-19T07:43:26.411Z',
    __v: 0,
  },
};

export const DEFAULT_DOCTORS = [];
export const TESTS = [];
export const TEST_GROUPS = [];

export const GROUP_CATEGORIES = {
  cbc: 'Haematology',
  diabetes: 'Biochemistry',
  lft: 'Biochemistry',
  rft: 'Biochemistry',
  lipid: 'Biochemistry',
  thyroid: 'Hormones',
  coagulation: 'Haematology',
  urine: 'Clinical Pathology',
  stool: 'Clinical Pathology',
  iron: 'Biochemistry',
  dengue: 'Serology',
  widal: 'Serology',
};

export const DEFAULT_LAB_PROFILE = {
  name: 'Cell Cited Pathology Lab (CCPL)',
  tagline: 'Pathology & Healthcare Diagnostic Centre',
  address: 'Shop No. 17, City Trade Centre, Lakhperabagh Chauraha, Barabanki - 225001',
  phones: ['9554448906', '6307342505', '8601463398'],
  email: 'ccpath11@gmail.com',
  certificateNumber: 'CMEE26151240',
  registrationAuthority: 'Provisional registration certificate issued by Office of the Chief Medical Officer, Barabanki',
  signatory: {
    name: 'Dr. Sanjay Singh',
    degrees: 'MBBS, MD Pathologist',
    designation: 'Consultant Pathologist',
  },
  authorisedSignatory: 'Dr. Sanjay Singh, MBBS, MD Pathologist',
};
