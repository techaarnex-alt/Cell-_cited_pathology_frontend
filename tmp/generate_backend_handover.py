from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak,
    KeepTogether, ListFlowable, ListItem
)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "cell-cited-backend-api-handover.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

NAVY = colors.HexColor("#203969")
BLUE = colors.HexColor("#3355AA")
RED = colors.HexColor("#EE5256")
INK = colors.HexColor("#243754")
MUTED = colors.HexColor("#5F718E")
LINE = colors.HexColor("#D7E1F2")
PALE = colors.HexColor("#F4F7FC")
GREEN = colors.HexColor("#1E7145")

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="CoverTitle", parent=styles["Title"], fontName="Helvetica-Bold",
    fontSize=27, leading=32, textColor=NAVY, spaceAfter=8,
))
styles.add(ParagraphStyle(
    name="CoverSub", parent=styles["Normal"], fontName="Helvetica",
    fontSize=12, leading=18, textColor=MUTED,
))
styles.add(ParagraphStyle(
    name="H1x", parent=styles["Heading1"], fontName="Helvetica-Bold",
    fontSize=18, leading=23, textColor=NAVY, spaceBefore=8, spaceAfter=10,
))
styles.add(ParagraphStyle(
    name="H2x", parent=styles["Heading2"], fontName="Helvetica-Bold",
    fontSize=12.5, leading=16, textColor=BLUE, spaceBefore=10, spaceAfter=6,
))
styles.add(ParagraphStyle(
    name="Bodyx", parent=styles["BodyText"], fontName="Helvetica",
    fontSize=9.2, leading=13.2, textColor=INK, spaceAfter=6,
))
styles.add(ParagraphStyle(
    name="Small", parent=styles["BodyText"], fontName="Helvetica",
    fontSize=7.5, leading=10, textColor=MUTED,
))
styles.add(ParagraphStyle(
    name="CodeBlock", parent=styles["BodyText"], fontName="Courier",
    fontSize=7.2, leading=9.2, textColor=colors.HexColor("#152B55"),
    backColor=colors.HexColor("#F4F7FC"), borderColor=LINE, borderWidth=.3,
    borderPadding=5, spaceAfter=6,
))
styles.add(ParagraphStyle(
    name="Table", parent=styles["BodyText"], fontName="Helvetica",
    fontSize=7.3, leading=9.2, textColor=INK,
))
styles.add(ParagraphStyle(
    name="TableHead", parent=styles["BodyText"], fontName="Helvetica-Bold",
    fontSize=7.3, leading=9.2, textColor=colors.white,
))

def p(text, style="Bodyx"):
    return Paragraph(text, styles[style])

def bullet(items):
    return ListFlowable(
        [ListItem(p(item), leftIndent=10) for item in items],
        bulletType="bullet", start="circle", leftIndent=15, bulletFontSize=6,
        spaceAfter=6,
    )

def table(headers, rows, widths):
    data = [[p(h, "TableHead") for h in headers]]
    data += [[p(str(cell), "Table") for cell in row] for row in rows]
    result = Table(data, colWidths=widths, repeatRows=1, hAlign="LEFT")
    result.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), .35, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, PALE]),
    ]))
    return result

def section(title, body=None):
    out = [p(title, "H1x")]
    if body:
        out.append(p(body))
    return out

def footer(canvas, doc):
    canvas.saveState()
    page = canvas.getPageNumber()
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(.5)
    canvas.line(15 * mm, 12 * mm, 195 * mm, 12 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 7.5)
    canvas.drawString(15 * mm, 7.5 * mm, "Cell Cited Pathology Lab - Backend API Handover")
    canvas.drawRightString(195 * mm, 7.5 * mm, f"Page {page}")
    canvas.restoreState()

doc = SimpleDocTemplate(
    str(OUT), pagesize=A4, leftMargin=15 * mm, rightMargin=15 * mm,
    topMargin=16 * mm, bottomMargin=17 * mm,
    title="Cell Cited Pathology Lab - Backend API Handover",
    author="Cell Cited Pathology Lab",
)

story = []
story += [Spacer(1, 20 * mm), p("CELL CITED PATHOLOGY LAB", "H2x"),
          p("Backend API Handover", "CoverTitle"),
          p("Detailed implementation guide for moving the current browser-local laboratory workflow to a secure production backend.", "CoverSub"),
          Spacer(1, 12 * mm)]
