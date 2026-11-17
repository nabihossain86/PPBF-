import json
import os

# 1. Write the Shared CSS
shared_css = """
:root {
  --navy: #0b2545;
  --navy-dark: #06182e;
  --navy-light: #13386a;
  --navy-surface: #0f2b52;
  --gold: #b8893a;
  --gold-light: #d4a359;
  --gold-pale: #fcf8f0;
  --ivory: #faf7f0;
  --ivory-dark: #f0e9dc;
  --ivory-light: #fdfbf7;
  --tri-red: #e11d48;
  --tri-orange: #f59e0b;
  --tri-green: #0e9f5c;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --text-light: #94a3b8;
  --border: #e2e8f0;
  --border-dark: #cbd5e1;
  --card-bg: #ffffff;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Manrope', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: var(--ivory);
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

/* Common Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
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
}
.btn-gold {
  background: var(--gold);
  color: #ffffff;
  border-color: var(--gold);
}
.btn-gold:hover {
  background: var(--gold-light);
}
.btn-outline {
  background: #ffffff;
  color: var(--navy);
  border-color: var(--border-dark);
}
.btn-outline:hover {
  background: var(--ivory);
  border-color: var(--navy);
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
  padding: 4px 10px;
  font-size: 12px;
}
.btn-icon {
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 50%;
}

/* Badges */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.badge-running {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}
.badge-completed {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
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
  border: 1px solid var(--border);
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
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}
.kpi-card .kpi-val {
  font-size: 26px;
  font-weight: 800;
  color: var(--navy);
  line-height: 1.2;
}
.kpi-card .kpi-sub {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 6px;
}
.kpi-card.accent-navy {
  border-left: 4px solid var(--navy);
}
.kpi-card.accent-gold {
  border-left: 4px solid var(--gold);
}
.kpi-card.accent-green {
  border-left: 4px solid var(--tri-green);
}
.kpi-card.accent-orange {
  border-left: 4px solid var(--tri-orange);
}
.kpi-card.accent-red {
  border-left: 4px solid var(--tri-red);
}

/* Cards & Panels */
.panel {
  background: #ffffff;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  margin-bottom: 24px;
  overflow: hidden;
}
.panel-header {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
  background: var(--ivory-light);
}
.panel-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--navy);
  display: flex;
  align-items: center;
  gap: 10px;
}
.panel-body {
  padding: 20px;
}

/* Tables */
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
}
.data-table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
  color: var(--text-main);
  vertical-align: middle;
}
.data-table tbody tr:nth-child(even) {
  background: var(--ivory);
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
  background: var(--tri-green);
  border-radius: 9999px;
}

/* Chips list for fast form jumping */
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
  border: 1px solid var(--border-dark);
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
   A4 PRINT & OFFICIAL STATEMENT TEMPLATE
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
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
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

/* A4 Header */
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

/* Header Stacked 3 Boxes */
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

/* Statement Title with Gold Double Rules */
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

/* Details Grid */
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

/* Guarantor box */
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

/* Passport Photo Box */
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

/* Summary Strip */
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

/* 24-Row Payment Table */
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
.a4-payment-table th.text-right {
  text-align: right;
}
.a4-payment-table th.text-center {
  text-align: center;
}
.a4-payment-table td {
  padding: 2.5px 6px;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}
.a4-payment-table td.text-right {
  text-align: right;
}
.a4-payment-table td.text-center {
  text-align: center;
}
.a4-payment-table tr:nth-child(even) td {
  background: var(--ivory);
}
.a4-payment-table tr.total-row td {
  background: var(--navy) !important;
  color: #ffffff !important;
  font-weight: 800;
  font-size: 11px;
  padding: 4px 6px;
  border-top: 1px solid var(--gold);
}

/* Authorization Section (3 boxes) */
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

/* Footer */
.a4-footer-text {
  text-align: center;
  font-size: 9px;
  color: #64748b;
  margin-top: 4px;
}

/* Editable in Edit Mode */
.editable:focus {
  outline: 2px solid var(--gold);
  background: #fefce8 !important;
}

/* Print Toolbar on Screen */
.a4-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  padding: 10px 16px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  margin-bottom: 16px;
  width: 100%;
  max-width: 794px;
}

/* Print Media Query */
@media print {
  @page {
    size: A4 portrait;
    margin: 0;
  }
  body, html {
    background: #ffffff !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  .no-print,
  .app-sidebar,
  .app-topbar,
  .app-bottom-nav,
  .app-drawer,
  .drawer-backdrop,
  .a4-toolbar,
  .photo-action-btn,
  .btn,
  .chips-scroll,
  .modal-overlay {
    display: none !important;
  }
  .app-content {
    margin: 0 !important;
    padding: 0 !important;
    background: transparent !important;
  }
  .a4-screen-wrapper {
    padding: 0 !important;
    margin: 0 !important;
    display: block !important;
    overflow: visible !important;
  }
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

/* Toast Notifications */
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.toast {
  background: var(--navy);
  color: #ffffff;
  padding: 12px 20px;
  border-radius: var(--radius-md);
  font-size: 13.5px;
  font-weight: 600;
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 10px;
  border-left: 4px solid var(--gold);
  animation: slideIn 0.3s ease;
}
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(11, 37, 69, 0.6);
  backdrop-filter: blur(4px);
  z-index: 8000;
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
  border: 1px solid var(--border);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
  overflow: hidden;
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
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
"""

with open('shared_styles.css', 'w') as f:
    f.write(shared_css)

