import json
import os
import shutil

print("Building Professional Business Forum UI for PPBF...")

# 1. Load logo and seed data
with open('logo_base64.txt', 'r') as f:
    LOGO_B64 = f.read().strip()

with open('seed_data.json', 'r') as f:
    SEED_DATA_JSON = f.read().strip()

# 2. Executive Business Forum Shared CSS
PRO_SHARED_CSS = """
:root {
  --navy-dark: #07192f;
  --navy: #0b2545;
  --navy-light: #13386a;
  --navy-surface: #0f2b52;
  --gold: #b8893a;
  --gold-light: #d4a359;
  --gold-pale: #fcf8f0;
  --gold-border: #e6c88b;
  --ivory: #faf7f0;
  --ivory-dark: #f0e9dc;
  --bg-app: #f4f6f9;
  --card-bg: #ffffff;
  --tri-red: #e11d48;
  --tri-orange: #f59e0b;
  --tri-green: #0e9f5c;
  --text-main: #0f172a;
  --text-muted: #526071;
  --text-light: #8e9cae;
  --border-subtle: #e2e8f0;
  --border-medium: #cbd5e1;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;
  --shadow-sm: 0 1px 3px rgba(11, 37, 69, 0.05);
  --shadow-md: 0 4px 12px rgba(11, 37, 69, 0.07);
  --shadow-lg: 0 10px 25px rgba(11, 37, 69, 0.1);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Manrope', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: var(--bg-app);
  color: var(--text-main);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, .serif-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
}

.bengali-text, .bn-title {
  font-family: 'Noto Serif Bengali', 'Hind Siliguri', serif;
}

/* Tri-Color Bar Component */
.tri-bar {
  display: flex;
  width: 100%;
  height: 4px;
}
.tri-bar .bar-red { flex: 1; background-color: var(--tri-red); }
.tri-bar .bar-orange { flex: 1; background-color: var(--tri-orange); }
.tri-bar .bar-green { flex: 1; background-color: var(--tri-green); }

/* Executive Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 18px;
  font-size: 13.5px;
  font-weight: 600;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}
.btn-primary {
  background: var(--navy);
  color: #ffffff;
  border-color: var(--navy);
}
.btn-primary:hover {
  background: var(--navy-light);
  box-shadow: var(--shadow-sm);
}
.btn-gold {
  background: linear-gradient(135deg, #b8893a 0%, #d4a359 100%);
  color: #ffffff;
  border-color: var(--gold);
}
.btn-gold:hover {
  filter: brightness(1.05);
  box-shadow: 0 4px 10px rgba(184, 137, 58, 0.3);
}
.btn-outline {
  background: #ffffff;
  color: var(--navy);
  border-color: var(--border-medium);
}
.btn-outline:hover {
  background: var(--gold-pale);
  border-color: var(--gold);
  color: var(--navy);
}
.btn-danger {
  background: #fee2e2;
  color: #991b1b;
  border-color: #fca5a5;
}
.btn-danger:hover {
  background: #fecaca;
}
.btn-sm {
  padding: 5px 12px;
  font-size: 12px;
  border-radius: var(--radius-sm);
}

/* Badges */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.badge-running {
  background: #fffbeb;
  color: #92400e;
  border: 1px solid #fde68a;
}
.badge-completed {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}
.badge-navy {
  background: var(--navy);
  color: #ffffff;
}
.badge-gold {
  background: var(--gold-pale);
  color: var(--gold);
  border: 1px solid var(--gold);
}

/* KPI Cards */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}
.kpi-card {
  background: #ffffff;
  border-radius: var(--radius-lg);
  padding: 18px 20px;
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
.kpi-card .kpi-label {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.7px;
  margin-bottom: 6px;
}
.kpi-card .kpi-val {
  font-size: 24px;
  font-weight: 800;
  color: var(--navy);
  line-height: 1.2;
}
.kpi-card .kpi-sub {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 6px;
}
.kpi-card.accent-navy { border-left: 4px solid var(--navy); }
.kpi-card.accent-gold { border-left: 4px solid var(--gold); }
.kpi-card.accent-green { border-left: 4px solid var(--tri-green); }
.kpi-card.accent-orange { border-left: 4px solid var(--tri-orange); }
.kpi-card.accent-red { border-left: 4px solid var(--tri-red); }

/* Executive Panels */
.panel {
  background: #ffffff;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-sm);
  margin-bottom: 24px;
  overflow: hidden;
}
.panel-header {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-subtle);
  background: #fbfcfd;
}
.panel-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--navy);
  display: flex;
  align-items: center;
  gap: 10px;
}
.panel-body {
  padding: 20px;
}

/* Professional Tables */
.table-responsive {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
  text-align: left;
}
.data-table th {
  background: var(--navy);
  color: #ffffff;
  font-weight: 700;
  padding: 12px 14px;
  border-bottom: 2px solid var(--gold);
  white-space: nowrap;
  letter-spacing: 0.3px;
}
.data-table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-main);
  vertical-align: middle;
}
.data-table tbody tr:nth-child(even) {
  background: #fcfdfe;
}
.data-table tbody tr:hover {
  background: #f1f5f9;
}

/* Progress bar */
.progress-bar-bg {
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
  margin-top: 4px;
}
.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gold) 0%, var(--tri-green) 100%);
  border-radius: 9999px;
}

/* Fast Form Links Chips */
.chips-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
  margin-bottom: 16px;
}
.chip {
  padding: 6px 14px;
  background: #ffffff;
  border: 1px solid var(--border-medium);
  border-radius: 9999px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--navy);
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s;
}
.chip:hover, .chip.active {
  background: var(--navy);
  color: #ffffff;
  border-color: var(--navy);
}

/* ========================================================
   STANDARD A4 PORTRAIT INVESTMENT STATEMENT TEMPLATE
======================================================== */
.a4-screen-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 16px 0;
  width: 100%;
  overflow-x: auto;
}
.a4-page-frame {
  width: 794px;
  height: 1122px;
  min-height: 1122px;
  max-height: 1122px;
  background: #ffffff;
  box-shadow: 0 12px 36px rgba(11, 37, 69, 0.14);
  padding: 24px 28px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  transform-origin: top center;
  color: #0f172a;
}
.a4-header {
  display: grid;
  grid-template-columns: 80px 1fr 140px;
  align-items: center;
  gap: 14px;
  margin-bottom: 8px;
}
.a4-logo {
  width: 76px;
  height: 76px;
  object-fit: contain;
}
.a4-title-center {
  text-align: center;
}
.a4-bismillah {
  font-family: 'Noto Serif Bengali', serif;
  font-size: 13px;
  color: var(--gold);
  font-weight: 600;
  margin-bottom: 2px;
}
.a4-forum-bn {
  font-family: 'Noto Serif Bengali', serif;
  font-size: 21px;
  font-weight: 800;
  color: var(--navy);
  line-height: 1.2;
}
.a4-forum-en {
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: var(--gold);
  margin-top: 1px;
}
.a4-forum-addr {
  font-size: 9.5px;
  color: #475569;
  margin-top: 2px;
}
.a4-meta-boxes {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.a4-meta-box {
  border: 1px solid var(--navy);
  border-radius: 4px;
  padding: 4px 6px;
  text-align: center;
  background: #ffffff;
}
.a4-meta-label {
  font-size: 8px;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--navy);
  letter-spacing: 0.5px;
  line-height: 1;
}
.a4-meta-value {
  font-size: 11px;
  font-weight: 800;
  color: var(--navy);
  margin-top: 2px;
  line-height: 1;
}
.a4-doc-title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin: 8px 0 10px 0;
}
.gold-rule {
  flex: 1;
  height: 2px;
  border-top: 1px solid var(--gold);
  border-bottom: 1px solid var(--gold);
  margin-top: 2px;
}
.a4-doc-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--navy);
  letter-spacing: 1px;
  text-transform: uppercase;
}
.a4-details-section {
  display: grid;
  grid-template-columns: 1fr 105px;
  gap: 12px;
  margin-bottom: 8px;
}
.a4-fields-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 14px;
  font-size: 11px;
}
.a4-field-row {
  display: flex;
  border-bottom: 1px dotted #cbd5e1;
  padding: 2.5px 0;
  align-items: center;
}
.a4-field-label {
  font-weight: 700;
  color: var(--navy);
  width: 110px;
  flex-shrink: 0;
}
.a4-field-val {
  flex: 1;
  color: #0f172a;
  font-weight: 600;
}
.a4-guarantor-box {
  grid-column: 1 / -1;
  border: 1px solid #cbd5e1;
  background: var(--ivory);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 10.5px;
  margin-top: 4px;
  display: flex;
  gap: 16px;
}
.a4-guarantor-box strong {
  color: var(--navy);
}
.a4-photo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.a4-photo-box {
  width: 100px;
  height: 118px;
  border: 1px solid #94a3b8;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}
.a4-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.a4-photo-placeholder {
  text-align: center;
  font-size: 9px;
  color: #64748b;
  padding: 4px;
}
.a4-photo-btns {
  display: flex;
  gap: 4px;
}
.a4-summary-strip {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  margin-bottom: 8px;
}
.a4-strip-box {
  padding: 5px 8px;
  border-radius: 4px;
  text-align: center;
  font-weight: 700;
}
.strip-received {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #86efac;
}
.strip-due-red {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}
.strip-due-green {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #86efac;
}
.strip-installments {
  background: var(--ivory);
  color: var(--navy);
  border: 1px solid #cbd5e1;
}
.a4-table-wrapper {
  flex: 1;
  margin-bottom: 8px;
  overflow: hidden;
}
.a4-payment-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 10px;
}
.a4-payment-table th {
  background: var(--navy);
  color: #ffffff;
  padding: 4px 6px;
  border-bottom: 2px solid var(--gold);
  font-weight: 700;
  text-align: left;
}
.a4-payment-table th.text-right { text-align: right; }
.a4-payment-table th.text-center { text-align: center; }
.a4-payment-table td {
  padding: 2.5px 6px;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}
.a4-payment-table td.text-right { text-align: right; }
.a4-payment-table td.text-center { text-align: center; }
.a4-payment-table tr:nth-child(even) td { background: var(--ivory); }
.a4-payment-table tr.total-row td {
  background: var(--navy) !important;
  color: #ffffff !important;
  font-weight: 800;
  font-size: 11px;
  padding: 4px 6px;
  border-top: 1px solid var(--gold);
}
.a4-auth-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 10px;
}
.a4-auth-box {
  text-align: center;
  padding-top: 28px;
  position: relative;
}
.a4-sig-line {
  border-top: 1px solid #0f172a;
  margin-bottom: 4px;
}
.a4-auth-role {
  font-size: 10px;
  font-weight: 700;
  color: var(--navy);
}
.a4-auth-name {
  font-size: 9.5px;
  color: #475569;
}
.a4-footer-text {
  text-align: center;
  font-size: 9px;
  color: #64748b;
  margin-top: 4px;
}

/* Screen toolbar for A4 documents */
.a4-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  padding: 10px 18px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-sm);
  margin-bottom: 16px;
  width: 100%;
  max-width: 794px;
}

/* Modals & Dialogs */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(7, 25, 47, 0.65);
  backdrop-filter: blur(4px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.modal-card {
  background: #ffffff;
  border-radius: var(--radius-xl);
  max-width: 520px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(7, 25, 47, 0.25);
  overflow: hidden;
  border: 1px solid var(--border-subtle);
}
.modal-header {
  padding: 18px 24px;
  background: var(--navy);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.modal-body {
  padding: 24px;
}
.modal-footer {
  padding: 16px 24px;
  background: var(--ivory);
  border-top: 1px solid var(--border-subtle);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Print CSS */
@media print {
  @page { size: A4 portrait; margin: 0; }
  body, html { background: #fff !important; margin: 0 !important; padding: 0 !important; }
  .no-print, .app-sidebar, .app-topbar, .app-bottom-nav, .app-drawer, .a4-toolbar, .btn { display: none !important; }
  .app-content { margin: 0 !important; padding: 0 !important; }
  .a4-screen-wrapper { padding: 0 !important; margin: 0 !important; display: block !important; }
  .a4-page-frame {
    box-shadow: none !important;
    transform: none !important;
    margin: 0 auto !important;
    page-break-after: always !important;
    break-after: page !important;
    height: 1122px !important;
    max-height: 1122px !important;
    overflow: hidden !important;
  }
}
"""

# Write Shared CSS
with open('pro_shared.css', 'w') as f:
    f.write(PRO_SHARED_CSS)