story.append(table(
    ["Document purpose", "Scope"],
    [["Provide the backend team with the current working rules, record shapes, API contracts, lifecycle transitions, report delivery requirements, and production controls.",
      "Patients, reports, test catalogue, group panels, results, billing, invoices, doctors, report PDFs, and synchronization."]],
    [80 * mm, 85 * mm],
))
story += [Spacer(1, 9 * mm), p("Current client version", "H2x"),
          p("React + Vite single-page application. Data is currently stored in browser localStorage under the key <b>cell-cited-pathology-workflow-v1</b>. The app is therefore a functional workflow prototype, not a multi-user system.")]
story += [Spacer(1, 12 * mm), p("Handover outcome", "H2x"), bullet([
    "A REST API (or equivalent service contract) with durable database storage and server-issued identifiers.",
    "Role-aware authentication and audit trails for all clinical, billing, and catalogue changes.",
    "Server-side validation for report status, result capture, payment collection, and reference-range interpretation.",
    "Generated or reproducible A4 report/invoice PDFs with the current letterhead and watermark treatment.",
])]
story.append(PageBreak())

story += section("1. Current application behavior", "The client exposes the following operational modules. These are the user-visible capabilities the backend must preserve.")
story.append(table(
    ["Module", "Current behavior", "Backend responsibility"],
    [
        ["Dashboard", "Counts patients, draft reports, and ready reports.", "Provide aggregate counts filtered by laboratory/site and user authorization."],
        ["Patients", "Registers patient demographics and can immediately create a draft report from selected tests.", "Create/search/read patient records and atomically create a visit/report when requested."],
        ["New report", "Creates a report for an existing patient with group or individual investigations.", "Create report, snapshot selected test metadata and price, maintain selected group names."],
        ["Test catalogue", "Maintains test name, category, unit, reference range, rate, alertable flag.", "Versioned catalogue CRUD with protection against unsafe edits to historical report values."],
        ["Result entry", "Requires a value for every selected test before report finalisation.", "Persist results, validate transition Draft -> Final, record actor and finalisation time."],
        ["Reports", "Lists final reports, prints/saves/shares A4 output with or without letterhead.", "List, authorize, render/download/share stable PDF versions and preserve final snapshots."],
        ["Billing", "Stores billed amount, received amount, and calculated balance. Payment is capped at fee.", "Create invoice/ledger records, record payments immutably, calculate balance server-side."],
        ["Doctors", "Stores referring doctor details and referral percentage; earnings are derived from reports.", "CRUD doctors and calculate earnings from frozen report doctor percentage, not today's master rate."],
    ],
    [28 * mm, 64 * mm, 73 * mm],
))
story += [p("Important: existing report records include selected test definitions directly. This protects a historical report from later catalogue edits. Preserve this design or implement an equivalent versioned snapshot model.", "Small")]

story += section("2. Recommended service architecture")
story.append(bullet([
    "API service: authenticated REST API, JSON payloads, versioned under /api/v1.",
    "Database: PostgreSQL recommended. Use transactions for report creation, finalisation, and payment entry.",
    "Object storage: store generated PDF files and optional signed assets; retain a version number and checksum per final document.",
    "Renderer worker: asynchronous job for official PDFs if rendering is not performed inline. The API should return a document job/status or a signed download URL.",
    "Audit layer: append-only activity records for clinical results, report finalisation, catalogue edits, doctor edits, invoice/payment events, and document downloads.",
    "Authorization: tenant/lab -> users -> roles. Suggested roles: administrator, receptionist, technician, pathologist, billing, read-only auditor.",
]))
story.append(p("Suggested tenancy boundary: every operational record should carry laboratory_id, even if the first release supports only one laboratory. This avoids a later destructive schema migration.", "Small"))

