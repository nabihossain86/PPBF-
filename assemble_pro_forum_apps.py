import json
import os
import shutil

print("Assembling PPBF Executive Portal (Desktop & Mobile Full-Screen + Categorized Three-Dot Menu)...")

with open('logo_base64.txt', 'r', encoding='utf-8') as f:
    LOGO_B64 = f.read().strip()

with open('pro_shared.css', 'r', encoding='utf-8') as f:
    PRO_SHARED_CSS = f.read().strip()

with open('seed_data.json', 'r', encoding='utf-8') as f:
    SEED_DATA_OBJ = json.load(f)

# Compact canonical JSON string & escape </ to prevent accidental </script> termination
SEED_DATA_JSON = json.dumps(SEED_DATA_OBJ, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')

with open('app_logic.js', 'r', encoding='utf-8') as f:
    APP_LOGIC_JS = f.read().strip()

with open('app_renderers.js', 'r', encoding='utf-8') as f:
    APP_RENDERERS_JS = f.read().strip()

if '__SEED_DATA_JSON__' not in APP_LOGIC_JS or '__LOGO_B64__' not in APP_LOGIC_JS:
    raise RuntimeError("Missing expected placeholders in app_logic.js")

APP_LOGIC_BOUND = (
    APP_LOGIC_JS
    .replace('__SEED_DATA_JSON__', SEED_DATA_JSON)
    .replace('__LOGO_B64__', LOGO_B64)
)

SHARED_JS = APP_LOGIC_BOUND + "\n\n" + APP_RENDERERS_JS

GOOGLE_FONTS_HTML = """
  <!-- Google Fonts: Manrope, Cormorant Garamond, Noto Serif Bengali, Hind Siliguri -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Hind+Siliguri:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&family=Noto+Serif+Bengali:wght@500;600;700;800&display=swap" rel="stylesheet">
"""

# Layout-only CSS differences between Desktop and Mobile
PRO_DESKTOP_CSS = """
/* Desktop Full-Screen Executive Layout with Bottom Dock */
.app-content {
  padding: 28px 36px 28px 36px;
}

.app-topbar {
  padding: 10px 32px;
}

.more-menu-panel {
  bottom: 78px;
  right: max(16px, calc((100vw - 920px) / 2));
  width: 450px;
  max-height: calc(100vh - 156px);
  border-radius: 18px;
}

@media (max-width: 768px) {
  .app-content {
    padding: 18px 14px 24px 14px;
  }
  .more-menu-panel {
    bottom: calc(74px + env(safe-area-inset-bottom, 0px));
    left: 10px;
    right: 10px;
    width: auto;
    max-height: calc(100vh - 148px);
  }
}
"""

PRO_MOBILE_CSS = """
/* Mobile Full-Screen Executive Layout with Bottom Nav Bar */
.app-topbar {
  padding: 8px 12px;
}

.topbar-logo {
  width: 36px;
  height: 36px;
}

.topbar-name-bn {
  font-size: 15.5px;
}

.mode-status-btn {
  padding: 5px 11px;
  font-size: 12px;
  min-height: 36px;
}

.app-content {
  padding: 16px 14px 24px 14px;
}

.more-menu-panel {
  bottom: calc(74px + env(safe-area-inset-bottom, 0px));
  left: 10px;
  right: 10px;
  max-height: calc(100vh - 148px);
  border-radius: 18px;
}

/* Mobile-tuned bottom bar (keeps clean stacked layout on mobile viewports) */
.bottom-nav-inner {
  gap: 2px;
  padding: 6px 6px;
}
.bottom-nav-item {
  flex-direction: column;
  gap: 3px;
  padding: 5px 2px;
  min-height: 54px;
  border-radius: 10px;
  font-size: 12px;
}
.bottom-nav-item:hover {
  background: transparent;
  border-color: transparent;
}
.bottom-nav-icon-wrap {
  padding: 4px 14px;
}
.bottom-nav-item.active {
  background: transparent;
  border-color: transparent;
  box-shadow: none;
  color: var(--navy);
}
.bottom-nav-item.active .bottom-nav-icon-wrap {
  background: var(--navy);
  color: #ffffff;
  box-shadow: 0 3px 10px rgba(11, 37, 69, 0.2);
}

/* Sticky First Column on Mobile Tables */
.mobile-sticky-col th:first-child,
.mobile-sticky-col td:first-child {
  position: sticky;
  left: 0;
  z-index: 3;
  background: #ffffff;
  box-shadow: 2px 0 4px rgba(11, 37, 69, 0.05);
}
.mobile-sticky-col tr:nth-child(even) td:first-child {
  background: #fcfdfe;
}
.mobile-sticky-col th:first-child {
  background: var(--navy) !important;
}

@media (max-width: 460px) {
  .topbar-name-en {
    display: none;
  }
  .hero-banner {
    padding: 18px 16px;
  }
  .hero-crest {
    width: 64px;
    height: 64px;
  }
  .hero-title-bn {
    font-size: 22px;
  }
}
@media (max-width: 400px) {
  .bottom-nav-item {
    font-size: 11.2px;
  }
}
"""

def build_app_shell_html(title_suffix: str, viewport_meta: str, layout_css: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="{viewport_meta}">
  <title>PPBF - Parania Para Business Forum ({title_suffix})</title>
  {GOOGLE_FONTS_HTML}
  <style>
{PRO_SHARED_CSS}

{layout_css}
  </style>
</head>
<body>
  <div class="app-shell">
    <!-- Sticky Contextual Top Header -->
    <div class="app-topbar-wrap no-print">
      <header class="app-topbar">
        <div class="topbar-left">
          <button type="button" id="topbar-back-btn" class="topbar-back-btn" style="display:none;" onclick="goBackOrHome()" aria-label="Go Back" title="Go Back">
            <svg style="width:20px;height:20px;fill:currentColor" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          </button>
          <a href="#/home" class="topbar-brand-link" onclick="toggleMoreMenu(false)">
            <img src="{LOGO_B64}" alt="PPBF Crest Logo" class="topbar-logo" />
            <div class="topbar-brand-text">
              <span class="topbar-name-bn">পরানিয়া পাড়া বিজনেস ফোরাম</span>
              <span class="topbar-sub-row">
                <span class="topbar-name-en">PARANIA PARA BUSINESS FORUM</span>
                <span class="topbar-route-pill" id="topbar-route-pill">Executive Board</span>
              </span>
            </div>
          </a>
        </div>

        <div class="topbar-right">
          <button type="button" id="mode-status-btn" class="mode-status-btn" onclick="toggleEditMode()" title="Toggle View-Only / Edit Mode">
            <span>🔒</span><span>View Only</span>
          </button>
        </div>
      </header>
      <div class="tri-bar">
        <div class="bar-red"></div>
        <div class="bar-orange"></div>
        <div class="bar-green"></div>
      </div>
    </div>

    <!-- More Menu Backdrop -->
    <div class="more-menu-backdrop no-print" id="more-menu-backdrop" onclick="toggleMoreMenu(false)"></div>

    <!-- Categorized "More" Menu Sheet (Remaining Modules, Forms, Governance, Exports & App Controls) -->
    <aside class="more-menu-panel no-print" id="more-menu-panel" aria-label="More Options Menu">
      <div class="more-menu-header">
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="{LOGO_B64}" alt="PPBF Seal" style="width:36px;height:36px;border-radius:50%;background:#fff;padding:2px;object-fit:contain;" />
          <div>
            <div style="font-size:15.5px; font-weight:800; line-height:1.2;">More Options &amp; Modules</div>
            <div style="font-size:12px; color:var(--gold-light);">Secondary Modules, A4 Forms &amp; Tools</div>
          </div>
        </div>
        <button type="button" class="btn btn-sm btn-outline" style="min-width:36px;min-height:36px;background:rgba(255,255,255,0.12);border-color:rgba(255,255,255,0.25);color:#fff;" onclick="toggleMoreMenu(false)" aria-label="Close Menu">✕</button>
      </div>

      <div class="more-menu-body">
        <div id="more-menu-cloud-slot"></div>
        <div class="more-menu-category">
          <div class="more-menu-cat-title"><span>Statements &amp; Official A4 Forms</span><span>4</span></div>
          <div class="more-menu-items">
            <a href="#/statements" class="more-menu-item" data-route="#/statements" onclick="toggleMoreMenu(false)">
              <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
              <div class="menu-item-meta"><span>Statements Center</span><span class="menu-item-sub">Member &amp; investment A4 statement lookup</span></div>
            </a>
            <a href="#/forms" class="more-menu-item" data-route="#/forms" onclick="toggleMoreMenu(false)">
              <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
              <div class="menu-item-meta"><span>Official A4 Forms Hub</span><span class="menu-item-sub">Standardized printable ledger templates</span></div>
            </a>
            <a href="#/inv/all" class="more-menu-item" data-route="#/inv/all" onclick="toggleMoreMenu(false)">
              <svg viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
              <div class="menu-item-meta"><span>All Investment Forms (Print / PDF)</span><span class="menu-item-sub">Batch 24-page portrait A4 ledger pack</span></div>
            </a>
            <button type="button" class="more-menu-item" onclick="printCurrentPage()">
              <svg viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
              <div class="menu-item-meta"><span>Print Current Screen</span><span class="menu-item-sub">Send active view to PDF / Printer</span></div>
            </button>
          </div>
        </div>

        <div class="more-menu-category">
          <div class="more-menu-cat-title"><span>Treasury, Assets &amp; Council</span><span>4</span></div>
          <div class="more-menu-items">
            <a href="#/finance" class="more-menu-item" data-route="#/finance" onclick="toggleMoreMenu(false)">
              <svg viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
              <div class="menu-item-meta"><span>Treasury &amp; Accounts</span><span class="menu-item-sub">Reserves, relief fund &amp; monthly cash flow</span></div>
            </a>
            <a href="#/assets" class="more-menu-item" data-route="#/assets" onclick="toggleMoreMenu(false)">
              <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
              <div class="menu-item-meta"><span>Asset Register</span><span class="menu-item-sub">Cooperative equipment &amp; fixed valuation</span></div>
            </a>
            <a href="#/media" class="more-menu-item" data-route="#/media" onclick="toggleMoreMenu(false)">
              <svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
              <div class="menu-item-meta"><span>Forum Media Gallery</span><span class="menu-item-sub">AGM, disbursement &amp; welfare archive</span></div>
            </a>
            <a href="#/about" class="more-menu-item" data-route="#/about" onclick="toggleMoreMenu(false)">
              <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              <div class="menu-item-meta"><span>About Council</span><span class="menu-item-sub">Executive leadership &amp; forum governance</span></div>
            </a>
          </div>
        </div>

        <div class="more-menu-category">
          <div class="more-menu-cat-title"><span>Governance, Backup &amp; Admin</span><span>7</span></div>
          <div class="more-menu-items">
            <a href="#/report" class="more-menu-item" data-route="#/report" onclick="toggleMoreMenu(false)">
              <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
              <div class="menu-item-meta"><span>Audit &amp; Integrity Report</span><span class="menu-item-sub">Recovery metrics &amp; source completeness</span></div>
            </a>
            <a href="#/admin" class="more-menu-item" data-route="#/admin" onclick="toggleMoreMenu(false)">
              <svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
              <div class="menu-item-meta"><span>Secretariat Admin</span><span class="menu-item-sub">Audit log, master tables &amp; reset</span></div>
            </a>
            <button type="button" class="more-menu-item" onclick="toggleEditMode()">
              <svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
              <div class="menu-item-meta"><span>Toggle View / Edit Mode</span><span class="menu-item-sub" id="menu-mode-sub">Locked (Click to unlock with passkey)</span></div>
            </button>
            <button type="button" class="more-menu-item" onclick="exportDataJSON()">
              <svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
              <div class="menu-item-meta"><span>Export JSON Backup</span><span class="menu-item-sub">Full cooperative dataset &amp; photos</span></div>
            </button>
            <button type="button" class="more-menu-item" onclick="exportMembersCSV()">
              <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>
              <div class="menu-item-meta"><span>Export Members CSV (UTF-8)</span><span class="menu-item-sub">Excel-safe Bengali &amp; English export</span></div>
            </button>
            <button type="button" class="more-menu-item" onclick="openImportModal()">
              <svg viewBox="0 0 24 24"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>
              <div class="menu-item-meta"><span>Validated Import &amp; Rollback</span><span class="menu-item-sub">Preview &amp; apply JSON backup safely</span></div>
            </button>
            <button type="button" class="more-menu-item" onclick="shareApp()">
              <svg viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/></svg>
              <div class="menu-item-meta"><span>Share Portal Link</span><span class="menu-item-sub">Share or copy active route URL</span></div>
            </button>
          </div>
        </div>

        <div class="more-menu-category" id="more-menu-android-group" style="display:none;">
          <div class="more-menu-cat-title"><span>Android App Controls</span><span>2</span></div>
          <div class="more-menu-items">
            <button type="button" class="more-menu-item" onclick="androidToggleLayout()">
              <svg viewBox="0 0 24 24"><path d="M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z"/></svg>
              <div class="menu-item-meta"><span>Switch Desktop / Mobile View</span><span class="menu-item-sub" id="menu-android-layout-sub">Toggle portal layout mode</span></div>
            </button>
            <button type="button" class="more-menu-item" onclick="androidRefreshApp()">
              <svg viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
              <div class="menu-item-meta"><span>Refresh Application</span><span class="menu-item-sub">Reload current portal view</span></div>
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Full-Screen Main Content -->
    <main class="app-content" id="app-content">
      <!-- Dynamically rendered by renderRoute() -->
    </main>

    <!-- Tri-Color Footer -->
    <footer class="app-footer no-print">
      <div class="tri-bar">
        <div class="bar-red"></div>
        <div class="bar-orange"></div>
        <div class="bar-green"></div>
      </div>
      <div class="app-footer-inner">
        <div>
          <strong class="bengali-text" style="color:var(--navy);">পরানিয়া পাড়া বিজনেস ফোরাম</strong> • Est. 01/10/2022 • P.M. Khali, Cox's Bazar
        </div>
        <div>
          <span>ppbf2023@gmail.com</span> • <span>38 Member Profiles / 50 Shares</span>
        </div>
      </div>
    </footer>

    <!-- Fixed Responsive Bottom Navigation Bar (Essential 4 Primary Options + More) -->
    <nav class="bottom-nav-bar no-print" id="bottom-nav-bar" aria-label="Primary Bottom Navigation">
      <div class="bottom-nav-inner">
        <a href="#/home" class="bottom-nav-item" data-nav="home" onclick="toggleMoreMenu(false)">
          <span class="bottom-nav-icon-wrap" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          </span>
          <span class="bottom-nav-label">Home</span>
        </a>
        <a href="#/members" class="bottom-nav-item" data-nav="members" onclick="toggleMoreMenu(false)">
          <span class="bottom-nav-icon-wrap" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          </span>
          <span class="bottom-nav-label">Members</span>
        </a>
        <a href="#/loans" class="bottom-nav-item" data-nav="loans" onclick="toggleMoreMenu(false)">
          <span class="bottom-nav-icon-wrap" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
          </span>
          <span class="bottom-nav-label">Investments</span>
        </a>
        <a href="#/shares" class="bottom-nav-item" data-nav="shares" onclick="toggleMoreMenu(false)">
          <span class="bottom-nav-icon-wrap" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-3 15H8v-2h3v2zm5 0h-3v-2h3v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
          </span>
          <span class="bottom-nav-label">Shares</span>
        </a>
        <button type="button" id="more-menu-trigger" class="bottom-nav-item" data-nav="more" onclick="toggleMoreMenu()" aria-label="More Options Menu" aria-expanded="false">
          <span class="bottom-nav-icon-wrap" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>
          </span>
          <span class="bottom-nav-label">More</span>
        </button>
      </div>
    </nav>
  </div>

  <script>
{SHARED_JS}
  </script>
</body>
</html>
"""

desktop_html = build_app_shell_html(
    "Desktop Full-Screen Portal",
    "width=device-width, initial-scale=1.0",
    PRO_DESKTOP_CSS,
)

mobile_html = build_app_shell_html(
    "Mobile Full-Screen Portal",
    "width=device-width, initial-scale=1.0, maximum-scale=5.0",
    PRO_MOBILE_CSS,
)

with open('PPBF_Desktop.html', 'w', encoding='utf-8') as f:
    f.write(desktop_html)
print(f"Wrote /PPBF_Desktop.html ({len(desktop_html):,} bytes)")

with open('PPBF_Mobile.html', 'w', encoding='utf-8') as f:
    f.write(mobile_html)
print(f"Wrote /PPBF_Mobile.html ({len(mobile_html):,} bytes)")

os.makedirs('app/src/main/assets', exist_ok=True)
shutil.copy('PPBF_Desktop.html', 'app/src/main/assets/PPBF_Desktop.html')
shutil.copy('PPBF_Mobile.html', 'app/src/main/assets/PPBF_Mobile.html')
print("Synchronized HTML assets into app/src/main/assets/")
