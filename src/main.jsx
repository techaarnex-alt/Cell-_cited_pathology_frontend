import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { api } from './api';
import './styles.css';

const STORAGE_KEY = 'cell-cited-pathology-workflow-v1';
const CATALOGUE_VERSION = 2;
const SAMPLE_TYPES = [
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

const DEFAULT_USER = {
  id: "6afea8aca66c8e089c37e22f",
  name: "Super Administrator",
  username: "admin",
  email: "admin@cellcited.com",
  role: "administrator",
  laboratory: {
    _id: "6afea89e3c0b9ae4477e9de8",
    name: "Cell Cited Pathology Lab (CCPL)",
    code: "CCPL",
    address: "Shop No. 17, City Trade Centre, Lakhperabagh Chauraha, Barabanki - 225001",
    phones: [
      "9554448906",
      "6307342505",
      "8601463398"
    ],
    email: "ccpath11@gmail.com",
    medicalCertificate: "CMEE26151240",
    authorisedSignatory: "Dr. Sanjay Singh, MBBS, MD Pathologist",
    registrationDetails: "Provisional registration certificate issued by Office of the Chief Medical Officer, Barabanki",
    letterheadAssetUrl: "/report-letterhead.jpg",
    watermarkAssetUrl: "/report-watermark.png",
    timezone: "Asia/Kolkata",
    isActive: true,
    createdAt: "2026-11-19T07:43:26.411Z",
    updatedAt: "2026-11-19T07:43:26.411Z",
    __v: 0
  }
};
/*
const DEFAULT_DOCTORS = [
  { id: 'doctor-ps-patel', doctorCode: 'DR-001', name: 'Dr. P.S. Patel', referralPercentage: 60 },
  { id: 'satguru-hospital', doctorCode: 'DR-002', name: 'Satguru Hospital', referralPercentage: 60 },
  { id: 'doctor-ruman', doctorCode: 'DR-003', name: 'Dr. RUMAN', referralPercentage: 70 },
];
const TESTS = [
  // Haematology
  { name: 'Haemoglobin', unit: 'g/dL', range: '12.00–15.00', Rate: "0000000" },
  { name: 'Packed Cell Volume (PCV)', unit: '%', range: '36.00–46.00' },
  { name: 'RBC Count', unit: 'million/µL', range: '3.80–4.80' },
  { name: 'MCV', unit: 'fL', range: '80–100' },
  { name: 'Mentzer Index', unit: '', range: 'Screening index: <13 suggests thalassaemia trait; >13 suggests iron deficiency', alertable: false },
  { name: 'MCH', unit: 'pg', range: '27–33' },
  { name: 'MCHC', unit: 'g/dL', range: '32–36' },
  { name: 'RDW-CV', unit: '%', range: '11.50–14.00' },
  { name: 'Total Leucocyte Count (TLC)', unit: 'thou/mm³', range: '4.00–10.00' },
  { name: 'Neutrophils', unit: '%', range: '40–70' },
  { name: 'Lymphocytes', unit: '%', range: '20–40' },
  { name: 'Monocytes', unit: '%', range: '2–8' },
  { name: 'Eosinophils', unit: '%', range: '1–6' },
  { name: 'Basophils', unit: '%', range: '<2.00' },
  { name: 'Metamyelocytes', unit: '%', range: '0–0% (peripheral blood)' },
  { name: 'Myelocytes', unit: '%', range: '0–0% (peripheral blood)' },
  { name: 'Promyelocytes', unit: '%', range: '0–0% (peripheral blood)' },
  { name: 'Blasts', unit: '%', range: '0–0% (peripheral blood)' },
  { name: 'Absolute Neutrophil Count', unit: 'thou/mm³', range: '2.00–7.00' },
  { name: 'Absolute Lymphocyte Count', unit: 'thou/mm³', range: '1.00–3.00' },
  { name: 'Absolute Monocyte Count', unit: 'thou/mm³', range: '0.20–1.00' },
  { name: 'Absolute Eosinophil Count', unit: 'thou/mm³', range: '0.02–0.50' },
  { name: 'Absolute Basophil Count', unit: 'thou/mm³', range: '0.02–0.10' },
  { name: 'Platelet Count', unit: 'thou/mm³', range: '150.00–410.00' },
  { name: 'Mean Platelet Volume', unit: 'fL', range: '7.00–12.00' },
  { name: 'HCT', unit: '%', range: '35–50' },
  { name: 'Prothrombin Concentration', unit: '%', range: '70–140' },
  { name: 'Reticulocyte Count', unit: '%', range: '0.5–2.5' },
  { name: 'Absolute Eosinophil Count (AEC)', unit: 'cells/µL', range: '40–440' },
  { name: 'Bleeding Time', unit: 'min', range: '2–7' },
  { name: 'Clotting Time', unit: 'min', range: '5–11' },
  { name: 'Prothrombin Time (PT)', unit: 'sec', range: '10.0–14.0' },
  { name: 'INR', unit: '', range: '0.90–1.10' },
  { name: 'APTT', unit: 'sec', range: '25–32' },
  { name: 'D-Dimer', unit: 'µg/mL FEU', range: '<0.50' },
  { name: 'Fibrinogen', unit: 'mg/dL', range: '200–400' },
  { name: 'Hb Electrophoresis', unit: '%', range: '95–98' },
  { name: 'ESR', unit: 'mm/hr', range: 'Male: 0–15 · Female: 0–20' },

  // Glucose and diabetes
  { name: 'Glucose Fasting', unit: 'mg/dL', range: '70–100' },
  { name: 'Glucose Post Prandial', unit: 'mg/dL', range: '70–140' },
  { name: 'Glucose Random, Plasma', unit: 'mg/dL', range: '70.00–140.00' },
  { name: 'HbA1c', unit: '%', range: '4.0–5.6 (non-diabetic) · 5.7–6.4 (at risk) · ≥6.5 (diabetes)' },
  { name: 'Average Glucose', unit: 'mg/dL', range: 'Calculated eAG = (28.7 × HbA1c) − 46.7 mg/dL', alertable: false },
  { name: 'GTT Fasting', unit: 'mg/dL', range: '70–99' },
  { name: 'GTT 1 Hour', unit: 'mg/dL', range: 'Protocol-specific (75-g pregnancy test: <180 mg/dL)', alertable: false },
  { name: 'GTT 2 Hour', unit: 'mg/dL', range: 'Below 140' },

  // Liver function
  { name: 'Total Bilirubin', unit: 'mg/dL', range: '0.20–1.20' },
  { name: 'Direct Bilirubin', unit: 'mg/dL', range: '<0.30' },
  { name: 'Indirect Bilirubin', unit: 'mg/dL', range: '<1.10' },
  { name: 'AST (SGOT)', unit: 'U/L', range: '15.00–40.00' },
  { name: 'ALT (SGPT)', unit: 'U/L', range: '10.00–49.00' },
  { name: 'AST:ALT Ratio', unit: 'ratio', range: '<1.00' },
  { name: 'GGT', unit: 'U/L', range: '0–73' },
  { name: 'Alkaline Phosphatase (ALP)', unit: 'U/L', range: '30.00–120.00' },
  { name: 'Total Protein', unit: 'g/dL', range: '6.0–8.30' },
  { name: 'Albumin', unit: 'g/dL', range: '3.5–5.0' },
  { name: 'Globulin', unit: 'g/dL', range: '2.0–3.5' },
  { name: 'A/G Ratio', unit: 'ratio', range: '1.0–2.2' },

  // Renal function and electrolytes
  { name: 'Blood Urea', unit: 'mg/dL', range: '13.00–43.00' },
  { name: 'Blood Urea Nitrogen (BUN)', unit: 'mg/dL', range: '6.00–20.00' },
  { name: 'Serum Creatinine', unit: 'mg/dL', range: '0.55–1.02' },
  { name: 'Estimated GFR', unit: 'mL/min/1.73 m²', range: '≥90' },
  { name: 'BUN/Creatinine Ratio', unit: 'ratio', range: '10–20:1' },
  { name: 'Uric Acid, Serum', unit: 'mg/dL', range: '2.60–6.00' },
  { name: 'Calcium, Total', unit: 'mg/dL', range: '8.70–10.40' },
  { name: 'Phosphorus', unit: 'mg/dL', range: '2.40–5.10' },
  { name: 'Sodium', unit: 'mEq/L', range: '136.00–145.00' },
  { name: 'Potassium', unit: 'mEq/L', range: '3.50–5.10' },
  { name: 'Chloride', unit: 'mEq/L', range: '98.00–107.00' },
  { name: 'Urine Albumin', unit: 'mg/L', range: 'Method and urine-concentration dependent; assess with ACR <30 mg/g', alertable: false },
  { name: 'Urine Creatinine', unit: 'mg/L', range: '15.00–278.00' },
  { name: 'Albumin/Creatinine Ratio (ACR)', unit: 'mg/g', range: '<30.00' },
  { name: '24-hour Urine Total Volume', unit: 'mL', range: '800–2,000' },
  { name: '24-hour Urine Albumin', unit: 'mg', range: '<30' },
  { name: '24-hour Urine Protein', unit: 'mg', range: '<150' },

  // Lipids
  { name: 'Total Cholesterol', unit: 'mg/dL', range: '<200' },
  { name: 'Triglycerides', unit: 'mg/dL', range: '<150' },
  { name: 'HDL Cholesterol', unit: 'mg/dL', range: '>40' },
  { name: 'LDL Cholesterol, Direct', unit: 'mg/dL', range: '<100' },
  { name: 'VLDL Cholesterol', unit: 'mg/dL', range: '<30' },
  { name: 'Non-HDL Cholesterol', unit: 'mg/dL', range: '<130' },

  // Urine and stool examination
  { name: 'Urine Colour', unit: '', range: 'Pale yellow' },
  { name: 'Urine Appearance', unit: '', range: 'Clear' },
  { name: 'Urine Specific Gravity', unit: '', range: '1.001–1.030' },
  { name: 'Urine pH', unit: '', range: '5.0–8.0' },
  { name: 'Urine Protein', unit: '', range: 'Negative' },
  { name: 'Urine Glucose', unit: '', range: 'Negative' },
  { name: 'Urine Ketone', unit: '', range: 'Negative' },
  { name: 'Urine Bilirubin', unit: '', range: 'Negative' },
  { name: 'Urine Urobilinogen', unit: '', range: 'Negative' },
  { name: 'Urine Blood', unit: '', range: 'Negative' },
  { name: 'Leucocyte Esterase', unit: '', range: 'Negative' },
  { name: 'Urine Nitrite', unit: '', range: 'Negative' },
  { name: 'Urine Ascorbic Acid', unit: '', range: 'Negative' },
  { name: 'Urine Pus Cells', unit: '/HPF', range: '0–5' },
  { name: 'Urine RBC', unit: '/HPF', range: '0.0–2.0' },
  { name: 'Urine Epithelial Cells', unit: '/HPF', range: '0.0–5.0' },
  { name: 'Urine Calcium Oxalate Monohydrate Crystals', unit: '/HPF', range: '0.0–0.99' },
  { name: 'Urine Calcium Oxalate Dihydrate Crystals', unit: '/HPF', range: '0.0–0.99' },
  { name: 'Urine Casts', unit: '', range: 'None seen' },
  { name: 'Urine Crystals', unit: '', range: 'None seen' },
  { name: 'Urine Bacteria', unit: '', range: 'None seen' },
  { name: 'Stool Colour', unit: '', range: 'Brown' },
  { name: 'Stool Consistency', unit: '', range: 'Semi-solid' },
  { name: 'Stool Mucus', unit: '', range: 'Absent' },
  { name: 'Stool Blood', unit: '', range: 'Absent' },
  { name: 'Stool Pus Cells', unit: '', range: 'Usually absent' },
  { name: 'Stool RBC', unit: '', range: 'Absent' },
  { name: 'Stool Ova', unit: '', range: 'Absent' },
  { name: 'Stool Cysts', unit: '', range: 'Absent' },
  { name: 'Stool Parasites', unit: '', range: 'Absent' },
  { name: 'Stool Undigested Food', unit: '', range: 'Occasional' },
  { name: 'Stool Trophozoite', unit: '', range: 'Absent' },
  { name: 'Stool Larvae', unit: '', range: 'Absent' },
  { name: 'Stool Fungal Elements', unit: '', range: 'Absent' },

  // Thyroid, hormones, vitamins and iron studies
  { name: 'T3, Total', unit: 'ng/mL', range: '0.60–1.81' },
  { name: 'T4, Total', unit: 'µg/dL', range: '5–12' },
  { name: 'TSH', unit: 'µIU/mL', range: '0.35–5.50' },
  { name: 'Free T3 (FT3)', unit: 'pg/mL', range: '2.30–4.20' },
  { name: 'Free T4 (FT4)', unit: 'ng/dL', range: '0.89–1.76' },
  { name: 'TSH, Ultrasensitive', unit: 'µIU/mL', range: '0.550–4.780' },
  { name: 'FSH', unit: 'mIU/mL', range: 'Male: 1.2–15.8; female: follicular 2.9–14.6, mid-cycle 4.7–23.2, luteal 1.4–8.9, postmenopausal 16.0–157.0', alertable: false },
  { name: 'LH', unit: 'mIU/mL', range: 'Male: 1.3–9.6; female: follicular 1.9–14.6, mid-cycle 12.2–118.0, luteal 0.7–12.9, postmenopausal 5.3–65.4', alertable: false },
  { name: 'Prolactin, Serum', unit: 'ng/mL', range: '2.10–17.70' },
  { name: 'Testosterone', unit: 'ng/dL', range: '164.94–753.38' },
  { name: 'Estradiol', unit: 'pg/mL', range: 'Male: 10–40; female premenopausal: 15–350; postmenopausal: <10 (cycle-specific)', alertable: false },
  { name: 'Progesterone', unit: 'ng/mL', range: 'Male: <0.20; female: follicular ≤0.89, ovulation ≤12, luteal 1.8–24, postmenopausal <0.20', alertable: false },
  { name: 'Cortisol, Morning Serum', unit: 'µg/dL', range: '4.30–22.40' },
  { name: 'PTH', unit: 'pg/mL', range: '15–65 (adults)' },
  { name: 'Insulin', unit: 'µIU/mL', range: 'Fasting: 2.6–24.9', alertable: false },
  { name: 'Fasting Insulin', unit: 'µIU/mL', range: '2.6–24.9' },
  { name: 'Vitamin B12', unit: 'pg/mL', range: '180.00–914.00' },
  { name: 'Vitamin D 25-Hydroxy, Serum', unit: 'nmol/L', range: '75.00–250' },
  { name: 'Ferritin, Serum', unit: 'ng/mL', range: '22.00–322.00' },
  { name: 'Iron', unit: 'µg/dL', range: '65.00–175.00' },
  { name: 'Total Iron Binding Capacity', unit: 'µg/dL', range: '250–425' },
  { name: 'Transferrin Saturation', unit: '%', range: '20.00–50.00' },

  // Serology, microbiology and screening
  { name: 'Beta-hCG, Total', unit: 'mIU/mL', range: '<5.00' },
  { name: 'C-Reactive Protein (CRP)', unit: 'mg/L', range: '<3.3' },
  { name: 'HIV 1 & 2 Antibodies, Screening', unit: 'index value', range: '<1.00 · Negative' },
  { name: 'Hepatitis B Surface Antigen (HBsAg)', unit: '', range: 'Non-reactive' },
  { name: 'Rheumatoid Factor, Serum', unit: 'IU/mL', range: '<14.00' },
  { name: 'Widal Salmonella typhi O (TO)', unit: '', range: 'Non-reactive' },
  { name: 'Widal Salmonella typhi H (TH)', unit: '', range: 'Non-reactive' },
  { name: 'Widal Salmonella typhi A, H (AH)', unit: '', range: 'Reactive up to titre 1:320' },
  { name: 'Widal Salmonella typhi B, H (BH)', unit: '', range: 'Non-reactive' },
  { name: 'Dengue NS1', unit: '', range: 'Negative' },
  { name: 'Dengue IgG', unit: '', range: 'Negative' },
  { name: 'Dengue IgM', unit: '', range: 'Negative' },
  { name: 'Malaria Pf, Qualitative', unit: '', range: 'Negative' },
  { name: 'Malaria Pv, Qualitative', unit: '', range: 'Negative' },
  { name: 'HIV 1, Qualitative', unit: '', range: 'Negative' },
  { name: 'HIV 2, Qualitative', unit: '', range: 'Negative' },
  { name: 'VDRL', unit: '', range: 'Reactive / Non-reactive' },
  { name: 'Typhoid IgM', unit: '', range: 'Positive – acute typhoid fever / Negative' },
  { name: 'Typhoid IgG', unit: '', range: 'Negative' },
  { name: 'Skin Smear', unit: '', range: 'Negative' },
  { name: 'Nail Scraping', unit: '', range: 'Negative' },
  { name: 'MP Antigen Test', unit: '', range: 'Negative' },
  { name: 'HCV Card Test', unit: '', range: 'Non-reactive' },
  { name: 'Urine Pregnancy Card Test', unit: '', range: 'Negative' },

  // Seminal fluid examination
  { name: 'Semen Volume', unit: 'mL', range: '≥1.4 (WHO 2021 lower reference limit)' },
  { name: 'Semen Colour', unit: '', range: 'Pearly white' },
  { name: 'Semen Consistency', unit: '', range: 'Viscid' },
  { name: 'Semen Liquefaction Time', unit: 'min', range: '0–30' },
  { name: 'Semen Reaction', unit: '', range: 'Alkaline' },
  { name: 'Semen Fructose', unit: '', range: 'Positive' },
  { name: 'Total Sperm Count', unit: 'million/mL', range: '≥16 (WHO 2021 lower reference limit)' },
  { name: 'Semen Motility', unit: '%', range: 'Total motility ≥42%; progressive motility ≥30% (WHO 2021)', alertable: false },
  { name: 'Semen Pus Cells', unit: '/HPF', range: 'No universal HPF interval; quantify leukocytes if clinically indicated', alertable: false },
];

// Panels are shortcuts only: every investigation remains available for individual ordering.
const TEST_GROUPS = [
  { id: 'cbc', name: 'Complete Blood Count (CBC)', description: 'Core blood count with differential and platelets', tests: ['Haemoglobin', 'Packed Cell Volume (PCV)', 'RBC Count', 'MCV', 'MCH', 'MCHC', 'RDW-CV', 'Total Leucocyte Count (TLC)', 'Neutrophils', 'Lymphocytes', 'Monocytes', 'Eosinophils', 'Basophils', 'Platelet Count', 'Mean Platelet Volume'] },
  { id: 'diabetes', name: 'Diabetes Profile', description: 'Fasting, post-meal glucose and long-term control', tests: ['Glucose Fasting', 'Glucose Post Prandial', 'HbA1c', 'Average Glucose'] },
  { id: 'lft', name: 'Liver Function Test (LFT)', description: 'Bilirubin, enzymes and protein profile', tests: ['Total Bilirubin', 'Direct Bilirubin', 'Indirect Bilirubin', 'AST (SGOT)', 'ALT (SGPT)', 'AST:ALT Ratio', 'GGT', 'Alkaline Phosphatase (ALP)', 'Total Protein', 'Albumin', 'Globulin', 'A/G Ratio'] },
  { id: 'rft', name: 'Renal Function Test (RFT)', description: 'Kidney markers and electrolytes', tests: ['Blood Urea', 'Blood Urea Nitrogen (BUN)', 'Serum Creatinine', 'Estimated GFR', 'Uric Acid, Serum', 'Sodium', 'Potassium', 'Chloride', 'Calcium, Total', 'Phosphorus'] },
  { id: 'lipid', name: 'Lipid Profile', description: 'Cholesterol and triglyceride assessment', tests: ['Total Cholesterol', 'Triglycerides', 'HDL Cholesterol', 'LDL Cholesterol, Direct', 'VLDL Cholesterol', 'Non-HDL Cholesterol'] },
  { id: 'thyroid', name: 'Thyroid Profile', description: 'T3, T4 and TSH', tests: ['T3, Total', 'T4, Total', 'TSH'] },
  { id: 'coagulation', name: 'Coagulation Profile', description: 'Clotting and bleeding assessment', tests: ['Bleeding Time', 'Clotting Time', 'Prothrombin Time (PT)', 'INR', 'APTT', 'D-Dimer', 'Fibrinogen'] },
  { id: 'urine', name: 'Urine Routine Examination', description: 'Physical, chemical and microscopic examination', tests: ['Urine Colour', 'Urine Appearance', 'Urine Specific Gravity', 'Urine pH', 'Urine Protein', 'Urine Glucose', 'Urine Ketone', 'Urine Bilirubin', 'Urine Urobilinogen', 'Urine Blood', 'Leucocyte Esterase', 'Urine Nitrite', 'Urine Pus Cells', 'Urine RBC', 'Urine Epithelial Cells', 'Urine Casts', 'Urine Crystals', 'Urine Bacteria'] },
  { id: 'stool', name: 'Stool Routine Examination', description: 'Macroscopic and microscopic stool analysis', tests: ['Stool Colour', 'Stool Consistency', 'Stool Mucus', 'Stool Blood', 'Stool Pus Cells', 'Stool RBC', 'Stool Ova', 'Stool Cysts', 'Stool Parasites', 'Stool Undigested Food', 'Stool Trophozoite', 'Stool Larvae', 'Stool Fungal Elements'] },
  { id: 'iron', name: 'Iron Profile', description: 'Iron stores and binding capacity', tests: ['Ferritin, Serum', 'Iron', 'Total Iron Binding Capacity', 'Transferrin Saturation'] },
  { id: 'dengue', name: 'Dengue Profile', description: 'Dengue antigen and antibody screening', tests: ['Dengue NS1', 'Dengue IgG', 'Dengue IgM'] },
  { id: 'widal', name: 'Widal Test', description: 'Salmonella antibody titres', tests: ['Widal Salmonella typhi O (TO)', 'Widal Salmonella typhi H (TH)', 'Widal Salmonella typhi A, H (AH)', 'Widal Salmonella typhi B, H (BH)'] },
];
*/

// Dynamic fallbacks - all data is retrieved dynamically from the real API:
const DEFAULT_DOCTORS = [];
const TESTS = [];
const TEST_GROUPS = [];

const testKey = (name) => String(name).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
const GROUP_CATEGORIES = { cbc: 'Haematology', diabetes: 'Biochemistry', lft: 'Biochemistry', rft: 'Biochemistry', lipid: 'Biochemistry', thyroid: 'Hormones', coagulation: 'Haematology', urine: 'Clinical Pathology', stool: 'Clinical Pathology', iron: 'Biochemistry', dengue: 'Serology', widal: 'Serology' };
const categoryForTest = (name) => {
  const group = (TEST_GROUPS || []).find((item) => (item.tests || []).includes(name));
  return GROUP_CATEGORIES[group?.id] || 'General';
};
const catalogueDetails = (test) => ({
  id: test.id || test.backendId || test._id || test.name,
  backendId: test.backendId || test._id || (test.id && String(test.id).length === 24 ? test.id : undefined),
  name: test.name,
  unit: test.unit || test.units || '',
  range: test.range || test.referenceRange || '',
  category: String(test.category || '').trim() || categoryForTest(test.name),
  rate: Math.max(0, Number(test.rate ?? test.price ?? 0) || 0),
  alertable: test.alertable !== false,
});
const mergeCatalogue = (savedTests = [], applyCurrentReferences = false) => {
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

const date = () => new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date());
const formatDisplayDate = (d = new Date()) => {
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
const makeId = (prefix, count) => `${prefix}-${String(count + 1).padStart(4, '0')}`;
const dateFromRecord = (value) => {
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
const isToday = (value) => {
  if (!value) return false;
  const todayFormatted = date();
  if (typeof value === 'string' && value.trim() === todayFormatted) return true;
  const d = dateFromRecord(value);
  if (!d || Number.isNaN(d.getTime())) return false;
  const now = new Date();
  return d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
};
const startOfDay = (value) => new Date(value.getFullYear(), value.getMonth(), value.getDate());
const earningsForPeriod = (reports, doctorId, since) => reports.reduce((total, report) => {
  const createdOn = dateFromRecord(report.createdOn);
  const matches = report.doctorId === doctorId || (report.doctorBackendId && report.doctorBackendId === doctorId);
  if (!matches || !createdOn || createdOn < since) return total;
  return total + (Number(report.fee || 0) * Number(report.doctorPercentage || 0) / 100);
}, 0);
const patientName = (patient) => [patient?.title, patient?.name].filter(Boolean).join(' ');
const genderForTitle = (title) => ({ 'Mr.': 'Male', 'Mrs.': 'Female', 'Ms.': 'Female', Master: 'Male' }[title] || '');
const numberFrom = (value) => {
  const match = String(value ?? '').replace(/,/g, '').match(/[-+]?\d*\.?\d+/);
  return match ? Number(match[0]) : null;
};
const referralPercentage = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(100, Math.max(0, parsed)) : 0;
};
const normaliseDoctor = (doctor = {}, index = 0) => ({
  ...doctor,
  id: String(doctor.id || `legacy-doctor-${index}-${String(doctor.name || doctor.doctorName || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`),
  doctorCode: String(doctor.doctorCode || doctor.code || `DR-${String(index + 1).padStart(3, '0')}`),
  name: String(doctor.name || doctor.doctorName || '').trim(),
  specialty: String(doctor.specialty || doctor.specialisation || '').trim(),
  mobile: String(doctor.mobile || doctor.phone || '').trim(),
  address: String(doctor.address || doctor.clinicAddress || '').trim(),
  referralPercentage: referralPercentage(doctor.referralPercentage ?? doctor.percentage ?? doctor.commissionPercentage),
});
const mergeDoctors = (savedDoctors = []) => {
  const doctors = savedDoctors.map(normaliseDoctor).filter((doctor) => doctor.name);
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
const isOutsideReferenceRange = (test) => {
  if (test.alertable === false) return false;
  const observed = numberFrom(test.value);
  const range = String(test.range ?? '');
  if (!Number.isFinite(observed) || !range) return false;

  // A less-than reference (for example, <0.50) has a clear upper limit.
  const upperLimit = range.match(/[<≤]\s*(\d*\.?\d+)/);
  if (upperLimit) return observed > Number(upperLimit[1]);

  // A greater-than reference (for example, HDL >40) has a clear lower limit.
  const lowerLimit = range.match(/[>≥]\s*(\d*\.?\d+)/);
  if (lowerLimit) return observed < Number(lowerLimit[1]);

  const intervals = [...range.matchAll(/(\d*\.?\d+)\s*(?:–|-|to)\s*(\d*\.?\d+)/gi)]
    .map((match) => [Number(match[1]), Number(match[2])])
    .filter(([low, high]) => Number.isFinite(low) && Number.isFinite(high));
  if (intervals.length === 1) return observed < intervals[0][0] || observed > intervals[0][1];
  return intervals.length ? observed > Math.max(...intervals.map(([, high]) => high)) : false;
};
const normalise = (value = {}) => ({
  catalogueVersion: CATALOGUE_VERSION,
  patients: Array.isArray(value.patients) ? value.patients.map((patient) => ({
    ...patient,
    sampleType: patient.sampleType || 'Blood',
    registeredOn: patient.registeredOn || patient.createdOn || date(),
  })) : [],
  reports: Array.isArray(value.reports) ? value.reports.map((report) => ({
    ...report,
    sampleType: report.sampleType || 'Blood',
    registeredOn: report.registeredOn || report.createdOn || date(),
    collectedOn: report.collectedOn || report.createdOn || date(),
    reportedOn: report.reportedOn || '',
    fee: Number(report.fee || 0),
    discount: Number(report.discount || 0),
    paid: Number(report.paid || 0),
    paymentMethod: report.paymentMethod || 'Cash',
    testGroups: Array.isArray(report.testGroups) ? report.testGroups : [],
    tests: Array.isArray(report.tests) ? report.tests : [],
  })) : [],
  doctors: mergeDoctors(Array.isArray(value.doctors) ? value.doctors : []),
  tests: mergeCatalogue(Array.isArray(value.tests) ? value.tests : [], Number(value.catalogueVersion || 0) < CATALOGUE_VERSION),
});
const load = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return normalise(JSON.parse(saved));
    return normalise();
  } catch { return normalise(); }
};

function CellCitedMark({ compact = false }) {
  return <div className={`cell-cited-mark ${compact ? 'compact' : ''}`} aria-label="Cell Cited Pathology Lab">
    <span className="logo-image"><img src={`${import.meta.env.BASE_URL}cell-cited-logo.jpg`} alt="Cell Cited medical cross logo" /></span>
    <span><b>Cell Cited</b><strong>Pathology Lab <em>(CCPL)</em></strong></span>
  </div>;
}

function NavIcon({ name }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const icons = {
    dashboard: <><rect {...common} x="3" y="3" width="7" height="7" rx="1" /><rect {...common} x="14" y="3" width="7" height="7" rx="1" /><rect {...common} x="3" y="14" width="7" height="7" rx="1" /><path {...common} d="M14 21v-7h7v7z" /><path {...common} d="M17.5 16v3" /></>,
    patients: <><circle {...common} cx="12" cy="8" r="3.5" /><path {...common} d="M5 21c.6-4.1 3-6 7-6s6.4 1.9 7 6" /></>,
    newreport: <><path {...common} d="M6 3h8l4 4v14H6z" /><path {...common} d="M14 3v5h5M12 11v6M9 14h6" /></>,
    tests: <><path {...common} d="M9 3v6l-4 7.1A3.2 3.2 0 0 0 7.8 21h8.4a3.2 3.2 0 0 0 2.8-4.9L15 9V3" /><path {...common} d="M8 3h8M8.5 16h7" /></>,
    results: <><path {...common} d="M5 3h14v18H5z" /><path {...common} d="M8 8h8M8 12h5M8 16h3" /><path {...common} d="m15 16 1.2 1.2L19 14.5" /></>,
    reports: <><path {...common} d="M7 3h8l4 4v14H7z" /><path {...common} d="M15 3v5h5M10 12h6M10 16h6" /></>,
    billing: <><rect {...common} x="3" y="5" width="18" height="14" rx="2" /><path {...common} d="M3 10h18M7 15h3" /></>,
    business: <><path {...common} d="M4 20V10M10 20V4M16 20v-7M22 20H2" /><path {...common} d="m4 7 5-4 5 4 6-3" /></>,
    doctors: <><path {...common} d="M9 4h6v4a3 3 0 0 1-6 0zM12 11v10M8 14h8M9 21h6" /><path {...common} d="M5 12h2M17 12h2" /></>,
    profile: <><circle {...common} cx="12" cy="12" r="9" /><circle {...common} cx="12" cy="9" r="2.5" /><path {...common} d="M7.8 18c.8-2.1 2.2-3.2 4.2-3.2s3.4 1.1 4.2 3.2" /></>,
    setting: <><circle {...common} cx="12" cy="12" r="3" /><path {...common} d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
    settings: <><circle {...common} cx="12" cy="12" r="3" /><path {...common} d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
    logout: <><path {...common} d="M10 4H5v16h5" /><path {...common} d="M13 8l4 4-4 4M8 12h9" /></>,
  };
  return <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">{icons[name]}</svg>;
}

function DoctorSignature() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = new Image();
    image.src = `${import.meta.env.BASE_URL}dr-sanjay-signature.jpg`;
    const render = () => {
      if (!canvasRef.current) return;
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      for (let index = 0; index < pixels.data.length; index += 4) {
        const red = pixels.data[index]; const green = pixels.data[index + 1]; const blue = pixels.data[index + 2];
        // The source image has a black background and blue handwriting. Keep
        // only blue-ink pixels transparent-to-black, rather than treating all
        // dark pixels as ink.
        const ink = Math.max(0, (blue - red) * 18 + (green - red) * 6 + (blue - 10) * 4);
        pixels.data[index] = 5; pixels.data[index + 1] = 5; pixels.data[index + 2] = 8;
        pixels.data[index + 3] = Math.min(255, ink);
      }
      context.putImageData(pixels, 0, 0);
    };
    if (image.complete && image.naturalWidth > 0) {
      render();
    } else {
      image.onload = render;
    }
  }, []);
  return <canvas ref={canvasRef} className="doctor-signature-canvas" aria-label="Signature of Dr. Sanjay Singh" />;
}