story.append(PageBreak())
story += section("3. Core data model")
story.append(p("Names below are implementation suggestions; fields marked Snapshot must not be recalculated from the live catalogue after a report is created or finalised."))
story.append(table(
    ["Entity", "Required fields", "Notes"],
    [
        ["laboratories", "id, name, address, phones, email, letterhead_asset_id, watermark_asset_id, timezone", "Configuration for output and scope."],
        ["users", "id, laboratory_id, name, email/login, password_hash or SSO subject, role, active_at", "Never store demo credentials in source or plaintext."],
        ["patients", "id, laboratory_id, patient_number, title, name, age, age_unit, gender, mobile, address, created_at", "Patient number currently looks like CCPL-0001."],
        ["doctors", "id, laboratory_id, doctor_code, name, specialty, mobile, address, referral_percentage, active", "A report stores a referral percentage snapshot separately."],
        ["tests", "id, laboratory_id, code, name, category, unit, reference_range, rate, alertable, active, version", "Catalogue master."],
        ["test_groups", "id, laboratory_id, code, name, description, category", "Examples: CBC, Diabetes Profile, LFT, Lipid Profile."],
        ["test_group_items", "group_id, test_id, display_order", "Defines ordered group membership."],
        ["reports", "id, laboratory_id, report_number, patient_id, doctor_id, doctor_percentage_snapshot, status, created_at, finalised_at, finalised_by", "Statuses at minimum Draft and Final."],
        ["report_items", "id, report_id, test_id nullable, test_name_snapshot, unit_snapshot, range_snapshot, category_snapshot, alertable_snapshot, rate_snapshot, value, remark, display_order", "Clinical and pricing snapshot. test_id may be nullable if catalogue item later retires."],
        ["report_groups", "report_id, group_id nullable, group_name_snapshot, display_order", "Use to force selected groups onto their own printed page."],
        ["invoices", "id, laboratory_id, invoice_number, report_id, issued_at, total, status", "One invoice per report is the present client behavior."],
        ["payments", "id, invoice_id, amount, paid_at, method, reference, received_by", "Append-only. Do not overwrite paid amount."],
        ["documents", "id, report_id/invoice_id, type, version, storage_key, checksum, created_at, created_by", "PDF/print artifacts."],
        ["audit_events", "id, laboratory_id, actor_id, entity_type, entity_id, action, before_json, after_json, occurred_at", "Clinical traceability."],
    ],
    [30 * mm, 69 * mm, 66 * mm],
))

story += section("4. Record shapes and payload examples")
story.append(p("Patient create request", "H2x"))
story.append(p('''POST /api/v1/patients
{
  "title": "Mr.", "name": "Jigyasa", "age": 23, "ageUnit": "Years",
  "gender": "Male", "mobile": "9554448906", "address": "...",
  "doctorId": "uuid-or-null"
}''', "CodeBlock"))
story.append(p("Report create request - the server expands selected group IDs, de-duplicates tests, and snapshots the selected test data.", "H2x"))
story.append(p('''POST /api/v1/reports
{
  "patientId": "patient-uuid",
  "testGroupIds": ["diabetes-group-uuid", "lft-group-uuid"],
  "testIds": ["optional-individual-test-uuid"],
  "feeOverride": null
}''', "CodeBlock"))
story.append(p("Result finalisation request", "H2x"))
story.append(p('''POST /api/v1/reports/{reportId}/finalize
{
  "items": [
    {"reportItemId": "item-uuid", "value": "105", "unit": "mg/dL",
     "referenceRange": "70-100", "remark": ""}
  ],
  "expectedVersion": 4
}''', "CodeBlock"))
story.append(p("The API should reject missing values, non-Draft reports, cross-laboratory IDs, stale expectedVersion values, and attempts by unauthorized roles. Store exactly what was finalized, including the unit/range supplied at finalisation.", "Small"))

