import os
import shutil

print("Assembling Facebook-style PPBF application...")

with open('logo_base64.txt', 'r') as f:
    LOGO_B64 = f.read().strip()

with open('fb_shared.css', 'r') as f:
    FB_CSS = f.read().strip()

with open('fb_logic_part1.js', 'r') as f:
    PART1 = f.read().strip()

with open('app_renderers.js', 'r') as f:
    APP_RENDERERS = f.read().strip()

with open('fb_logic_part2.js', 'r') as f:
    PART2 = f.read().strip()

# Combine JS: PART1 + APP_RENDERERS (which contains A4 form logic) + PART2 (which overrides renderRoute and provides FB views)
COMBINED_JS = PART1 + "\n\n" + APP_RENDERERS + "\n\n" + PART2

GOOGLE_FONTS_HTML = """
  <!-- Google Fonts: Manrope, Cormorant Garamond, Noto Serif Bengali, Hind Siliguri -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Hind+Siliguri:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&family=Noto+Serif+Bengali:wght@500;600;700;800&display=swap" rel="stylesheet">
"""

# Facebook Navigation Tabs Header (Icons for Home, Marketplace, Groups, Watch, Notifications, Menu)
FB_TABS_HTML = """
  <!-- Facebook Top Navigation Tabs -->
  <nav class="fb-tabs-nav no-print">
    <a href="#/home" class="fb-tab-item active" data-tab="home" title="News Feed">
      <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
    </a>
    <a href="#/loans" class="fb-tab-item" data-tab="loans" title="Marketplace / Investments">
      <svg viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
    </a>
    <a href="#/members" class="fb-tab-item" data-tab="members" title="Groups / Members">
      <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
    </a>
    <a href="#/media" class="fb-tab-item" data-tab="media" title="Watch / Video">
      <svg viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zm-11-2l6-4.5-6-4.5v9z"/></svg>
    </a>
    <a href="#/notifications" class="fb-tab-item" data-tab="notifications" title="Notifications">
      <svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
    </a>
    <a href="#/menu" class="fb-tab-item" data-tab="menu" title="Menu">
      <svg viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
    </a>
  </nav>
"""

# Construct Desktop HTML
desktop_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PPBF - Parania Para Business Forum (Facebook UI)</title>
  {GOOGLE_FONTS_HTML}
  <style>
    {FB_CSS}
    
    /* Desktop specific adjustments */
    @media (min-width: 900px) {{
      .fb-container {{
        max-width: 720px;
      }}
      .fb-tabs-nav {{
        padding: 0 40px;
      }}
    }}
  </style>
</head>
<body>
  <!-- Facebook Top Header -->
  <header class="fb-header no-print">
    <div style="display:flex; align-items:center; gap:12px;">
      <a href="#/home" class="fb-brand">
        <img src="{LOGO_B64}" class="fb-logo" alt="PPBF Logo" />
        <div>
          <div class="fb-brand-title">PPBF</div>
          <div class="fb-brand-bn">পরানিয়া পাড়া ফোরাম</div>
        </div>
      </a>
      <div class="fb-search-box">
        <svg style="width:16px;height:16px;fill:var(--fb-text-secondary);" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        <input type="text" placeholder="Search investments, members, forms..." oninput="if(window.location.hash!=='#/loans') window.location.hash='#/loans';" />
      </div>
    </div>

    <!-- Right Header Actions -->
    <div class="fb-actions">
      <button class="fb-icon-btn" onclick="window.location.hash='#/menu'" title="All Shortcuts">
        <svg style="width:20px;height:20px;fill:currentColor" viewBox="0 0 24 24"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>
      </button>
      <button class="fb-icon-btn" onclick="shareApp()" title="Share Link">
        <svg style="width:20px;height:20px;fill:currentColor" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/></svg>
      </button>
      <button class="fb-icon-btn" onclick="window.location.hash='#/notifications'" title="Notifications">
        <svg style="width:20px;height:20px;fill:currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
        <span class="fb-badge">2</span>
      </button>
      <div class="fb-user-avatar" style="cursor:pointer;" onclick="toggleEditMode()" title="Toggle View/Edit Mode">
        N
      </div>
    </div>
  </header>

  {FB_TABS_HTML}

  <!-- Main Feed / Screen Container -->
  <main id="fb-app-content">
    <!-- Rendered via hash routing -->
  </main>

  <script>
    {COMBINED_JS}
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
  <title>PPBF - Parania Para Business Forum (Facebook Mobile UI)</title>
  {GOOGLE_FONTS_HTML}
  <style>
    {FB_CSS}
    
    .fb-search-box {{
      display: none;
    }}
    .fb-header {{
      padding: 0 12px;
    }}
    .fb-tab-item svg {{
      width: 24px;
      height: 24px;
    }}
  </style>
</head>
<body>
  <!-- Facebook Mobile Header -->
  <header class="fb-header no-print">
    <a href="#/home" class="fb-brand">
      <img src="{LOGO_B64}" class="fb-logo" alt="PPBF Logo" />
      <div>
        <div class="fb-brand-title">PPBF</div>
        <div class="fb-brand-bn">পরানিয়া পাড়া ফোরাম</div>
      </div>
    </a>

    <div class="fb-actions">
      <button class="fb-icon-btn" onclick="window.location.hash='#/loans'" title="Search / Marketplace">
        <svg style="width:18px;height:18px;fill:currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
      </button>
      <button class="fb-icon-btn" onclick="shareApp()" title="Share">
        <svg style="width:18px;height:18px;fill:currentColor" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/></svg>
      </button>
      <div class="fb-user-avatar" style="width:34px;height:34px;font-size:13px;cursor:pointer;" onclick="toggleEditMode()" title="Toggle View/Edit Mode">
        N
      </div>
    </div>
  </header>

  {FB_TABS_HTML}

  <!-- Main Feed / Screen Container -->
  <main id="fb-app-content">
    <!-- Rendered via hash routing -->
  </main>

  <script>
    {COMBINED_JS}
  </script>
</body>
</html>
"""

# Write root deliverables
with open('PPBF_Desktop.html', 'w') as f:
    f.write(desktop_html)
print("Updated /PPBF_Desktop.html with Facebook UI")

with open('PPBF_Mobile.html', 'w') as f:
    f.write(mobile_html)
print("Updated /PPBF_Mobile.html with Facebook UI")

# Copy to Android assets
shutil.copy('PPBF_Desktop.html', 'app/src/main/assets/PPBF_Desktop.html')
shutil.copy('PPBF_Mobile.html', 'app/src/main/assets/PPBF_Mobile.html')