function LetterheadLogo() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const image = new Image();
    image.src = `${import.meta.env.BASE_URL}cell-cited-logo.jpg`;
    image.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      for (let index = 0; index < pixels.data.length; index += 4) {
        const red = pixels.data[index]; const green = pixels.data[index + 1]; const blue = pixels.data[index + 2];
        if (red < 12 && green < 12 && blue < 12) pixels.data[index + 3] = 0;
      }
      context.putImageData(pixels, 0, 0);
    };
  }, []);
  return <canvas ref={canvasRef} className="letterhead-logo" aria-hidden="true" />;
}

function ReportDocument({ report, patient, testGroups = TEST_GROUPS, labProfile = {}, withoutLetterhead = false, pdfExport = false }) {
  const rows = report.tests || [];
  const groupsList = (Array.isArray(testGroups) && testGroups.length) ? testGroups : TEST_GROUPS;
  const PAGE_SIZE = 10;
  const chunks = [];

  // 1. Map each investigation in the report to its clinical profile/panel (CBC, LFT, RFT, Lipid, etc.)
  const getProfileForTest = (test) => {
    const matchedGroup = groupsList.find((g) =>
      (g.tests || []).some((tName) => testKey(tName) === testKey(test.name))
    );
    if (matchedGroup) {
      return matchedGroup.name;
    }
    const cat = String(test.category || '').trim();
    if (cat && cat.toLowerCase() !== 'general') {
      return cat;
    }
    const fallbackCategory = categoryForTest(test.name);
    if (fallbackCategory && fallbackCategory.toLowerCase() !== 'general') {
      return fallbackCategory;
    }
    return 'Clinical Pathology';
  };

  const profileMap = new Map();
  rows.forEach((test) => {
    const profileName = getProfileForTest(test);
    if (!profileMap.has(profileName)) {
      profileMap.set(profileName, []);
    }
    profileMap.get(profileName).push(test);
  });

  // Preserve ordering: Booked groups first, then standard group order, then custom categories
  const orderedProfiles = [];
  (report.testGroups || []).forEach((groupName) => {
    const g = groupsList.find((item) => item.name === groupName || item.id === groupName);
    const resolved = g ? g.name : groupName;
    if (profileMap.has(resolved) && !orderedProfiles.includes(resolved)) {
      orderedProfiles.push(resolved);
    }
  });
  groupsList.forEach((g) => {
    if (profileMap.has(g.name) && !orderedProfiles.includes(g.name)) {
      orderedProfiles.push(g.name);
    }
  });
  profileMap.forEach((_, name) => {
    if (!orderedProfiles.includes(name)) {
      orderedProfiles.push(name);
    }
  });

  // 2. Chunk each profile into pages of at most PAGE_SIZE (10) tests
  orderedProfiles.forEach((profileName) => {
    const tests = profileMap.get(profileName) || [];
    if (!tests.length) return;

    for (let i = 0; i < tests.length; i += PAGE_SIZE) {
      chunks.push({
        rows: tests.slice(i, i + PAGE_SIZE),
        department: i > 0 ? `${profileName} (Continued)` : profileName,
        isProfileEnd: (i + PAGE_SIZE >= tests.length),
      });
    }
  });

  if (!chunks.length) {
    chunks.push({ rows: [], department: 'Clinical Pathology', isProfileEnd: true });
  }

  const labPhones = (labProfile.phones && labProfile.phones.length) ? labProfile.phones.join(' · ') : '9554448906 · 6307342505 · 8601463398';
  const labEmail = labProfile.email || 'ccpath11@gmail.com';
  const labAddress = labProfile.address || 'Shop No. 17, City Trade Centre, Lakhperabagh Chauraha, Barabanki - 225001';
  const labSignatory = labProfile.authorisedSignatory || 'Dr. Sanjay Singh, MBBS, MD Pathologist';

  return <div className={`report-stack ${withoutLetterhead ? 'without-letterhead' : ''} ${pdfExport ? 'pdf-export' : ''}`}>
    {chunks.map((chunk, index) => {
      const first = index === 0;
      const last = index === chunks.length - 1;
      return <article key={index} className={`report-paper ${first ? 'first-page' : 'continuation-page'}`}>
        <div className="report-art" aria-hidden="true"><img className="report-letterhead-image" src={`${import.meta.env.BASE_URL}report-letterhead.jpg`} alt="" /><div className="report-letterhead-clear-area" /></div>
        <div className="report-watermark" aria-hidden="true" />
        <div className="report-content">
          {first ? <>
            <header className="report-letterhead"><div className="report-letterhead-brand"><LetterheadLogo /><span><b>Cell Cited</b><strong>Pathology Lab <em>(CCPL)</em></strong></span></div><div className="report-letterhead-contact"><b>Pathology <i>•</i> Health Care</b><span>{labPhones}</span><small>{labEmail}</small></div><p>{labAddress}</p></header>
            <section className="patient-card">
              <div><p><b>Patient ID :</b><span>{patient.id}</span></p><p><b>Patient Name :</b><span>{patientName(patient)}</span></p><p><b>Age / Gender :</b><span>{patient.age} {patient.ageUnit || 'Years'} / {patient.gender.toUpperCase()}</span></p><p><b>Referred By :</b><span>{patient.reference || 'Self'}</span></p><p><b>Sample Type :</b><span>{report.sampleType || patient?.sampleType || 'Blood'}</span></p></div>
              <div><p><b>Report No. :</b><span>{report.number}</span></p><p><b>Registered On :</b><span>{report.registeredOn || report.createdOn || date()}</span></p><p><b>Collected On :</b><span>{report.collectedOn || report.createdOn || date()}</span></p><p><b>Reported On :</b><span>{report.reportedOn || date()}</span></p></div>
            </section>
            <div className="report-title"><span>Laboratory Examination Report</span><small>Verified laboratory result</small></div>
          </> : <div className="continuation-title"><b>Report No. : {report.number}</b><span>Continued</span></div>}
          <table className="report-table"><thead><tr><th>Test Description</th><th>Observe<br />Value</th><th>Units</th><th>Biological Reference Range</th></tr></thead><tbody>
            <tr className="department"><td colSpan="4">{chunk.department}</td></tr>
            {chunk.rows.map((test) => { const isOutOfRange = isOutsideReferenceRange(test); return <tr key={test.name} className={isOutOfRange ? 'out-of-range' : ''}><td><b>{test.name.toUpperCase()}</b><small>Method / As per laboratory protocol</small></td><td><b>{test.value || '—'}</b></td><td>{test.unit}</td><td>{test.range}</td></tr>; })}
          </tbody></table>
          {(chunk.isProfileEnd || last) && <div className="report-end">End of Report</div>}
          <footer className="signature">
            <span className="signature-image"><DoctorSignature /></span>
            <b>Pathologist</b>
            <strong>{labSignatory}</strong>
            <small>Computer-generated report · Authorised signatory</small>
          </footer>
        </div>
        <div className="report-page-number">Page {index + 1} of {chunks.length}</div>
      </article>;
    })}
  </div>;
}

