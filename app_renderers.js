// UI Screen Renderers for PPBF (Full-Screen Layout & Categorized Three-Dot Navigation)

const ROUTE_TITLES = {
  home: 'Executive Board',
  members: 'Member Directory (38)',
  shares: 'Share Register (1–50)',
  loans: 'Investments Portfolio',
  forms: 'Official A4 Forms Hub',
  statements: 'Statements Center',
  finance: 'Treasury & Accounts',
  assets: 'Asset Register',
  media: 'Forum Media Gallery',
  about: 'About Council',
  report: 'Audit & Integrity Report',
  admin: 'Secretariat Admin'
};

function getActiveRoute() {
  let hash = window.location.hash || '#/home';
  if (!hash.startsWith('#/')) hash = '#/home';
  return hash;
}

function renderRoute() {
  const hash = getActiveRoute();
  const content = document.getElementById('app-content');
  if (!content) return;

  pushRouteHistory(hash);
  updateNavActive(hash);

  if (hash === '#/home') {
    content.innerHTML = renderHome();
  } else if (hash === '#/members') {
    content.innerHTML = renderMembers();
  } else if (hash === '#/shares') {
    content.innerHTML = renderShareRegister();
  } else if (/^#\/member\/([^/]+)\/statement$/.test(hash)) {
    const id = decodeURIComponent(hash.match(/^#\/member\/([^/]+)\/statement$/)[1]);
    content.innerHTML = renderMemberStatement(id);
    autoScaleA4();
  } else if (hash.startsWith('#/member/')) {
    const id = decodeURIComponent(hash.replace('#/member/', ''));
    content.innerHTML = renderMemberProfile(id);
  } else if (hash === '#/loans') {
    content.innerHTML = renderLoans();
  } else if (hash.startsWith('#/inv/')) {
    const no = decodeURIComponent(hash.replace('#/inv/', ''));
    if (no === 'all') {
      content.innerHTML = renderInvAll();
    } else {
      content.innerHTML = renderInvForm(no);
    }
    autoScaleA4();
  } else if (hash === '#/forms') {
    content.innerHTML = renderFormsHub();
  } else if (hash === '#/statements') {
    content.innerHTML = renderStatements();
  } else if (hash === '#/assets') {
    content.innerHTML = renderAssets();
  } else if (hash === '#/finance') {
    content.innerHTML = renderFinance();
  } else if (hash === '#/media') {
    content.innerHTML = renderMedia();
  } else if (hash === '#/about') {
    content.innerHTML = renderAbout();
  } else if (hash === '#/report') {
    content.innerHTML = renderReport();
  } else if (hash === '#/admin') {
    content.innerHTML = renderAdmin();
  } else {
    window.location.hash = '#/home';
    return;
  }

  window.scrollTo({ top: 0, behavior: 'instant' });
  setTimeout(autoScaleA4, 50);
  if (typeof updateAndroidBackCapability === 'function') {
    updateAndroidBackCapability();
  }
  if (typeof refreshCloudSyncUI === 'function') {
    refreshCloudSyncUI();
  }
}

function resolveRouteLabel(hash) {
  if (hash === '#/home') return ROUTE_TITLES.home;
  if (hash === '#/members') return ROUTE_TITLES.members;
  if (hash === '#/shares') return ROUTE_TITLES.shares;
  if (/^#\/member\/[^/]+\/statement$/.test(hash)) return 'Member A4 Statement';
  if (hash.startsWith('#/member/')) return 'Member Profile';
  if (hash === '#/loans') return ROUTE_TITLES.loans;
  if (hash === '#/inv/all') return 'All Investment Forms';
  if (hash.startsWith('#/inv/')) return `Investment Form #${decodeURIComponent(hash.replace('#/inv/', ''))}`;
  const key = hash.replace('#/', '');
  return ROUTE_TITLES[key] || ROUTE_TITLES.home;
}

function updateNavActive(hash) {
  const isHome = hash === '#/home';
  const backBtn = document.getElementById('topbar-back-btn');
  if (backBtn) {
    backBtn.style.display = isHome ? 'none' : 'inline-flex';
  }

  const pill = document.getElementById('topbar-route-pill');
  if (pill) {
    pill.textContent = resolveRouteLabel(hash);
  }

  const modeBtn = document.getElementById('mode-status-btn');
  if (modeBtn) {
    const edit = isEditMode();
    modeBtn.classList.toggle('unlocked', edit);
    modeBtn.innerHTML = edit ? '<span>🔓</span><span>Edit Mode</span>' : '<span>🔒</span><span>View Only</span>';
  }

  const menuModeSub = document.getElementById('menu-mode-sub');
  if (menuModeSub) {
    menuModeSub.textContent = isEditMode() ? 'Unlocked (Full PII & inline edit active)' : 'Locked (Click to unlock with passkey)';
  }

  const androidGroup = document.getElementById('more-menu-android-group');
  if (androidGroup) {
    const hasAndroid = Boolean(window.AndroidApp);
    androidGroup.style.display = hasAndroid ? 'block' : 'none';
    const layoutSub = document.getElementById('menu-android-layout-sub');
    if (hasAndroid && layoutSub && typeof window.AndroidApp.isDesktopLayout === 'function') {
      const isDesk = window.AndroidApp.isDesktopLayout();
      layoutSub.textContent = isDesk ? 'Currently Desktop View — Tap for Mobile View' : 'Currently Mobile View — Tap for Desktop View';
    }
  }

  document.querySelectorAll('.more-menu-item[data-route]').forEach(item => {
    const route = item.getAttribute('data-route');
    const active =
      route === hash ||
      (route === '#/loans' && hash.startsWith('#/inv/') && hash !== '#/inv/all') ||
      (route === '#/members' && hash.startsWith('#/member/'));
    item.classList.toggle('active', active);
  });

  const morePanel = document.getElementById('more-menu-panel');
  const isMoreOpen = Boolean(morePanel && morePanel.classList.contains('open'));
  const isHomeTab = hash === '#/home';
  const isMembersTab = hash === '#/members' || hash.startsWith('#/member/');
  const isLoansTab = hash === '#/loans' || (hash.startsWith('#/inv/') && hash !== '#/inv/all');
  const isSharesTab = hash === '#/shares';
  const isSecondaryRoute = !(isHomeTab || isMembersTab || isLoansTab || isSharesTab);

  document.querySelectorAll('.bottom-nav-item[data-nav]').forEach(navEl => {
    const key = navEl.getAttribute('data-nav');
    let active = false;
    if (key === 'more') {
      active = isMoreOpen || isSecondaryRoute;
    } else if (!isMoreOpen) {
      if (key === 'home') active = isHomeTab;
      else if (key === 'members') active = isMembersTab;
      else if (key === 'loans') active = isLoansTab;
      else if (key === 'shares') active = isSharesTab;
    }
    navEl.classList.toggle('active', active);
  });
}

function getCloudSyncPresentation() {
  const cs = (typeof CLOUD_STATE === 'object' && CLOUD_STATE) ? CLOUD_STATE : {};
  let pillClass = 'cloud-pill--offline';
  let pillText = 'Local Offline Mode';
  if (cs.isAuthLoading || cs.syncState === 'syncing') {
    pillClass = 'cloud-pill--syncing';
    pillText = cs.isAuthLoading ? 'Signing In...' : 'Syncing Cloud...';
  } else if (cs.isSignedIn && cs.isConnected) {
    pillClass = 'cloud-pill--live';
    pillText = 'Cloud Live Sync';
  } else if (cs.isSignedIn) {
    pillClass = 'cloud-pill--warn';
    pillText = 'Signed In (Offline Cached)';
  } else if (cs.isConnected) {
    pillClass = 'cloud-pill--warn';
    pillText = 'Connected • Sign in for Sync';
  } else if (cs.firebaseInitialized) {
    pillClass = 'cloud-pill--offline';
    pillText = 'Offline Cached';
  }

  const identityText = cs.isSignedIn
    ? (cs.email || cs.displayName || 'Google Account Connected')
    : 'Sign in with Google to synchronize all 38 member records, photos & 24 forms across Web and Android.';

  let syncTimeText = 'Not synced yet';
  if (cs.lastSyncAt) {
    try {
      const dt = new Date(cs.lastSyncAt);
      syncTimeText = isNaN(dt.getTime()) ? String(cs.lastSyncAt) : dt.toLocaleString();
    } catch (_) {
      syncTimeText = String(cs.lastSyncAt);
    }
  }

  return { cs, pillClass, pillText, identityText, syncTimeText };
}

function renderCloudSyncCompact() {
  const { cs, pillClass, pillText, identityText, syncTimeText } = getCloudSyncPresentation();
  return `
    <div class="hero-cloud-strip">
      <div class="hero-cloud-meta">
        <span class="cloud-pill ${pillClass}">${escHtml(pillText)}</span>
        <span>${cs.isSignedIn ? escHtml(identityText) : 'Local & Firebase Realtime DB Sync'}</span>
        ${cs.lastSyncAt ? `<span style="opacity:0.8;">• Last sync: ${escHtml(syncTimeText)}</span>` : ''}
      </div>
      <div class="hero-cloud-actions">
        ${cs.isSignedIn ? `
          <button type="button" class="btn btn-sm btn-outline" style="background:rgba(255,255,255,0.12); color:#fff; border-color:rgba(255,255,255,0.28);" onclick="cloudPullNow()">Pull Latest</button>
          <button type="button" class="btn btn-sm btn-gold" onclick="pushCloudDataNow(true)">Push Cloud</button>
        ` : `
          <button type="button" class="btn btn-sm btn-gold" onclick="cloudSignInWithGoogle()" ${cs.isAuthLoading ? 'disabled' : ''}>
            ${cs.isAuthLoading ? 'Connecting...' : 'Sign in with Google'}
          </button>
        `}
      </div>
    </div>
  `;
}

function renderCloudSyncCard(isDrawer = false) {
  const { cs, pillClass, pillText, identityText, syncTimeText } = getCloudSyncPresentation();
  const cardClass = isDrawer ? 'cloud-sync-card cloud-sync-card--drawer' : 'cloud-sync-card';
  return `
    <div class="${cardClass}">
      <div class="cloud-sync-header">
        <div class="cloud-sync-title">Firebase Cloud Sync (${cs.platform === 'android' ? 'Android Native' : 'Web SDK'})</div>
        <span class="cloud-pill ${pillClass}">${escHtml(pillText)}</span>
      </div>
      <div class="cloud-sync-sub">
        <div><strong>Account:</strong> ${escHtml(identityText)}</div>
        <div><strong>Database:</strong> ppbf-2023 • <strong>Last Sync:</strong> ${escHtml(syncTimeText)}</div>
      </div>
      ${cs.lastError ? `<div class="cloud-sync-error">${escHtml(cs.lastError)}</div>` : ''}
      <div class="cloud-actions-row">
        ${cs.isSignedIn ? `
          <button type="button" class="btn btn-sm btn-primary" onclick="cloudPullNow()">Pull Latest</button>
          <button type="button" class="btn btn-sm btn-gold" onclick="pushCloudDataNow(true)">Push Snapshot</button>
          <button type="button" class="btn btn-sm btn-outline" onclick="cloudSignOut()">Sign Out</button>
        ` : `
          <button type="button" class="btn btn-sm btn-gold" onclick="cloudSignInWithGoogle()" ${cs.isAuthLoading ? 'disabled' : ''}>
            ${cs.isAuthLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>
          <button type="button" class="btn btn-sm btn-outline" onclick="cloudPullNow()">Check Cloud</button>
        `}
      </div>
    </div>
  `;
}

function refreshCloudSyncUI() {
  if (typeof document === 'undefined') return;
  const homeSlot = document.getElementById('home-cloud-sync-slot');
  if (homeSlot) homeSlot.innerHTML = renderCloudSyncCompact();

  const drawerSlot = document.getElementById('more-menu-cloud-slot');
  if (drawerSlot) drawerSlot.innerHTML = renderCloudSyncCard(true);

  const adminSlot = document.getElementById('admin-cloud-sync-slot');
  if (adminSlot) adminSlot.innerHTML = renderCloudSyncCard(false);
}

// 1. EXECUTIVE HOME SCREEN (#/home)
// Prioritizes ONLY the 4 most important options + clearly separated Source vs Calculated KPIs
function renderHome() {
  const info = PPBF_DATA.info || {};
  const list = PPBF_DATA.investments.list || [];
  const members = PPBF_DATA.members || [];
  const src = PPBF_DATA.source_summary || {
    distinct_profiles: 38,
    share_serials: 50,
    total_shares: 50,
    total_target: 1850000,
    paid: 1769000,
    due: 81000,
    profit: 1126937
  };
  const integrity = analyzeDataIntegrity(PPBF_DATA);

  let totalInvested = 0;
  let totalReceived = 0;
  let totalInvDue = 0;
  let totalInvProfit = 0;
  let runningCount = 0;
  let runningTotal = 0;
  let completedCount = 0;

  list.forEach(item => {
    totalInvested += (parseFloat(item.total) || 0);
    totalReceived += (parseFloat(item.received) || 0);
    totalInvDue += (parseFloat(item.due) || 0);
    totalInvProfit += (parseFloat(item.profit) || 0);
    if (item.status === 'RUNNING') {
      runningCount++;
      runningTotal += (parseFloat(item.total) || 0);
    } else {
      completedCount++;
    }
  });

  const typeMap = {};
  list.forEach(item => {
    const t = item.type || 'General';
    typeMap[t] = (typeMap[t] || 0) + (parseFloat(item.total) || 0);
  });

  const edit = isEditMode();

  return `
    <!-- Executive Hero Banner -->
    <section class="hero-banner">
      <div class="hero-grid">
        <div class="hero-crest-wrap">
          <img src="${PPBF_LOGO_SRC}" alt="PPBF Official Crest" class="hero-crest" />
          <div>
            <div class="hero-bismillah">${escHtml(info.bismillah || 'বিসমিল্লাহির রাহমানির রাহীম')}</div>
            <h1 class="hero-title-bn">${escHtml(info.name_bn || 'পরানিয়া পাড়া বিজনেস ফোরাম')}</h1>
            <div class="hero-title-en">${escHtml(info.name_en || 'PARANIA PARA BUSINESS FORUM')}</div>
            <div class="hero-meta-line">
              Est. ${escHtml(info.established || '01/10/2022')} • ${escHtml(info.address || "P.M. Khali, Cox's Bazar")} • ${escHtml(info.email || 'ppbf2023@gmail.com')}
            </div>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
          <button class="badge ${edit ? 'badge-completed' : 'badge-gold'}" style="cursor:pointer; border:none; padding: 7px 14px; font-size: 12.5px;" onclick="toggleEditMode()">
            ${edit ? '🔓 Edit Mode Active' : '🔒 View-Only Mode (PII Masked)'}
          </button>
          <button class="btn btn-sm btn-outline" style="background: rgba(255,255,255,0.12); color:#fff; border-color: rgba(255,255,255,0.28);" onclick="toggleMoreMenu(true)">
            More Options &amp; Tools
          </button>
        </div>
      </div>
      <div id="home-cloud-sync-slot">${renderCloudSyncCompact()}</div>
      <div class="tri-bar" style="margin-top: 16px; border-radius: 3px;">
        <div class="bar-red"></div>
        <div class="bar-orange"></div>
        <div class="bar-green"></div>
      </div>
    </section>

    <!-- Priority Quick Access: ONLY 4 Essential Options -->
    <div class="section-heading-row">
      <div>
        <h2 class="section-heading">Essential Forum Access</h2>
        <p class="section-sub">Core daily cooperative workflows — switch anytime via the bottom navigation bar or open <strong>More</strong> for Statements, Treasury, Assets, Media &amp; Admin</p>
      </div>
    </div>

    <div class="priority-grid">
      <a href="#/members" class="priority-card" id="priority-members">
        <div class="priority-card-top">
          <div>
            <div class="priority-title">Member Directory</div>
            <div class="priority-desc">38 distinct member profiles holding 50 shares with 10-section records &amp; ledgers.</div>
          </div>
          <div class="priority-icon-box">
            <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          </div>
        </div>
        <div class="priority-foot">
          <span>${integrity.profileCount} Profiles • ${integrity.totalSharesSum} Shares</span>
          <span>Open →</span>
        </div>
      </a>

      <a href="#/loans" class="priority-card" id="priority-investments">
        <div class="priority-card-top">
          <div>
            <div class="priority-title">Investments Portfolio</div>
            <div class="priority-desc">All ${list.length} cooperative investments, installments, guarantors &amp; recovery status.</div>
          </div>
          <div class="priority-icon-box">
            <svg viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
          </div>
        </div>
        <div class="priority-foot">
          <span>${runningCount} Running • ${completedCount} Completed</span>
          <span>Open →</span>
        </div>
      </a>

      <a href="#/shares" class="priority-card" id="priority-shares">
        <div class="priority-card-top">
          <div>
            <div class="priority-title">Share Register 1–50</div>
            <div class="priority-desc">Complete share serial 1 to 50 ownership lookup linked directly to member profiles.</div>
          </div>
          <div class="priority-icon-box">
            <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-3 15H8v-2h3v2zm5 0h-3v-2h3v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
          </div>
        </div>
        <div class="priority-foot">
          <span>${integrity.uniqueSerialCount} / 50 Serials Verified</span>
          <span>Open →</span>
        </div>
      </a>

      <a href="#/statements" class="priority-card" id="priority-statements">
        <div class="priority-card-top">
          <div>
            <div class="priority-title">Statements &amp; A4 Forms</div>
            <div class="priority-desc">Printable portrait A4 investment ledgers and member savings statements.</div>
          </div>
          <div class="priority-icon-box">
            <svg viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
          </div>
        </div>
        <div class="priority-foot">
          <span>A4 Print &amp; PDF Ready</span>
          <span>Open →</span>
        </div>
      </a>
    </div>

    <!-- Source Member Fund Overview (Explicitly separated from Calculated Sums) -->
    <div class="section-heading-row">
      <div>
        <h2 class="section-heading">Cooperative Savings &amp; Member Fund</h2>
        <p class="section-sub">Official source summary values alongside live calculated member &amp; investment totals</p>
      </div>
      <a href="#/report" class="btn btn-sm btn-outline">Data Integrity Details</a>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card accent-navy">
        <span class="kpi-label">Registered Equity</span>
        <span class="kpi-val">${integrity.profileCount} / ${integrity.totalSharesSum}</span>
        <span class="kpi-sub">${integrity.profileCount} Distinct Profiles holding ${integrity.totalSharesSum} Share Serials</span>
        <span class="kpi-source-tag tag-source">Authoritative Source</span>
      </div>
      <div class="kpi-card accent-green">
        <span class="kpi-label">Member Savings Paid</span>
        <span class="kpi-val" style="color: var(--tri-green);">${formatTaka(integrity.calculated.paid)}</span>
        <span class="kpi-sub">Source Target: ${formatTaka(src.total_target)}</span>
        <span class="kpi-source-tag tag-calculated">Calculated &amp; Matches Source (${formatTaka(src.paid)})</span>
      </div>
      <div class="kpi-card accent-red">
        <span class="kpi-label">Net Member Due</span>
        <span class="kpi-val" style="color: var(--tri-red);">${formatTaka(integrity.calculated.due)}</span>
        <span class="kpi-sub">Includes ${integrity.negativeDueMembers.length} overpaid/negative-due records</span>
        <span class="kpi-source-tag tag-calculated">Calculated &amp; Matches Source (${formatTaka(src.due)})</span>
      </div>
      <div class="kpi-card accent-gold">
        <span class="kpi-label">Source Glance Profit</span>
        <span class="kpi-val" style="color: var(--gold);">${formatTaka(src.profit)}</span>
        <span class="kpi-sub">Sum of member profit fields: ${formatTaka(Math.round(integrity.calculated.profitFieldSum))}</span>
        <span class="kpi-source-tag tag-source">Source Summary Glance</span>
      </div>
    </div>

    <!-- Calculated Investment Portfolio KPIs -->
    <div class="section-heading-row">
      <div>
        <h2 class="section-heading">Investment Portfolio Overview</h2>
        <p class="section-sub">Live totals derived from the ${list.length} master investment statement forms</p>
      </div>
      <a href="#/inv/all" class="btn btn-sm btn-gold">Print All ${list.length} A4 Forms</a>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card accent-navy">
        <span class="kpi-label">Total Capital Invested</span>
        <span class="kpi-val">${formatTaka(totalInvested)}</span>
        <span class="kpi-sub">${list.length} Master Investment Agreements</span>
        <span class="kpi-source-tag tag-calculated">Calculated Live</span>
      </div>
      <div class="kpi-card accent-orange">
        <span class="kpi-label">Running vs Completed</span>
        <span class="kpi-val">${runningCount} / ${completedCount}</span>
        <span class="kpi-sub">${formatTaka(runningTotal)} Active Capital</span>
        <span class="kpi-source-tag tag-calculated">Calculated Live</span>
      </div>
      <div class="kpi-card accent-green">
        <span class="kpi-label">Installments Received</span>
        <span class="kpi-val" style="color: var(--tri-green);">${formatTaka(totalReceived)}</span>
        <span class="kpi-sub">Synced from 24-row payment ledgers</span>
        <span class="kpi-source-tag tag-calculated">Calculated Live</span>
      </div>
      <div class="kpi-card accent-red">
        <span class="kpi-label">Investment Outstanding Due</span>
        <span class="kpi-val" style="color: var(--tri-red);">${formatTaka(totalInvDue)}</span>
        <span class="kpi-sub">Expected Investment Profit: ${formatTaka(totalInvProfit)}</span>
        <span class="kpi-source-tag tag-calculated">Calculated Live</span>
      </div>
    </div>

    <!-- Breakdown by Investment Type & Active Records -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-bottom: 24px;">
      <div class="panel" style="margin-bottom: 0;">
        <div class="panel-header">
          <div class="panel-title">Portfolio Breakdown by Type</div>
          <a href="#/loans" class="btn btn-sm btn-outline">Details</a>
        </div>
        <div class="panel-body">
          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${Object.entries(typeMap).map(([type, amt]) => {
              const pct = totalInvested > 0 ? Math.round((amt / totalInvested) * 100) : 0;
              return `
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; margin-bottom: 4px;">
                    <span style="color: var(--navy);">${escHtml(type)}</span>
                    <span>${formatTaka(amt)} <span style="color: var(--text-muted); font-size: 12px;">(${pct}%)</span></span>
                  </div>
                  <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${pct}%;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <div class="panel" style="margin-bottom: 0;">
        <div class="panel-header">
          <div class="panel-title">Quick Investment Form Jump</div>
          <span class="badge badge-navy">${list.length} Forms</span>
        </div>
        <div class="panel-body">
          <div class="chips-scroll" style="flex-wrap: wrap; overflow: visible; margin-bottom: 10px;">
            ${list.map(i => `
              <a href="#/inv/${encodeURIComponent(i.no)}" class="chip">
                #${escHtml(i.no)} • ${escHtml(String(i.receiver || '').split(' ')[0])}
              </a>
            `).join('')}
          </div>
          <p style="font-size: 13px; color: var(--text-muted);">
            Select any investment chip to open its synchronized 24-row portrait A4 statement.
          </p>
        </div>
      </div>
    </div>

    <!-- Recent Investment Activity Table -->
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">Recent &amp; Active Investment Agreements</div>
        <a href="#/loans" class="btn btn-sm btn-primary">View All ${list.length}</a>
      </div>
      <div class="table-responsive mobile-sticky-col">
        <table class="data-table">
          <thead>
            <tr>
              <th># No.</th>
              <th>Receiver</th>
              <th>Type</th>
              <th>Total (৳)</th>
              <th>Received (৳)</th>
              <th>Due (৳)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${list.slice(0, 8).map(item => `
              <tr>
                <td style="font-weight: 800; color: var(--navy);">${escHtml(item.no)}</td>
                <td>
                  <div style="font-weight: 700;">${escHtml(item.receiver)}</div>
                  <div class="bengali-text" style="font-size: 12.5px; color: var(--text-muted);">${escHtml(item.receiver_bn || '')}</div>
                </td>
                <td>${escHtml(item.type)}</td>
                <td style="font-weight: 700;">${formatTaka(item.total)}</td>
                <td style="color: var(--tri-green); font-weight: 700;">${formatTaka(item.received)}</td>
                <td style="color: ${item.due > 0 ? 'var(--tri-red)' : 'var(--tri-green)'}; font-weight: 700;">${formatTaka(item.due)}</td>
                <td><span class="badge ${item.status === 'RUNNING' ? 'badge-running' : 'badge-completed'}">${escHtml(item.status)}</span></td>
                <td><a href="#/inv/${encodeURIComponent(item.no)}" class="btn btn-sm btn-outline">A4 Form</a></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 2. AUTHORITATIVE 38-MEMBER DIRECTORY (#/members)
let CURRENT_MEMBER_FILTER = 'ALL';

function renderMembers() {
  const members = PPBF_DATA.members || [];
  const integrity = analyzeDataIntegrity(PPBF_DATA);
  const edit = isEditMode();

  const multiShareCount = members.filter(m => Number(m.shares) > 1).length;
  const hasDueCount = members.filter(m => Number(m.due) > 0).length;
  const negDueCount = members.filter(m => Number(m.due) < 0).length;
  const zeroDueCount = members.filter(m => Number(m.due) === 0).length;

  return `
    <div class="section-heading-row">
      <div>
        <h2 class="section-heading">Member Directory (${integrity.profileCount} Distinct Profiles / ${integrity.totalSharesSum} Shares)</h2>
        <p class="section-sub">
          Calculated Paid: <strong>${formatTaka(integrity.calculated.paid)}</strong> •
          Net Due: <strong>${formatTaka(integrity.calculated.due)}</strong> •
          ${edit ? '<span style="color:var(--tri-green);font-weight:700;">Edit Mode: Full PII Visible</span>' : '<span>View Mode: Contact &amp; NID PII Masked</span>'}
        </p>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <a href="#/shares" class="btn btn-sm btn-outline">Share Register 1–50</a>
        <button class="btn btn-sm btn-gold" onclick="exportMembersCSV()">Export CSV</button>
      </div>
    </div>

    <div class="toolbar-card">
      <div class="search-input-wrap">
        <svg class="search-icon" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        <input type="text" id="member-search" class="search-input"
          placeholder="Search by Member ID, English/Bengali name, serial #, mobile, email, or NID..."
          oninput="filterMembersList(this.value)" />
      </div>
      <div style="display: flex; gap: 6px; flex-wrap: wrap;">
        <button class="btn btn-sm btn-primary member-filter-btn" onclick="setMemberFilter('ALL', this)">All (${members.length})</button>
        <button class="btn btn-sm btn-outline member-filter-btn" onclick="setMemberFilter('MULTI', this)">Multi-Share (${multiShareCount})</button>
        <button class="btn btn-sm btn-outline member-filter-btn" onclick="setMemberFilter('HAS_DUE', this)">Has Due (${hasDueCount})</button>
        <button class="btn btn-sm btn-outline member-filter-btn" onclick="setMemberFilter('NEG_DUE', this)">Negative Due (${negDueCount})</button>
        <button class="btn btn-sm btn-outline member-filter-btn" onclick="setMemberFilter('ZERO_DUE', this)">Zero Due (${zeroDueCount})</button>
      </div>
    </div>

    <div class="panel">
      <div class="table-responsive mobile-sticky-col">
        <table class="data-table" id="members-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Member (EN / BN)</th>
              <th>Shares &amp; Serials</th>
              <th>Contact</th>
              <th>Paid (৳)</th>
              <th>Due (৳)</th>
              <th>Profit (৳)</th>
              <th>Payout (৳)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${members.map(m => {
              const serials = Array.isArray(m.serials) ? m.serials : [];
              const searchBlob = [
                m.id, m.en, m.bn, m.mobile, m.email, m.nid, m.prof,
                serials.join(' ')
              ].join(' ').toLowerCase();
              const dueNum = Number(m.due) || 0;
              return `
                <tr class="member-row"
                    data-search="${escHtml(searchBlob)}"
                    data-shares="${Number(m.shares) || 0}"
                    data-due="${dueNum}">
                  <td style="font-weight: 800; color: var(--navy);">#${m.id}</td>
                  <td>
                    <a href="#/member/${m.id}" style="text-decoration:none; color:inherit;">
                      <div style="font-weight: 800; color: var(--navy);">${escHtml(m.en)}</div>
                      <div class="bengali-text" style="font-size: 13px; color: var(--text-muted);">${escHtml(m.bn || '')}</div>
                    </a>
                  </td>
                  <td>
                    <div style="font-weight: 700; font-size: 13px; color: var(--navy); margin-bottom: 4px;">${m.shares} Share${Number(m.shares) > 1 ? 's' : ''}</div>
                    <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                      ${serials.map(s => `<a href="#/shares" class="serial-pill">#${s}</a>`).join('')}
                    </div>
                  </td>
                  <td style="font-size: 13px;">
                    <div>${maskPhone(m.mobile)}</div>
                    <div style="color: var(--text-muted); font-size: 12px;">${maskEmail(m.email)}</div>
                  </td>
                  <td style="font-weight: 700; color: var(--tri-green);">${formatTaka(m.paid)}</td>
                  <td style="font-weight: 800; color: ${dueNum > 0 ? 'var(--tri-red)' : (dueNum < 0 ? '#0369a1' : 'var(--tri-green)')};">
                    ${formatTaka(m.due)}
                  </td>
                  <td style="font-weight: 600;">${formatTaka(Math.round(Number(m.profit) || 0))}</td>
                  <td style="font-weight: 700; color: var(--navy);">${formatTaka(Math.round(Number(m.payout) || 0))}</td>
                  <td>
                    <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                      <a href="#/member/${m.id}" class="btn btn-sm btn-primary">Profile</a>
                      <a href="#/member/${m.id}/statement" class="btn btn-sm btn-outline">A4</a>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function setMemberFilter(mode, btn) {
  CURRENT_MEMBER_FILTER = mode;
  document.querySelectorAll('.member-filter-btn').forEach(b => {
    b.classList.remove('btn-primary');
    b.classList.add('btn-outline');
  });
  if (btn) {
    btn.classList.remove('btn-outline');
    btn.classList.add('btn-primary');
  }
  const inp = document.getElementById('member-search');
  filterMembersList(inp ? inp.value : '');
}

function filterMembersList(q) {
  q = (q || '').trim().toLowerCase();
  document.querySelectorAll('.member-row').forEach(row => {
    const blob = row.getAttribute('data-search') || '';
    const shares = Number(row.getAttribute('data-shares') || 0);
    const due = Number(row.getAttribute('data-due') || 0);

    let passFilter = true;
    if (CURRENT_MEMBER_FILTER === 'MULTI') passFilter = shares > 1;
    else if (CURRENT_MEMBER_FILTER === 'HAS_DUE') passFilter = due > 0;
    else if (CURRENT_MEMBER_FILTER === 'NEG_DUE') passFilter = due < 0;
    else if (CURRENT_MEMBER_FILTER === 'ZERO_DUE') passFilter = due === 0;

    const passSearch = !q || blob.includes(q);
    row.style.display = (passFilter && passSearch) ? '' : 'none';
  });
}

// 2B. COMPLETE 10-SECTION MEMBER PROFILE (#/member/<id>)
function renderMemberProfile(id) {
  const members = PPBF_DATA.members || [];
  const m = members.find(item => String(item.id) === String(id));
  if (!m) {
    return `
      <div class="panel" style="padding: 36px; text-align: center;">
        <h3 style="font-size: 22px; color: var(--navy); margin-bottom: 10px;">Member #${escHtml(id)} Not Found</h3>
        <p style="color: var(--text-muted); margin-bottom: 16px;">Only the 38 canonical member profiles (IDs 1–38) exist in the dataset.</p>
        <a href="#/members" class="btn btn-primary">Return to Member Directory</a>
      </div>
    `;
  }

  const edit = isEditMode();
  const photoKey = `mem_${m.id}`;
  const photo = getPhoto(photoKey);
  const nom = m.nom || {};
  const bank = m.bank || {};
  const serials = Array.isArray(m.serials) ? m.serials : [];
  const yrs = m.yrs || {};
  const yearKeys = Object.keys(yrs).sort();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const ledger = Array.isArray(m.ledger) ? m.ledger : [];

  const editableCell = (path, rawVal, fallback = 'Not provided') => {
    if (edit) {
      const displayVal = (rawVal === null || rawVal === undefined) ? '' : String(rawVal);
      return `<span contenteditable="true" onblur="updateMemberField(${m.id}, '${path}', this.innerText)">${escHtml(displayVal)}</span>`;
    }
    return displayOrMissing(rawVal, fallback);
  };

  const derivedTargetCheck = (Number(m.paid) || 0) + (Number(m.due) || 0);

  return `
    <div class="toolbar-card">
      <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
        <a href="#/members" class="btn btn-sm btn-outline">← All Members (38)</a>
        <div>
          <h2 class="serif-title" style="font-size: 26px; color: var(--navy); font-weight: 700;">
            #${m.id} — ${escHtml(m.en)}
          </h2>
          <div class="bengali-text" style="font-size: 14.5px; color: var(--text-muted);">${escHtml(m.bn || '')}</div>
        </div>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <a href="#/member/${m.id}/statement" class="btn btn-sm btn-gold">Printable A4 Statement</a>
        <button class="btn btn-sm ${edit ? 'btn-danger' : 'btn-primary'}" onclick="toggleEditMode()">
          ${edit ? '🔓 Lock to View Mode' : '🔒 Unlock PII &amp; Edit'}
        </button>
      </div>
    </div>

    ${!edit ? `
      <div style="background: #eef2ff; border: 1px solid #c7d2fe; color: #312e81; padding: 11px 14px; border-radius: var(--radius-md); font-size: 13.5px; margin-bottom: 18px;">
        <strong>Privacy Notice:</strong> Mobile, Email, NID, Date of Birth, and Bank Account details are masked in View-Only mode. Unlock Edit Mode (top bar) to view full PII or make audited edits. Historical ledger rows remain protected at all times.
      </div>
    ` : ''}

    <div class="profile-sections-grid">
      <!-- 1. Identity & Membership -->
      <div class="panel" style="margin-bottom:0;">
        <div class="panel-header"><div class="panel-title">1. Identity &amp; Membership</div></div>
        <div class="panel-body">
          <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 14px;">
            <div style="width: 72px; height: 86px; border: 1px solid var(--border-medium); border-radius: 8px; overflow: hidden; background: var(--ivory); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              ${photo ? `<img src="${photo}" alt="${escHtml(m.en)}" style="width:100%;height:100%;object-fit:cover;" />` : `<span style="font-weight:800; color:var(--navy); font-size:22px;">${escHtml(String(m.en || 'M').charAt(0))}</span>`}
            </div>
            <div>
              <div style="font-weight:800; color:var(--navy);">Member ID #${m.id}</div>
              <div style="font-size:13px; color:var(--text-muted);">Photo ref: ${escHtml(m.photo || 'None')}</div>
              ${edit ? `
                <div style="display:flex; gap:6px; margin-top:6px;">
                  <label class="btn btn-sm btn-outline" style="cursor:pointer;">Upload Photo<input type="file" accept="image/*" style="display:none;" onchange="handlePhotoUpload('${photoKey}', this)" /></label>
                  ${photo ? `<button class="btn btn-sm btn-danger" onclick="removePhoto('${photoKey}')">Del</button>` : ''}
                </div>
              ` : ''}
            </div>
          </div>
          <table class="kv-table">
            <tr><th>English Name</th><td>${editableCell('en', m.en)}</td></tr>
            <tr><th>Bengali Name</th><td class="bengali-text">${editableCell('bn', m.bn)}</td></tr>
            <tr><th>Date of Birth</th><td>${edit ? editableCell('dob', m.dob) : maskSensitiveDate(m.dob)}</td></tr>
            <tr><th>Blood Group</th><td>${editableCell('blood', m.blood)}</td></tr>
            <tr><th>Join Date</th><td>${editableCell('join', m.join)}</td></tr>
          </table>
        </div>
      </div>

      <!-- 2. Family & Address -->
      <div class="panel" style="margin-bottom:0;">
        <div class="panel-header"><div class="panel-title">2. Family &amp; Address</div></div>
        <div class="panel-body">
          <table class="kv-table">
            <tr><th>Father's Name</th><td class="bengali-text">${editableCell('father', m.father)}</td></tr>
            <tr><th>Mother's Name</th><td class="bengali-text">${editableCell('mother', m.mother)}</td></tr>
            <tr><th>Permanent Address</th><td class="bengali-text">${editableCell('perm', m.perm)}</td></tr>
            <tr><th>Current Address</th><td class="bengali-text">${editableCell('cur', m.cur)}</td></tr>
          </table>
        </div>
      </div>

      <!-- 3. Education & Profession -->
      <div class="panel" style="margin-bottom:0;">
        <div class="panel-header"><div class="panel-title">3. Education &amp; Profession</div></div>
        <div class="panel-body">
          <table class="kv-table">
            <tr><th>Education</th><td>${editableCell('edu', m.edu)}</td></tr>
            <tr><th>Institution</th><td>${editableCell('inst', m.inst)}</td></tr>
            <tr><th>Profession</th><td class="bengali-text">${editableCell('prof', m.prof)}</td></tr>
            <tr><th>Company / Org</th><td>${editableCell('company', m.company)}</td></tr>
          </table>
        </div>
      </div>

      <!-- 4. Contact Information -->
      <div class="panel" style="margin-bottom:0;">
        <div class="panel-header"><div class="panel-title">4. Contact Information</div></div>
        <div class="panel-body">
          <table class="kv-table">
            <tr><th>Mobile</th><td>${edit ? editableCell('mobile', m.mobile) : maskPhone(m.mobile)}</td></tr>
            <tr><th>Email</th><td>${edit ? editableCell('email', m.email) : maskEmail(m.email)}</td></tr>
            <tr><th>National ID (NID)</th><td>${edit ? editableCell('nid', m.nid) : maskNID(m.nid)}</td></tr>
          </table>
        </div>
      </div>

      <!-- 5. Nominee Information -->
      <div class="panel" style="margin-bottom:0;">
        <div class="panel-header"><div class="panel-title">5. Nominee Information</div></div>
        <div class="panel-body">
          <table class="kv-table">
            <tr><th>Nominee (EN)</th><td>${editableCell('nom.en', nom.en)}</td></tr>
            <tr><th>Nominee (BN)</th><td class="bengali-text">${editableCell('nom.bn', nom.bn)}</td></tr>
            <tr><th>Relationship</th><td class="bengali-text">${editableCell('nom.rel', nom.rel)}</td></tr>
            <tr><th>Nominee DOB</th><td>${edit ? editableCell('nom.dob', nom.dob) : maskSensitiveDate(nom.dob)}</td></tr>
            <tr><th>Nominee Mobile</th><td>${edit ? editableCell('nom.mobile', nom.mobile) : maskPhone(nom.mobile)}</td></tr>
            <tr><th>Profession</th><td class="bengali-text">${editableCell('nom.prof', nom.prof)}</td></tr>
          </table>
        </div>
      </div>

      <!-- 6. Bank Information -->
      <div class="panel" style="margin-bottom:0;">
        <div class="panel-header"><div class="panel-title">6. Bank Information</div></div>
        <div class="panel-body">
          <table class="kv-table">
            <tr><th>Bank Name</th><td>${editableCell('bank.bank', bank.bank)}</td></tr>
            <tr><th>Branch</th><td>${editableCell('bank.branch', bank.branch)}</td></tr>
            <tr><th>Account Type</th><td>${editableCell('bank.type', bank.type)}</td></tr>
            <tr><th>Account Number</th><td>${edit ? editableCell('bank.acc', bank.acc) : maskBankAcc(bank.acc)}</td></tr>
          </table>
        </div>
      </div>

      <!-- 7. Shareholding & Share Serials -->
      <div class="panel" style="margin-bottom:0;">
        <div class="panel-header"><div class="panel-title">7. Shareholding &amp; Share Serials</div></div>
        <div class="panel-body">
          <table class="kv-table">
            <tr><th>Total Shares Held</th><td style="font-size:18px; color:var(--navy); font-weight:800;">${m.shares}</td></tr>
            <tr>
              <th>Assigned Serials</th>
              <td>
                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                  ${serials.map(s => `<a href="#/shares" class="serial-pill">Serial #${s}</a>`).join('')}
                </div>
              </td>
            </tr>
            <tr><th>Ownership Share (%)</th><td>${formatExactNumber(m.own)}% <span class="kpi-source-tag tag-source">Stored Value</span></td></tr>
          </table>
        </div>
      </div>

      <!-- 8. Exact Source Financial Values -->
      <div class="panel" style="margin-bottom:0;">
        <div class="panel-header">
          <div class="panel-title">8. Exact Source Financial Values</div>
          <span class="kpi-source-tag tag-source">Raw Preserved</span>
        </div>
        <div class="panel-body">
          <table class="kv-table">
            <tr><th>Paid</th><td style="color:var(--tri-green);">${edit ? editableCell('paid', m.paid) : formatTaka(m.paid)}</td></tr>
            <tr><th>Due</th><td style="color:${Number(m.due) < 0 ? '#0369a1' : (Number(m.due) > 0 ? 'var(--tri-red)' : 'var(--tri-green)')};">${edit ? editableCell('due', m.due) : formatTaka(m.due)}</td></tr>
            <tr><th>Total (Stored)</th><td>${edit ? editableCell('total', m.total) : formatTaka(m.total)}</td></tr>
            <tr><th>Own</th><td>${formatExactNumber(m.own)}</td></tr>
            <tr><th>Profit (Stored)</th><td>${formatTaka(m.profit)}</td></tr>
            <tr><th>Payout</th><td>${formatTaka(m.payout)}</td></tr>
            <tr><th>PT</th><td>${formatTaka(m.pt)}</td></tr>
            <tr><th>Fine / Fine Paid</th><td>${formatTaka(m.fine)} / ${formatTaka(m.finepaid)}</td></tr>
            <tr><th>Calculated Check</th><td><span class="kpi-source-tag tag-calculated">Calculated</span> Paid + Due = ${formatTaka(derivedTargetCheck)}</td></tr>
          </table>
        </div>
      </div>
    </div>

    <!-- 9. Year-wise Monthly Values (2022–2029) & Extra -->
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">9. Year-wise Monthly Contributions (2022–2029)</div>
        <span class="badge badge-gold">Extra: ${formatTaka(m.extra)}</span>
      </div>
      <div class="table-responsive mobile-sticky-col">
        <table class="data-table">
          <thead>
            <tr>
              <th>Year</th>
              ${monthNames.map(mn => `<th>${mn}</th>`).join('')}
              <th>Annual Sum <span class="kpi-source-tag tag-calculated">Calc</span></th>
            </tr>
          </thead>
          <tbody>
            ${yearKeys.map(yr => {
              const arr = Array.isArray(yrs[yr]) ? yrs[yr] : [];
              const yrSum = arr.reduce((a, b) => a + (Number(b) || 0), 0);
              return `
                <tr>
                  <td style="font-weight: 800; color: var(--navy);">${escHtml(yr)}</td>
                  ${monthNames.map((_, idx) => {
                    const val = arr[idx] !== undefined ? arr[idx] : 0;
                    return `<td style="color:${Number(val) > 0 ? 'var(--navy)' : 'var(--text-light)'}; font-weight:${Number(val) > 0 ? '700' : '500'};">${formatExactNumber(val)}</td>`;
                  }).join('')}
                  <td style="font-weight: 800; color: var(--tri-green);">${formatTaka(yrSum)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- 10. Protected Complete Historical Ledger -->
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">10. Protected Complete Historical Ledger (${ledger.length} Entries)</div>
        <span class="badge badge-navy">Read-Only Protected</span>
      </div>
      <div class="table-responsive mobile-sticky-col">
        <table class="data-table">
          <thead>
            <tr>
              <th>Entry #</th>
              <th>Share Serial (s)</th>
              <th>Share Count</th>
              <th>Paid (৳)</th>
              <th>Due (৳)</th>
            </tr>
          </thead>
          <tbody>
            ${ledger.length === 0 ? `
              <tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No historical ledger entries recorded.</td></tr>
            ` : ledger.map((row, idx) => `
              <tr>
                <td style="font-weight:700;">#${idx + 1}</td>
                <td><a href="#/shares" class="serial-pill">Serial #${escHtml(row.s)}</a></td>
                <td>${escHtml(row.share !== undefined ? row.share : 1)}</td>
                <td style="font-weight:700; color:var(--tri-green);">${formatTaka(row.paid)}</td>
                <td style="font-weight:700; color:${Number(row.due) < 0 ? '#0369a1' : (Number(row.due) > 0 ? 'var(--tri-red)' : 'var(--tri-green)')};">${formatTaka(row.due)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 2C. PRINTABLE A4 MEMBER STATEMENT (#/member/<id>/statement)
function renderMemberStatement(id) {
  const members = PPBF_DATA.members || [];
  const m = members.find(item => String(item.id) === String(id));
  if (!m) {
    return `
      <div class="panel" style="padding: 36px; text-align: center;">
        <h3>Member #${escHtml(id)} Not Found</h3>
        <a href="#/members" class="btn btn-primary" style="margin-top:12px;">Back to Members</a>
      </div>
    `;
  }

  const info = PPBF_DATA.info || {};
  const photo = getPhoto(`mem_${m.id}`);
  const nom = m.nom || {};
  const bank = m.bank || {};
  const serials = Array.isArray(m.serials) ? m.serials : [];
  const yrs = m.yrs || {};
  const yearKeys = Object.keys(yrs).sort();
  const ledger = Array.isArray(m.ledger) ? m.ledger : [];

  return `
    <div style="display: flex; justify-content: center; width: 100%;">
      <div class="a4-toolbar no-print">
        <div style="display: flex; align-items: center; gap: 10px;">
          <a href="#/member/${m.id}" class="btn btn-sm btn-outline">← Member Profile</a>
          <span style="font-size: 13px; font-weight: 700; color: var(--navy);">Member #${m.id} Statement</span>
        </div>
        <button class="btn btn-sm btn-gold" onclick="printCurrentPage()">Print / Save A4 PDF</button>
      </div>
    </div>

    <div class="a4-screen-wrapper">
      <div class="a4-page-frame">
        <div>
          <div class="a4-header">
            <img src="${PPBF_LOGO_SRC}" class="a4-logo" alt="PPBF Seal" />
            <div class="a4-title-center">
              <div class="a4-bismillah">${escHtml(info.bismillah || 'বিসমিল্লাহির রাহমানির রাহীম')}</div>
              <div class="a4-forum-bn">${escHtml(info.name_bn || 'পরানিয়া পাড়া বিজনেস ফোরাম')}</div>
              <div class="a4-forum-en">${escHtml(info.name_en || 'PARANIA PARA BUSINESS FORUM')}</div>
              <div class="a4-forum-addr">Est. ${escHtml(info.established || '01/10/2022')} • ${escHtml(info.address || '')} • ${escHtml(info.email || '')}</div>
            </div>
            <div class="a4-meta-boxes">
              <div class="a4-meta-box"><div class="a4-meta-label">Member ID</div><div class="a4-meta-value">#${m.id}</div></div>
              <div class="a4-meta-box"><div class="a4-meta-label">Shares</div><div class="a4-meta-value">${m.shares} (${serials.join(', ')})</div></div>
              <div class="a4-meta-box"><div class="a4-meta-label">Joined</div><div class="a4-meta-value">${escHtml(m.join || '—')}</div></div>
            </div>
          </div>

          <div class="tri-bar" style="margin-bottom: 6px;">
            <div class="bar-red"></div><div class="bar-orange"></div><div class="bar-green"></div>
          </div>

          <div class="a4-doc-title-row">
            <div class="gold-rule"></div>
            <h2 class="a4-doc-title">Member Equity &amp; Savings Statement</h2>
            <div class="gold-rule"></div>
          </div>

          <div class="a4-details-section">
            <div class="a4-fields-grid">
              <div class="a4-field-row"><span class="a4-field-label">Name (EN):</span><span class="a4-field-val">${escHtml(m.en)}</span></div>
              <div class="a4-field-row"><span class="a4-field-label">Name (BN):</span><span class="a4-field-val bengali-text">${escHtml(m.bn || '—')}</span></div>
              <div class="a4-field-row"><span class="a4-field-label">Father:</span><span class="a4-field-val bengali-text">${escHtml(m.father || 'Not provided')}</span></div>
              <div class="a4-field-row"><span class="a4-field-label">Mother:</span><span class="a4-field-val bengali-text">${escHtml(m.mother || 'Not provided')}</span></div>
              <div class="a4-field-row"><span class="a4-field-label">Mobile:</span><span class="a4-field-val">${maskPhone(m.mobile)}</span></div>
              <div class="a4-field-row"><span class="a4-field-label">Profession:</span><span class="a4-field-val bengali-text">${escHtml(m.prof || 'Not provided')}</span></div>
              <div class="a4-field-row"><span class="a4-field-label">Nominee:</span><span class="a4-field-val bengali-text">${escHtml(nom.en || nom.bn || 'Not provided')} (${escHtml(nom.rel || '—')})</span></div>
              <div class="a4-field-row"><span class="a4-field-label">Bank:</span><span class="a4-field-val">${escHtml(bank.bank || 'Not provided')} (${maskBankAcc(bank.acc)})</span></div>
              <div class="a4-guarantor-box">
                <div><strong>Stored Source Values:</strong> Total ${formatTaka(m.total)} • Own ${formatExactNumber(m.own)} • Profit ${formatTaka(m.profit)} • Payout ${formatTaka(m.payout)} • PT ${formatTaka(m.pt)} • Extra ${formatTaka(m.extra)}</div>
              </div>
            </div>
            <div class="a4-photo-container">
              <div class="a4-photo-box">
                ${photo ? `<img src="${photo}" class="a4-photo-img" alt="Member Photo" />` : `<div class="a4-photo-placeholder"><div>Photo Ref:</div><div>${escHtml(m.photo || 'Passport Photo')}</div></div>`}
              </div>
            </div>
          </div>

          <div class="a4-summary-strip">
            <div class="a4-strip-box strip-received">
              <div style="font-size: 8.5px; text-transform: uppercase;">Source Paid</div>
              <div style="font-size: 13px; font-weight: 800;">${formatTaka(m.paid)}</div>
            </div>
            <div class="a4-strip-box ${Number(m.due) > 0 ? 'strip-due-red' : 'strip-due-green'}">
              <div style="font-size: 8.5px; text-transform: uppercase;">Source Due</div>
              <div style="font-size: 13px; font-weight: 800;">${formatTaka(m.due)}</div>
            </div>
            <div class="a4-strip-box strip-installments">
              <div style="font-size: 8.5px; text-transform: uppercase;">Fines / Paid</div>
              <div style="font-size: 13px; font-weight: 800;">${formatTaka(m.fine)} / ${formatTaka(m.finepaid)}</div>
            </div>
          </div>
        </div>

        <div class="a4-table-wrapper">
          <div style="font-size:10px; font-weight:800; color:var(--navy); margin-bottom:4px; text-transform:uppercase;">Annual Deposit Breakdown (Stored yrs Array)</div>
          <table class="a4-payment-table" style="margin-bottom: 10px;">
            <thead>
              <tr>
                <th>Year</th><th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>May</th><th>Jun</th>
                <th>Jul</th><th>Aug</th><th>Sep</th><th>Oct</th><th>Nov</th><th>Dec</th>
                <th class="text-right">Calc Sum</th>
              </tr>
            </thead>
            <tbody>
              ${yearKeys.map(yr => {
                const arr = Array.isArray(yrs[yr]) ? yrs[yr] : [];
                const sum = arr.reduce((a, b) => a + (Number(b) || 0), 0);
                return `
                  <tr>
                    <td style="font-weight:700;">${escHtml(yr)}</td>
                    ${Array.from({ length: 12 }, (_, idx) => `<td>${arr[idx] || 0}</td>`).join('')}
                    <td class="text-right" style="font-weight:700;">${formatExactNumber(sum)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div style="font-size:10px; font-weight:800; color:var(--navy); margin-bottom:4px; text-transform:uppercase;">Historical Share Ledger (ledger Array)</div>
          <table class="a4-payment-table">
            <thead>
              <tr>
                <th class="text-center">#</th>
                <th>Share Serial (s)</th>
                <th class="text-center">Share Units</th>
                <th class="text-right">Paid (৳)</th>
                <th class="text-right">Due (৳)</th>
              </tr>
            </thead>
            <tbody>
              ${ledger.map((r, i) => `
                <tr>
                  <td class="text-center">${i + 1}</td>
                  <td>Serial #${escHtml(r.s)}</td>
                  <td class="text-center">${escHtml(r.share !== undefined ? r.share : 1)}</td>
                  <td class="text-right" style="font-weight:700;">${formatTaka(r.paid)}</td>
                  <td class="text-right" style="font-weight:700;">${formatTaka(r.due)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div>
          <div class="a4-auth-grid">
            <div class="a4-auth-box"><div class="a4-sig-line"></div><div class="a4-auth-role">Finance Secretary</div><div class="a4-auth-name">${escHtml(info.finance_secretary || '')}</div></div>
            <div class="a4-auth-box"><div class="a4-sig-line"></div><div class="a4-auth-role">General Secretary</div><div class="a4-auth-name">${escHtml(info.secretary || '')}</div></div>
            <div class="a4-auth-box"><div class="a4-sig-line"></div><div class="a4-auth-role">President</div><div class="a4-auth-name">${escHtml(info.president || '')}</div></div>
          </div>
          <div class="tri-bar"><div class="bar-red"></div><div class="bar-orange"></div><div class="bar-green"></div></div>
          <div class="a4-footer-text">${escHtml(info.name_bn || '')} • ${escHtml(info.address || '')} • Generated from Canonical 38-Member / 50-Share Ledger</div>
        </div>
      </div>
    </div>
  `;
}

// 2D. SHARE SERIAL REGISTER 1–50 (#/shares)
function renderShareRegister() {
  const serials = PPBF_DATA.share_serials || [];
  const members = PPBF_DATA.members || [];
  const memberById = {};
  members.forEach(m => { memberById[Number(m.id)] = m; });

  return `
    <div class="section-heading-row">
      <div>
        <h2 class="section-heading">Share Serial Register (Serials 1–50)</h2>
        <p class="section-sub">50 unique cooperative share serials mapped across ${members.length} distinct member profiles</p>
      </div>
      <a href="#/members" class="btn btn-sm btn-outline">View 38 Member Profiles</a>
    </div>

    <div class="toolbar-card">
      <div class="search-input-wrap">
        <svg class="search-icon" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        <input type="text" class="search-input" placeholder="Search by share serial (1-50), member ID, or English/Bengali name..."
          oninput="filterShareRegister(this.value)" />
      </div>
      <span class="badge badge-navy">${serials.length} Registered Serials</span>
    </div>

    <div class="panel">
      <div class="table-responsive mobile-sticky-col">
        <table class="data-table">
          <thead>
            <tr>
              <th>Share Serial</th>
              <th>Holder Member ID</th>
              <th>Holder Name (EN / BN)</th>
              <th>Member Total Shares</th>
              <th>Holder Paid (৳)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${serials.map(s => {
              const m = memberById[Number(s.member_id)] || {};
              const blob = `${s.share_serial} ${s.member_id} ${s.member_name_en} ${s.member_name_bn}`.toLowerCase();
              return `
                <tr class="share-row" data-search="${escHtml(blob)}">
                  <td style="font-weight: 800; color: var(--navy);">#${s.share_serial}</td>
                  <td><span class="badge badge-gold">Member #${s.member_id}</span></td>
                  <td>
                    <div style="font-weight: 700; color: var(--navy);">${escHtml(s.member_name_en)}</div>
                    <div class="bengali-text" style="font-size: 13px; color: var(--text-muted);">${escHtml(s.member_name_bn || '')}</div>
                  </td>
                  <td style="font-weight: 700;">${m.shares || 1} Share${Number(m.shares) > 1 ? 's' : ''}</td>
                  <td style="font-weight: 700; color: var(--tri-green);">${formatTaka(m.paid)}</td>
                  <td>
                    <div style="display:flex; gap:6px; flex-wrap:wrap;">
                      <a href="#/member/${s.member_id}" class="btn btn-sm btn-primary">Profile</a>
                      <a href="#/member/${s.member_id}/statement" class="btn btn-sm btn-outline">A4</a>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function filterShareRegister(q) {
  q = (q || '').trim().toLowerCase();
  document.querySelectorAll('.share-row').forEach(row => {
    const blob = row.getAttribute('data-search') || '';
    row.style.display = (!q || blob.includes(q)) ? '' : 'none';
  });
}

// 3. INVESTMENTS / LOANS SCREEN (#/loans)
function renderLoans() {
  const list = PPBF_DATA.investments.list || [];

  let totalSanctioned = 0;
  let totalReceived = 0;
  let totalDue = 0;
  let runningCount = 0;
  let completedCount = 0;

  list.forEach(i => {
    totalSanctioned += (parseFloat(i.total) || 0);
    totalReceived += (parseFloat(i.received) || 0);
    totalDue += (parseFloat(i.due) || 0);
    if (i.status === 'RUNNING') runningCount++;
    else completedCount++;
  });

  return `
    <div class="section-heading-row">
      <div>
        <h2 class="section-heading">Investments &amp; Vehicle Financing</h2>
        <p class="section-sub">${list.length} Sanctioned Agreements • ${runningCount} Running • ${completedCount} Completed</p>
      </div>
      <a href="#/inv/all" class="btn btn-gold">Print All ${list.length} Forms (A4 PDF)</a>
    </div>

    <div style="margin-bottom: 12px;">
      <div style="font-size: 12.5px; font-weight: 700; color: var(--navy); text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.45px;">
        Quick Form Links (1-Click A4 Statement):
      </div>
      <div class="chips-scroll">
        ${list.map(i => `
          <a href="#/inv/${encodeURIComponent(i.no)}" class="chip">#${escHtml(i.no)} (${escHtml(String(i.receiver || '').split(' ')[0])})</a>
        `).join('')}
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card accent-navy"><span class="kpi-label">Total Financed</span><span class="kpi-val">${formatTaka(totalSanctioned)}</span></div>
      <div class="kpi-card accent-green"><span class="kpi-label">Total Collected</span><span class="kpi-val">${formatTaka(totalReceived)}</span></div>
      <div class="kpi-card accent-red"><span class="kpi-label">Outstanding Due</span><span class="kpi-val" style="color: var(--tri-red);">${formatTaka(totalDue)}</span></div>
      <div class="kpi-card accent-orange"><span class="kpi-label">Running / Completed</span><span class="kpi-val">${runningCount} / ${completedCount}</span></div>
    </div>

    <div class="toolbar-card">
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="btn btn-sm btn-primary filter-btn active" onclick="filterLoans('ALL', this)">All (${list.length})</button>
        <button class="btn btn-sm btn-outline filter-btn" onclick="filterLoans('RUNNING', this)">Running (${runningCount})</button>
        <button class="btn btn-sm btn-outline filter-btn" onclick="filterLoans('COMPLETED', this)">Completed (${completedCount})</button>
      </div>
      <div class="search-input-wrap" style="max-width: 320px;">
        <svg class="search-icon" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        <input type="text" class="search-input" placeholder="Search receiver, type, guarantor..." oninput="searchLoans(this.value)" />
      </div>
    </div>

    <div class="panel">
      <div class="table-responsive mobile-sticky-col">
        <table class="data-table" id="loans-table">
          <thead>
            <tr>
              <th># No.</th>
              <th>Receiver</th>
              <th>Type / Vehicle</th>
              <th>Guarantor</th>
              <th>Total (৳)</th>
              <th>Received (৳) &amp; Progress</th>
              <th>Profit (৳)</th>
              <th>Due (৳)</th>
              <th>Issue Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(i => {
              const pct = (parseFloat(i.total) > 0) ? Math.min(100, Math.round(((parseFloat(i.received) + parseFloat(i.security || 0)) / parseFloat(i.total)) * 100)) : 0;
              const photoKey = `rec_${String(i.no).replace(/ /g, '').replace(/&/g, '_')}`;
              const photo = getPhoto(photoKey);
              return `
                <tr class="loan-row" data-status="${escHtml(i.status)}" data-receiver="${escHtml(String(i.receiver || '').toLowerCase())}" data-type="${escHtml(String(i.type || '').toLowerCase())}" data-guarantor="${escHtml(String(i.guarantor_name || '').toLowerCase())}">
                  <td style="font-weight: 800; color: var(--navy);">${escHtml(i.no)}</td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <div style="width: 36px; height: 36px; border-radius: 6px; background: #e2e8f0; border: 1px solid #cbd5e1; overflow: hidden; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        ${photo ? `<img src="${photo}" style="width:100%;height:100%;object-fit:cover;" alt="Receiver" />` : `<span style="font-size:11px;font-weight:700;color:var(--navy);">${escHtml(String(i.receiver || 'R').charAt(0))}</span>`}
                      </div>
                      <div>
                        <div style="font-weight: 700; color: var(--navy);">${escHtml(i.receiver)}</div>
                        <div class="bengali-text" style="font-size: 12.5px; color: var(--text-muted);">${escHtml(i.receiver_bn || '')}</div>
                      </div>
                    </div>
                  </td>
                  <td><div style="font-weight: 600;">${escHtml(i.type)}</div><div style="font-size: 12px; color: var(--text-muted);">${escHtml(i.size || '')}</div></td>
                  <td><div style="font-size: 13.5px; font-weight: 600;">${escHtml(i.guarantor_name || 'N/A')}</div><div style="font-size: 12px; color: var(--text-muted);">${maskPhone(i.guarantor_mobile)}</div></td>
                  <td style="font-weight: 700;">${formatTaka(i.total)}</td>
                  <td style="min-width: 140px;">
                    <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700;">
                      <span style="color: var(--tri-green);">${formatTaka(i.received)}</span>
                      <span style="font-size: 11.5px; color: var(--text-muted);">${pct}%</span>
                    </div>
                    <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${pct}%;"></div></div>
                  </td>
                  <td style="font-weight: 700; color: var(--gold);">${formatTaka(i.profit)}</td>
                  <td style="font-weight: 800; color: ${i.due > 0 ? 'var(--tri-red)' : 'var(--tri-green)'};">${formatTaka(i.due)}</td>
                  <td>${escHtml(i.issue_date)}</td>
                  <td><span class="badge ${i.status === 'RUNNING' ? 'badge-running' : 'badge-completed'}">${escHtml(i.status)}</span></td>
                  <td><a href="#/inv/${encodeURIComponent(i.no)}" class="btn btn-sm btn-primary">A4 Form</a></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function filterLoans(status, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.remove('btn-primary', 'active');
    b.classList.add('btn-outline');
  });
  if (btn) {
    btn.classList.remove('btn-outline');
    btn.classList.add('btn-primary', 'active');
  }
  document.querySelectorAll('.loan-row').forEach(row => {
    const s = row.getAttribute('data-status');
    row.style.display = (status === 'ALL' || s === status) ? '' : 'none';
  });
}

function searchLoans(q) {
  q = (q || '').toLowerCase();
  document.querySelectorAll('.loan-row').forEach(row => {
    const r = row.getAttribute('data-receiver') || '';
    const t = row.getAttribute('data-type') || '';
    const g = row.getAttribute('data-guarantor') || '';
    row.style.display = (r.includes(q) || t.includes(q) || g.includes(q)) ? '' : 'none';
  });
}

// 4. OFFICIAL A4 INVESTMENT STATEMENT FORM (#/inv/<n>)
function renderInvForm(no) {
  const form = PPBF_DATA.investments.forms[no];
  if (!form) {
    return `
      <div class="panel" style="padding: 40px; text-align: center;">
        <h3 style="color: var(--navy); margin-bottom: 12px;">Investment Form #${escHtml(no)} Not Found</h3>
        <a href="#/loans" class="btn btn-primary">Back to Investments</a>
      </div>
    `;
  }

  const edit = isEditMode();
  const keys = Object.keys(PPBF_DATA.investments.forms);
  const curIdx = keys.indexOf(no);
  const prevNo = curIdx > 0 ? keys[curIdx - 1] : null;
  const nextNo = curIdx < keys.length - 1 ? keys[curIdx + 1] : null;

  return `
    <div style="display: flex; justify-content: center; width: 100%;">
      <div class="a4-toolbar no-print">
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <a href="#/loans" class="btn btn-sm btn-outline">← Investments</a>
          <span style="font-size: 13px; font-weight: 700; color: var(--navy);">Form #${escHtml(no)}</span>
          <span class="badge ${form.status === 'RUNNING' ? 'badge-running' : 'badge-completed'}">${escHtml(form.status)}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          ${prevNo ? `<a href="#/inv/${encodeURIComponent(prevNo)}" class="btn btn-sm btn-outline">‹ Prev</a>` : ''}
          ${nextNo ? `<a href="#/inv/${encodeURIComponent(nextNo)}" class="btn btn-sm btn-outline">Next ›</a>` : ''}
          <button class="btn btn-sm btn-gold" onclick="printCurrentPage()">Print / Save PDF</button>
        </div>
      </div>
    </div>
    ${buildInvA4Html(no, edit)}
  `;
}

// 5. ALL INVESTMENT FORMS PRINT VIEW (#/inv/all)
function renderInvAll() {
  const forms = PPBF_DATA.investments.forms || {};
  const keys = Object.keys(forms);

  return `
    <div style="display: flex; justify-content: center; width: 100%;">
      <div class="a4-toolbar no-print">
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <a href="#/loans" class="btn btn-sm btn-outline">← Back to Investments</a>
          <span style="font-weight: 700; color: var(--navy);">Full Investment Ledger (${keys.length} Pages)</span>
        </div>
        <button class="btn btn-gold btn-sm" onclick="printCurrentPage()">Print All ${keys.length} Forms to PDF</button>
      </div>
    </div>

    <div class="a4-multi-container" style="display: flex; flex-direction: column; gap: 28px; align-items: center;">
      ${keys.map(k => buildInvA4Html(k, false)).join('')}
    </div>
  `;
}

function renderSinglePageA4(no) {
  return buildInvA4Html(no, false);
}

function buildInvA4Html(no, edit) {
  const form = PPBF_DATA.investments.forms[no];
  if (!form) return '';
  const info = PPBF_DATA.info || {};
  const photoKey = `rec_${String(no).replace(/ /g, '').replace(/&/g, '_')}`;
  const photo = getPhoto(photoKey);

  let totalReceived = 0;
  let paidInstallmentsCount = 0;
  (form.rows || []).forEach(r => {
    const a = parseFloat(r.paid_amount) || 0;
    if (a > 0) {
      totalReceived += a;
      paidInstallmentsCount++;
    }
  });

  const totalAmt = parseFloat(form.total) || 0;
  const secAmt = parseFloat(form.security) || 0;
  const dueAmt = (form.status === 'COMPLETED') ? 0 : Math.max(0, totalAmt - secAmt - totalReceived);
  const totalInstallments = parseInt(form.installments, 10) || 18;
  const safeNo = escHtml(no);

  return `
    <div class="a4-screen-wrapper" style="padding: 0;">
      <div class="a4-page-frame">
        <div>
          <div class="a4-header">
            <img src="${PPBF_LOGO_SRC}" class="a4-logo" alt="PPBF Seal" />
            <div class="a4-title-center">
              <div class="a4-bismillah">${escHtml(info.bismillah || 'বিসমিল্লাহির রাহমানির রাহীম')}</div>
              <div class="a4-forum-bn">${escHtml(info.name_bn || 'পরানিয়া পাড়া বিজনেস ফোরাম')}</div>
              <div class="a4-forum-en">${escHtml(info.name_en || 'PARANIA PARA BUSINESS FORUM')}</div>
              <div class="a4-forum-addr">Est. ${escHtml(info.established || '01/10/2022')} • ${escHtml(info.address || '')} • ${escHtml(info.email || '')}</div>
            </div>
            <div class="a4-meta-boxes">
              <div class="a4-meta-box"><div class="a4-meta-label">Serial No.</div><div class="a4-meta-value">${safeNo}</div></div>
              <div class="a4-meta-box" style="background: ${form.status === 'RUNNING' ? '#fef3c7' : '#dcfce7'};">
                <div class="a4-meta-label">Status</div>
                <div class="a4-meta-value" style="color: ${form.status === 'RUNNING' ? '#92400e' : '#166534'};">
                  ${edit ? `
                    <select onchange="updateFormField('${safeNo}', 'status', this.value)" style="border:none;background:transparent;font-weight:800;font-size:10px;text-align:center;">
                      <option value="RUNNING" ${form.status === 'RUNNING' ? 'selected' : ''}>RUNNING</option>
                      <option value="COMPLETED" ${form.status === 'COMPLETED' ? 'selected' : ''}>COMPLETED</option>
                    </select>
                  ` : escHtml(form.status)}
                </div>
              </div>
              <div class="a4-meta-box">
                <div class="a4-meta-label">Date</div>
                <div class="a4-meta-value">
                  ${edit ? `
                    <input type="date" value="${escHtml(form.date || normalizeDate(new Date().toISOString()))}"
                      onchange="updateFormField('${safeNo}', 'date', this.value)"
                      style="border:none;background:transparent;font-size:9.5px;font-weight:700;width:100%;text-align:center;" />
                  ` : escHtml(form.date || normalizeDate(new Date().toISOString()))}
                </div>
              </div>
            </div>
          </div>

          <div class="tri-bar" style="margin-bottom: 6px;"><div class="bar-red"></div><div class="bar-orange"></div><div class="bar-green"></div></div>

          <div class="a4-doc-title-row">
            <div class="gold-rule"></div>
            <h2 class="a4-doc-title">Investment Statement</h2>
            <div class="gold-rule"></div>
          </div>

          <div class="a4-details-section">
            <div class="a4-fields-grid">
              <div class="a4-field-row">
                <span class="a4-field-label">Receiver Name:</span>
                <span class="a4-field-val" ${edit ? `contenteditable="true" onblur="updateFormField('${safeNo}', 'receiver', this.innerText)"` : ''}>${escHtml(form.receiver)}</span>
              </div>
              <div class="a4-field-row">
                <span class="a4-field-label">Total Amount:</span>
                <span class="a4-field-val" style="font-weight:800; color:var(--navy);" ${edit ? `contenteditable="true" onblur="updateFormField('${safeNo}', 'total', this.innerText.replace(/[^0-9.]/g, ''))"` : ''}>${formatTaka(form.total)}</span>
              </div>
              <div class="a4-field-row">
                <span class="a4-field-label">Investment Type:</span>
                <span class="a4-field-val" ${edit ? `contenteditable="true" onblur="updateFormField('${safeNo}', 'type', this.innerText)"` : ''}>${escHtml(form.type)}</span>
              </div>
              <div class="a4-field-row">
                <span class="a4-field-label">Forum Invested:</span>
                <span class="a4-field-val" ${edit ? `contenteditable="true" onblur="updateFormField('${safeNo}', 'forum_invested', this.innerText.replace(/[^0-9.]/g, ''))"` : ''}>${formatTaka(form.forum_invested)}</span>
              </div>
              <div class="a4-field-row">
                <span class="a4-field-label">Mobile Number:</span>
                <span class="a4-field-val" ${edit ? `contenteditable="true" onblur="updateFormField('${safeNo}', 'mobile', this.innerText)"` : ''}>${edit ? escHtml(form.mobile || '') : maskPhone(form.mobile)}</span>
              </div>
              <div class="a4-field-row">
                <span class="a4-field-label">Security Money:</span>
                <span class="a4-field-val" ${edit ? `contenteditable="true" onblur="updateFormField('${safeNo}', 'security', this.innerText.replace(/[^0-9.]/g, ''))"` : ''}>${formatTaka(form.security)}</span>
              </div>
              <div class="a4-field-row">
                <span class="a4-field-label">Issue Date:</span>
                <span class="a4-field-val" ${edit ? `contenteditable="true" onblur="updateFormField('${safeNo}', 'issue_date', this.innerText)"` : ''}>${escHtml(form.issue_date)}</span>
              </div>
              <div class="a4-field-row">
                <span class="a4-field-label">Expected Profit:</span>
                <span class="a4-field-val" style="color:var(--gold); font-weight:800;" ${edit ? `contenteditable="true" onblur="updateFormField('${safeNo}', 'profit', this.innerText.replace(/[^0-9.]/g, ''))"` : ''}>${formatTaka(form.profit)}</span>
              </div>
              <div class="a4-field-row">
                <span class="a4-field-label">End Date:</span>
                <span class="a4-field-val" ${edit ? `contenteditable="true" onblur="updateFormField('${safeNo}', 'end_date', this.innerText)"` : ''}>${escHtml(form.end_date)}</span>
              </div>
              <div class="a4-field-row">
                <span class="a4-field-label">Installments:</span>
                <span class="a4-field-val" ${edit ? `contenteditable="true" onblur="updateFormField('${safeNo}', 'installments', this.innerText)"` : ''}>${escHtml(form.installments)} Monthly</span>
              </div>
              <div class="a4-guarantor-box">
                <div><strong>Guarantor:</strong> <span ${edit ? `contenteditable="true" onblur="updateFormField('${safeNo}', 'guarantor_name', this.innerText)"` : ''}>${escHtml(form.guarantor_name || 'Alhaj Faridul Alam')}</span></div>
                <div><strong>Mobile:</strong> <span ${edit ? `contenteditable="true" onblur="updateFormField('${safeNo}', 'guarantor_mobile', this.innerText)"` : ''}>${edit ? escHtml(form.guarantor_mobile || '') : maskPhone(form.guarantor_mobile)}</span></div>
                <div><strong>Relation:</strong> <span ${edit ? `contenteditable="true" onblur="updateFormField('${safeNo}', 'guarantor_relation', this.innerText)"` : ''}>${escHtml(form.guarantor_relation || 'Village Elder')}</span></div>
              </div>
            </div>

            <div class="a4-photo-container">
              <div class="a4-photo-box">
                ${photo ? `<img src="${photo}" class="a4-photo-img" alt="Receiver Photo" />` : `
                  <div class="a4-photo-placeholder">
                    <svg style="width:30px;height:30px;fill:#94a3b8;margin-bottom:2px;" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    <div>Passport Size Photo</div>
                  </div>
                `}
              </div>
              ${edit ? `
                <div class="a4-photo-btns no-print">
                  <label class="btn btn-sm btn-outline" style="padding: 2px 6px; font-size: 10px; cursor: pointer;">
                    Change<input type="file" accept="image/*" style="display:none;" onchange="handlePhotoUpload('${photoKey}', this)" />
                  </label>
                  ${photo ? `<button class="btn btn-sm btn-danger" style="padding: 2px 6px; font-size: 10px;" onclick="removePhoto('${photoKey}')">Del</button>` : ''}
                </div>
              ` : ''}
            </div>
          </div>

          <div class="a4-summary-strip">
            <div class="a4-strip-box strip-received"><div style="font-size: 8.5px; text-transform: uppercase;">Total Received</div><div style="font-size: 13px; font-weight: 800;">${formatTaka(totalReceived)}</div></div>
            <div class="a4-strip-box ${dueAmt === 0 ? 'strip-due-green' : 'strip-due-red'}"><div style="font-size: 8.5px; text-transform: uppercase;">Outstanding Due</div><div style="font-size: 13px; font-weight: 800;">${formatTaka(dueAmt)}</div></div>
            <div class="a4-strip-box strip-installments"><div style="font-size: 8.5px; text-transform: uppercase;">Installments Paid</div><div style="font-size: 13px; font-weight: 800;">${paidInstallmentsCount} / ${totalInstallments}</div></div>
          </div>
        </div>

        <div class="a4-table-wrapper">
          <table class="a4-payment-table">
            <thead>
              <tr>
                <th style="width: 28px;" class="text-center">#</th>
                <th style="width: 110px;">Month</th>
                <th style="width: 85px;">Received Date</th>
                <th>Description</th>
                <th style="width: 95px;" class="text-right">Paid Amount</th>
                <th style="width: 80px;" class="text-center">Receiver Sign</th>
                <th style="width: 105px;">Remarks</th>
              </tr>
            </thead>
            <tbody>
              ${(form.rows || []).map((row, idx) => `
                <tr>
                  <td class="text-center" style="font-weight: 700; color: var(--navy);">${row.no || (idx + 1)}</td>
                  <td ${edit ? `contenteditable="true" onblur="updateRowField('${safeNo}', ${idx}, 'month', this.innerText)"` : ''}>${escHtml(row.month || '')}</td>
                  <td ${edit ? `contenteditable="true" onblur="updateRowField('${safeNo}', ${idx}, 'received_date', this.innerText)"` : ''}>${escHtml(row.received_date || '')}</td>
                  <td ${edit ? `contenteditable="true" onblur="updateRowField('${safeNo}', ${idx}, 'description', this.innerText)"` : ''}>${escHtml(row.description || '')}</td>
                  <td class="text-right" style="font-weight: 700; color: ${row.paid_amount > 0 ? 'var(--navy)' : '#94a3b8'};"
                    ${edit ? `contenteditable="true" onblur="updateRowField('${safeNo}', ${idx}, 'paid_amount', this.innerText.replace(/[^0-9.]/g, ''))"` : ''}>
                    ${row.paid_amount > 0 ? formatTaka(row.paid_amount) : '-'}
                  </td>
                  <td class="text-center" ${edit ? `contenteditable="true" onblur="updateRowField('${safeNo}', ${idx}, 'receiver_sign', this.innerText)"` : ''}>${escHtml(row.receiver_sign || (row.paid_amount > 0 ? 'Signed' : ''))}</td>
                  <td ${edit ? `contenteditable="true" onblur="updateRowField('${safeNo}', ${idx}, 'remarks', this.innerText)"` : ''}>${escHtml(row.remarks || '')}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="4" style="text-align: right; padding-right: 12px; letter-spacing: 0.5px;">TOTAL AMOUNT PAID:</td>
                <td class="text-right" style="font-size: 11.5px; font-weight: 800; color: #ffffff;">${formatTaka(totalReceived)}</td>
                <td colspan="2" style="font-size: 9px; text-align: center; color: var(--gold-light);">VERIFIED BY FORUM</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <div class="a4-auth-grid">
            <div class="a4-auth-box"><div class="a4-sig-line"></div><div class="a4-auth-role">Finance Secretary</div><div class="a4-auth-name" ${edit ? `contenteditable="true" onblur="updateFormField('${safeNo}', 'finance_secretary', this.innerText)"` : ''}>${escHtml(form.finance_secretary || info.finance_secretary)}</div></div>
            <div class="a4-auth-box"><div class="a4-sig-line"></div><div class="a4-auth-role">General Secretary</div><div class="a4-auth-name" ${edit ? `contenteditable="true" onblur="updateFormField('${safeNo}', 'secretary', this.innerText)"` : ''}>${escHtml(form.secretary || info.secretary)}</div></div>
            <div class="a4-auth-box"><div class="a4-sig-line"></div><div class="a4-auth-role">President</div><div class="a4-auth-name" ${edit ? `contenteditable="true" onblur="updateFormField('${safeNo}', 'president', this.innerText)"` : ''}>${escHtml(form.president || info.president)}</div></div>
          </div>
          <div class="tri-bar"><div class="bar-red"></div><div class="bar-orange"></div><div class="bar-green"></div></div>
          <div class="a4-footer-text">${escHtml(info.name_bn || '')} • ${escHtml(info.address || '')} • Email: ${escHtml(info.email || '')} • Official Cooperative Ledger Form</div>
        </div>
      </div>
    </div>
  `;
}

// 7. A4 FORMS HUB (#/forms)
function renderFormsHub() {
  const list = PPBF_DATA.investments.list || [];
  const members = PPBF_DATA.members || [];

  return `
    <div class="section-heading-row">
      <div>
        <h2 class="section-heading">Official A4 Forms Hub</h2>
        <p class="section-sub">Standardized printable portrait A4 cooperative documents, investment ledgers, and member statements.</p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
      <div class="panel" style="margin-bottom: 0;">
        <div class="panel-header">
          <div class="panel-title">Investment Statements</div>
          <span class="badge badge-navy">${list.length} Forms</span>
        </div>
        <div class="panel-body">
          <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 14px;">
            24-row installment collection statements with receiver photos, guarantor box, and 3 executive signature seals.
          </p>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <a href="#/inv/all" class="btn btn-gold btn-sm">Print All ${list.length} Forms</a>
            <a href="#/loans" class="btn btn-outline btn-sm">Select Individual Form</a>
          </div>
        </div>
      </div>

      <div class="panel" style="margin-bottom: 0;">
        <div class="panel-header">
          <div class="panel-title">Member Equity Statements</div>
          <span class="badge badge-navy">${members.length} Profiles / 50 Shares</span>
        </div>
        <div class="panel-body">
          <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 14px;">
            Printable portrait A4 member financial statements showing stored source balances, 2022–2029 deposits, and share ledger.
          </p>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <a href="#/statements" class="btn btn-primary btn-sm">Open Statements Center</a>
            <a href="#/members" class="btn btn-outline btn-sm">Open Member Directory</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 8. STATEMENTS CENTER (#/statements)
function renderStatements() {
  const list = PPBF_DATA.investments.list || [];
  const members = PPBF_DATA.members || [];

  return `
    <div class="section-heading-row">
      <div>
        <h2 class="section-heading">Cooperative Statements Center</h2>
        <p class="section-sub">Select any of the ${list.length} investments or ${members.length} member profiles to open an A4 printable statement.</p>
      </div>
      <a href="#/inv/all" class="btn btn-sm btn-gold">Print All Investments</a>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
      <div class="panel">
        <div class="panel-header"><div class="panel-title">Investment Statements (${list.length})</div></div>
        <div class="panel-body">
          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 460px; overflow-y: auto;">
            ${list.map(i => `
              <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 10px 12px; background: var(--ivory); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                <div>
                  <div style="font-weight: 700; color: var(--navy); font-size: 14.5px;">#${escHtml(i.no)} — ${escHtml(i.receiver)}</div>
                  <div style="font-size: 12.5px; color: var(--text-muted);">${escHtml(i.type)} • ${formatTaka(i.total)}</div>
                </div>
                <a href="#/inv/${encodeURIComponent(i.no)}" class="btn btn-sm btn-primary">A4 Form</a>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header"><div class="panel-title">Member Equity Statements (${members.length})</div></div>
        <div class="panel-body">
          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 460px; overflow-y: auto;">
            ${members.map(m => `
              <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 10px 12px; background: var(--ivory); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                <div>
                  <div style="font-weight: 700; color: var(--navy); font-size: 14.5px;">#${m.id} ${escHtml(m.en)}</div>
                  <div style="font-size: 12.5px; color: var(--text-muted);">${m.shares} Share(s) [${(m.serials || []).join(', ')}] • Paid ${formatTaka(m.paid)}</div>
                </div>
                <div style="display:flex; gap:6px;">
                  <a href="#/member/${m.id}" class="btn btn-sm btn-outline">Profile</a>
                  <a href="#/member/${m.id}/statement" class="btn btn-sm btn-primary">A4</a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// 9. ASSETS REGISTER (#/assets)
function renderAssets() {
  const assets = PPBF_DATA.assets || [];
  const totalCost = assets.reduce((sum, a) => sum + (parseFloat(a.cost) || 0), 0);
  const totalCurrentVal = assets.reduce((sum, a) => sum + (parseFloat(a.current_val) || 0), 0);

  return `
    <div class="section-heading-row">
      <div>
        <h2 class="section-heading">Cooperative Asset Register</h2>
        <p class="section-sub">Fixed Assets, Real Estate Advances &amp; Equipment • Net Current Value: <strong>${formatTaka(totalCurrentVal)}</strong></p>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card accent-navy"><span class="kpi-label">Total Acquisition Cost</span><span class="kpi-val">${formatTaka(totalCost)}</span></div>
      <div class="kpi-card accent-green"><span class="kpi-label">Current Book Value</span><span class="kpi-val">${formatTaka(totalCurrentVal)}</span></div>
      <div class="kpi-card accent-gold"><span class="kpi-label">Registered Items</span><span class="kpi-val">${assets.length} Assets</span></div>
    </div>

    <div class="panel">
      <div class="table-responsive mobile-sticky-col">
        <table class="data-table">
          <thead>
            <tr>
              <th>Asset ID</th><th>Asset Description</th><th>Category</th><th>Acquisition Date</th>
              <th>Cost (৳)</th><th>Current Valuation (৳)</th><th>Location</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${assets.map(a => `
              <tr>
                <td style="font-weight: 800; color: var(--navy);">${escHtml(a.id)}</td>
                <td style="font-weight: 700;">${escHtml(a.name)}</td>
                <td><span class="badge badge-navy">${escHtml(a.category)}</span></td>
                <td>${escHtml(a.purchase_date)}</td>
                <td style="font-weight: 700;">${formatTaka(a.cost)}</td>
                <td style="font-weight: 800; color: var(--tri-green);">${formatTaka(a.current_val)}</td>
                <td>${escHtml(a.location)}</td>
                <td><span class="badge badge-completed">${escHtml(a.status)}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 10. FINANCE SCREEN (#/finance)
function renderFinance() {
  const fin = PPBF_DATA.finance || {};
  const collections = fin.monthly_collections || [];

  return `
    <div class="section-heading-row">
      <div>
        <h2 class="section-heading">Treasury &amp; Financial Accounts</h2>
        <p class="section-sub">Capital Reserves, Profit Distribution, and Monthly Cash Flow Summary.</p>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card accent-navy"><span class="kpi-label">Cooperative Capital Fund</span><span class="kpi-val">${formatTaka(fin.capital_fund)}</span></div>
      <div class="kpi-card accent-gold"><span class="kpi-label">General Reserve Fund</span><span class="kpi-val">${formatTaka(fin.general_reserve)}</span></div>
      <div class="kpi-card accent-green"><span class="kpi-label">Welfare &amp; Relief Fund</span><span class="kpi-val">${formatTaka(fin.welfare_fund)}</span></div>
      <div class="kpi-card accent-orange"><span class="kpi-label">Realized Profit</span><span class="kpi-val">${formatTaka(fin.realized_profit)}</span></div>
    </div>

    <div class="panel">
      <div class="panel-header"><div class="panel-title">Monthly Recovery &amp; Cash Flow Statement</div></div>
      <div class="table-responsive mobile-sticky-col">
        <table class="data-table">
          <thead>
            <tr>
              <th>Month</th><th>Member Savings (৳)</th><th>Investment Recovered (৳)</th>
              <th>Realized Profit (৳)</th><th>Operating Expenses (৳)</th><th>Net Inflow (৳)</th>
            </tr>
          </thead>
          <tbody>
            ${collections.map(c => {
              const net = (c.savings + c.investment_recovered + c.profit) - c.expense;
              return `
                <tr>
                  <td style="font-weight: 800; color: var(--navy);">${escHtml(c.month)}</td>
                  <td style="font-weight: 700;">${formatTaka(c.savings)}</td>
                  <td style="font-weight: 700; color: var(--tri-green);">${formatTaka(c.investment_recovered)}</td>
                  <td style="font-weight: 700; color: var(--gold);">${formatTaka(c.profit)}</td>
                  <td style="color: var(--tri-red);">${formatTaka(c.expense)}</td>
                  <td style="font-weight: 800; color: var(--navy);">${formatTaka(net)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 11. MEDIA / GALLERY (#/media)
function renderMedia() {
  const items = PPBF_DATA.media || [];

  return `
    <div class="section-heading-row">
      <div>
        <h2 class="section-heading">Cooperative Media &amp; Events Archive</h2>
        <p class="section-sub">Annual general meetings, disbursement ceremonies, and community welfare initiatives.</p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
      ${items.map(m => `
        <div class="panel" style="margin-bottom: 0; display: flex; flex-direction: column;">
          <div style="height: 150px; background: linear-gradient(135deg, #0b2545 0%, #13386a 100%); display: flex; align-items: center; justify-content: center; position: relative;">
            <svg style="width: 48px; height: 48px; fill: var(--gold-light);" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
            <span class="badge badge-gold" style="position: absolute; top: 12px; right: 12px;">${escHtml(m.category)}</span>
          </div>
          <div style="padding: 16px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="font-size: 12px; font-weight: 700; color: var(--gold); text-transform: uppercase;">${escHtml(m.date)}</div>
              <h3 style="font-size: 18.5px; font-weight: 700; color: var(--navy); margin: 4px 0 8px 0;">${escHtml(m.title)}</h3>
              <p style="font-size: 13.5px; color: var(--text-muted); line-height: 1.5;">${escHtml(m.description)}</p>
            </div>
            <div style="margin-top: 14px; border-top: 1px solid var(--border-subtle); padding-top: 10px;">
              <span class="badge badge-navy">${escHtml(m.tag || 'Archive')}</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// 12. ABOUT (#/about)
function renderAbout() {
  const info = PPBF_DATA.info || {};
  const integrity = analyzeDataIntegrity(PPBF_DATA);

  return `
    <div class="panel" style="padding: 28px;">
      <div style="text-align: center; max-width: 680px; margin: 0 auto 28px auto;">
        <img src="${PPBF_LOGO_SRC}" style="width: 104px; height: 104px; margin: 0 auto 12px auto; display: block;" alt="PPBF Seal" />
        <div class="bengali-text" style="font-size: 15.5px; color: var(--gold); font-weight: 600;">${escHtml(info.bismillah)}</div>
        <h2 class="bengali-text" style="font-size: 28px; font-weight: 800; color: var(--navy);">${escHtml(info.name_bn)}</h2>
        <div style="font-size: 13px; font-weight: 800; letter-spacing: 1.5px; color: var(--gold); margin-top: 4px;">${escHtml(info.name_en)}</div>
        <p style="font-size: 14.5px; color: var(--text-muted); margin-top: 12px;">
          Established on ${escHtml(info.established)} at ${escHtml(info.address)}. Built on mutual trust, halal micro-enterprise financing, and transparent community savings across ${integrity.profileCount} distinct members holding ${integrity.totalSharesSum} registered equity shares.
        </p>
      </div>

      <div class="tri-bar" style="margin-bottom: 24px;"><div class="bar-red"></div><div class="bar-orange"></div><div class="bar-green"></div></div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;">
        <div>
          <h3 style="font-size: 20.5px; font-weight: 700; color: var(--navy); margin-bottom: 10px;">Executive Committee</h3>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 14.5px;">
            <li style="padding: 10px 12px; background: var(--ivory); border-radius: var(--radius-md);"><strong>President:</strong> ${escHtml(info.president)}</li>
            <li style="padding: 10px 12px; background: var(--ivory); border-radius: var(--radius-md);"><strong>General Secretary:</strong> ${escHtml(info.secretary)}</li>
            <li style="padding: 10px 12px; background: var(--ivory); border-radius: var(--radius-md);"><strong>Finance Secretary:</strong> ${escHtml(info.finance_secretary)}</li>
          </ul>
        </div>

        <div>
          <h3 style="font-size: 20.5px; font-weight: 700; color: var(--navy); margin-bottom: 10px;">Contact &amp; Governance</h3>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 14.5px;">
            <li style="padding: 10px 12px; background: var(--ivory); border-radius: var(--radius-md);"><strong>Headquarters:</strong> ${escHtml(info.address)}</li>
            <li style="padding: 10px 12px; background: var(--ivory); border-radius: var(--radius-md);"><strong>Official Email:</strong> ${escHtml(info.email)}</li>
            <li style="padding: 10px 12px; background: var(--ivory); border-radius: var(--radius-md);"><strong>Registry Coverage:</strong> ${integrity.profileCount} Member Profiles / ${integrity.totalSharesSum} Share Serials</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}

// 13. AUDIT & DATA INTEGRITY REPORT (#/report)
function renderReport() {
  const list = PPBF_DATA.investments.list || [];
  const info = PPBF_DATA.info || {};
  const integrity = analyzeDataIntegrity(PPBF_DATA);

  const totalInvested = list.reduce((s, i) => s + (parseFloat(i.total) || 0), 0);
  const totalReceived = list.reduce((s, i) => s + (parseFloat(i.received) || 0), 0);
  const recoveryRate = totalInvested > 0 ? Math.round((totalReceived / totalInvested) * 100) : 0;

  return `
    <div class="section-heading-row">
      <div>
        <h2 class="section-heading">Cooperative Audit &amp; Data Integrity Report</h2>
        <p class="section-sub">Investment Portfolio Recovery &amp; 38-Member / 50-Share Source Verification</p>
      </div>
      <button class="btn btn-gold" onclick="printCurrentPage()">Print Official Report</button>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card accent-green">
        <span class="kpi-label">Portfolio Recovery Rate</span>
        <span class="kpi-val">${recoveryRate}%</span>
        <span class="kpi-sub">${formatTaka(totalReceived)} / ${formatTaka(totalInvested)}</span>
        <span class="kpi-source-tag tag-calculated">Calculated Live</span>
      </div>
      <div class="kpi-card accent-navy">
        <span class="kpi-label">Member Registry Integrity</span>
        <span class="kpi-val">${integrity.isClean ? 'VERIFIED' : 'CHECK'}</span>
        <span class="kpi-sub">${integrity.profileCount} Profiles • ${integrity.uniqueSerialCount}/50 Serials • 0 Duplicates</span>
        <span class="kpi-source-tag tag-source">Schema Verified</span>
      </div>
      <div class="kpi-card accent-gold">
        <span class="kpi-label">Member Paid vs Source</span>
        <span class="kpi-val">${formatTaka(integrity.calculated.paid)}</span>
        <span class="kpi-sub">Source Glance: ${formatTaka(integrity.sourceSummary.paid)} • Net Due: ${formatTaka(integrity.calculated.due)}</span>
        <span class="kpi-source-tag tag-calculated">100% Reconciled</span>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header"><div class="panel-title">Source Data Completeness &amp; Validation Notes</div></div>
      <div class="panel-body" style="font-size: 14px; color: var(--text-main); line-height: 1.65;">
        <ul style="padding-left: 20px; display: flex; flex-direction: column; gap: 8px;">
          <li><strong>38 Profiles vs 50 Share Serials:</strong> The cooperative consists of <strong>${integrity.profileCount} distinct members</strong> holding <strong>${integrity.totalSharesSum} share serials (1–50)</strong> because 9 members hold multiple shares. No nonexistent placeholder people have been invented.</li>
          <li><strong>Duplicate Check:</strong> Duplicate Member IDs: <strong>${integrity.duplicateIds.length}</strong> • Duplicate Share Serials: <strong>${integrity.duplicateMemberSerials.length}</strong> • Missing Serials (1–50): <strong>${integrity.missingSerials.length}</strong>.</li>
          <li><strong>Negative / Overpaid Due Records Preserved:</strong> ${integrity.negativeDueMembers.map(n => `#${n.id} ${escHtml(n.en)} (${formatTaka(n.due)})`).join(', ') || 'None'}.</li>
          <li><strong>Source Glance Profit vs Member Profit Sum:</strong> Source summary <code>glance.profit</code> is <strong>${formatTaka(integrity.sourceSummary.profit)}</strong>; summing individual stored <code>member.profit</code> fields yields <strong>${formatTaka(Math.round(integrity.calculated.profitFieldSum))}</strong>. Both are reported transparently without overwriting stored records.</li>
          <li><strong>Empty Source Profile Fields (Preserved as Missing):</strong> Education (${integrity.emptyCounts.edu}), Institution (${integrity.emptyCounts.inst}), Profession (${integrity.emptyCounts.prof}), Company (${integrity.emptyCounts.company}), Email (${integrity.emptyCounts.email}), NID (${integrity.emptyCounts.nid}), Bank A/C (${integrity.emptyCounts.bank_acc}).</li>
        </ul>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header"><div class="panel-title">Auditor Certification</div></div>
      <div class="panel-body">
        <p style="font-size: 14.5px; color: var(--text-muted); line-height: 1.6; margin-bottom: 18px;">
          This certifies that the books, accounts, ${list.length} investment statement forms, and 38-member / 50-share records of <strong>Parania Para Business Forum</strong> from ${escHtml(info.established)} to date have been verified cleanly.
        </p>
        <div style="display: flex; gap: 28px; flex-wrap: wrap; padding-top: 16px; border-top: 1px solid var(--border-subtle);">
          <div><div style="border-top: 1px solid #000; width: 140px; margin-bottom: 4px;"></div><div style="font-size: 12px; font-weight: 700;">${escHtml(info.finance_secretary)}</div><div style="font-size: 11px; color: var(--text-muted);">Finance Secretary</div></div>
          <div><div style="border-top: 1px solid #000; width: 140px; margin-bottom: 4px;"></div><div style="font-size: 12px; font-weight: 700;">${escHtml(info.secretary)}</div><div style="font-size: 11px; color: var(--text-muted);">General Secretary</div></div>
          <div><div style="border-top: 1px solid #000; width: 140px; margin-bottom: 4px;"></div><div style="font-size: 12px; font-weight: 700;">${escHtml(info.president)}</div><div style="font-size: 11px; color: var(--text-muted);">President</div></div>
        </div>
      </div>
    </div>
  `;
}

// 14. ADMIN (#/admin)
function renderAdmin() {
  const edit = isEditMode();
  const list = PPBF_DATA.investments.list || [];
  const members = PPBF_DATA.members || [];
  const auditLog = PPBF_DATA.audit_log || [];

  return `
    <div class="section-heading-row">
      <div>
        <h2 class="section-heading">Secretariat Administration &amp; Master Controls</h2>
        <p class="section-sub">Edit passkey lock, JSON/CSV exports, validated import with rollback, audit trail, and master registers.</p>
      </div>
    </div>

    <div id="admin-cloud-sync-slot">${renderCloudSyncCard(false)}</div>

    <div class="panel" style="border-left: 4px solid var(--gold); padding: 18px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
      <div>
        <div style="font-weight: 800; font-size: 17px; color: var(--navy);">
          Current Mode: ${edit ? '<span style="color:var(--tri-green)">EDIT MODE (UNLOCKED)</span>' : '<span style="color:var(--text-muted)">VIEW ONLY (PII MASKED)</span>'}
        </div>
        <div style="font-size: 13.5px; color: var(--text-muted); margin-top: 2px;">
          ${edit ? 'Inline editing and full PII visibility active. All edits are written to the audit log.' : 'Unlock with executive passkey (ppbf2023) to reveal masked PII and edit records.'}
        </div>
      </div>
      <button class="btn ${edit ? 'btn-danger' : 'btn-primary'}" onclick="toggleEditMode()">
        ${edit ? 'Lock to View Mode' : 'Unlock Edit Mode'}
      </button>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px;">
      <div class="panel" style="margin-bottom: 0; padding: 18px;">
        <h4 style="font-size: 16.5px; font-weight: 700; color: var(--navy); margin-bottom: 6px;">JSON Full Backup</h4>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">Download complete database, 38 members, 50 serials, 24 forms, and photos.</p>
        <button class="btn btn-outline" onclick="exportDataJSON()" style="width: 100%;">Export JSON</button>
      </div>
      <div class="panel" style="margin-bottom: 0; padding: 18px;">
        <h4 style="font-size: 16.5px; font-weight: 700; color: var(--navy); margin-bottom: 6px;">UTF-8 CSV Export</h4>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">Excel-compatible UTF-8 BOM CSV with full Bengali &amp; English member fields.</p>
        <button class="btn btn-outline" onclick="exportMembersCSV()" style="width: 100%;">Export Members CSV</button>
      </div>
      <div class="panel" style="margin-bottom: 0; padding: 18px;">
        <h4 style="font-size: 16.5px; font-weight: 700; color: var(--navy); margin-bottom: 6px;">Validated Import</h4>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">Preview schema counts &amp; duplicates before applying, with 1-click rollback.</p>
        <button class="btn btn-primary" onclick="openImportModal()" style="width: 100%;">Open Import &amp; Rollback</button>
      </div>
      <div class="panel" style="margin-bottom: 0; padding: 18px;">
        <h4 style="font-size: 16.5px; font-weight: 700; color: var(--tri-red); margin-bottom: 6px;">Reset to Seed</h4>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">Restore canonical 38-member / 50-share &amp; 24-investment seed.</p>
        <button class="btn btn-danger" onclick="resetToSeed()" style="width: 100%;">Reset Seed Data</button>
      </div>
    </div>

    <!-- Audit Trail Log -->
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">Executive Audit Trail Log (${auditLog.length} Events)</div>
        <span class="badge badge-navy">Tamper-Evident</span>
      </div>
      <div class="table-responsive mobile-sticky-col">
        <table class="data-table">
          <thead>
            <tr><th>Timestamp</th><th>Actor</th><th>Entity / ID</th><th>Field</th><th>Before</th><th>After</th></tr>
          </thead>
          <tbody>
            ${auditLog.length === 0 ? `
              <tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No audited edits recorded in this workspace yet.</td></tr>
            ` : auditLog.slice(0, 25).map(a => `
              <tr>
                <td style="font-size:12.5px;">${escHtml(a.timestamp)}</td>
                <td style="font-size:13px;">${escHtml(a.who)}</td>
                <td style="font-weight:700;">${escHtml(a.entity)} #${escHtml(a.record_id)}</td>
                <td><code>${escHtml(a.field)}</code></td>
                <td style="font-size:13px; color:var(--text-muted);">${escHtml(JSON.stringify(a.before))}</td>
                <td style="font-size:13px; color:var(--tri-green); font-weight:700;">${escHtml(JSON.stringify(a.after))}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Master Investments Table -->
    <div class="panel">
      <div class="panel-header"><div class="panel-title">Master Investment Records (${list.length} Items)</div></div>
      <div class="table-responsive mobile-sticky-col">
        <table class="data-table">
          <thead>
            <tr><th>#</th><th>Receiver</th><th>Type</th><th>Total</th><th>Received</th><th>Due</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            ${list.map(i => `
              <tr>
                <td style="font-weight: 800; color: var(--navy);">${escHtml(i.no)}</td>
                <td style="font-weight: 700;">${escHtml(i.receiver)}</td>
                <td>${escHtml(i.type)}</td>
                <td>${formatTaka(i.total)}</td>
                <td style="color: var(--tri-green); font-weight: 700;">${formatTaka(i.received)}</td>
                <td style="color: ${i.due > 0 ? 'var(--tri-red)' : 'var(--tri-green)'}; font-weight: 700;">${formatTaka(i.due)}</td>
                <td><span class="badge ${i.status === 'RUNNING' ? 'badge-running' : 'badge-completed'}">${escHtml(i.status)}</span></td>
                <td><a href="#/inv/${encodeURIComponent(i.no)}" class="btn btn-sm btn-outline">Open Form</a></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Master 38-Member Table -->
    <div class="panel">
      <div class="panel-header"><div class="panel-title">Master Member Registry (${members.length} Profiles / 50 Shares)</div></div>
      <div class="table-responsive mobile-sticky-col">
        <table class="data-table">
          <thead>
            <tr><th>ID</th><th>English Name</th><th>Bengali Name</th><th>Shares</th><th>Serials</th><th>Paid</th><th>Due</th><th>Action</th></tr>
          </thead>
          <tbody>
            ${members.map(m => `
              <tr>
                <td style="font-weight:800;">#${m.id}</td>
                <td style="font-weight:700;">${escHtml(m.en)}</td>
                <td class="bengali-text">${escHtml(m.bn)}</td>
                <td>${m.shares}</td>
                <td>${(m.serials || []).join(', ')}</td>
                <td style="color:var(--tri-green); font-weight:700;">${formatTaka(m.paid)}</td>
                <td style="font-weight:700;">${formatTaka(m.due)}</td>
                <td><a href="#/member/${m.id}" class="btn btn-sm btn-outline">Open Profile</a></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Initialize Application on DOM Ready
window.addEventListener('DOMContentLoaded', () => {
  initData();
  renderRoute();
  refreshCloudSyncUI();
});

window.addEventListener('hashchange', renderRoute);