story.append(PageBreak())
story += section("5. API endpoint contract")
story.append(table(
    ["Method and path", "Purpose", "Main response / rules"],
    [
        ["POST /auth/login", "Authenticate a user", "Return short-lived access token and refresh/session mechanism. Rate limit."],
        ["GET /me", "Current identity and permissions", "Return laboratory scope, role, user identity."],
        ["GET/POST /patients", "Search and create patients", "Search by patient number, name, or mobile with pagination."],
        ["GET/PATCH /patients/{id}", "Read/update demographics", "Use version/updated_at concurrency control."],
        ["GET/POST /tests", "List/create catalogue tests", "Only authorized admin/pathology config roles may mutate."],
        ["PATCH/DELETE /tests/{id}", "Edit/retire test", "Prefer active=false if referenced historically; never mutate report snapshots."],
        ["GET/POST /test-groups", "List/create group definitions", "Return ordered group item list."],
        ["GET/POST /doctors", "Directory and referrals", "Validate percentage 0 to 100."],
        ["PATCH /doctors/{id}", "Update doctor", "Existing report percentage snapshots do not change."],
        ["POST /reports", "Create Draft report", "Transaction: expand groups, snapshot items, calculate fee and number."],
        ["GET /reports", "List reports", "Filters: status, patient, date, report number, doctor, page."],
        ["GET /reports/{id}", "Read report", "Includes report items/groups/patient/doctor snapshots."],
        ["PATCH /reports/{id}/results", "Save Draft results", "May support partial save; audit clinical changes."],
        ["POST /reports/{id}/finalize", "Finalize report", "Transactional status transition and immutable final snapshot."],
        ["POST /reports/{id}/reopen", "Controlled correction", "Pathologist/admin only; require reason and audit event."],
        ["POST /reports/{id}/documents", "Request PDF render", "Body selects withLetterhead true/false. Returns document record/job."],
        ["GET /documents/{id}/download", "Download generated PDF", "Authorize, log download, use time-limited signed URL if applicable."],
        ["GET/POST /invoices", "Read/create invoice", "Usually created with report; must retain price snapshot."],
        ["POST /invoices/{id}/payments", "Record payment", "Append payment; reject amount <= 0; balance is computed server-side."],
        ["GET /billing/summary", "Billing dashboard", "Billed, received, outstanding, period filters."],
        ["GET /doctors/{id}/earnings", "Referral earnings", "Derived from report fee x doctor_percentage_snapshot."],
    ],
    [42 * mm, 48 * mm, 75 * mm],
))
story += [p("Response convention", "H2x"), p('''Success: { "data": { ... }, "meta": { "requestId": "..." } }
Validation error: { "error": { "code": "VALIDATION_ERROR", "message": "...", "fields": { "age": "Must be non-negative" }, "requestId": "..." } }
Conflict: HTTP 409 for duplicate patient/report numbers, stale version, or an invalid state transition.''', "CodeBlock")]

story += section("6. Workflow and status rules")
story.append(table(
    ["Workflow", "Required server sequence", "Key invariants"],
    [
        ["Patient registration with tests", "Create patient; expand requested groups; create Draft report; create report item snapshots; calculate fee; optionally create invoice shell - one DB transaction.", "No report without at least one item. Report and patient must share laboratory scope."],
        ["Existing patient report", "Verify patient; resolve doctor from patient if applicable; create Draft report and snapshots.", "Do not use latest test rate/range after creation."],
        ["Result entry", "Save values, units, ranges, remarks on report items. Allow draft save if desired.", "Do not make automatic clinical interpretation the final authority."],
        ["Finalisation", "Validate all required item values; write finalised_at/by; set status Final; create audit event; optionally queue PDF.", "Final reports cannot silently change. Corrections require controlled reopen/version path."],
        ["Payment", "Insert payment ledger row; compute sum(payments); expose balance.", "Current UI caps one payment at fee. Backend should support multiple payments and reject overpayment unless policy allows credit."],
        ["Doctor earnings", "Sum eligible report fee x report doctor_percentage_snapshot within the requested dates.", "Never recompute historical earnings from a changed doctor master percentage."],
    ],
    [34 * mm, 76 * mm, 55 * mm],
))
story += [p("Reference range flag", "H2x"), p("The client currently parses one number from an entered value and recognizes < limit, > limit, or one numeric interval such as 70-100. Tests with alertable=false are not auto-flagged. Treat this as display assistance only: range parsing should be server-tested and configurable because many laboratory ranges are age, sex, method, and specimen dependent.")]

story += section("7. Report, invoice, and PDF delivery")
story.append(bullet([
    "Letterhead mode: each A4 report page uses the approved report-letterhead image and a light centre watermark. Content must begin below the header and end above the footer on every page.",
    "Without-letterhead mode: plain paper only, with a 38 mm blank top area. Do not render letterhead or watermark in this mode.",
    "Group pagination: when a report was created from selected groups, each selected group begins on a dedicated page. Individual tests keep normal page flow.",
    "Result emphasis: only numeric results outside the stored reference range are enlarged/bold. Normal values, units, and reference ranges retain standard print typography.",
    "PDF output: the current client uses html2pdf.js and native Web Share when supported, falling back to download. A production backend should generate a stable, archived PDF (for example, Chromium print service) and should not rely only on a browser-local document.",
    "Invoice: current invoice derives one per report, with per-test display values calculated from total fee divided by number of tests. The backend should choose and document a rounding policy, preferably using item-level price snapshots or explicit allocation.",
]))
story.append(p("Document versioning recommendation: store render inputs (letterhead asset version, watermark asset version, report snapshot version, renderer version) with every generated PDF. Reprinting should either return the same immutable version or explicitly create a newer revision with an audit reason.", "Small"))