function InvoiceDocument({ report, patient, labProfile = {} }) {
  const fee = Number(report.fee || 0);
  const discount = Number(report.discount || 0);
  const paid = Number(report.paid || 0);
  const netFee = Math.max(0, fee - discount);
  const due = Math.max(0, netFee - paid);
  const tests = report.tests || [];
  const perTest = tests.length ? fee / tests.length : fee;
  const invoiceNo = `CCPL/INV/${String(report.number || '').replace(/\D/g, '').padStart(4, '0')}`;
  const labPhones = (labProfile.phones && labProfile.phones.length) ? labProfile.phones.join(' · ') : '9554448906 · 6307342505 · 8601463398';
  const labEmail = labProfile.email || 'ccpath11@gmail.com';
  const labAddress = labProfile.address || 'Shop No. 17, City Trade Centre, Lakhperabagh Chauraha, Barabanki - 225001';
  const labName = labProfile.name || 'CELL CITED PATHOLOGY LAB (CCPL)';

  const PAGE_SIZE = 10;
  const chunks = [];
  if (tests.length <= PAGE_SIZE) {
    chunks.push(tests);
  } else {
    for (let i = 0; i < tests.length; i += PAGE_SIZE) {
      chunks.push(tests.slice(i, i + PAGE_SIZE));
    }
  }
  if (!chunks.length) chunks.push([]);

  return <div className="invoice-stack">
    <style>{`.invoice-stack{display:flex;flex-direction:column;gap:24px}.invoice-document{width:210mm;min-height:275mm;margin:0 auto;background:#fffdf7;border:1px solid #e6b344;box-shadow:0 12px 28px rgba(15,58,53,.14);padding:11mm;color:#263536;box-sizing:border-box}.invoice-header{display:grid;grid-template-columns:58px 1fr 150px;gap:14px;align-items:center;background:linear-gradient(100deg,#ffd23f,#f4b613);border-bottom:4px solid #a23523;padding:10px 12px;margin:-11mm -11mm 15px}.invoice-mark{display:grid;place-items:center;width:46px;height:46px;border-radius:50%;background:#a23523;color:#fff;font:900 18px Georgia,serif}.invoice-header h2{margin:0;color:#7c211d;font-size:20px}.invoice-header p{margin:3px 0;color:#3f3215;font-size:10px;font-weight:600}.invoice-title{text-align:right}.invoice-title b{display:inline-block;border-radius:4px;background:#a23523;color:#fff;padding:7px 10px;font-size:13px;letter-spacing:.7px}.invoice-title span{display:block;margin-top:6px;color:#5d4a1f;font-size:10px}.invoice-info{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:15px 0;padding:11px;border:1px solid #e4d5a9;border-radius:6px;font-size:11px;line-height:1.6}.invoice-info p{margin:0}.invoice-info strong{display:inline-block;min-width:31mm;color:#6b541a}.invoice-status{display:inline-block;border-radius:999px;padding:4px 8px;font:700 10px Arial,sans-serif}.invoice-status.paid{background:#ddf2e9;color:#16614e}.invoice-status.due{background:#fff1d5;color:#96620d}.invoice-table{width:100%;border-collapse:collapse;font-size:11px}.invoice-table th{background:#a23523;color:#fff;padding:9px;text-align:left}.invoice-table th:last-child,.invoice-table td:last-child{text-align:right}.invoice-table td{padding:10px 9px;border-bottom:1px solid #e6d9b7}.invoice-table td:first-child{width:42px;color:#806a36}.invoice-summary{width:78mm;margin:13px 0 0 auto;border-top:2px solid #a23523;font-size:11px}.invoice-summary p{display:flex;justify-content:space-between;margin:7px 0}.invoice-summary .grand{padding-top:8px;border-top:1px solid #e6d9b7;color:#7c211d;font-size:14px;font-weight:800}.invoice-foot{display:flex;justify-content:space-between;align-items:end;margin-top:48px;padding-top:10px;border-top:1px solid #e6d9b7;color:#5a655e;font-size:10px}.invoice-foot b{color:#263536}@media print{.invoice-stack{gap:0}.invoice-document{width:210mm;min-height:297mm;margin:0;border:0;box-shadow:none;break-after:page;page-break-after:always}.invoice-document:last-child{break-after:auto;page-break-after:auto}}`}</style>
    <style>{`.invoice-document{background:#fff;border-color:#cbd7ed;color:#273b61}.invoice-header{background:linear-gradient(105deg,#eef3ff,#fff);border-bottom-color:#ee5256}.invoice-mark,.invoice-title b,.invoice-table th{background:#263f85}.invoice-header h2,.invoice-summary .grand{color:#263f85}.invoice-header p,.invoice-title span{color:#526987}.invoice-info{border-color:#d7e1f2}.invoice-info strong{color:#304f94}.invoice-table td{border-bottom-color:#e2e9f5}.invoice-table td:first-child{color:#526987}.invoice-summary{border-top-color:#ee5256}.invoice-summary .grand,.invoice-foot{border-color:#dce5f3}.invoice-foot{color:#5a6c88}.invoice-foot b{color:#263f85}`}</style>
    <style>{`.invoice-header h2{font-size:24px}.invoice-header p{font-size:12px}.invoice-title b{font-size:15px}.invoice-title span{font-size:12px}.invoice-info{font-size:13.5px}.invoice-info strong{min-width:33mm}.invoice-status{font-size:12px}.invoice-table{font-size:13.5px}.invoice-table th{font-size:13px}.invoice-table td{font-size:13.5px}.invoice-table td small{font-size:11.5px}.invoice-summary{font-size:13.5px}.invoice-summary .grand{font-size:17px}.invoice-foot{font-size:11.5px}.invoice-foot b{font-size:12.5px}`}</style>
    {chunks.map((chunk, index) => {
      const isLast = index === chunks.length - 1;
      return <article key={index} className={`invoice-document ${index === 0 ? 'first-page' : 'continuation-page'}`}>
        <header className="invoice-header"><div className="invoice-mark">CC</div><div><h2>{labName}</h2><p>{labAddress}</p><p>{labPhones} · {labEmail}</p></div><div className="invoice-title"><b>TAX INVOICE</b><span>Invoice no. {invoiceNo}</span><span>Date: {report.createdOn}{chunks.length > 1 ? ` · Page ${index + 1} of ${chunks.length}` : ''}</span></div></header>
        <section className="invoice-info"><div><p><strong>Patient name</strong>: {patientName(patient) || '—'}</p><p><strong>Patient ID</strong>: {patient?.id || report.patientId}</p><p><strong>Age / Gender</strong>: {patient?.age || '—'} {patient?.ageUnit || 'years'} / {patient?.gender || '—'}</p></div><div><p><strong>Report no.</strong>: {report.number}</p><p><strong>Referred by</strong>: {patient?.reference || 'Self'}</p><p><strong>Payment mode</strong>: {report.paymentMethod || 'Cash'}</p><p><strong>Payment status</strong>: <span className={`invoice-status ${due ? 'due' : 'paid'}`}>{due ? 'PART PAYMENT / DUE' : 'PAID IN FULL'}</span></p></div></section>
        <table className="invoice-table"><thead><tr><th>S.No.</th><th>Laboratory service / investigation</th><th>Amount</th></tr></thead><tbody>{chunk.map((test, itemIdx) => { const globalIdx = index * PAGE_SIZE + itemIdx; return <tr key={test.name}><td>{globalIdx + 1}</td><td><b>{test.name}</b><br /><small>Laboratory investigation</small></td><td>₹{(globalIdx === tests.length - 1 ? fee - perTest * (tests.length - 1) : perTest).toFixed(2)}</td></tr>; })}</tbody></table>
        {isLast && <>
          <section className="invoice-summary"><p><span>Subtotal</span><b>₹{fee.toFixed(2)}</b></p><p><span>Discount</span><b>₹{discount.toFixed(2)}</b></p><p className="grand"><span>Grand total</span><span>₹{netFee.toFixed(2)}</span></p><p><span>Received</span><b>₹{paid.toFixed(2)}</b></p><p><span>Balance due</span><b>₹{due.toFixed(2)}</b></p></section>
          <footer className="invoice-foot"><div><b>Thank you for choosing Cell Cited Pathology Lab.</b><br />This is a computer-generated invoice and does not require a physical stamp.<br />Services once rendered are subject to laboratory terms and conditions.</div><div><b>Authorised Signatory</b></div></footer>
        </>}
      </article>;
    })}
  </div>;
}

