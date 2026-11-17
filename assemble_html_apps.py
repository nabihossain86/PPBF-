import os
import shutil

print("Assembling PPBF_Desktop.html and PPBF_Mobile.html...")

with open('logo_base64.txt', 'r') as f:
    LOGO_B64 = f.read().strip()

with open('shared_styles.css', 'r') as f:
    SHARED_CSS = f.read().strip()

with open('desktop_styles.css', 'r') as f:
    DESKTOP_CSS = f.read().strip()

with open('mobile_styles.css', 'r') as f:
    MOBILE_CSS = f.read().strip()

with open('app_logic.js', 'r') as f:
    APP_LOGIC_JS = f.read().strip()

with open('app_renderers.js', 'r') as f:
    APP_RENDERERS_JS = f.read().strip()

SHARED_JS = APP_LOGIC_JS + "\n\n" + APP_RENDERERS_JS

GOOGLE_FONTS_HTML = """
  <!-- Google Fonts: Manrope, Cormorant Garamond, Noto Serif Bengali, Hind Siliguri -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Hind+Siliguri:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&family=Noto+Serif+Bengali:wght@500;600;700;800&display=swap" rel="stylesheet">
"""

# Nav links definitions
NAV_LINKS_DESKTOP = """
      <a href="#/home" class="nav-link active">
        <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        <span>Dashboard</span>
      </a>
      <a href="#/loans" class="nav-link">
        <svg viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
        <span>Investments</span>
      </a>
      <a href="#/members" class="nav-link">
        <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
        <span>Members</span>
      </a>
      <a href="#/forms" class="nav-link">
        <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
        <span>Forms Hub</span>
      </a>
      <a href="#/statements" class="nav-link">
        <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
        <span>Statements</span>
      </a>
      <a href="#/assets" class="nav-link">
        <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
        <span>Assets Register</span>
      </a>
      <a href="#/finance" class="nav-link">
        <svg viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
        <span>Finance</span>
      </a>
      <a href="#/media" class="nav-link">
        <svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
        <span>Gallery</span>
      </a>
      <a href="#/about" class="nav-link">
        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        <span>About PPBF</span>
      </a>
      <a href="#/report" class="nav-link">
        <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
        <span>Audit Report</span>
      </a>
      <a href="#/admin" class="nav-link">
        <svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
        <span>Administration</span>
      </a>
"""

NAV_LINKS_DRAWER = """
      <a href="#/home" class="drawer-link active" onclick="toggleDrawer(false)">
        <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        <span>Dashboard</span>
      </a>
      <a href="#/loans" class="drawer-link" onclick="toggleDrawer(false)">
        <svg viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
        <span>Investments</span>
      </a>
      <a href="#/members" class="drawer-link" onclick="toggleDrawer(false)">
        <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
        <span>Members</span>
      </a>
      <a href="#/forms" class="drawer-link" onclick="toggleDrawer(false)">
        <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
        <span>Forms Hub</span>
      </a>
      <a href="#/statements" class="drawer-link" onclick="toggleDrawer(false)">
        <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
        <span>Statements</span>
      </a>
      <a href="#/assets" class="drawer-link" onclick="toggleDrawer(false)">
        <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
        <span>Assets Register</span>
      </a>
      <a href="#/finance" class="drawer-link" onclick="toggleDrawer(false)">
        <svg viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
        <span>Finance</span>
      </a>
      <a href="#/media" class="drawer-link" onclick="toggleDrawer(false)">
        <svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
        <span>Gallery</span>
      </a>
      <a href="#/about" class="drawer-link" onclick="toggleDrawer(false)">
        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        <span>About PPBF</span>
      </a>
      <a href="#/report" class="drawer-link" onclick="toggleDrawer(false)">
        <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
        <span>Audit Report</span>
      </a>
      <a href="#/admin" class="drawer-link" onclick="toggleDrawer(false)">
        <svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
        <span>Administration</span>
      </a>
"""

# Construct Desktop HTML
desktop_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PPBF - Parania Para Business Forum (Desktop)</title>
  {GOOGLE_FONTS_HTML}
  <style>
    {SHARED_CSS}
    {DESKTOP_CSS}
  </style>
</head>
<body>
  <div class="app-layout">
    <!-- Left Sidebar -->
    <aside class="app-sidebar no-print">
      <div class="sidebar-brand">
        <img src="{LOGO_B64}" alt="PPBF Logo" class="sidebar-logo" />
        <div class="sidebar-bismillah">বিসমিল্লাহির রাহমানির রাহীম</div>
        <div class="sidebar-name-bn">পরানিয়া পাড়া বিজনেস ফোরাম</div>
        <div class="sidebar-name-en">PARANIA PARA BUSINESS FORUM</div>
        <div class="tri-bar" style="margin-top: 10px;">
          <div class="bar-red"></div>
          <div class="bar-orange"></div>
          <div class="bar-green"></div>
        </div>
      </div>

      <nav class="sidebar-nav">
        {NAV_LINKS_DESKTOP}
      </nav>

      <div class="sidebar-footer">
        <div style="margin-bottom: 8px;">
          <button class="btn btn-sm btn-outline" style="width: 100%; border-color: rgba(255,255,255,0.2); color: #fff; background: rgba(255,255,255,0.06);" onclick="toggleEditMode()">
            Edit / View Mode
          </button>
        </div>
        <div style="font-size: 10px; color: #64748b;">
          Est. 01/10/2022 • P.M. Khali, Cox's Bazar
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="app-main">
      <header class="app-topbar no-print">
        <div class="topbar-left">
          <h2 class="topbar-page-title" id="topbar-title">Executive Dashboard</h2>
        </div>
        <div class="topbar-right">
          <button class="btn btn-sm btn-outline" onclick="shareApp()" title="Share Link">
            <svg style="width:14px;height:14px;fill:currentColor" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/></svg>
            Share
          </button>
          <button class="btn btn-sm btn-outline" onclick="exportDataJSON()" title="Export Backup">
            <svg style="width:14px;height:14px;fill:currentColor" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
            Backup JSON
          </button>
          <button class="btn btn-sm btn-primary" onclick="toggleEditMode()" id="mode-btn">
            Mode Toggle
          </button>
        </div>
      </header>

      <main class="app-content" id="app-content">
        <!-- Content rendered via hash routing -->
      </main>
    </div>
  </div>

  <script>
    {SHARED_JS}
  </script>
