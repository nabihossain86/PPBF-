desktop_css = """
/* PPBF Desktop Layout Styles */
.app-layout {
  display: flex;
  min-height: 100vh;
}

.app-sidebar {
  width: 260px;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background: linear-gradient(180deg, #07192f 0%, #0b2545 100%);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  z-index: 100;
  box-shadow: 3px 0 12px rgba(0,0,0,0.12);
  overflow-y: auto;
}

.sidebar-brand {
  padding: 20px 16px 16px 16px;
  text-align: center;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.sidebar-logo {
  width: 72px;
  height: 72px;
  object-fit: contain;
  margin: 0 auto 10px auto;
  display: block;
}
.sidebar-bismillah {
  font-family: 'Noto Serif Bengali', serif;
  font-size: 11.5px;
  color: var(--gold);
  margin-bottom: 3px;
}
.sidebar-name-bn {
  font-family: 'Noto Serif Bengali', serif;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.25;
}
.sidebar-name-en {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
  color: var(--gold-light);
  margin-top: 3px;
}

.sidebar-nav {
  padding: 16px 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  color: #94a3b8;
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 600;
  transition: all 0.2s;
}
.nav-link:hover {
  background: rgba(255,255,255,0.06);
  color: #ffffff;
}
.nav-link.active {
  background: rgba(184, 137, 58, 0.18);
  color: #ffffff;
  border-left: 3px solid var(--gold);
  font-weight: 700;
}
.nav-link svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  fill: currentColor;
}

.sidebar-footer {
  padding: 14px 16px;
  border-top: 1px solid rgba(255,255,255,0.08);
  font-size: 11px;
  color: #64748b;
  text-align: center;
}

.app-main {
  margin-left: 260px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.app-topbar {
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  position: sticky;
  top: 0;
  z-index: 90;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.topbar-page-title {
  font-size: 19px;
  font-weight: 800;
  color: var(--navy);
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-content {
  padding: 28px;
  flex: 1;
}

.app-bottom-nav, .app-drawer, .drawer-backdrop, .mobile-toggle-btn {
  display: none !important;
}
"""

mobile_css = """
/* PPBF Mobile Layout Styles */
.app-sidebar {
  display: none !important;
}

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--ivory);
}

.app-topbar {
  height: 56px;
  background: var(--navy);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.mobile-toggle-btn {
  background: none;
  border: none;
  color: #ffffff;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: var(--radius-sm);
}
.mobile-top-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}
.mobile-top-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
}
.mobile-top-name {
  font-family: 'Noto Serif Bengali', serif;
  font-size: 14.5px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.1;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-content {
  padding: 14px 14px 84px 14px;
  flex: 1;
  min-width: 0;
}

/* Off-canvas Drawer */
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(11, 37, 69, 0.6);
  backdrop-filter: blur(2px);
  z-index: 999;
  display: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.drawer-backdrop.open {
  display: block;
  opacity: 1;
}

.app-drawer {
  position: fixed;
  top: 0;
  left: -290px;
  width: 280px;
  height: 100%;
  background: linear-gradient(180deg, #07192f 0%, #0b2545 100%);
  color: #ffffff;
  z-index: 1000;
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 5px 0 20px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
}
.app-drawer.open {
  left: 0;
}
.drawer-header {
  padding: 20px 16px 16px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  text-align: center;
  position: relative;
}
.drawer-close-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
}
.drawer-nav {
  padding: 14px 10px;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.drawer-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  color: #cbd5e1;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}
.drawer-link:hover, .drawer-link.active {
  background: rgba(184, 137, 58, 0.2);
  color: #ffffff;
  border-left: 3px solid var(--gold);
}
.drawer-link svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

/* Bottom Navigation Bar */
.app-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #ffffff;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 200;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.06);
}
.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: 10.5px;
  font-weight: 600;
  color: var(--text-muted);
  text-decoration: none;
  flex: 1;
  height: 100%;
  transition: all 0.2s;
}
.bottom-nav-item svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
  transition: transform 0.2s;
}
.bottom-nav-item.active {
  color: var(--navy);
  font-weight: 800;
}
.bottom-nav-item.active svg {
  fill: var(--navy);
  transform: translateY(-1px);
}

/* Mobile Sticky Table Column */
.mobile-sticky-col th:first-child,
.mobile-sticky-col td:first-child {
  position: sticky;
  left: 0;
  z-index: 3;
  background: #ffffff;
  box-shadow: 2px 0 4px rgba(0,0,0,0.04);
}
.mobile-sticky-col tr:nth-child(even) td:first-child {
  background: var(--ivory);
}
.mobile-sticky-col th:first-child {
  background: var(--navy) !important;
}
"""

with open('desktop_styles.css', 'w') as f:
    f.write(desktop_css)
with open('mobile_styles.css', 'w') as f:
    f.write(mobile_css)
print("Saved desktop_styles.css and mobile_styles.css")
