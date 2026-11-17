import json
import os
import shutil

print("Building Facebook-style UI for PPBF...")

with open('logo_base64.txt', 'r') as f:
    LOGO_B64 = f.read().strip()

with open('seed_data_fb.json', 'r') as f:
    SEED_DATA_JSON = f.read().strip()

# Create Facebook Stylesheet
FB_SHARED_CSS = """
:root {
  --fb-blue: #1877F2;
  --fb-blue-dark: #166fe5;
  --fb-blue-light: #e7f3ff;
  --fb-bg: #f0f2f5;
  --fb-card: #ffffff;
  --fb-border: #ced0d4;
  --fb-border-light: #e4e6eb;
  --fb-text-primary: #050505;
  --fb-text-secondary: #65676b;
  --fb-btn-bg: #e4e6eb;
  --fb-btn-hover: #d8dadf;
  --navy: #0b2545;
  --navy-light: #13386a;
  --gold: #b8893a;
  --tri-red: #e11d48;
  --tri-orange: #f59e0b;
  --tri-green: #0e9f5c;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 18px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, 'Noto Serif Bengali';
  background-color: var(--fb-bg);
  color: var(--fb-text-primary);
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
}

/* Facebook Header */
.fb-header {
  height: 56px;
  background: #ffffff;
  border-bottom: 1px solid var(--fb-border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.fb-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.fb-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.fb-brand-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 22px;
  font-weight: 800;
  color: var(--navy);
  letter-spacing: 0.5px;
  line-height: 1;
}
.fb-brand-bn {
  font-family: 'Noto Serif Bengali', serif;
  font-size: 11.5px;
  color: var(--gold);
  font-weight: 700;
  line-height: 1.1;
  margin-top: 2px;
}

.fb-search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--fb-bg);
  padding: 8px 14px;
  border-radius: 9999px;
  width: 280px;
}
.fb-search-box input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  width: 100%;
}

.fb-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.fb-icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--fb-btn-bg);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  color: var(--fb-text-primary);
  transition: background 0.2s;
}
.fb-icon-btn:hover {
  background: var(--fb-btn-hover);
}
.fb-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #e41e3f;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 9999px;
  border: 2px solid #ffffff;
}

/* Facebook Tab Navigation Bar */
.fb-tabs-nav {
  height: 52px;
  background: #ffffff;
  border-bottom: 1px solid var(--fb-border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 56px;
  z-index: 999;
}
.fb-tab-item {
  flex: 1;
  max-width: 120px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--fb-text-secondary);
  text-decoration: none;
  position: relative;
  transition: all 0.2s;
}
.fb-tab-item svg {
  width: 26px;
  height: 26px;
  fill: currentColor;
}
.fb-tab-item:hover {
  background: var(--fb-bg);
  border-radius: var(--radius-md);
}
.fb-tab-item.active {
  color: var(--fb-blue);
}
.fb-tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--fb-blue);
  border-radius: 3px 3px 0 0;
}

/* Layout Containers */
.fb-container {
  max-width: 680px;
  margin: 16px auto;
  padding: 0 12px 60px 12px;
}
.fb-wide-container {
  max-width: 1080px;
  margin: 16px auto;
  padding: 0 12px 60px 12px;
}

/* Stories Reel */
.fb-stories-reel {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
  margin-bottom: 16px;
  scrollbar-width: none;
}
.fb-stories-reel::-webkit-scrollbar {
  display: none;
}
.fb-story-card {
  width: 110px;
  height: 175px;
  border-radius: var(--radius-lg);
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px;
  color: #ffffff;
  transition: transform 0.2s, box-shadow 0.2s;
}
.fb-story-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}
.fb-story-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 3px solid var(--fb-blue);
  background: #ffffff;
  color: var(--navy);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 13px;
}
.fb-story-name {
  font-size: 11.5px;
  font-weight: 700;
  line-height: 1.2;
  text-shadow: 0 1px 2px rgba(0,0,0,0.8);
}

/* Facebook Post Creator */
.fb-creator-card {
  background: var(--fb-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--fb-border-light);
  padding: 12px 16px;
  margin-bottom: 16px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.fb-creator-top {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--fb-border-light);
}
.fb-user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--navy);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 15px;
  flex-shrink: 0;
}
.fb-fake-input {
  flex: 1;
  background: var(--fb-bg);
  border-radius: 9999px;
  padding: 10px 16px;
  font-size: 14px;
  color: var(--fb-text-secondary);
  cursor: pointer;
  transition: background 0.2s;
}
.fb-fake-input:hover {
  background: var(--fb-btn-hover);
}
.fb-creator-actions {
  display: flex;
  padding-top: 8px;
  justify-content: space-around;
}
.fb-creator-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  color: var(--fb-text-secondary);
  cursor: pointer;
  border: none;
  background: transparent;
  transition: background 0.2s;
}
.fb-creator-btn:hover {
  background: var(--fb-bg);
}

/* Facebook Post Card */
.fb-post-card {
  background: var(--fb-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--fb-border-light);
  margin-bottom: 16px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  overflow: hidden;
}
.fb-post-header {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.fb-author-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.fb-author-info {
  line-height: 1.25;
}
.fb-author-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--fb-text-primary);
  display: flex;
  align-items: center;
  gap: 4px;
}
.fb-author-role {
  font-size: 12px;
  color: var(--fb-text-secondary);
}
.fb-post-body {
  padding: 4px 16px 12px 16px;
  font-size: 14px;
  color: var(--fb-text-primary);
}
.fb-post-attachment {
  border-top: 1px solid var(--fb-border-light);
  border-bottom: 1px solid var(--fb-border-light);
  background: var(--fb-bg);
}

/* Post Metrics & Actions */
.fb-post-metrics {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  font-size: 13px;
  color: var(--fb-text-secondary);
  border-bottom: 1px solid var(--fb-border-light);
}
.fb-reactions-count {
  display: flex;
  align-items: center;
  gap: 4px;
}
.fb-post-actions-bar {
  display: flex;
  padding: 4px 8px;
  border-bottom: 1px solid var(--fb-border-light);
}
.fb-action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: var(--fb-text-secondary);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.fb-action-btn:hover {
  background: var(--fb-bg);
}
.fb-action-btn.active {
  color: var(--fb-blue);
}

/* Comments Section */
.fb-comments-section {
  padding: 12px 16px;
  background: #fbfbfb;
}
.fb-comment-item {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}
.fb-comment-bubble {
  background: var(--fb-bg);
  padding: 8px 12px;
  border-radius: var(--radius-lg);
  font-size: 13px;
  max-width: 85%;
}
.fb-comment-author {
  font-weight: 700;
  color: var(--fb-text-primary);
  margin-bottom: 2px;
}
.fb-comment-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}
.fb-comment-input-row input {
  flex: 1;
  background: var(--fb-bg);
  border: 1px solid var(--fb-border-light);
  border-radius: 9999px;
  padding: 8px 14px;
  font-size: 13px;
  outline: none;
}

/* Facebook Marketplace Cards */
.fb-marketplace-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 12px;
}
.fb-market-card {
  background: var(--fb-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--fb-border-light);
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}
.fb-market-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.fb-market-img {
  height: 140px;
  background: linear-gradient(135deg, #0b2545 0%, #13386a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  position: relative;
}
.fb-market-info {
  padding: 10px 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.fb-market-price {
  font-size: 17px;
  font-weight: 800;
  color: var(--fb-text-primary);
}
.fb-market-title {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--fb-text-primary);
  margin: 2px 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fb-market-sub {
  font-size: 12px;
  color: var(--fb-text-secondary);
}

/* Facebook Menu Tiles */
.fb-menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}
.fb-menu-tile {
  background: var(--fb-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--fb-border-light);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-decoration: none;
  color: var(--fb-text-primary);
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  transition: transform 0.2s, background 0.2s;
}
.fb-menu-tile:hover {
  background: var(--fb-bg);
  transform: translateY(-2px);
}
.fb-menu-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

/* Include Tri-bar and A4 rules from earlier */
.tri-bar {
  display: flex;
  width: 100%;
  height: 4px;
}
.tri-bar .bar-red { flex: 1; background-color: var(--tri-red); }
.tri-bar .bar-orange { flex: 1; background-color: var(--tri-orange); }
.tri-bar .bar-green { flex: 1; background-color: var(--tri-green); }

/* A4 Print System */
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
  background: #faf7f0;
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
  background: #faf7f0;
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
.a4-payment-table tr:nth-child(even) td { background: #faf7f0; }
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

/* Modals & Popups */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(4px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.modal-card {
  background: #ffffff;
  border-radius: var(--radius-lg);
  max-width: 500px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.modal-header {
  padding: 14px 18px;
  border-bottom: 1px solid var(--fb-border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.modal-body {
  padding: 18px;
}
.modal-footer {
  padding: 12px 18px;
  border-top: 1px solid var(--fb-border-light);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background: #f9f9f9;
}

@media print {
  @page { size: A4 portrait; margin: 0; }
  body, html { background: #fff !important; margin: 0 !important; padding: 0 !important; }
  .no-print, .fb-header, .fb-tabs-nav, .a4-toolbar, .btn { display: none !important; }
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

with open('fb_shared.css', 'w') as f:
    f.write(FB_SHARED_CSS)