</body>
</html>
"""

# Construct Mobile HTML
mobile_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>PPBF - Parania Para Business Forum (Mobile)</title>
  {GOOGLE_FONTS_HTML}
  <style>
    {SHARED_CSS}
    {MOBILE_CSS}
  </style>
</head>
<body>
  <div class="app-layout">
    <!-- Top Bar -->
    <header class="app-topbar no-print">
      <div class="topbar-left">
        <button class="mobile-toggle-btn" onclick="toggleDrawer(true)" aria-label="Open Menu">
          <svg style="width:24px;height:24px;fill:currentColor" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
        </button>
        <div class="mobile-top-brand">
          <img src="{LOGO_B64}" class="mobile-top-logo" alt="PPBF Logo" />
          <span class="mobile-top-name">পরানিয়া পাড়া ফোরাম</span>
        </div>
      </div>
      <div class="topbar-right">
        <button class="btn btn-sm btn-gold" onclick="toggleEditMode()" style="padding: 4px 8px; font-size: 11px;">
          Mode
        </button>
      </div>
    </header>

    <!-- Off-Canvas Drawer Backdrop -->
    <div class="drawer-backdrop no-print" id="drawer-backdrop" onclick="toggleDrawer(false)"></div>

    <!-- Off-Canvas Drawer -->
    <aside class="app-drawer no-print" id="app-drawer">
      <div class="drawer-header">
        <button class="drawer-close-btn" onclick="toggleDrawer(false)">✕</button>
        <img src="{LOGO_B64}" style="width: 56px; height: 56px; margin: 0 auto 6px auto; display: block;" alt="PPBF Logo" />
        <div style="font-family: 'Noto Serif Bengali', serif; font-size: 11px; color: var(--gold);">বিসমিল্লাহির রাহমানির রাহীম</div>
        <div style="font-family: 'Noto Serif Bengali', serif; font-size: 15px; font-weight: 700; color: #fff;">পরানিয়া পাড়া বিজনেস ফোরাম</div>
        <div style="font-size: 9px; font-weight: 800; color: var(--gold-light); letter-spacing: 1px;">PARANIA PARA BUSINESS FORUM</div>
        <div class="tri-bar" style="margin-top: 10px;">
          <div class="bar-red"></div>
          <div class="bar-orange"></div>
          <div class="bar-green"></div>
        </div>
      </div>

      <nav class="drawer-nav">
        {NAV_LINKS_DRAWER}
      </nav>

      <div style="padding: 12px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 8px;">
        <button class="btn btn-sm btn-outline" style="flex:1; font-size: 11px; color:#fff; border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.06);" onclick="exportDataJSON()">
          Backup JSON
        </button>
        <button class="btn btn-sm btn-outline" style="flex:1; font-size: 11px; color:#fff; border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.06);" onclick="shareApp()">
          Share
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="app-content" id="app-content">
      <!-- Active screen dynamically rendered -->
    </main>

    <!-- Bottom Navigation Bar (5 Primary Tabs) -->
    <nav class="app-bottom-nav no-print">
      <a href="#/home" class="bottom-nav-item active">
        <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        <span>Home</span>
      </a>
      <a href="#/loans" class="bottom-nav-item">
        <svg viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
        <span>Investments</span>
      </a>
      <a href="#/members" class="bottom-nav-item">
        <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
        <span>Members</span>
      </a>
      <a href="#/finance" class="bottom-nav-item">
        <svg viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
        <span>Finance</span>
      </a>
      <a href="javascript:void(0)" class="bottom-nav-item" onclick="toggleDrawer(true)">
        <svg viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
        <span>Menu</span>
      </a>
    </nav>
  </div>

  <script>
    {SHARED_JS}
  </script>
</body>
</html>
"""

# Write root deliverables
with open('PPBF_Desktop.html', 'w') as f:
    f.write(desktop_html)
print("Created /PPBF_Desktop.html")

with open('PPBF_Mobile.html', 'w') as f:
    f.write(mobile_html)
print("Created /PPBF_Mobile.html")

# Copy to Android assets
os.makedirs('app/src/main/assets', exist_ok=True)
shutil.copy('PPBF_Desktop.html', 'app/src/main/assets/PPBF_Desktop.html')
shutil.copy('PPBF_Mobile.html', 'app/src/main/assets/PPBF_Mobile.html')