story += section("8. Authentication, privacy, and audit controls")
story.append(table(
    ["Area", "Production requirement"],
    [
        ["Authentication", "Replace the current demo browser-only login/session flag with a real identity provider or password flow using hashed passwords, rotation, account lockout/rate limits, and secure sessions."],
        ["Authorization", "Authorize every record by laboratory_id and role. Reception may register patients; technicians may enter results; only pathologist/admin should finalize/reopen; billing may post payments."],
        ["Audit", "Capture actor, timestamp, action, request ID, before/after values, and reason for corrections. Do not permit audit row editing."],
        ["PII", "Encrypt database/storage at rest, TLS in transit, least-privilege database accounts, log redaction, retention policy, and backup restore tests."],
        ["Clinical safety", "Make test/range updates versioned; final reports must remain reproducible. Require reason and authorization for corrections or deletions."],
        ["Reliability", "Transactions, idempotency keys for POST operations, optimistic locking for edits, structured error logging, health checks, and monitored backups."],
    ],
    [42 * mm, 123 * mm],
))

story += section("9. Migration and integration plan")
story.append(table(
    ["Phase", "Deliverable", "Definition of done"],
    [
        ["1. Schema and auth", "Database migrations, laboratory/user/role model, token/session flow.", "Users can authenticate and are isolated by laboratory scope."],
        ["2. Masters", "Tests, groups, doctors, laboratory assets endpoints.", "Catalogue versions and doctor edits work; historical records are untouched."],
        ["3. Patients and Draft reports", "Patient search/create and report creation transaction.", "Client removes localStorage writes for these flows and uses API responses."],
        ["4. Results and finalisation", "Draft save, finalise/reopen, audit events, range/flag service.", "Finalisation rejects incomplete/stale updates and stores an immutable snapshot."],
        ["5. Billing", "Invoice, payment ledger, summaries, doctor earnings.", "Multiple payments, rounding policy, balance and referral calculation are tested."],
        ["6. Documents", "Server PDF renderer, asset versioning, signed downloads/share links.", "Generated A4 output matches approved layout on every page."],
        ["7. Data migration", "Export/import browser localStorage data if required.", "Import report: patient/report/item/doctor relationships, errors, reconciliation report."],
        ["8. Cutover", "Feature flag, read-only legacy backup, monitoring, rollback procedure.", "Operations staff sign off after parallel verification."],
    ],
    [29 * mm, 67 * mm, 69 * mm],
))

story += section("10. Acceptance checklist for backend team")
story.append(bullet([
    "Creating a patient with selected group(s) produces an atomic Draft report with the exact selected test and pricing snapshots.",
    "A group-selected report prints each selected group beginning on a separate page; multi-page documents repeat the approved letterhead, footer, and light centre watermark.",
    "A plain report has no letterhead/watermark and preserves the 38 mm top blank area.",
    "Finalisation is blocked until every required test item has an observed value; finalised report data is immutable without a reasoned reopen/correction path.",
    "Reference-range flags are deterministic and configured per test snapshot; only out-of-range numeric result values receive emphasis in output.",
    "Changing a catalogue test, doctor percentage, or letterhead after report creation does not alter historical report output or earnings.",
    "Payment requests create ledger rows; totals/balances are computed on the server and cannot be manipulated by a client payload.",
    "All sensitive actions create an audit event and are forbidden across laboratories or unauthorized roles.",
    "PDF downloads are authorized, versioned, reproducible, and visually tested at A4 size.",
    "The client can recover gracefully from API validation, authorization, network, conflict, and rendering errors." 
]))

story += [Spacer(1, 3 * mm), p("Open implementation decisions", "H2x"), p(
    "1. Confirm laboratory identifier/numbering policy: sequential per laboratory, yearly reset, or UUID plus visible display number.<br/>"
    "2. Confirm correction governance: amendment page versus re-open and regenerate revision.<br/>"
    "3. Confirm supported payment methods, GST/tax requirements, refunds, and partial payment policy.<br/>"
    "4. Confirm whether patient records need date of birth/age-at-collection snapshots, external SMS/WhatsApp delivery, and share-link expiry or patient authentication.",
    "Small"
)]

doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUT)