function App() {
  const [data, setData] = useState(load);
  const [view, setView] = useState('dashboard');
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
        fetch('/api/v1/test-groups', { headers: authHeaders }).then((r) => r.json()).catch(() => null),
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
        const processedGroups = fetchedGroups.map((g) => ({
          id: g.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          backendId: g._id,
          name: g.name,
          description: g.description,
          category: g.category,
          tests: (g.testNames && g.testNames.length)
            ? g.testNames
            : (Array.isArray(g.testIds) ? g.testIds.map((t) => (typeof t === 'object' && t ? t.name : t)) : (g.tests || []).map((t) => (typeof t === 'object' && t ? t.name : t))),
          testObjects: Array.isArray(g.testIds) ? g.testIds : [],
        }));
        setTestGroups(processedGroups);
        try { localStorage.setItem('cell-cited-test-groups', JSON.stringify(processedGroups)); } catch { }

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
          if (extractedTests.length || (Array.isArray(testsData) && testsData.length)) {
            const allNewTests = [
              ...(Array.isArray(testsData) ? testsData.map((t) => ({
                id: t._id,
                backendId: t._id,
                name: t.name,
                category: t.category,
                unit: t.unit || '',
                range: t.referenceRange || '',
                rate: t.rate || 0,
                alertable: t.alertable !== false,
              })) : []),
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
  const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem('cell-cited-session') === 'active');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('cell-cited-user');
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
    } catch { }
    return DEFAULT_USER;
  });
  const [labProfile, setLabProfile] = useState({
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
  });
  const [testGroups, setTestGroups] = useState(() => {
    try {
      const saved = localStorage.getItem('cell-cited-test-groups');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const save = (next) => {
    const updated = normalise(typeof next === 'function' ? next(data) : next);
    setData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const syncWithBackend = async () => {
    try {
      const [fetchedPatients, fetchedReports, fetchedDoctors, fetchedTests, fetchedGroups, fetchedLab, fetchedMe] = await Promise.all([
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
        try { sessionStorage.setItem('cell-cited-user', JSON.stringify(fetchedMe)); } catch { }
      }

      if (fetchedLab) {
        setLabProfile({
          name: fetchedLab.name || 'Cell Cited Pathology Lab (CCPL)',
          tagline: fetchedLab.tagline || 'Pathology & Healthcare Diagnostic Centre',
          address: fetchedLab.address || 'Shop No. 17, City Trade Centre, Lakhperabagh Chauraha, Barabanki - 225001',
          phones: (fetchedLab.phones && fetchedLab.phones.length) ? fetchedLab.phones : ['9554448906', '6307342505', '8601463398'],
          email: fetchedLab.email || 'ccpath11@gmail.com',
          certificateNumber: fetchedLab.medicalCertificate || 'CMEE26151240',
          registrationAuthority: fetchedLab.registrationDetails || 'Provisional registration certificate issued by Office of the Chief Medical Officer, Barabanki',
          signatory: fetchedLab.signatory || {
            name: 'Dr. Sanjay Singh',
            degrees: 'MBBS, MD Pathologist',
            designation: 'Consultant Pathologist',
          },
          authorisedSignatory: fetchedLab.authorisedSignatory || 'Dr. Sanjay Singh, MBBS, MD Pathologist',
        });
      }

      if (Array.isArray(fetchedGroups) && fetchedGroups.length) {
        const processedGroups = fetchedGroups.map((g) => ({
          id: g.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          backendId: g._id,
          name: g.name,
          description: g.description,
          category: g.category,
          tests: (g.testNames && g.testNames.length) ? g.testNames : (Array.isArray(g.testIds) ? g.testIds.map((t) => (typeof t === 'object' && t ? t.name : t)) : (g.tests || []).map((t) => (typeof t === 'object' && t ? t.name : t))),
          testObjects: Array.isArray(g.testIds) ? g.testIds : [],
        }));
        setTestGroups(processedGroups);
        try { localStorage.setItem('cell-cited-test-groups', JSON.stringify(processedGroups)); } catch { }
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
            registeredOn: p.registeredOn || (p.createdAt ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(p.createdAt)) : date()),
            createdAt: p.createdAt,
          }));
          changed = true;
        }

        if (Array.isArray(fetchedReports) && fetchedReports.length) {
          next.reports = fetchedReports.map((r) => {
            const existingLocal = (current.reports || []).find((lr) => lr.id === r._id || lr.backendId === r._id || lr.number === r.reportNumber);
            const reportFee = Number(r.fee !== undefined ? r.fee : (existingLocal?.fee || 0));
            const reportDiscount = Number(r.discount !== undefined ? r.discount : (existingLocal?.discount || 0));
            const reportPaid = Number(r.paid !== undefined ? r.paid : (existingLocal?.paid || 0));
            const reportDue = Math.max(0, reportFee - reportDiscount - reportPaid);
            return {
              id: r._id,
              backendId: r._id,
              number: r.reportNumber,
              patientId: r.patientSnapshot?.patientNumber || r.patientId?._id || r.patientId,
              status: r.status,
              createdOn: new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(r.createdAt)),
              registeredOn: r.registeredOn || (r.createdAt ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(r.createdAt)) : date()),
              createdAt: r.createdAt,
              reportedOn: r.reportedOn || existingLocal?.reportedOn || '',
              fee: reportFee,
              discount: reportDiscount,
              paid: reportPaid,
              paymentMethod: r.paymentMethod || existingLocal?.paymentMethod || 'Cash',
              paidOn: r.paidOn || existingLocal?.paidOn || '',
              isCollected: Boolean(r.isCollected || existingLocal?.isCollected || (reportPaid > 0 && reportDue === 0)),
              doctorId: r.doctorId || '',
              doctorPercentage: r.doctorSnapshot?.referralPercentage || 0,
              testGroups: r.testGroupNames || [],
              tests: (r.items || []).map((item) => ({
                name: item.testNameSnapshot,
                unit: item.unitSnapshot,
                range: item.rangeSnapshot,
                value: item.value || '',
                remark: item.remark || '',
                rate: item.rateSnapshot,
                alertable: item.alertableSnapshot,
                reportItemId: item._id,
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

        const groupTests = (Array.isArray(fetchedGroups) ? fetchedGroups : []).flatMap((g) =>
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

        if (groupTests.length || (Array.isArray(fetchedTests) && fetchedTests.length)) {
          next.tests = mergeCatalogue([
            ...(Array.isArray(fetchedTests) ? fetchedTests.map((t) => ({
              id: t._id,
              backendId: t._id,
              name: t.name,
              category: t.category,
              unit: t.unit || '',
              range: t.referenceRange || '',
              rate: t.rate || 0,
              alertable: t.alertable !== false,
            })) : []),
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
    if (loggedIn && ['dashboard', 'patients', 'newreport', 'tests', 'doctors', 'reports', 'billing'].includes(view)) {
      syncWithBackend();
    }
  }, [view, loggedIn]);
  const selected = data.reports.find((report) => report.id === selectedId);
  const selectedPatient = selected && data.patients.find((patient) => patient.id === selected.patientId);
  const invoiceReport = data.reports.find((report) => report.id === invoiceId);
  const invoicePatient = invoiceReport && data.patients.find((patient) => patient.id === invoiceReport.patientId);
  const recordPatient = data.patients.find((patient) => patient.id === patientRecordId);
  const finalReports = data.reports.filter((report) => report.status === 'Final');
  const totalPatients = data.patients.length;
  const todayPatients = data.patients.filter((p) => isToday(p.registeredOn || p.createdOn || p.createdAt)).length;
  const todayBookings = data.reports.filter((r) => isToday(r.registeredOn || r.createdOn || r.createdAt)).length;
  const pendingReports = data.reports.filter((report) => report.status === 'Draft' || report.status === 'Pending').length;
  const todayRevenue = data.reports.reduce((total, r) => {
    const paid = Number(r.paid || 0);
    if (paid <= 0) return total;
    const isPaidToday = isToday(r.paidOn) || (!r.paidOn && isToday(r.registeredOn || r.createdOn || r.createdAt));
    return isPaidToday ? total + paid : total;
  }, 0);
  const todayRelease = data.reports.filter((r) => (r.status === 'Final' || r.status === 'Completed') && isToday(r.createdOn || r.createdAt || r.registeredOn)).length;
  const latestReport = data.reports && data.reports.length > 0 ? data.reports[0] : null;
  const latestPatient = latestReport ? data.patients.find((p) => p.id === latestReport.patientId) : null;
  const catalogue = data.tests;
  const chosenInvestigations = (form) => {
    const individuallySelected = form.getAll('tests');
    const selectedGroupIds = form.getAll('testGroups');
    const groupedTests = testGroups
      .filter((group) => selectedGroupIds.includes(group.id))
      .flatMap((group) => group.tests || []);
    const names = new Set([...individuallySelected, ...groupedTests]);

    const resolvedTests = Array.from(names).map((name) => {
      const match = catalogue.find((t) => t.name?.toLowerCase() === name.toLowerCase());
      if (match) return match;
      const fromObj = testGroups.flatMap((g) => g.testObjects || []).find((t) => t.name?.toLowerCase() === name.toLowerCase());
      if (fromObj) {
        return {
          id: fromObj._id || name,
          name: fromObj.name,
          category: fromObj.category,
          unit: fromObj.unit || '',
          range: fromObj.referenceRange || '',
          rate: fromObj.rate || 0,
        };
      }
      return { name, rate: 0, unit: '', range: '' };
    });

    return {
      tests: resolvedTests,
      groups: testGroups.filter((group) => selectedGroupIds.includes(group.id)).map((group) => group.name),
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
    const referringDoctor = data.doctors.find((doctor) => doctor.id === doctorId || doctor.backendId === doctorId);

    const title = String(form.get('title') || '');
    const name = String(form.get('name') || '').trim();
    const age = Number(form.get('age'));
    const ageUnit = String(form.get('ageUnit') || 'Years');
    const gender = String(form.get('gender') || '');
    const mobile = String(form.get('mobile') || '').trim();
    const address = String(form.get('address') || '').trim();
    const sampleType = String(form.get('sampleType') || 'Blood').trim() || 'Blood';
    const registeredOn = String(form.get('registeredOn') || date()).trim() || date();
    const collectedOn = String(form.get('collectedOn') || registeredOn).trim() || registeredOn;
    const reportedOn = String(form.get('reportedOn') || '').trim();

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
        address,
        sampleType,
        registeredOn,
        collectedOn,
        reportedOn,
        doctorId: referringDoctor?.backendId || (referringDoctor?.id?.length === 24 ? referringDoctor.id : undefined),
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
      sampleType,
      registeredOn,
      doctorId: referringDoctor?.id || '',
      reference: referringDoctor?.name || 'Self',
      address,
    };

    const report = createdReport ? {
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
      tests: (createdReport.items || []).map((i) => ({
        name: i.testNameSnapshot,
        unit: i.unitSnapshot,
        range: i.rangeSnapshot,
        value: i.value || '',
        remark: i.remark || '',
        rate: i.rateSnapshot,
        alertable: i.alertableSnapshot,
        reportItemId: i._id,
      })),
    } : {
      id: crypto.randomUUID(),
      number: makeId('CCPL-R', data.reports.length),
      patientId: patient.id,
      sampleType,
      registeredOn,
      collectedOn,
      reportedOn,
      status: 'Draft',
      createdOn: registeredOn,
      fee: chosen.tests.reduce((total, test) => total + Number(test.rate || 0), 0),
      paid: 0,
      doctorId: referringDoctor?.id || '',
      doctorPercentage: referringDoctor?.referralPercentage || 0,
      testGroups: chosen.groups,
      tests: chosen.tests.map((test) => ({ ...test, value: '' })),
    };

    save({ ...data, patients: [patient, ...data.patients], reports: [report, ...data.reports] });
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

  const finalise = async (report, event) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const customReportedOn = String(values.get('reportedOn') || date()).trim() || date();
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

    const targetId = report.backendId || (report.id?.length === 24 ? report.id : null);
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

    const updated = { ...report, status: 'Final', reportedOn: customReportedOn, tests };
    save({ ...data, reports: data.reports.map((item) => (item.id === report.id ? updated : item)) });
    setSelectedId(updated.id);
    setView('preview');
    setNotice('Report finalised and ready to print.');
  };

  const openReport = (report) => { setSelectedId(report.id); setView('preview'); };
  const openInvoice = (report) => {
    const fee = Number(report.fee || 0);
    const discount = Number(report.discount || 0);
    const paid = Number(report.paid || 0);
    const due = Math.max(0, fee - discount - paid);
    if (due > 0) {
      setNotice(`Collect remaining balance of ₹${due.toFixed(2)} before generating the invoice for ${report.number}.`);
      return;
    }
    setInvoiceId(report.id);
    setView('invoice');
  };
  const printDocument = (name) => { const title = document.title; document.title = name.replace(/[^a-z0-9_-]/gi, '-'); window.print(); window.setTimeout(() => { document.title = title; }, 800); };
  const shareReportPdf = async () => {
    if (!selected) return;
    const outputMode = reportPrintOption;
    const fileName = `CCPL-Report-${selected.number}${outputMode === 'without' ? '-without-letterhead' : ''}.pdf`;
    setReportPdfMode(outputMode);
    setIsGeneratingReportPdf(true);
    try {
      await new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)));
      const reportElement = document.querySelector('.report-stack');
      if (!reportElement) throw new Error('Report preview is unavailable.');
      const { default: html2pdf } = await import('html2pdf.js');
      const pdf = await html2pdf().set({
        margin: 0,
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] },
      }).from(reportElement).outputPdf('blob');
      const file = new File([pdf], fileName, { type: 'application/pdf' });
      if (navigator.canShare?.({ files: [file] }) && navigator.share) {
        try { await navigator.share({ files: [file], title: `Report ${selected.number}` }); }
        catch (error) { if (error?.name !== 'AbortError') throw error; }
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
    window.setTimeout(() => document.body.classList.remove('print-catalogue'), 1000);
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
        message: 'Choose a patient and at least one test group or individual investigation.',
        type: 'warning',
      });
      return;
    }
    const patient = data.patients.find((item) => item.id === patientId);
    const formDoctorId = String(form.get('doctorId') || newReportDoctorId || '').trim();
    const doctorIdToUse = formDoctorId || patient?.doctorId || '';
    const referringDoctor = data.doctors.find((doctor) => doctor.id === doctorIdToUse || doctor.backendId === doctorIdToUse);
    const inputFee = Number(form.get('fee') || 0);
    const calculatedFee = chosen.tests.reduce((total, test) => total + Number(test.rate || 0), 0);
    const fee = inputFee > 0 ? inputFee : calculatedFee;
    const sampleType = String(form.get('sampleType') || patient?.sampleType || 'Blood').trim() || 'Blood';
    const registeredOn = String(form.get('registeredOn') || patient?.registeredOn || date()).trim() || date();
    const collectedOn = String(form.get('collectedOn') || registeredOn).trim() || registeredOn;
    const reportedOn = String(form.get('reportedOn') || '').trim();

    let backendReport = null;
    let apiMsg = '';
    let apiErr = '';
    try {
      const patientIdentifier = patient?.backendId || patient?.id;
      const backendDoctorId = referringDoctor?.backendId || (referringDoctor?.id?.length === 24 ? referringDoctor.id : undefined);
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
        if (patient && (innerErr.message?.toLowerCase().includes('not found') || innerErr.status === 404)) {
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
        console.log("backendReport._apiMessage", backendReport._apiMessage)
        apiMsg = backendReport._apiMessage || 'Draft report created successfully';
      }
    } catch (err) {
      console.warn('Backend create report fallback:', err);
      apiErr = err.message || 'Server connection error';
    }

    const report = backendReport ? {
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
      doctorPercentage: referringDoctor?.referralPercentage ?? backendReport.doctorSnapshot?.referralPercentage ?? 0,
      testGroups: chosen.groups,
      tests: (backendReport.items || []).map((i) => ({
        name: i.testNameSnapshot,
        unit: i.unitSnapshot,
        range: i.rangeSnapshot,
        value: i.value || '',
        remark: i.remark || '',
        rate: i.rateSnapshot,
        alertable: i.alertableSnapshot,
        reportItemId: i._id,
      })),
    } : {
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

    save({ ...data, patients: updatedPatients, reports: [report, ...data.reports] });
    formElement?.reset?.();
    setNewReportPatientId('');
    setNewReportDoctorId('');
    setBookingFee(0);

    if (backendReport) {
      console.log('API Message:', apiMsg);
      setNotice({
        message: apiMsg || 'Draft report created successfully',
        type: 'success',
      });
    } else if (apiErr) {
      console.warn('API Error:', apiErr);
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
      name: String(form.get('name')).trim(),
      category: String(form.get('category')).trim(),
      unit: String(form.get('unit')).trim(),
      range: String(form.get('range')).trim(),
      rate: form.get('rate'),
    });
    if (!test.name) return;
    if (catalogue.some((item) => item.name.toLowerCase() === test.name.toLowerCase())) {
      setNotice('This investigation already exists.');
      return;
    }
    let backendTest = null;
    try {
      backendTest = await api.createTest({
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
    const saved = { ...test, backendId: backendTest?._id, id: backendTest?._id || test.name };
    save({ ...data, tests: [...catalogue, saved] });
    formElement?.reset?.();
  };

  const saveTest = async (originalName, draft) => {
    const updated = catalogueDetails({ ...draft, name: originalName });
    const existing = catalogue.find((t) => t.name === originalName);
    const targetId = existing?.backendId || (existing?.id && String(existing.id).length === 24 ? existing.id : null) || originalName;
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
        test.name === originalName ? { ...updated, backendId: savedBackendId, id: savedBackendId || test.id } : test
      ),
    });
  };

  const removeTest = async (name) => {
    const existing = catalogue.find((t) => t.name === name);
    const targetId = existing?.backendId || (existing?.id && String(existing.id).length === 24 ? existing.id : null) || name;
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
      doctorCode: backendDoctor?.doctorCode || makeId('DR', data.doctors.length),
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
    if (!updated.name) { setNotice('A doctor or organisation name is required.'); return; }
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
    save({ ...data, doctors: data.doctors.map((doctor) => (doctor.id === doctorId ? updated : doctor)) });
    setNotice(`${updated.name} updated.`);
  };

  useEffect(() => {
    const syncDoctors = (event) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try { setData(normalise(JSON.parse(event.newValue))); } catch { /* Keep the active workspace if external data is invalid. */ }
    };
    window.addEventListener('storage', syncDoctors);
    return () => window.removeEventListener('storage', syncDoctors);
  }, []);

  const collectPayment = async (report, paymentData) => {
    const isObject = typeof paymentData === 'object' && paymentData !== null;
    const prevPaid = Number(report.paid || 0);
    const numTotal = isObject && paymentData.total !== undefined ? Number(paymentData.total) : Number(report.fee || 0);
    const numDiscount = isObject && paymentData.discount !== undefined ? Number(paymentData.discount) : Number(report.discount || 0);
    const paymentMethod = (isObject && (paymentData.paymentMode || paymentData.paymentMethod)) || report.paymentMethod || 'Cash';

    // collectingNow is the amount collected in this transaction
    let collectingNow = 0;
    if (isObject) {
      if (paymentData.collectingNow !== undefined) {
        collectingNow = Number(paymentData.collectingNow);
      } else if (paymentData.amount !== undefined) {
        collectingNow = Number(paymentData.amount);
      } else if (paymentData.received !== undefined) {
        const rVal = Number(paymentData.received);
        // If received is cumulative total paid:
        collectingNow = rVal >= prevPaid ? (rVal - prevPaid) : rVal;
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
        const invoices = await api.getInvoices({ reportId: report.backendId || report.id });
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
        message: prevPaid > 0
          ? `Due cleared: ₹${collectingNow.toFixed(2)} collected for ${pName} (${report.number}). Full bill of ₹${numTotal.toFixed(2)} is now Paid in Full. Tax Invoice is ready to print.`
          : `Full payment of ₹${collectingNow.toFixed(2)} recorded for ${pName} (${report.number}). Tax Invoice is ready to print.`,
        type: 'success',
      });
    } else {
      setNotice({
        title: 'Partial payment recorded',
        message: `Partial payment of ₹${collectingNow.toFixed(2)} recorded for ${pName} (${report.number}). Remaining due: ₹${newDue.toFixed(2)}. Tax invoice will be generated upon full payment.`,
        type: 'warning',
      });
    }
  };

  useEffect(() => {
    if (!reportPrintMode || !selected) return;
    printDocument(`CCPL-Report-${selected.number}${reportPrintMode === 'without' ? '-without-letterhead' : ''}`);
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
          phones: (lab.phones && lab.phones.length) ? lab.phones : prev.phones,
          email: lab.email || prev.email,
          certificateNumber: lab.medicalCertificate || prev.certificateNumber,
          authorisedSignatory: lab.authorisedSignatory || prev.authorisedSignatory,
          registrationAuthority: lab.registrationDetails || prev.registrationAuthority,
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
      setAuthNotice(err.message || 'Failed to send OTP. Please check the email/username and try again.');
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
        message: 'Your password has been reset successfully! You can now log in with your new password.',
        type: 'success',
      });
    } catch (err) {
      setAuthNotice(err.message || 'Failed to reset password. Please verify the OTP.');
      setAuthNoticeType('error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setLoggedIn(false);
  };

  const noticeTitle = typeof notice === 'object' && notice !== null ? notice.title : '';
  const noticeText = typeof notice === 'object' && notice !== null ? notice.message : String(notice || '');
  const noticeType = typeof notice === 'object' && notice !== null ? (notice.type || 'success') : (String(notice).startsWith('⚠') ? 'warning' : 'info');

  const toastElement = notice ? (
    <div className={`toast toast-${noticeType}`} role="status" aria-live="polite">
      <div className="toast-icon">
        {noticeType === 'success' ? '✓' : noticeType === 'warning' ? '⚠' : 'ℹ'}
      </div>
      <div className="toast-body">
        {noticeTitle && <div className="toast-title">{noticeTitle}</div>}
        <div className="toast-message">{noticeText}</div>
      </div>
      <button className="toast-close" onClick={() => setNotice('')} aria-label="Close notification" title="Dismiss">×</button>
    </div>
  ) : null;

  if (!loggedIn)
    return (
      <main className="login">
        <section className="login-brand-panel">
          <div className="login-brand-header">
            <CellCitedMark />
            <div className="login-doctor-tag" title="Consultant Pathologist & Signatory">
              <span className="doc-icon">👨‍⚕️</span>
              <div>
                <strong>Dr. Sanjay Singh</strong>
                <span>MD (Path)</span>
              </div>
            </div>
          </div>

          <span className="login-eyebrow">PATHOLOGY · HEALTH CARE</span>
          <h1 className="login-title">Cell Cited Pathology Lab <span className="sub-abbr">(CCPL)</span></h1>
          {/* <p className="login-intro">
            Comprehensive diagnostic services with computerized laboratory workflow and accredited medical reports.
          </p> */}

          <div className="login-services-grid">
            <div className="service-chip">
              <span className="chip-bullet">•</span>
              <b>All Types  Pathology Tests Available </b>
            </div>
            <div className="service-chip">
              <span className="chip-bullet">•</span>
              <b>24x7 Sample Collection Facility </b>
            </div>
            <div className="service-chip">
              <span className="chip-bullet">•</span>
              <b>Home Sample Collection Available </b>
            </div>
            <div className="service-chip">
              <span className="chip-bullet">•</span>
              <b>Fast & Reliable Report Delivery</b>
            </div>
            <div className="service-chip">
              <span className="chip-bullet">•</span>
              <b>Full Body Health Checkup Package</b>
            </div>
          </div>

          <div className="login-contact-card">
            <div className="contact-item">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <div>
                <span className="contact-label">Helpline Numbers</span>
                <span className="contact-value">9554448906, 6307342505, 8601463398</span>
              </div>
            </div>

            <div className="contact-item">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <div>
                <span className="contact-label">Email Support</span>
                <span className="contact-value">ccpath11@gmail.com</span>
              </div>
            </div>

            <div className="contact-item">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <span className="contact-label">Laboratory Address</span>
                <span className="contact-value">Shop No.-17 City Trade Center Lakhpedabagh Chauraha Barabanki ( 225001)</span>
              </div>
            </div>
          </div>
        </section>
        {authMode === 'login' && (
          <form onSubmit={handleLogin}>
            <h2>Sign in</h2>
            {loginError && (
              <div className="login-error-alert" role="alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{loginError}</span>
              </div>
            )}
            <input
              name="username"
              placeholder="Username or Email"
              required
              defaultValue={forgotIdentifier || ''}
              onChange={() => { if (loginError) setLoginError(''); }}
            />
            <div className="password-input-wrapper">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                required
                onChange={() => { if (loginError) setLoginError(''); }}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            <div className="login-forgot-row">
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setAuthMode('forgot');
                  setAuthNotice('');
                  setLoginError('');
                }}
              >
                Forgot password?
              </button>
            </div>
            <button type="submit" disabled={authLoading}>
              {authLoading ? 'Opening workspace...' : 'Login'}
            </button>
            {notice && <p className="notice">{noticeText}</p>}
          </form>
        )}

        {authMode === 'forgot' && (
          <form onSubmit={handleSendOtp} className="auth-card-form">
            <h2>Forgot password</h2>
            <p className="auth-card-desc">
              Enter your registered email address or username to receive a 6-digit OTP code to reset your password.
            </p>
            <input
              name="forgotIdentifier"
              type="text"
              value={forgotIdentifier}
              onChange={(e) => setForgotIdentifier(e.target.value)}
              placeholder="Registered email or username"
              required
              autoFocus
            />
            <button type="submit" disabled={authLoading}>
              {authLoading ? 'Sending OTP via EmailJS...' : 'Send OTP'}
            </button>
            {authNotice && <p className={`auth-card-notice ${authNoticeType}`}>{authNotice}</p>}
            <div className="auth-card-footer">
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setAuthMode('login');
                  setAuthNotice('');
                }}
              >
                ← Back to Sign in
              </button>
            </div>
          </form>
        )}

        {authMode === 'reset' && (
          <form onSubmit={handleResetPassword} className="auth-card-form">
            <h2>Reset password</h2>
            <p className="auth-card-desc">
              Enter the 6-digit OTP sent to <b>{maskedEmail || forgotIdentifier}</b> and set a new password.
            </p>
            <input
              name="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={resetOtp}
              onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 6-digit OTP"
              required
              autoFocus
              className="otp-code-input"
            />
            <div className="password-input-wrapper">
              <input
                name="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min 6 characters)"
                required
                minLength={6}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowNewPassword((prev) => !prev)}
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                title={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            <input
              name="confirmPassword"
              type={showNewPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              minLength={6}
            />
            <button type="submit" disabled={authLoading}>
              {authLoading ? 'Resetting password...' : 'Reset password'}
            </button>
            <div className="resend-row">
              <span>Didn't receive code?</span>
              <button
                type="button"
                className="link-btn"
                disabled={authLoading}
                onClick={handleResendOtp}
              >
                Resend OTP
              </button>
            </div>
            {authNotice && <p className={`auth-card-notice ${authNoticeType}`}>{authNotice}</p>}
            <div className="auth-card-footer">
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setAuthMode('login');
                  setAuthNotice('');
                }}
              >
                ← Back to Sign in
              </button>
            </div>
          </form>
        )}
      </main>
    );

  return <div className="app-shell">
    {toastElement && createPortal(toastElement, document.body)}
    <aside><div className="brand"><CellCitedMark compact /></div><nav>{[['dashboard', 'Dashboard'], ['patients', 'Patients & Registration'], ['newreport', 'Test Booking'], ['billing', 'Billing'], ['results', 'Result entry'], ['reports', 'Reports'], ['doctors', 'Doctors'], ['tests', 'Test catalogue'], ['business', 'Business report'], ['profile', 'Profile'], ['setting', 'Settings']].map(([key, label]) => <button key={key} className={view === key ? 'active' : ''} onClick={() => setView(key)}><NavIcon name={key} /><span>{label}</span></button>)}</nav><button className="logout" onClick={handleLogout}><NavIcon name="logout" /><span>Log out</span></button><p className="aarnex-credit">Created &amp; Designed by <b>Aarnex Tech</b></p></aside>
    <main className="workspace">
      <header className="app-topbar">
        <div>
          <span className="topbar-kicker">WELCOME TO CELL CITED PATHOLOGY LAB</span>
        </div>
        <div className="topbar-actions">
          {/* <span className="secure-badge">● Secure local workspace</span> */}
          <span className="topbar-date" title="Today's Date">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="calendar-icon">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{formatDisplayDate()}</span>
          </span>
        </div>
      </header>
      {view === 'dashboard' && <>
        <header className="page-head">
          <div>
            <span className="eyebrow">OPERATIONS / OVERVIEW</span>


          </div>
          <button onClick={() => setView('patients')}>+ New patient</button>
        </header>

        <section className="metrics dashboard-metrics">
          <article onClick={() => setView('patients')} style={{ cursor: 'pointer' }} title="View all patients">
            <span className="metric-label">Total patients</span>
            <b className="metric-number">{totalPatients}</b>
            <span className="metric-sub">Open patient records</span>
          </article>
          <article onClick={() => setView('patients')} style={{ cursor: 'pointer' }} title="View today's patients">
            <span className="metric-label">Today's patients</span>
            <b className="metric-number">{todayPatients}</b>
            <span className="metric-sub">Registered today</span>
          </article>
          <article onClick={() => setView('newreport')} style={{ cursor: 'pointer' }} title="View today's bookings">
            <span className="metric-label">Today's bookings</span>
            <b className="metric-number">{todayBookings}</b>
            <span className="metric-sub">Tests booked today</span>
          </article>
          <article onClick={() => setView('results')} style={{ cursor: 'pointer' }} title="View and enter results for pending reports">
            <span className="metric-label">Pending reports</span>
            <b className="metric-number">{pendingReports}</b>
            <span className="metric-sub">Awaiting result entry</span>
          </article>
          <article onClick={() => setView('reports')} style={{ cursor: 'pointer' }} title="View final reports released today">
            <span className="metric-label">Today's release</span>
            <b className="metric-number">{todayRelease}</b>
            <span className="metric-sub">Final reports released</span>
          </article>
        </section>

        <div className="dashboard-split-grid">
          {/* Left Column: Quick Actions */}
          <section className="panel quick-actions-panel">
            <span className="eyebrow">QUICK ACTIONS</span>
            <h2>Open a workspace</h2>
            <div className="quick-actions-grid">
              <div className="action-card" onClick={() => setView('patients')} role="button" tabIndex={0} title="Open Patients & Registration">
                <div className="action-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                </div>
                <div className="action-content">
                  <b>Patients &amp; Registration</b>
                  <p>Register or update patient details</p>
                </div>
                <span className="action-chevron">›</span>
              </div>

              <div className="action-card" onClick={() => setView('newreport')} role="button" tabIndex={0} title="Open Test Booking">
                <div className="action-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 3v6l-4 7.1A3.2 3.2 0 0 0 7.8 21h8.4a3.2 3.2 0 0 0 2.8-4.9L15 9V3" />
                    <path d="M8 3h8M8.5 16h7" />
                  </svg>
                </div>
                <div className="action-content">
                  <b>Test booking</b>
                  <p>Book laboratory investigations</p>
                </div>
                <span className="action-chevron">›</span>
              </div>

              <div className="action-card" onClick={() => setView('results')} role="button" tabIndex={0} title="Open Result Entry">
                <div className="action-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="action-content">
                  <b>Result entry</b>
                  <p>Enter and finalise results</p>
                </div>
                <span className="action-chevron">›</span>
              </div>

              <div className="action-card" onClick={() => setView('reports')} role="button" tabIndex={0} title="View Reports">
                <div className="action-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div className="action-content">
                  <b>View reports</b>
                  <p>Review, print, or edit reports</p>
                </div>
                <span className="action-chevron">›</span>
              </div>
            </div>
          </section>

          {/* Right Column: Report Activity */}
          <section className="panel report-activity-panel">
            <span className="eyebrow">REPORT ACTIVITY</span>
            <h2>Today's report status</h2>
            <div className="report-activity-list">
              <div className="activity-item" onClick={() => setView('newreport')} role="button" tabIndex={0} title="View today's bookings">
                <span className="activity-dot dot-blue">●</span>
                <div className="activity-content">
                  <b>Today's booking</b>
                  <p>New investigation requests</p>
                </div>
                <div className="activity-meta">
                  <span className="activity-count">{todayBookings}</span>
                  <span className="activity-arrow">›</span>
                </div>
              </div>

              <div className="activity-item" onClick={() => setView('reports')} role="button" tabIndex={0} title="View recent reports">
                <span className="activity-dot dot-green">●</span>
                <div className="activity-content">
                  <b>Recent reports</b>
                  <p>
                    {latestReport
                      ? `Latest: ${latestReport.number} · ${patientName(latestPatient) || 'Patient'}`
                      : 'No recent reports created yet'}
                  </p>
                </div>
                <div className="activity-meta">
                  <span className="activity-count">{data.reports.length}</span>
                  <span className="activity-arrow">›</span>
                </div>
              </div>

              <div className="activity-item" onClick={() => setView('results')} role="button" tabIndex={0} title="View pending reports">
                <span className="activity-dot dot-amber">●</span>
                <div className="activity-content">
                  <b>Pending reports</b>
                  <p>Reports awaiting result entry</p>
                </div>
                <div className="activity-meta">
                  <span className="activity-count">{pendingReports}</span>
                  <span className="activity-arrow">›</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* <section className="panel">
          <h2>Recent reports</h2>
          <ReportList reports={data.reports.slice(0, 6)} patients={data.patients} onOpen={openReport} onResults={(report) => { setSelectedId(report.id); setView('results'); }} />
        </section> */}
      </>}
      {view === 'patients' && <><header className="page-head"><div><span className="eyebrow">PATIENTS</span>  </div><button onClick={() => registrationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>+ Register patient</button></header><section className="panel patient-register"><header><div><h2>Registered patients</h2><p>Find a patient by name, patient ID or mobile number.</p></div></header><label className="patient-search">Search by patient ID or name<input value={patientSearch} onChange={(event) => setPatientSearch(event.target.value)} placeholder="Search by patient name, ID or mobile number" /></label><PatientList patients={data.patients} reports={data.reports} search={patientSearch} onOpen={(patient) => { setPatientRecordId(patient.id); setView('patientrecord'); }} onNewReport={(patient) => { setNewReportPatientId(patient.id); setView('newreport'); }} /></section><form ref={registrationRef} className="panel patient-form patient-visit-form" onSubmit={registerPatient}><h2>Patient registration</h2><div className="form-grid patient-details-grid"><label>Title<select name="title" defaultValue="" onChange={(event) => setRegistrationGender(genderForTitle(event.target.value))}><option value="">Select title</option><option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Master</option><option>Baby</option><option>Dr.</option></select></label><label>Patient name<input name="name" required /></label><label>Age<input name="age" type="number" min="0" required /></label><label>Age unit<select name="ageUnit" defaultValue="Years"><option>Years</option><option>Months</option><option>Days</option></select></label><label>Gender<select name="gender" value={registrationGender} onChange={(event) => setRegistrationGender(event.target.value)} required><option value="" disabled>Select gender</option><option>Female</option><option>Male</option><option>Other</option></select></label><label>Mobile<input name="mobile" type="tel" inputMode="numeric" placeholder="10-digit mobile number" /></label><label>Referred by<select name="doctorId" defaultValue=""><option value="">Self / direct walk-in</option>{data.doctors.map((doctor) => <option value={doctor.id} key={doctor.id}>{doctor.doctorCode} · {doctor.name} ({doctor.referralPercentage}%)</option>)}</select></label><label>Sample type<select name="sampleType" defaultValue="Blood">{SAMPLE_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</select></label><label>Collected on<input name="collectedOn" defaultValue={date()} placeholder="DD/MM/YYYY" /></label><label className="wide">Address<input name="address" placeholder="Patient address (optional)" /></label></div><fieldset className="visit-tests"><legend>Select tests for this visit</legend><p className="field-help">Choose one or more tests. A draft report and billing entry will be created from these selections.</p><InvestigationPicker key={bookingPickerKey} catalogue={catalogue} testGroups={testGroups} booking /></fieldset><button>Save patient</button></form></>}
      {view === 'patientrecord' && recordPatient && <><header className="page-head"><div><span className="eyebrow">PATIENT RECORD</span><h1>{patientName(recordPatient)}</h1><p>{recordPatient.id} · {recordPatient.mobile || 'No mobile number recorded'}</p></div><div><button className="secondary" onClick={() => setView('patients')}>Back to patients</button><button onClick={() => { setNewReportPatientId(recordPatient.id); setView('newreport'); }}>+ Test booking</button></div></header><section className="panel patient-record"><div><span>Patient ID</span><b>{recordPatient.id}</b></div><div><span>Age / gender</span><b>{recordPatient.age} {recordPatient.ageUnit || 'Years'} / {recordPatient.gender}</b></div><div><span>Mobile</span><b>{recordPatient.mobile || '—'}</b></div><div><span>Sample type</span><b>{recordPatient.sampleType || 'Blood'}</b></div><div><span>Registered on</span><b>{recordPatient.registeredOn || '—'}</b></div><div><span>Referred by</span><b>{recordPatient.reference || 'Self'}</b></div><div><span>Address</span><b>{recordPatient.address || '—'}</b></div></section><section className="panel"><h2>Report history</h2><ReportList reports={data.reports.filter((report) => report.patientId === recordPatient.id)} patients={data.patients} onOpen={openReport} onResults={(report) => { setSelectedId(report.id); setView('results'); }} /></section></>}
      {view === 'newreport' && <><header className="page-head"><div><span className="eyebrow">TEST BOOKING</span> </div></header>
        <form className="panel patient-form" onSubmit={createReport}>
          <fieldset>
            <legend>Patient and billing</legend>
            <div className="form-grid">
              <label className="wide">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span>Patient</span>
                  {newReportPatientId && (
                    <button
                      type="button"
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#2563eb',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        textDecoration: 'underline',
                      }}
                      onClick={() => setNewReportPatientId('')}
                    >
                      Change / Show all patients
                    </button>
                  )}
                </div>
                <select
                  name="patientId"
                  required
                  value={newReportPatientId}
                  onChange={(event) => {
                    const patId = event.target.value;
                    setNewReportPatientId(patId);
                    const pat = data.patients.find((p) => p.id === patId);
                    if (pat) setNewReportDoctorId(pat.doctorId || '');
                  }}
                >
                  {newReportPatientId && data.patients.find((p) => p.id === newReportPatientId) ? (
                    (() => {
                      const p = data.patients.find((item) => item.id === newReportPatientId);
                      return (
                        <option value={p.id} key={p.id}>
                          {p.id} · {patientName(p)}
                        </option>
                      );
                    })()
                  ) : (
                    <>
                      <option value="" disabled>Select patient</option>
                      {data.patients.map((patient) => (
                        <option value={patient.id} key={patient.id}>
                          {patient.id} · {patientName(patient)}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                {newReportPatientId && (() => {
                  const pat = data.patients.find((p) => p.id === newReportPatientId);
                  if (!pat) return null;
                  return (
                    <div className="billing-patient-meta" style={{ marginTop: '8px' }}>
                      <span>Patient ID: <b>{pat.id}</b></span>
                      <span>Name: <b>{patientName(pat)}</b></span>
                      <span>Age / Gender: <b>{pat.age} {pat.ageUnit || 'Years'} / {pat.gender}</b></span>
                      <span>Mobile: <b>{pat.mobile || '—'}</b></span>
                      <span>Referred by: <b>{pat.reference || 'Self'}</b></span>
                    </div>
                  );
                })()}
              </label>
              <label>Referred by
                <select name="doctorId" value={newReportDoctorId} onChange={(event) => setNewReportDoctorId(event.target.value)}>
                  <option value="">Self / direct walk-in</option>
                  {data.doctors.map((doctor) => (
                    <option value={doctor.id} key={doctor.id}>
                      {doctor.doctorCode} · {doctor.name} ({doctor.referralPercentage}%)
                    </option>
                  ))}
                </select>
              </label>
              <label>Sample type
                <select name="sampleType" defaultValue={data.patients.find((p) => p.id === newReportPatientId)?.sampleType || 'Blood'} key={newReportPatientId}>
                  {SAMPLE_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </label>
              <label>Collected on
                <input name="collectedOn" defaultValue={date()} placeholder="DD/MM/YYYY" />
              </label>
              {/*  <label>
  Fee (₹)
  <input
    name="fee"
    type="number"
    min="0"
    value={bookingFee}
    onChange={(event) => setBookingFee(event.target.value)}
  />
</label> */}

            </div>
          </fieldset>
          <InvestigationPicker
            key={`booking-picker-${newReportPatientId}-${testGroups.length}-${catalogue.length}`}
            catalogue={catalogue}
            testGroups={testGroups}
            booking
            onSelectionChange={(total) => setBookingFee(total)}
          />
          <button>Create draft report</button>
        </form>
      </>}
      {view === 'tests' && <><header className="page-head"><div><span className="eyebrow">LABORATORY CONFIGURATION</span><h1>Available Tests &amp; Prices</h1> </div><button className="secondary" onClick={printCatalogue}>Print test availability / Save PDF</button></header><form className="panel catalogue-form" onSubmit={addTest}><h2>Add laboratory test</h2><div className="form-grid catalogue-add-grid"><label>Test name<input name="name" required /></label><label>Category<input name="category" placeholder="e.g. Biochemistry" /></label><label>Unit<input name="unit" placeholder="e.g. mg/dL" /></label><label>Reference range<input name="range" placeholder="e.g. 70–100" required /></label><label>Rate (₹)<input name="rate" type="number" min="0" step="0.01" defaultValue="0" /></label></div><button>Add test</button></form><section className="panel catalogue-panel"><Catalogue tests={catalogue} onSave={saveTest} onRemove={removeTest} /></section></>}
      {view === 'results' && <><header className="page-head"><div><span className="eyebrow">RESULT  ENTRY</span> </div></header>{data.reports.filter((report) => report.status === 'Draft').length ? data.reports.filter((report) => report.status === 'Draft').map((report) => <ResultForm key={report.id} report={report} patient={data.patients.find((patient) => patient.id === report.patientId)} onFinalise={finalise} />) : <section className="panel empty">No draft reports waiting for results.</section>}</>}
      {view === 'reports' && <><header className="page-head"><div><span className="eyebrow">REPORTS</span> </div></header><section className="panel"><ReportList reports={finalReports} patients={data.patients} onOpen={openReport} /></section></>}
      {view === 'billing' && <><header className="page-head"><div><span className="eyebrow">BILLING &amp; COLLECTION</span>  </div></header><Billing reports={data.reports} patients={data.patients} onCollect={collectPayment} onInvoice={openInvoice} /></>}
      {view === 'business' && <><header className="page-head"><div><span className="eyebrow">BUSINESS SUMMARY</span> </div></header><BusinessReport reports={data.reports} /></>}
      {view === 'doctors' && <><header className="page-head"><div><span className="eyebrow">REFERRING DOCTORS</span> </div></header><form className="panel catalogue-form doctor-form" onSubmit={addDoctor}><header><div><h2>Add referring doctor</h2><p>Save the clinic contact and referral percentage for future reference.</p></div></header><div className="form-grid doctor-add-grid"><label>Doctor name<input name="name" placeholder="e.g. Dr. A. Sharma" required /></label><label>Specialty<input name="specialty" placeholder="e.g. General Medicine" /></label><label>Mobile<input name="mobile" inputMode="numeric" placeholder="10-digit mobile number" /></label><label>Referral percentage<input name="referralPercentage" type="number" min="0" max="100" step="0.01" defaultValue="0" /><small>0–100% of the agreed referral share</small></label><label className="wide">Clinic address<input name="address" placeholder="Clinic / hospital address" /></label></div><button>Save doctor</button></form><section className="panel doctor-directory"><header className="doctor-directory-head"><div><h2>Saved referring doctors</h2><p>Edit a name, specialty, mobile number, clinic address, or agreed referral percentage, then save the row.</p></div><span className="directory-count">{data.doctors.length} saved</span></header><Doctors doctors={data.doctors} reports={data.reports} onSave={updateDoctor} /></section></>}
      {view === 'profile' && (() => {
        const profileUser = currentUser || DEFAULT_USER;
        const lab = profileUser.laboratory || labProfile;
        const phones = (lab.phones && lab.phones.length) ? lab.phones.join(' · ') : (labProfile.phones || []).join(' · ');
        const roleDisplay = profileUser.role ? (profileUser.role.charAt(0).toUpperCase() + profileUser.role.slice(1)) : 'Administrator';

        return (
          <div className="profile-page-wrapper">
            <header className="profile-hero-header">
              <div className="profile-avatar-circle">
                <img
                  src="/avatar.svg"
                  alt={profileUser.name || 'User avatar'}
                  className="profile-avatar-img"
                  onError={(e) => {
                    e.currentTarget.src = '/cell-cited-logo.jpg';
                  }}
                />
              </div>
              <div className="profile-hero-info">
                <div className="profile-name-badge-row">
                  <h1 className="profile-hero-name">{profileUser.name || 'Super Administrator'}</h1>
                  <span className="profile-verified-badge" title="Verified Account">
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-label="Verified">
                      <circle cx="12" cy="12" r="10" fill="#1d9bf0" />
                      <path d="M8.5 12.2l2.3 2.3 4.7-4.7" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
                <div className="profile-hero-email">{profileUser.email || 'admin@cellcited.com'}</div>
              </div>
            </header>

            <section className="profile-details-card">
              <h2 className="profile-card-title">Personal details</h2>
              <div className="profile-details-list">
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Full name:</span>
                  <span className="profile-detail-value">{profileUser.name || 'Super Administrator'}</span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Username:</span>
                  <span className="profile-detail-value">{profileUser.username || 'admin'}</span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Role:</span>
                  <span className="profile-detail-value">{roleDisplay}</span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Email:</span>
                  <span className="profile-detail-value">{profileUser.email || 'admin@cellcited.com'}</span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Phone Number:</span>
                  <span className="profile-detail-value">{phones}</span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Address:</span>
                  <span className="profile-detail-value profile-address-val">
                    <span className="profile-flag-icon" role="img" aria-label="India">🇮🇳</span>
                    <span>{lab.address || labProfile.address}</span>
                  </span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Laboratory:</span>
                  <span className="profile-detail-value">{lab.name || labProfile.name}</span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Lab Code:</span>
                  <span className="profile-detail-value">{lab.code || 'CCPL'}</span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Medical Certificate:</span>
                  <span className="profile-detail-value">{lab.medicalCertificate || labProfile.certificateNumber || 'CMEE26151240'}</span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Authorised Signatory:</span>
                  <span className="profile-detail-value">{lab.authorisedSignatory || labProfile.authorisedSignatory}</span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Registration:</span>
                  <span className="profile-detail-value">{lab.registrationDetails || labProfile.registrationAuthority}</span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Timezone:</span>
                  <span className="profile-detail-value">{lab.timezone || 'Asia/Kolkata'}</span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Status:</span>
                  <span className="profile-detail-value">
                    <span className="profile-status-badge">
                      <span className="profile-status-indicator"></span>
                      {lab.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </span>
                </div>
              </div>
            </section>
          </div>
        );
      })()}
      {view === 'setting' && (
        <SettingsView
          currentUser={currentUser}
          labProfile={labProfile}
          setNotice={setNotice}
          setView={setView}
        />
      )}
      {view === 'preview' && selected && selectedPatient && <><header className="page-head preview-head"><div><span className="eyebrow">REPORT PREVIEW</span><h1>{selected.number}</h1><p>Choose a report print format.</p></div><div><button className="secondary" onClick={() => setView('reports')}>Back to reports</button><div className="report-print-control"><select aria-label="Letterhead print option" value={reportPrintOption} onChange={(event) => setReportPrintOption(event.target.value)}><option value="with">With letterhead</option><option value="without">Without letterhead</option></select><button onClick={() => setReportPrintMode(reportPrintOption)}>Print report</button><button className="secondary" type="button" disabled={isGeneratingReportPdf} onClick={shareReportPdf}>{isGeneratingReportPdf ? 'Generating PDF…' : 'Share PDF'}</button></div></div></header><ReportDocument report={selected} patient={selectedPatient} labProfile={labProfile} testGroups={testGroups} withoutLetterhead={reportPrintMode === 'without' || reportPdfMode === 'without'} pdfExport={reportPdfMode !== null} /></>}
      {view === 'invoice' && invoiceReport && <><header className="page-head preview-head"><div><span className="eyebrow">INVOICE</span><h1>{invoiceReport.number}</h1> </div><div><button className="secondary" onClick={() => setView('billing')}>Back to billing</button><button onClick={() => printDocument(`CCPL-Invoice-${invoiceReport.number}`)}>Print / Save PDF</button></div></header><InvoiceDocument report={invoiceReport} patient={invoicePatient} labProfile={labProfile} /></>}
    </main>
  </div>;
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function SettingsView({ currentUser, labProfile, setNotice, setView }) {
  const profileUser = currentUser || DEFAULT_USER;

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localNotice, setLocalNotice] = useState(null);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLocalNotice(null);

    // 1. Validate Old Password
    if (!oldPassword.trim()) {
      setLocalNotice({ type: 'error', message: 'Please enter your current old password.' });
      return;
    }

    // 2. Validate New Password
    if (!newPassword.trim()) {
      setLocalNotice({ type: 'error', message: 'Please enter a new password.' });
      return;
    }
    if (newPassword.length < 6) {
      setLocalNotice({ type: 'error', message: 'New password must be at least 6 characters long.' });
      return;
    }

    // 3. Validate Confirm Password & check if both are the same
    if (!confirmPassword.trim()) {
      setLocalNotice({ type: 'error', message: 'Please confirm your new password.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setLocalNotice({ type: 'error', message: 'New password and confirm password do not match.' });
      return;
    }

    if (oldPassword === newPassword) {
      setLocalNotice({ type: 'error', message: 'New password cannot be the same as your old password. Please choose a different password.' });
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword({
        oldPassword: oldPassword.trim(),
        newPassword,
        confirmPassword,
      });

      setLocalNotice({
        type: 'success',
        message: 'Password reset successful! Your password has been updated in the database. Use your new password for your future logins.',
      });
      setNotice({
        title: 'Password Updated',
        message: 'Your administrator password has been updated successfully.',
        type: 'success',
      });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const errMsg = err.message || (err.error?.message) || 'Failed to update password. Please check your old password.';
      setLocalNotice({ type: 'error', message: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page-wrapper">
      <header className="page-head">
        <div>
          <span className="eyebrow">SETTINGS</span>
          {/* <h1>Settings</h1> */}

        </div>
      </header>

      {/* Account Identity Summary */}
      <div className="settings-account-banner">
        <div className="settings-account-info">
          <div className="settings-account-avatar">
            {profileUser.name ? profileUser.name.charAt(0) : 'A'}
          </div>
          <div className="settings-account-details">
            <b>{profileUser.name || 'Super Administrator'}</b>
            <span>@{profileUser.username || 'admin'} · {profileUser.email || 'admin@cellcited.com'}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="settings-role-tag">{profileUser.role || 'administrator'}</span>
          <button
            type="button"
            className="secondary"
            style={{ fontSize: '12px', padding: '6px 12px' }}
            onClick={() => setView('profile')}
          >
            View Profile →
          </button>
        </div>
      </div>

      {/* Reset Password Card */}
      <section className="settings-card">
        <div className="settings-card-head">
          <div className="settings-icon-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <h2>Reset Password</h2>
            <p>Update your administrator password by entering your current old password and new password.</p>
          </div>
        </div>

        {localNotice && (
          <div className={`settings-notice-box ${localNotice.type}`}>
            <span style={{ fontSize: '16px' }}>{localNotice.type === 'success' ? '✓' : '⚠'}</span>
            <div style={{ flex: 1 }}>{localNotice.message}</div>
          </div>
        )}

        <form onSubmit={handleResetPassword} className="settings-reset-form">
          {/* 1st: Old Password */}
          <div className="settings-form-row">
            <label>1. Old password</label>
            <div className="settings-input-action">
              <input
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => {
                  setOldPassword(e.target.value);
                  if (localNotice) setLocalNotice(null);
                }}
                placeholder="Enter your current old password"
                required
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="settings-eye-btn"
                onClick={() => setShowOldPassword(!showOldPassword)}
                aria-label="Toggle old password visibility"
              >
                <EyeIcon open={showOldPassword} />
              </button>
            </div>
            <small style={{ color: '#64748b' }}>Enter your current account password to authorize the change.</small>
          </div>

          {/* 2nd: New Password */}
          <div className="settings-form-row">
            <label>2. New password</label>
            <div className="settings-input-action">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (localNotice) setLocalNotice(null);
                }}
                placeholder="Enter new password (min. 6 characters)"
                required
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="settings-eye-btn"
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label="Toggle new password visibility"
              >
                <EyeIcon open={showNewPassword} />
              </button>
            </div>
            <small style={{ color: '#64748b' }}>Must be at least 6 characters long.</small>
          </div>

          {/* 3rd: Confirm Password */}
          <div className="settings-form-row">
            <label>3. Confirm password</label>
            <div className="settings-input-action">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (localNotice) setLocalNotice(null);
                }}
                placeholder="Re-enter your new password to confirm"
                required
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="settings-eye-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Toggle confirm password visibility"
              >
                <EyeIcon open={showConfirmPassword} />
              </button>
            </div>
            {newPassword && confirmPassword && (
              <small style={{ color: newPassword === confirmPassword ? '#059669' : '#dc2626', fontWeight: 500 }}>
                {newPassword === confirmPassword ? '✓ Passwords match' : '✕ Passwords do not match'}
              </small>
            )}
          </div>

          <div className="settings-actions-group">
            <button type="submit" disabled={loading}>
              {loading ? 'Validating & Resetting…' : 'Reset Password'}
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => {
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setLocalNotice(null);
              }}
              disabled={loading}
            >
              Clear
            </button>
          </div>
        </form>
      </section>

      {/* System Security Specifications */}
      {/* <section className="settings-card">
        <div className="settings-card-head">
          <div className="settings-icon-badge" style={{ background: '#ecfdf5', color: '#059669' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h2>Security &amp; Encryption Specifications</h2>
            <p>Direct authentication via Bearer token verification and bcrypt cryptographic hashing.</p>
          </div>
        </div>

        <div className="settings-info-grid">
          <div className="settings-info-item">
            <span>Session Authorization</span>
            <b>Active JWT Bearer Token</b>
          </div>
          <div className="settings-info-item">
            <span>Password Verification</span>
            <b>bcrypt (Salt rounds: 10)</b>
          </div>
          <div className="settings-info-item">
            <span>Verification Method</span>
            <b>Old Password Matching</b>
          </div>
          <div className="settings-info-item">
            <span>Database Backend</span>
            <b>MongoDB Atlas (Connected)</b>
          </div>
          <div className="settings-info-item">
            <span>Active Username</span>
            <b>@{profileUser.username || 'admin'}</b>
          </div>
          <div className="settings-info-item">
            <span>Laboratory Code</span>
            <b>{labProfile?.code || 'CCPL'}</b>
          </div>
        </div>
      </section> */}
    </div>
  );
}

function InvestigationPicker({ catalogue, testGroups = TEST_GROUPS, booking = false, onSelectionChange }) {
  const [selectedGroups, setSelectedGroups] = useState(() => new Set());
  const [selectedTests, setSelectedTests] = useState(() => new Set());
  const [search, setSearch] = useState('');
  const groupsList = (Array.isArray(testGroups) && testGroups.length) ? testGroups : TEST_GROUPS;
  const groupedTestNames = new Set(groupsList.flatMap((group) => group.tests || []));
  const standaloneTests = catalogue.filter((test) => !groupedTestNames.has(test.name));
  const query = search.trim().toLowerCase();
  const matches = (test) => !query || [test.name, test.category, test.unit].filter(Boolean).some((value) => String(value).toLowerCase().includes(query));
  const displayRate = (test) => `₹${Number(test.rate || 0).toFixed(2)}`;
  const groupCatalogueTests = (group) => (group.tests || [])
    .map((name) => {
      const fromCat = catalogue.find((test) => test.name?.toLowerCase() === name?.toLowerCase());
      if (fromCat) return fromCat;
      const fromObj = (group.testObjects || []).find((t) => t.name?.toLowerCase() === name?.toLowerCase());
      if (fromObj) {
        return {
          id: fromObj._id || name,
          name: fromObj.name,
          category: fromObj.category || group.category,
          unit: fromObj.unit || '',
          range: fromObj.referenceRange || '',
          rate: fromObj.rate || 0,
        };
      }
      return { name, rate: 0, unit: '', range: '' };
    })
    .filter(Boolean);
  const availableGroupTests = (group) => groupCatalogueTests(group)
    .filter((test) => !query || group.name.toLowerCase().includes(query) || (group.description && group.description.toLowerCase().includes(query)) || matches(test));
  const toggleGroup = (group) => {
    const groupTests = groupCatalogueTests(group).map((test) => test.name);
    const isSelected = selectedGroups.has(group.id);
    setSelectedGroups((current) => {
      const next = new Set(current);
      isSelected ? next.delete(group.id) : next.add(group.id);
      return next;
    });
    setSelectedTests((current) => {
      const next = new Set(current);
      groupTests.forEach((name) => isSelected ? next.delete(name) : next.add(name));
      return next;
    });
  };
  const toggleTest = (name) => {
    const nextTests = new Set(selectedTests);
    nextTests.has(name) ? nextTests.delete(name) : nextTests.add(name);
    setSelectedTests(nextTests);
    setSelectedGroups((current) => {
      const next = new Set(current);
      groupsList.filter((group) => (group.tests || []).includes(name)).forEach((group) => {
        const allComponentsSelected = groupCatalogueTests(group).every((test) => nextTests.has(test.name));
        allComponentsSelected ? next.add(group.id) : next.delete(group.id);
      });
      return next;
    });
  };

  useEffect(() => {
    if (onSelectionChange) {
      let total = 0;
      selectedTests.forEach((testName) => {
        const found = catalogue.find((t) => t.name?.toLowerCase() === testName?.toLowerCase())
          || groupsList.flatMap((g) => g.testObjects || []).find((t) => t.name?.toLowerCase() === testName?.toLowerCase());
        total += Number(found?.rate || 0);
      });
      onSelectionChange(total);
    }
  }, [selectedTests, catalogue, groupsList]);

  return <div className={`investigation-picker ${booking ? 'booking-picker' : ''}`}>
    {booking && <label className="test-search">Search tests by name or category<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tests by name or category" /></label>}
    {booking && <p className="test-count">{catalogue.length} tests available — search to narrow the list.</p>}
    <div className="picker-scroll">
      <fieldset className="test-groups">
        <legend>Choose reportable tests</legend>
        <p className="field-help">Select a group to tick every component automatically, then untick any tests that are not required. Only checked tests will appear in result entry and the report.</p>
        <div className="group-grid">{groupsList.map((group) => {
          const tests = availableGroupTests(group);
          const isGroupSelected = selectedGroups.has(group.id);
          if (!tests.length) return null;
          return <article key={group.id} className={`group-choice ${isGroupSelected ? 'selected' : ''}`}>
            <label className="group-choice-header">
              <input type="checkbox" name="testGroups" value={group.id} checked={isGroupSelected} onChange={() => toggleGroup(group)} />
              <span><b>{group.name}</b><small>{group.description}</small><em>Select all components · {tests.length} tests</em></span>
            </label>
            <div className="group-components" aria-label={`${group.name} components`}>
              <span className="component-caption">Untick components that are not required</span>
              <div className="component-grid">{tests.map((test) => <label key={test.name} className="group-test-choice">
                <input type="checkbox" name="tests" value={test.name} checked={selectedTests.has(test.name)} onChange={() => toggleTest(test.name)} />
                <span>{test.name}{booking && <small>{displayRate(test)}</small>}</span>
              </label>)}</div>
            </div>
          </article>;
        })}</div>
      </fieldset>
      <fieldset>
        <legend>Standalone individual tests</legend>
        <p className="field-help">These tests are not part of a listed group and remain individual bookings.</p>
        <div className="test-grid">{standaloneTests.filter(matches).map((test) => <label key={test.name} className="test-choice"><input type="checkbox" name="tests" value={test.name} checked={selectedTests.has(test.name)} onChange={() => toggleTest(test.name)} /><span><b>{test.name}{booking && <em>{displayRate(test)}</em>}</b><small>{test.unit || 'No unit'} · {test.range || 'Range not set'}</small></span></label>)}</div>
      </fieldset>
    </div>
  </div>;
}

function ReportList({ reports, patients, onOpen, onResults }) {
  return <div className="table-scroll"><table className="app-table"><thead><tr><th>Report no.</th><th>Patient</th><th>Investigations</th><th>Created</th><th>Status</th><th /></tr></thead><tbody>{reports.length ? reports.map((report) => { const patient = patients.find((item) => item.id === report.patientId); return <tr key={report.id}><td><b>{report.number}</b></td><td>{patientName(patient) || 'Patient unavailable'}</td><td>{report.testGroups?.length ? <small className="group-summary">Groups: {report.testGroups.join(' · ')}</small> : null}{report.tests.map((test) => test.name).join(', ')}</td><td>{report.createdOn}</td><td><span className={`status ${report.status.toLowerCase()}`}>{report.status}</span></td><td>{report.status === 'Final' ? <button className="secondary small" onClick={() => onOpen(report)}>Preview</button> : <button className="secondary small" onClick={() => onResults?.(report)}>Enter results</button>}</td></tr>; }) : <tr><td colSpan="6" className="empty">No reports created yet.</td></tr>}</tbody></table></div>;
}

function ResultForm({ report, patient, onFinalise }) {
  return <form className="panel result-form" onSubmit={(event) => onFinalise(report, event)}><header><div><h2>{report.number} · {patientName(patient)}</h2><p>{report.tests.map((test) => test.name).join(', ')}</p></div><span className="status draft">Draft</span></header><div className="table-scroll"><table className="app-table result-table"><thead><tr><th>Investigation</th><th>Observed result</th><th>Unit</th><th>Reference range</th><th>Remark</th></tr></thead><tbody>{report.tests.map((test) => <tr key={test.name}><td><b>{test.name}</b></td><td><input name={test.name} defaultValue={test.value} placeholder="Enter result" required /></td><td><input name={`${test.name}-unit`} defaultValue={test.unit} placeholder="Unit" disabled title="Unit is configured in test catalogue" /></td><td><input name={`${test.name}-range`} defaultValue={test.range} placeholder="Reference range" disabled title="Reference range is configured in test catalogue" /></td><td><input name={`${test.name}-remark`} defaultValue={test.remark} placeholder="Optional remark" /></td></tr>)}</tbody></table></div><footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}><div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}><label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, color: '#334b72' }}>Reported on: <input name="reportedOn" defaultValue={report.reportedOn || date()} style={{ width: '110px', padding: '6px 8px', borderRadius: '6px', border: '1px solid #c7d3e8' }} /></label><p style={{ margin: 0 }}>Verify observations, units, reference ranges and remarks before finalising.</p></div><button>Finalise report</button></footer></form>;
}

function PatientList({ patients, reports, search = '', onOpen, onNewReport }) {
  const query = search.trim().toLowerCase();
  const visiblePatients = query ? patients.filter((patient) => [patient.id, patientName(patient), patient.name, patient.mobile].filter(Boolean).some((value) => String(value).toLowerCase().includes(query))) : patients;
  return <div className="table-scroll"><table className="app-table patient-table"><thead><tr><th>ID</th><th>Patient</th><th>Age / gender</th><th>Mobile</th><th>Referred by</th><th>Selected tests</th>{(onOpen || onNewReport) && <th>Actions</th>}</tr></thead><tbody>{visiblePatients.length ? visiblePatients.map((patient) => { const patientReports = reports.filter((report) => report.patientId === patient.id); const latestReport = patientReports[0]; return <tr key={patient.id}><td><b>{patient.id}</b></td><td>{patientName(patient)}</td><td>{patient.age} {patient.ageUnit || 'Years'} / {patient.gender}</td><td>{patient.mobile || '—'}</td><td>{patient.reference || 'Self'}</td><td>{latestReport?.tests?.length ? `${latestReport.tests.length} test${latestReport.tests.length === 1 ? '' : 's'} selected` : 'No tests selected'}</td>{(onOpen || onNewReport) && <td className="patient-actions">{onOpen && <button className="secondary small" onClick={() => onOpen(patient)}>Open record</button>}{onNewReport && <button className="small" onClick={() => onNewReport(patient)}>Test booking</button>}</td>}</tr>; }) : <tr><td colSpan={onOpen || onNewReport ? 7 : 6} className="empty">{query ? 'No matching patients found.' : 'No patients registered yet.'}</td></tr>}</tbody></table></div>;
}

function CatalogueRow({ test, onSave, onRemove }) {
  const [draft, setDraft] = useState(test);
  useEffect(() => setDraft(test), [test]);
  const update = (field, value) => setDraft((current) => ({ ...current, [field]: value }));
  return <tr><td><b>{test.name}</b></td><td><input value={draft.category} onChange={(event) => update('category', event.target.value)} placeholder="Category" /></td><td><input value={draft.unit} onChange={(event) => update('unit', event.target.value)} placeholder="Unit" /></td><td><textarea value={draft.range} onChange={(event) => update('range', event.target.value)} placeholder="Reference range" rows="2" /></td><td><input value={draft.rate} onChange={(event) => update('rate', event.target.value)} type="number" min="0" step="0.01" aria-label={`${test.name} rate`} /></td><td className="catalogue-actions"><button type="button" className="small" onClick={() => onSave(test.name, draft)}>Save changes</button><button type="button" className="secondary small danger" onClick={() => onRemove(test.name)}>Remove</button></td></tr>;
}

function Catalogue({ tests, onSave, onRemove }) {
  return <><header><div><h2>Saved laboratory tests</h2><p>{tests.length} tests available for booking.</p></div></header><div className="table-scroll"><table className="app-table catalogue-table"><thead><tr><th>Test</th><th>Category</th><th>Units</th><th>Reference range</th><th>Rate (₹)</th><th>Actions</th></tr></thead><tbody>{tests.map((test) => <CatalogueRow key={test.name} test={test} onSave={onSave} onRemove={onRemove} />)}</tbody></table></div></>;
}

function Billing({ reports, patients, onCollect, onInvoice }) {
  const [selectedReportId, setSelectedReportId] = useState(() => {
    if (!reports.length) return '';
    const pending = reports.find((r) => {
      const f = Number(r.fee || 0);
      const d = Number(r.discount || 0);
      const p = Number(r.paid || 0);
      return Math.max(0, f - d - p) > 0;
    });
    return pending ? pending.id : reports[0].id;
  });

  const [patientFilter, setPatientFilter] = useState('');
  const [justCollectedId, setJustCollectedId] = useState(null);

  const activeReport = reports.find((r) => r.id === selectedReportId) || (reports.length ? reports[0] : null);
  const activePatient = activeReport ? patients.find((p) => p.id === activeReport.patientId) : null;

  const reportFee = Number(activeReport?.fee || 0);
  const reportDisc = Number(activeReport?.discount || 0);
  const prevPaid = Number(activeReport?.paid || 0);
  const reportPaid = prevPaid;
  const netTotal = Math.max(0, reportFee - reportDisc);
  const currentDue = Math.max(0, netTotal - prevPaid);

  const isCollected = Boolean(
    activeReport && (
      (activeReport.id === justCollectedId && currentDue === 0) ||
      (activeReport.isCollected && currentDue === 0) ||
      (prevPaid > 0 && currentDue === 0)
    )
  );

  const [total, setTotal] = useState(() => (activeReport ? Number(activeReport.fee || 0).toFixed(2) : '0.00'));
  const [discount, setDiscount] = useState(() => (activeReport ? Number(activeReport.discount || 0).toFixed(2) : '0.00'));
  const [collectingNow, setCollectingNow] = useState(() => {
    if (!activeReport) return '0.00';
    const fee = Number(activeReport.fee || 0);
    const disc = Number(activeReport.discount || 0);
    const pPaid = Number(activeReport.paid || 0);
    const due = Math.max(0, fee - disc - pPaid);
    if (due > 0) return due.toFixed(2);
    if (pPaid === 0) return Math.max(0, fee - disc).toFixed(2);
    return '0.00';
  });
  const [paymentMode, setPaymentMode] = useState(() => activeReport?.paymentMethod || 'Cash');

  useEffect(() => {
    if (activeReport) {
      const fee = Number(activeReport.fee || 0);
      const disc = Number(activeReport.discount || 0);
      const pPaid = Number(activeReport.paid || 0);
      const due = Math.max(0, fee - disc - pPaid);
      setTotal(fee.toFixed(2));
      setDiscount(disc.toFixed(2));
      if (due > 0) {
        setCollectingNow(due.toFixed(2));
      } else if (pPaid === 0) {
        setCollectingNow(Math.max(0, fee - disc).toFixed(2));
      } else {
        setCollectingNow('0.00');
      }
      setPaymentMode(activeReport.paymentMethod || 'Cash');
    }
  }, [activeReport?.id, activeReport?.paid, activeReport?.fee, activeReport?.discount]);

  const numTotal = Math.max(0, parseFloat(total) || 0);
  const numDiscount = Math.min(numTotal, Math.max(0, parseFloat(discount) || 0));
  const numCollecting = Math.max(0, parseFloat(collectingNow) || 0);
  const liveNet = Math.max(0, numTotal - numDiscount);
  const newTotalPaid = Math.min(liveNet, prevPaid + numCollecting);
  const liveRemainingDue = Math.max(0, liveNet - newTotalPaid);
  const dueString = liveRemainingDue.toFixed(2);

  const handleTotalChange = (val) => {
    if (prevPaid > 0) return;
    setTotal(val);
    const t = Math.max(0, parseFloat(val) || 0);
    const d = Math.min(t, Math.max(0, parseFloat(discount) || 0));
    const net = Math.max(0, t - d);
    setCollectingNow(net.toFixed(2));
  };

  const handleDiscountChange = (val) => {
    if (prevPaid > 0) return;
    setDiscount(val);
    const dRaw = parseFloat(val);
    const d = isNaN(dRaw) ? 0 : Math.max(0, dRaw);
    const t = Math.max(0, parseFloat(total) || 0);
    const validDiscount = Math.min(t, d);
    const net = Math.max(0, t - validDiscount);
    setCollectingNow(net.toFixed(2));
  };

  const handleSavePayment = (event) => {
    event?.preventDefault?.();
    if (!activeReport || isCollected) return;
    if (numCollecting <= 0) {
      alert('Please enter an amount to collect.');
      return;
    }
    setJustCollectedId(activeReport.id);
    onCollect(activeReport, {
      total: numTotal,
      discount: numDiscount,
      collectingNow: numCollecting,
      received: newTotalPaid,
      paymentMode,
    });
  };

  const filterMatch = (report) => {
    if (!patientFilter.trim()) return true;
    const p = patients.find((pat) => pat.id === report.patientId);
    const name = p ? patientName(p) : '';
    const q = patientFilter.toLowerCase();
    return (
      report.number?.toLowerCase().includes(q) ||
      name.toLowerCase().includes(q) ||
      p?.mobile?.includes(q) ||
      p?.id?.toLowerCase().includes(q)
    );
  };

  const pendingReports = reports.filter((r) => {
    const feeNum = Number(r.fee || 0);
    const discNum = Number(r.discount || 0);
    const paidNum = Number(r.paid || 0);
    return Math.max(0, feeNum - discNum - paidNum) > 0;
  });

  const settledReports = reports.filter((r) => {
    const feeNum = Number(r.fee || 0);
    const discNum = Number(r.discount || 0);
    const paidNum = Number(r.paid || 0);
    return Math.max(0, feeNum - discNum - paidNum) === 0;
  });

  const filteredPending = pendingReports.filter(filterMatch);
  const filteredSettled = settledReports.filter(filterMatch);

  return (
    <div className="billing-section-container">
      <p className="billing-receipt-subtitle"></p>

      <form className="billing-receipt-card" onSubmit={handleSavePayment}>
        <div className="billing-receipt-patient-row">
          <div className="billing-receipt-patient-header">
            <label className="billing-receipt-patient-label">
              <span>Patient with pending due / bill</span>
              <select
                className="billing-receipt-patient-select"
                value={activeReport?.id || ''}
                onChange={(event) => setSelectedReportId(event.target.value)}
              >
                {!reports.length && <option value="">No billing records found</option>}
                {filteredPending.length > 0 && (
                  <optgroup label="⚠️ Outstanding Dues">
                    {filteredPending.map((report) => {
                      const patient = patients.find((p) => p.id === report.patientId);
                      const pName = patient ? patientName(patient) : 'Patient unavailable';
                      const feeNum = Number(report.fee || 0);
                      const discNum = Number(report.discount || 0);
                      const paidNum = Number(report.paid || 0);
                      const reportDue = Math.max(0, feeNum - discNum - paidNum);
                      return (
                        <option key={report.id} value={report.id}>
                          {pName} · {report.number} (Total: ₹{feeNum.toFixed(2)}{paidNum > 0 ? `, Paid: ₹${paidNum.toFixed(2)}` : ''} | Due: ₹{reportDue.toFixed(2)})
                        </option>
                      );
                    })}
                  </optgroup>
                )}
                {filteredSettled.length > 0 && (
                  <optgroup label="✓ Settled / Fully Paid">
                    {filteredSettled.map((report) => {
                      const patient = patients.find((p) => p.id === report.patientId);
                      const pName = patient ? patientName(patient) : 'Patient unavailable';
                      const feeNum = Number(report.fee || 0);
                      return (
                        <option key={report.id} value={report.id}>
                          {pName} · {report.number} (₹{feeNum.toFixed(2)} · Fully Paid)
                        </option>
                      );
                    })}
                  </optgroup>
                )}
              </select>
            </label>

            {reports.length > 4 && (
              <div className="billing-receipt-filter-box">
                <input
                  type="text"
                  placeholder="Filter patient / report..."
                  value={patientFilter}
                  onChange={(e) => setPatientFilter(e.target.value)}
                  className="billing-filter-input"
                  aria-label="Filter patient or report"
                />
              </div>
            )}
          </div>

          {activePatient && (
            <div className="billing-patient-meta">
              <span>Patient ID: <b>{activePatient.id}</b></span>
              <span>Age / Gender: <b>{activePatient.age} {activePatient.ageUnit || 'Years'} / {activePatient.gender}</b></span>
              <span>Mobile: <b>{activePatient.mobile || '—'}</b></span>
              <span>Referred by: <b>{activePatient.reference || 'Self'}</b></span>
              <span>Report no: <b>{activeReport.number}</b></span>
              {currentDue > 0 ? (
                <span className="due-badge">Outstanding Due: ₹{currentDue.toFixed(2)}</span>
              ) : (
                <span className="status final">✓ Fully Paid</span>
              )}
            </div>
          )}
        </div>

        {prevPaid > 0 && currentDue > 0 && (
          <div className="billing-due-alert-banner">
            <span className="billing-due-icon">₹</span>
            <div className="billing-due-text">
              <strong>Outstanding Due Clearance (Previous Payment: ₹{prevPaid.toFixed(2)})</strong>
              <span>
                Total service bill is <b>₹{reportFee.toFixed(2)}</b>. The patient previously paid <b>₹{prevPaid.toFixed(2)}</b>, leaving an outstanding balance of <b className="due-highlight">₹{currentDue.toFixed(2)}</b>.
                Input fields below are preset to collect this due. Full <b>₹{reportFee.toFixed(2)}</b> Tax Invoice will be generated upon complete payment.
              </span>
            </div>
          </div>
        )}

        <div className="billing-receipt-grid-row">
          <div className="billing-receipt-field">
            <label>Total Billed (₹)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={total}
              onChange={(e) => handleTotalChange(e.target.value)}
              placeholder="0.00"
              disabled={isCollected || prevPaid > 0}
              title={prevPaid > 0 ? 'Total billed is locked because a payment was already recorded' : ''}
              required
            />
          </div>

          <div className="billing-receipt-field">
            <label>Discount (₹)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={discount}
              onChange={(e) => handleDiscountChange(e.target.value)}
              placeholder="0.00"
              disabled={isCollected || prevPaid > 0}
              title={prevPaid > 0 ? 'Discount is locked because a payment was already recorded' : ''}
            />
          </div>

          <div className="billing-receipt-field">
            <label>Previously Paid (₹)</label>
            <input
              type="text"
              readOnly
              value={`₹${prevPaid.toFixed(2)}`}
              className="billing-readonly-input"
              title="Amount already paid towards this bill"
            />
          </div>

          <div className="billing-receipt-field">
            <label>{prevPaid > 0 ? 'Collecting Due Amount (₹)' : 'Amount Collecting Now (₹)'}</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={currentDue > 0 ? currentDue : liveNet}
              value={collectingNow}
              onChange={(e) => setCollectingNow(e.target.value)}
              placeholder="0.00"
              disabled={isCollected}
              required
            />
          </div>
        </div>

        {!isCollected && (
          <div className="billing-calc-summary">
            <span>Total Bill: <b>₹{numTotal.toFixed(2)}</b></span>
            {numDiscount > 0 && <span>Discount: <b>−₹{numDiscount.toFixed(2)}</b></span>}
            <span>Net: <b>₹{liveNet.toFixed(2)}</b></span>
            <span className="divider">|</span>
            <span>Previously Paid: <b>₹{prevPaid.toFixed(2)}</b></span>
            <span>Collecting Now: <b className="collect-now-highlight">+₹{numCollecting.toFixed(2)}</b></span>
            <span className="divider">→</span>
            <span>Total Paid After: <b>₹{newTotalPaid.toFixed(2)}</b></span>
            <span>Remaining Due: <b className={liveRemainingDue > 0 ? 'due-text-red' : 'due-text-green'}>₹{dueString}</b></span>
          </div>
        )}

        <div className="billing-receipt-bottom-row">
          <div className="billing-receipt-field">
            <label>Payment mode</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              disabled={isCollected}
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="billing-receipt-field billing-receipt-due">
            <label>{liveRemainingDue === 0 ? 'Balance Due (Cleared)' : 'Remaining Due (₹)'}</label>
            <input
              type="text"
              readOnly
              value={dueString}
              className={`billing-due-input ${liveRemainingDue === 0 ? 'billing-due-input-cleared' : ''}`}
            />
          </div>

          <div className="billing-receipt-actions">
            <button
              type="submit"
              className={`billing-btn-save ${isCollected ? 'billing-btn-collected' : ''}`}
              disabled={isCollected || !activeReport || numCollecting <= 0}
              title={isCollected ? 'Payment has already been completed in full' : 'Record payment'}
            >
              {isCollected
                ? '✓ Paid in Full'
                : prevPaid > 0
                  ? `Collect Due ₹${numCollecting.toFixed(2)}`
                  : liveRemainingDue > 0
                    ? `Collect ₹${numCollecting.toFixed(2)} (Partial Payment)`
                    : `Collect ₹${numCollecting.toFixed(2)} (Full Payment)`}
            </button>
            <button
              type="button"
              className="secondary billing-btn-invoice"
              disabled={!activeReport || currentDue > 0}
              title={
                currentDue > 0
                  ? `Cannot generate invoice: Outstanding balance due of ₹${currentDue.toFixed(2)}. Complete full payment to generate the ₹${reportFee.toFixed(2)} Tax Invoice.`
                  : `View or print full ₹${reportFee.toFixed(2)} Tax Invoice`
              }
              onClick={() => onInvoice(activeReport)}
            >
              View / Print Invoice
            </button>
          </div>
        </div>

        {isCollected && (
          <div className="billing-collected-banner">
            <span className="billing-collected-icon">✓</span>
            <div className="billing-collected-text">
              <strong>Payment Completed in Full</strong>
              <span>
                Total service bill of ₹{reportFee.toFixed(2)} is fully paid (₹{reportPaid.toFixed(2)} received) via {activeReport?.paymentMethod || paymentMode} on {activeReport?.paidOn || 'record'}. Outstanding due is ₹0.00.
              </span>
            </div>
            <button
              type="button"
              className="billing-btn-save"
              style={{ marginLeft: 'auto', background: '#2563eb' }}
              onClick={() => onInvoice(activeReport)}
            >
              🖨️ View / Print Tax Invoice
            </button>
          </div>
        )}
      </form>

      <section className="panel billing-table-panel">
        <header className="billing-table-header">
          <div>
            <h2>Collection register</h2>
            <p>Click any patient row to review details, collect pending due or view full Tax Invoice.</p>
          </div>
          <span className="directory-count">{reports.length} bills</span>
        </header>

        <div className="table-scroll">
          <table className="app-table billing-table">
            <thead>
              <tr>
                <th>Report no.</th>
                <th>Patient</th>
                <th>Total billed</th>
                <th>Discount</th>
                <th>Received</th>
                <th>Balance due</th>
                <th>Payment mode</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {reports.length ? (
                reports.map((report) => {
                  const feeNum = Number(report.fee || 0);
                  const discNum = Number(report.discount || 0);
                  const paidNum = Number(report.paid || 0);
                  const reportDue = Math.max(0, feeNum - discNum - paidNum);
                  const patient = patients.find((p) => p.id === report.patientId);
                  const isSelected = report.id === activeReport?.id;
                  return (
                    <tr
                      key={report.id}
                      className={isSelected ? 'billing-row-selected' : ''}
                      onClick={() => {
                        setSelectedReportId(report.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <td><b>{report.number}</b></td>
                      <td><b>{patient ? patientName(patient) : 'Patient unavailable'}</b></td>
                      <td>₹{feeNum.toFixed(2)}</td>
                      <td>{discNum > 0 ? `₹${discNum.toFixed(2)}` : '—'}</td>
                      <td>₹{paidNum.toFixed(2)}</td>
                      <td>
                        {reportDue > 0 ? (
                          <span className="due-badge" title="Click row to collect due">₹{reportDue.toFixed(2)} Due</span>
                        ) : (
                          <span className="status final">Paid</span>
                        )}
                      </td>
                      <td><span className="payment-mode-tag">{report.paymentMethod || 'Cash'}</span></td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className="secondary small"
                          disabled={reportDue > 0}
                          title={
                            reportDue > 0
                              ? `Cannot generate invoice: Collect balance due of ₹${reportDue.toFixed(2)} first`
                              : `View or print full ₹${feeNum.toFixed(2)} Tax Invoice`
                          }
                          onClick={() => onInvoice(report)}
                        >
                          {reportDue > 0 ? 'Due Pending' : 'Invoice'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="empty">
                    No billing records yet. Book tests for a patient to create a bill.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function BusinessReport({ reports }) {
  const billed = reports.reduce((sum, report) => sum + (Number(report.fee || 0) - Number(report.discount || 0)), 0);
  const received = reports.reduce((sum, report) => sum + Number(report.paid || 0), 0);
  const balance = billed - received;
  return <><section className="metrics business-metrics"><article><b>₹{billed.toFixed(2)}</b><span>Total billed</span></article><article><b>₹{received.toFixed(2)}</b><span>Collected</span></article><article><b>₹{balance.toFixed(2)}</b><span>Outstanding balance</span></article></section><section className="panel"><h2>Report activity</h2><p className="summary-copy">{reports.length} report{reports.length === 1 ? '' : 's'} recorded. Payment collection is updated from the Billing section.</p></section></>;
}

function DoctorRow({ doctor, reports, onSave }) {
  const [draft, setDraft] = useState(doctor);
  useEffect(() => setDraft(doctor), [doctor]);
  const update = (field, value) => setDraft((current) => ({ ...current, [field]: value }));
  const isChanged = ['name', 'specialty', 'mobile', 'address', 'referralPercentage']
    .some((field) => String(draft[field] ?? '') !== String(doctor[field] ?? ''));
  const today = startOfDay(new Date());
  const weekStart = new Date(today); weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const formatEarnings = (value) => `₹${value.toFixed(2)}`;
  const todayEarnings = earningsForPeriod(reports.filter((report) => dateFromRecord(report.createdOn)?.getTime() === today.getTime()), doctor.id, today);
  const weeklyEarnings = earningsForPeriod(reports, doctor.id, weekStart);
  const monthlyEarnings = earningsForPeriod(reports, doctor.id, monthStart);

  return <tr><td><input aria-label={`Name for ${doctor.name}`} value={draft.name} onChange={(event) => update('name', event.target.value)} placeholder="Doctor or clinic name" /><small>{doctor.doctorCode} · Referring doctor</small></td><td><input aria-label={`Specialty for ${doctor.name}`} value={draft.specialty} onChange={(event) => update('specialty', event.target.value)} placeholder="Specialty" /></td><td><input aria-label={`Mobile for ${doctor.name}`} value={draft.mobile} onChange={(event) => update('mobile', event.target.value)} inputMode="numeric" placeholder="Mobile number" /></td><td><input aria-label={`Clinic address for ${doctor.name}`} value={draft.address} onChange={(event) => update('address', event.target.value)} placeholder="Clinic / hospital address" /></td><td><label className="percentage-field"><input aria-label={`Referral percentage for ${doctor.name}`} type="number" min="0" max="100" step="0.01" value={draft.referralPercentage} onChange={(event) => update('referralPercentage', event.target.value)} /><span>%</span></label></td><td className="earnings-cell"><b>{formatEarnings(todayEarnings)}</b><small>Today</small></td><td className="earnings-cell"><b>{formatEarnings(weeklyEarnings)}</b><small>This week</small></td><td className="earnings-cell"><b>{formatEarnings(monthlyEarnings)}</b><small>This month</small></td><td><button type="button" className="secondary percentage-save" disabled={!isChanged} onClick={() => onSave(doctor.id, draft)}>Save</button></td></tr>;
}

function Doctors({ doctors, reports, onSave }) {
  return <div className="table-scroll"><table className="app-table doctors-table"><thead><tr><th>Doctor / organisation</th><th>Specialty</th><th>Mobile</th><th>Clinic address</th><th>Referral percentage</th><th>Today</th><th>This week</th><th>This month</th><th aria-label="Save doctor" /></tr></thead><tbody>{doctors.length ? doctors.map((doctor) => <DoctorRow key={doctor.id} doctor={doctor} reports={reports} onSave={onSave} />) : <tr><td colSpan="9" className="empty">No referring doctors saved yet. Add a doctor above to see them in this directory.</td></tr>}</tbody></table></div>;
}

createRoot(document.getElementById('root')).render(<App />);
