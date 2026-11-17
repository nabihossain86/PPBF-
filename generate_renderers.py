with open('logo_base64.txt', 'r') as f:
    LOGO_B64 = f.read().strip()

renderers_code = f"""
// UI Screen Renderers for PPBF

function getActiveRoute() {{
  let hash = window.location.hash || '#/home';
  if (!hash.startsWith('#/')) hash = '#/home';
  return hash;
}}

function renderRoute() {{
  const hash = getActiveRoute();
  const content = document.getElementById('app-content');
  const titleEl = document.getElementById('topbar-title');
  if (!content) return;

  // Update navigation active states
  updateNavActive(hash);

  if (hash === '#/home') {{
    if (titleEl) titleEl.innerText = "Executive Dashboard";
    content.innerHTML = renderHome();
  }} else if (hash === '#/members') {{
    if (titleEl) titleEl.innerText = "Member Directory & Savings";
    content.innerHTML = renderMembers();
  }} else if (hash.startsWith('#/member/')) {{
    const id = hash.replace('#/member/', '');
    if (titleEl) titleEl.innerText = "Member Admission Statement";
    content.innerHTML = renderMemberAdmissionForm(id);
    autoScaleA4();
  }} else if (hash === '#/loans') {{
    if (titleEl) titleEl.innerText = "Investments & Vehicles";
    content.innerHTML = renderLoans();
  }} else if (hash.startsWith('#/inv/')) {{
    const no = decodeURIComponent(hash.replace('#/inv/', ''));
    if (no === 'all') {{
      if (titleEl) titleEl.innerText = "All Investment Forms (A4 Print)";
      content.innerHTML = renderInvAll();
    }} else {{
      if (titleEl) titleEl.innerText = `Investment Statement Form #${{no}}`;
      content.innerHTML = renderInvForm(no);
    }}
    autoScaleA4();
  }} else if (hash === '#/forms') {{
    if (titleEl) titleEl.innerText = "Official A4 Forms Hub";
    content.innerHTML = renderFormsHub();
  }} else if (hash === '#/statements') {{
    if (titleEl) titleEl.innerText = "Statements & Passbooks";
    content.innerHTML = renderStatements();
  }} else if (hash === '#/assets') {{
    if (titleEl) titleEl.innerText = "Cooperative Asset Register";
    content.innerHTML = renderAssets();
  }} else if (hash === '#/finance') {{
    if (titleEl) titleEl.innerText = "Financial Accounts & Ledger";
    content.innerHTML = renderFinance();
  }} else if (hash === '#/media') {{
    if (titleEl) titleEl.innerText = "Cooperative Gallery & Events";
    content.innerHTML = renderMedia();
  }} else if (hash === '#/about') {{
    if (titleEl) titleEl.innerText = "About Parania Para Business Forum";
    content.innerHTML = renderAbout();
  }} else if (hash === '#/report') {{
    if (titleEl) titleEl.innerText = "Annual Cooperative Audit & Report";
    content.innerHTML = renderReport();
  }} else if (hash === '#/admin') {{
    if (titleEl) titleEl.innerText = "Administration & Master Tables";
    content.innerHTML = renderAdmin();
  }} else {{
    window.location.hash = '#/home';
  }}
  
  // Re-run scaling
  setTimeout(autoScaleA4, 50);
}}

function updateNavActive(hash) {{
  // Desktop
  document.querySelectorAll('.nav-link').forEach(link => {{
    const href = link.getAttribute('href');
    if (href === hash || (href === '#/loans' && hash.startsWith('#/inv/'))) {{
      link.classList.add('active');
    }} else {{
      link.classList.remove('active');
    }}
  }});

  // Mobile drawer
  document.querySelectorAll('.drawer-link').forEach(link => {{
    const href = link.getAttribute('href');
    if (href === hash || (href === '#/loans' && hash.startsWith('#/inv/'))) {{
      link.classList.add('active');
    }} else {{
      link.classList.remove('active');
    }}
  }});

  // Mobile bottom nav
  document.querySelectorAll('.bottom-nav-item').forEach(item => {{
    const href = item.getAttribute('href');
    if (href === hash || (href === '#/loans' && hash.startsWith('#/inv/'))) {{
      item.classList.add('active');
    }} else {{
      item.classList.remove('active');
    }}
  }});
}}

// 1. HOME SCREEN
function renderHome() {{
  const list = PPBF_DATA.investments.list || [];
  const members = PPBF_DATA.members || [];
  const edit = isEditMode();

  let totalInvested = 0;
  let totalReceived = 0;
  let totalDue = 0;
  let totalProfit = 0;
  let runningCount = 0;
  let runningTotal = 0;
  let completedCount = 0;
  let completedTotal = 0;

  list.forEach(item => {{
    totalInvested += (parseFloat(item.total) || 0);
    totalReceived += (parseFloat(item.received) || 0);
    totalDue += (parseFloat(item.due) || 0);
    totalProfit += (parseFloat(item.profit) || 0);
    if (item.status === 'RUNNING') {{
      runningCount++;
      runningTotal += (parseFloat(item.total) || 0);
    }} else {{
      completedCount++;
      completedTotal += (parseFloat(item.total) || 0);
    }}
  }});

  let totalSavings = members.reduce((sum, m) => sum + (parseFloat(m.total_savings) || 0), 0);

  // Category breakdown
  const typeMap = {{}};
  list.forEach(item => {{
    const t = item.type || 'General';
    typeMap[t] = (typeMap[t] || 0) + (parseFloat(item.total) || 0);
  }});

  return `
    <!-- Hero / Welcome Banner -->
    <div style="background: linear-gradient(135deg, #07192f 0%, #0b2545 60%, #13386a 100%); color: #fff; border-radius: var(--radius-xl); padding: 26px 28px; margin-bottom: 24px; box-shadow: var(--shadow-md); position: relative; overflow: hidden;">
      <div style="position: absolute; right: -20px; bottom: -20px; opacity: 0.08; pointer-events: none;">
        <img src="{LOGO_B64}" style="width: 260px; height: 260px;" />
      </div>
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; position: relative; z-index: 2;">
        <div>
          <div class="bengali-text" style="color: var(--gold-light); font-size: 15px; margin-bottom: 4px; font-weight: 600;">
            ${{PPBF_DATA.info.bismillah}}
          </div>
          <h1 class="bengali-text" style="font-size: 28px; font-weight: 800; color: #ffffff; line-height: 1.25; margin-bottom: 4px;">
            ${{PPBF_DATA.info.name_bn}}
          </h1>
          <div style="font-size: 13px; color: #cbd5e1; font-weight: 500;">
            ${{PPBF_DATA.info.name_en}} • Est. ${{PPBF_DATA.info.established}} • P.M. Khali, Cox's Bazar
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <a href="#/loans" class="btn btn-gold">
            <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            View Investments
          </a>
          <a href="#/inv/all" class="btn btn-outline" style="background: rgba(255,255,255,0.15); color: #fff; border-color: rgba(255,255,255,0.3);">
            <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
            Print All Forms
          </a>
        </div>
      </div>
      <div class="tri-bar" style="margin-top: 18px; border-radius: 2px;">
        <div class="bar-red"></div>
        <div class="bar-orange"></div>
        <div class="bar-green"></div>
      </div>
    </div>

    <!-- Top KPI Grid -->
    <div class="kpi-grid">
      <div class="kpi-card accent-navy">
        <span class="kpi-label">Total Capital Invested</span>
        <span class="kpi-val">${{formatTaka(totalInvested)}}</span>
        <span class="kpi-sub">${{list.length}} Portfolio Allocations</span>
      </div>
      <div class="kpi-card accent-orange">
        <span class="kpi-label">Running Investments</span>
        <span class="kpi-val">${{runningCount}} Active</span>
        <span class="kpi-sub">${{formatTaka(runningTotal)}} Capital at Work</span>
      </div>
      <div class="kpi-card accent-green">
        <span class="kpi-label">Completed Investments</span>
        <span class="kpi-val">${{completedCount}} Settled</span>
        <span class="kpi-sub">${{formatTaka(completedTotal)}} Recovered Principal</span>
      </div>
      <div class="kpi-card accent-red">
        <span class="kpi-label">Outstanding Due</span>
        <span class="kpi-val" style="color: var(--tri-red);">${{formatTaka(totalDue)}}</span>
        <span class="kpi-sub">Receivable from active installments</span>
      </div>
      <div class="kpi-card accent-gold">
        <span class="kpi-label">Expected Net Profit</span>
        <span class="kpi-val" style="color: var(--gold);">${{formatTaka(totalProfit)}}</span>
        <span class="kpi-sub">Cooperative Return</span>
      </div>
      <div class="kpi-card accent-navy">
        <span class="kpi-label">Member Savings Fund</span>
        <span class="kpi-val">${{formatTaka(totalSavings)}}</span>
        <span class="kpi-sub">${{members.length}} Registered Members</span>
      </div>
    </div>

    <!-- Portfolio Breakdown and Quick Actions -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-bottom: 24px;">
      <!-- Investment Type Breakdown -->
      <div class="panel" style="margin-bottom: 0;">
        <div class="panel-header">
          <div class="panel-title">
            <svg style="width:20px;height:20px;fill:var(--gold)" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
            Portfolio by Investment Type
          </div>
        </div>
        <div class="panel-body">
          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${{Object.entries(typeMap).map(([type, amt]) => {{
              const pct = totalInvested > 0 ? Math.round((amt / totalInvested) * 100) : 0;
              return `
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; margin-bottom: 4px;">
                    <span style="color: var(--navy);">${{type}}</span>
                    <span>${{formatTaka(amt)}} <span style="color: var(--text-muted); font-size: 11px;">(${{pct}}%)</span></span>
                  </div>
                  <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${{pct}}%;"></div>
                  </div>
                </div>
              `;
            }}).join('')}}
          </div>
        </div>
      </div>

      <!-- Quick Links & Actions -->
      <div class="panel" style="margin-bottom: 0;">
        <div class="panel-header">
          <div class="panel-title">
            <svg style="width:20px;height:20px;fill:var(--gold)" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Cooperative Quick Actions
          </div>
        </div>
        <div class="panel-body">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <a href="#/loans" class="btn btn-outline" style="padding: 14px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px;">
              <svg style="width:24px;height:24px;fill:var(--navy)" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
              <span>Investments</span>
              <span style="font-size: 11px; color: var(--text-muted); font-weight: 500;">${{list.length}} records</span>
            </a>
            <a href="#/members" class="btn btn-outline" style="padding: 14px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px;">
              <svg style="width:24px;height:24px;fill:var(--navy)" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
              <span>Members</span>
              <span style="font-size: 11px; color: var(--text-muted); font-weight: 500;">${{members.length}} members</span>
            </a>
            <a href="#/forms" class="btn btn-outline" style="padding: 14px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px;">
              <svg style="width:24px;height:24px;fill:var(--navy)" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
              <span>Forms Hub</span>
              <span style="font-size: 11px; color: var(--text-muted); font-weight: 500;">Print A4 Templates</span>
            </a>
            <a href="#/report" class="btn btn-outline" style="padding: 14px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px;">
              <svg style="width:24px;height:24px;fill:var(--navy)" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-5h2v5zm4 0h-2v-3h2v3zm0-5h-2v-2h2v2zm4 5h-2V7h2v10z"/></svg>
              <span>Audit Report</span>
              <span style="font-size: 11px; color: var(--text-muted); font-weight: 500;">Financial Metrics</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Active Investments Table -->
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">
          <svg style="width:20px;height:20px;fill:var(--navy)" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
          Active Investment Portfolio Summary
        </div>
        <a href="#/loans" class="btn btn-sm btn-outline">View All (${{list.length}})</a>
      </div>
      <div class="table-responsive mobile-sticky-col">
        <table class="data-table">
          <thead>
            <tr>
              <th># No.</th>
              <th>Receiver</th>
              <th>Investment Type</th>
              <th>Total (৳)</th>
              <th>Received (৳)</th>
              <th>Due (৳)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${{list.slice(0, 8).map(item => `
              <tr>
                <td style="font-weight: 800; color: var(--navy);">${{item.no}}</td>
                <td>
                  <div style="font-weight: 700;">${{item.receiver}}</div>
                  <div class="bengali-text" style="font-size: 11.5px; color: var(--text-muted);">${{item.receiver_bn || ''}}</div>
                </td>
                <td>${{item.type}}</td>
                <td style="font-weight: 700;">${{formatTaka(item.total)}}</td>
                <td style="color: var(--tri-green); font-weight: 700;">${{formatTaka(item.received)}}</td>
                <td style="color: ${{item.due > 0 ? 'var(--tri-red)' : 'var(--tri-green)'}}; font-weight: 700;">
                  ${{formatTaka(item.due)}}
                </td>
                <td>
                  <span class="badge ${{item.status === 'RUNNING' ? 'badge-running' : 'badge-completed'}}">
                    ${{item.status}}
                  </span>
                </td>
                <td>
                  <a href="#/inv/${{encodeURIComponent(item.no)}}" class="btn btn-sm btn-primary">
                    View A4 Form
                  </a>
                </td>
              </tr>
            `).join('')}}
          </tbody>
        </table>
      </div>
    </div>
  `;
}}

// 2. MEMBERS SCREEN
function renderMembers() {{
  const members = PPBF_DATA.members || [];
  const edit = isEditMode();
  let totalSavings = members.reduce((sum, m) => sum + (parseFloat(m.total_savings) || 0), 0);

  return `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
      <div>
        <h2 class="serif-title" style="font-size: 26px; color: var(--navy); font-weight: 700;">General Member Directory</h2>
        <p style="font-size: 13px; color: var(--text-muted);">
          Total ${{members.length}} Active Members • Cumulative Savings: <strong>${{formatTaka(totalSavings)}}</strong>
        </p>
      </div>
      <div style="display: flex; gap: 8px;">
        <input type="text" id="member-search" placeholder="Search members by name or mobile..." 
          style="padding: 8px 14px; border: 1px solid var(--border-dark); border-radius: var(--radius-md); font-size: 13px; width: 240px;"
          oninput="filterMembersList(this.value)" />
        ${{edit ? `
          <button class="btn btn-primary" onclick="openAddMemberModal()">
            <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            Add Member
          </button>
        ` : ''}}
      </div>
    </div>

    <div class="panel">
      <div class="table-responsive mobile-sticky-col">
        <table class="data-table" id="members-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Member Name</th>
              <th>Mobile</th>
              <th>Designation</th>
              <th>Monthly Share</th>
              <th>Total Savings</th>
              <th>Shares</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${{members.map(m => `
              <tr class="member-row" data-name="${{m.name.toLowerCase()}}" data-mobile="${{m.mobile}}">
                <td style="font-weight: 800; color: var(--navy);">${{m.id}}</td>
                <td>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 38px; height: 38px; border-radius: 50%; background: var(--ivory-dark); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-weight: 800; color: var(--navy);">
                      ${{m.name.charAt(0)}}
                    </div>
                    <div>
                      <div style="font-weight: 700; color: var(--navy);">${{m.name}}</div>
                      <div class="bengali-text" style="font-size: 12px; color: var(--text-muted);">${{m.name_bn || ''}}</div>
                    </div>
                  </div>
                </td>
                <td>${{m.mobile}}</td>
                <td><span class="badge badge-navy">${{m.designation}}</span></td>
                <td style="font-weight: 700;">${{formatTaka(m.monthly_share)}}</td>
                <td style="font-weight: 800; color: var(--tri-green);">${{formatTaka(m.total_savings)}}</td>
                <td style="text-align: center; font-weight: 700;">${{m.shares}}</td>
                <td>${{m.join_date}}</td>
                <td>
                  <a href="#/member/${{m.id}}" class="btn btn-sm btn-outline">
                    A4 Statement
                  </a>
                </td>
              </tr>
            `).join('')}}
          </tbody>
        </table>
      </div>
    </div>
  `;
}}

function filterMembersList(q) {{
  q = (q || '').toLowerCase();
  document.querySelectorAll('.member-row').forEach(row => {{
    const name = row.getAttribute('data-name') || '';
    const mobile = row.getAttribute('data-mobile') || '';
    if (name.includes(q) || mobile.includes(q)) {{
      row.style.display = '';
    }} else {{
      row.style.display = 'none';
    }}
  }});
}}

// 3. INVESTMENTS / LOANS SCREEN
function renderLoans() {{
  const list = PPBF_DATA.investments.list || [];
  const edit = isEditMode();

  let totalSanctioned = 0;
  let totalReceived = 0;
  let totalDue = 0;
  let runningCount = 0;
  let completedCount = 0;

  list.forEach(i => {{
    totalSanctioned += (parseFloat(i.total) || 0);
    totalReceived += (parseFloat(i.received) || 0);
    totalDue += (parseFloat(i.due) || 0);
    if (i.status === 'RUNNING') runningCount++;
    else completedCount++;
  }});

  return `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
      <div>
        <h2 class="serif-title" style="font-size: 26px; color: var(--navy); font-weight: 700;">
          Investments & Vehicle Financing
        </h2>
        <p style="font-size: 13px; color: var(--text-muted);">
          Total 25 Sanctioned Units • ${{runningCount}} Running • ${{completedCount}} Completed
        </p>
      </div>
      <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
        <a href="#/inv/all" class="btn btn-gold">
          <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
          All Investment Forms (Print / PDF)
        </a>
      </div>
    </div>

    <!-- Quick Chips linking to all investment forms -->
    <div style="margin-bottom: 8px;">
      <div style="font-size: 11.5px; font-weight: 700; color: var(--navy); text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px;">
        Quick Form Links (1-Click A4 Access):
      </div>
      <div class="chips-scroll">
        ${{list.map(i => `
          <a href="#/inv/${{encodeURIComponent(i.no)}}" class="chip">
            #${{i.no}} (${{i.receiver.split(' ')[0]}})
          </a>
        `).join('')}}
      </div>
    </div>

    <!-- KPI Summary Strip -->
    <div class="kpi-grid" style="margin-bottom: 20px;">
      <div class="kpi-card accent-navy">
        <span class="kpi-label">Total Financed</span>
        <span class="kpi-val">${{formatTaka(totalSanctioned)}}</span>
      </div>
      <div class="kpi-card accent-green">
        <span class="kpi-label">Total Collected</span>
        <span class="kpi-val">${{formatTaka(totalReceived)}}</span>
      </div>
      <div class="kpi-card accent-red">
        <span class="kpi-label">Outstanding Due</span>
        <span class="kpi-val" style="color: var(--tri-red);">${{formatTaka(totalDue)}}</span>
      </div>
      <div class="kpi-card accent-orange">
        <span class="kpi-label">Running / Completed</span>
        <span class="kpi-val">${{runningCount}} / ${{completedCount}}</span>
      </div>
    </div>

    <!-- Filter and Search controls -->
    <div class="panel" style="margin-bottom: 16px;">
      <div style="padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-sm btn-primary filter-btn active" onclick="filterLoans('ALL', this)">All (${{list.length}})</button>
          <button class="btn btn-sm btn-outline filter-btn" onclick="filterLoans('RUNNING', this)">Running (${{runningCount}})</button>
          <button class="btn btn-sm btn-outline filter-btn" onclick="filterLoans('COMPLETED', this)">Completed (${{completedCount}})</button>
        </div>
        <div>
          <input type="text" placeholder="Search by receiver, type, guarantor..." 
            style="padding: 8px 14px; border: 1px solid var(--border-dark); border-radius: var(--radius-md); font-size: 13px; width: 260px;"
            oninput="searchLoans(this.value)" />
        </div>
      </div>
    </div>

    <!-- Investments Table -->
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
              <th>Received (৳) & Progress</th>
              <th>Profit (৳)</th>
              <th>Due (৳)</th>
              <th>Issue Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${{list.map(i => {{
              const pct = (parseFloat(i.total) > 0) ? Math.min(100, Math.round(((parseFloat(i.received) + parseFloat(i.security || 0)) / parseFloat(i.total)) * 100)) : 0;
              const photoKey = `rec_${{String(i.no).replace(/ /g, '').replace(/&/g, '_')}}`;
              const photo = getPhoto(photoKey);

              return `
                <tr class="loan-row" data-status="${{i.status}}" data-receiver="${{i.receiver.toLowerCase()}}" data-type="${{i.type.toLowerCase()}}" data-guarantor="${{(i.guarantor_name || '').toLowerCase()}}">
                  <td style="font-weight: 800; color: var(--navy);">${{i.no}}</td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <div style="width: 36px; height: 36px; border-radius: 6px; background: #e2e8f0; border: 1px solid #cbd5e1; overflow: hidden; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        ${{photo ? `<img src="${{photo}}" style="width:100%;height:100%;object-fit:cover;" />` : `<span style="font-size:11px;font-weight:700;color:var(--navy);">${{i.receiver.charAt(0)}}</span>`}}
                      </div>
                      <div>
                        <div style="font-weight: 700; color: var(--navy);">${{i.receiver}}</div>
                        <div class="bengali-text" style="font-size: 11.5px; color: var(--text-muted);">${{i.receiver_bn || ''}}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style="font-weight: 600;">${{i.type}}</div>
                    <div style="font-size: 11px; color: var(--text-muted);">${{i.size || ''}}</div>
                  </td>
                  <td>
                    <div style="font-size: 12.5px; font-weight: 600;">${{i.guarantor_name || 'N/A'}}</div>
                    <div style="font-size: 11px; color: var(--text-muted);">${{i.guarantor_mobile || ''}}</div>
                  </td>
                  <td style="font-weight: 700;">${{formatTaka(i.total)}}</td>
                  <td style="min-width: 140px;">
                    <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700;">
                      <span style="color: var(--tri-green);">${{formatTaka(i.received)}}</span>
                      <span style="font-size: 10.5px; color: var(--text-muted);">${{pct}}%</span>
                    </div>
                    <div class="progress-bar-bg">
                      <div class="progress-bar-fill" style="width: ${{pct}}%;"></div>
                    </div>
                  </td>
                  <td style="font-weight: 700; color: var(--gold);">${{formatTaka(i.profit)}}</td>
                  <td style="font-weight: 800; color: ${{i.due > 0 ? 'var(--tri-red)' : 'var(--tri-green)'}};">
                    ${{formatTaka(i.due)}}
                  </td>
                  <td>${{i.issue_date}}</td>
                  <td>
                    <span class="badge ${{i.status === 'RUNNING' ? 'badge-running' : 'badge-completed'}}">
                      ${{i.status}}
                    </span>
                  </td>
                  <td>
                    <a href="#/inv/${{encodeURIComponent(i.no)}}" class="btn btn-sm btn-primary">
                      Open A4 Form
                    </a>
                  </td>
                </tr>
              `;
            }}).join('')}}
          </tbody>
        </table>
      </div>
    </div>
  `;
}}

function filterLoans(status, btn) {{
  document.querySelectorAll('.filter-btn').forEach(b => {{
    b.classList.remove('btn-primary', 'active');
    b.classList.add('btn-outline');
  }});
  btn.classList.remove('btn-outline');
  btn.classList.add('btn-primary', 'active');

  document.querySelectorAll('.loan-row').forEach(row => {{
    const s = row.getAttribute('data-status');
    if (status === 'ALL' || s === status) {{
      row.style.display = '';
    }} else {{
      row.style.display = 'none';
    }}
  }});
}}

function searchLoans(q) {{
  q = (q || '').toLowerCase();
  document.querySelectorAll('.loan-row').forEach(row => {{
    const r = row.getAttribute('data-receiver') || '';
    const t = row.getAttribute('data-type') || '';
    const g = row.getAttribute('data-guarantor') || '';
    if (r.includes(q) || t.includes(q) || g.includes(q)) {{
      row.style.display = '';
    }} else {{
      row.style.display = 'none';
    }}
  }});
}}

// 4. OFFICIAL A4 INVESTMENT STATEMENT FORM (#/inv/<n>)
function renderInvForm(no) {{
  const form = PPBF_DATA.investments.forms[no];
  if (!form) {{
    return `
      <div class="panel" style="padding: 40px; text-align: center;">
        <h3 style="color: var(--navy); margin-bottom: 12px;">Investment Form #${{no}} Not Found</h3>
        <p style="color: var(--text-muted); margin-bottom: 20px;">The requested investment statement does not exist in the database.</p>
        <a href="#/loans" class="btn btn-primary">Back to Investments</a>
      </div>
    `;
  }}

  const edit = isEditMode();
  const photoKey = `rec_${{String(no).replace(/ /g, '').replace(/&/g, '_')}}`;
  const photo = getPhoto(photoKey);

  // Recalculate summary metrics from rows
  let totalReceived = 0;
  let paidInstallmentsCount = 0;
  form.rows.forEach(r => {{
    const a = parseFloat(r.paid_amount) || 0;
    if (a > 0) {{
      totalReceived += a;
      paidInstallmentsCount++;
    }}
  }});

  const totalAmt = parseFloat(form.total) || 0;
  const secAmt = parseFloat(form.security) || 0;
  const dueAmt = (form.status === 'COMPLETED') ? 0 : Math.max(0, totalAmt - secAmt - totalReceived);
  const totalInstallments = parseInt(form.installments) || 18;

  // Previous and next investment navigation
  const keys = Object.keys(PPBF_DATA.investments.forms);
  const curIdx = keys.indexOf(no);
  const prevNo = curIdx > 0 ? keys[curIdx - 1] : null;
  const nextNo = curIdx < keys.length - 1 ? keys[curIdx + 1] : null;

  return `
    <!-- Screen Control Toolbar (Hidden during print) -->
    <div style="display: flex; justify-content: center; width: 100%;">
      <div class="a4-toolbar no-print">
        <div style="display: flex; align-items: center; gap: 10px;">
          <a href="#/loans" class="btn btn-sm btn-outline">
            ← Back to List
          </a>
          <span style="font-size: 13px; font-weight: 700; color: var(--navy);">
            Form #${{no}}
          </span>
          <span class="badge ${{form.status === 'RUNNING' ? 'badge-running' : 'badge-completed'}}">
            ${{form.status}}
          </span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          ${{prevNo ? `<a href="#/inv/${{encodeURIComponent(prevNo)}}" class="btn btn-sm btn-outline" title="Previous Form">‹ Prev</a>` : ''}}
          ${{nextNo ? `<a href="#/inv/${{encodeURIComponent(nextNo)}}" class="btn btn-sm btn-outline" title="Next Form">Next ›</a>` : ''}}
          <button class="btn btn-sm btn-gold" onclick="window.print()">
            <svg style="width:14px;height:14px;fill:currentColor" viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
            Print / Save PDF
          </button>
        </div>
      </div>
    </div>

    <!-- Scalable A4 Portrait Canvas (Fixed 794 x 1122 px) -->
    <div class="a4-screen-wrapper">
      <div class="a4-page-frame">
        
        <!-- SECTION A: HEADER -->
        <div>
          <div class="a4-header">
            <!-- Logo Left -->
            <div>
              <img src="{LOGO_B64}" alt="PPBF Seal Logo" class="a4-logo" />
            </div>

            <!-- Center Forum Branding -->
            <div class="a4-title-center">
              <div class="a4-bismillah">${{PPBF_DATA.info.bismillah}}</div>
              <div class="a4-forum-bn">${{PPBF_DATA.info.name_bn}}</div>
              <div class="a4-forum-en">${{PPBF_DATA.info.name_en}}</div>
              <div class="a4-forum-addr">Est. ${{PPBF_DATA.info.established}} • P.M. Khali, Cox's Bazar • Email: ${{PPBF_DATA.info.email}}</div>
            </div>

            <!-- Right: Three Equal-Size Stacked Boxes -->
            <div class="a4-meta-boxes">
              <div class="a4-meta-box">
                <div class="a4-meta-label">Serial No.</div>
                <div class="a4-meta-value">${{no}}</div>
              </div>
              <div class="a4-meta-box" style="background: ${{form.status === 'RUNNING' ? '#fef3c7' : '#dcfce7'}};">
                <div class="a4-meta-label">Status</div>
                <div class="a4-meta-value" style="color: ${{form.status === 'RUNNING' ? '#92400e' : '#166534'}};">
                  ${{edit ? `
                    <select onchange="updateFormField('${{no}}', 'status', this.value)" style="border:none;background:transparent;font-weight:800;font-size:10px;text-align:center;">
                      <option value="RUNNING" ${{form.status === 'RUNNING' ? 'selected' : ''}}>RUNNING</option>
                      <option value="COMPLETED" ${{form.status === 'COMPLETED' ? 'selected' : ''}}>COMPLETED</option>
                    </select>
                  ` : form.status}}
                </div>
              </div>
              <div class="a4-meta-box">
                <div class="a4-meta-label">Date</div>
                <div class="a4-meta-value">
                  ${{edit ? `
                    <input type="date" value="${{form.date || normalizeDate(new Date().toISOString())}}" 
                      onchange="updateFormField('${{no}}', 'date', this.value)" 
                      style="border:none;background:transparent;font-size:9.5px;font-weight:700;width:100%;text-align:center;" />
                  ` : (form.date || normalizeDate(new Date().toISOString()))}}
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION B: TRI-BAR + CENTERED TITLE WITH GOLD RULES -->
          <div class="tri-bar" style="margin-bottom: 6px;">
            <div class="bar-red"></div>
            <div class="bar-orange"></div>
            <div class="bar-green"></div>
          </div>

          <div class="a4-doc-title-row">
            <div class="gold-rule"></div>
            <h2 class="a4-doc-title">Investment Statement</h2>
            <div class="gold-rule"></div>
          </div>

          <!-- SECTION C: DETAILS GRID (2 COLUMNS) + GUARANTOR BOX + RECEIVER PHOTO -->
          <div class="a4-details-section">
            <div class="a4-fields-grid">
              <!-- Left Column -->
              <div class="a4-field-row">
                <span class="a4-field-label">Receiver Name:</span>
                <span class="a4-field-val" ${{edit ? `contenteditable="true" onblur="updateFormField('${{no}}', 'receiver', this.innerText)"` : ''}}>
                  ${{form.receiver}}
                </span>
              </div>
              <!-- Right Column -->
              <div class="a4-field-row">
                <span class="a4-field-label">Total Amount:</span>
                <span class="a4-field-val" style="font-weight:800; color:var(--navy);" ${{edit ? `contenteditable="true" onblur="updateFormField('${{no}}', 'total', this.innerText.replace(/[^0-9.]/g, ''))"` : ''}}>
                  ${{formatTaka(form.total)}}
                </span>
              </div>

              <div class="a4-field-row">
                <span class="a4-field-label">Investment Type:</span>
                <span class="a4-field-val" ${{edit ? `contenteditable="true" onblur="updateFormField('${{no}}', 'type', this.innerText)"` : ''}}>
                  ${{form.type}}
                </span>
              </div>
              <div class="a4-field-row">
                <span class="a4-field-label">Forum Invested:</span>
                <span class="a4-field-val" ${{edit ? `contenteditable="true" onblur="updateFormField('${{no}}', 'forum_invested', this.innerText.replace(/[^0-9.]/g, ''))"` : ''}}>
                  ${{formatTaka(form.forum_invested)}}
                </span>
              </div>

              <div class="a4-field-row">
                <span class="a4-field-label">Mobile Number:</span>
                <span class="a4-field-val" ${{edit ? `contenteditable="true" onblur="updateFormField('${{no}}', 'mobile', this.innerText)"` : ''}}>
                  ${{form.mobile}}
                </span>
              </div>
              <div class="a4-field-row">
                <span class="a4-field-label">Security Money:</span>
                <span class="a4-field-val" ${{edit ? `contenteditable="true" onblur="updateFormField('${{no}}', 'security', this.innerText.replace(/[^0-9.]/g, ''))"` : ''}}>
                  ${{formatTaka(form.security)}}
                </span>
              </div>

              <div class="a4-field-row">
                <span class="a4-field-label">Issue Date:</span>
                <span class="a4-field-val" ${{edit ? `contenteditable="true" onblur="updateFormField('${{no}}', 'issue_date', this.innerText)"` : ''}}>
                  ${{form.issue_date}}
                </span>
              </div>
              <div class="a4-field-row">
                <span class="a4-field-label">Expected Profit:</span>
                <span class="a4-field-val" style="color:var(--gold); font-weight:800;" ${{edit ? `contenteditable="true" onblur="updateFormField('${{no}}', 'profit', this.innerText.replace(/[^0-9.]/g, ''))"` : ''}}>
                  ${{formatTaka(form.profit)}}
                </span>
              </div>

              <div class="a4-field-row">
                <span class="a4-field-label">End Date:</span>
                <span class="a4-field-val" ${{edit ? `contenteditable="true" onblur="updateFormField('${{no}}', 'end_date', this.innerText)"` : ''}}>
                  ${{form.end_date}}
                </span>
              </div>
              <div class="a4-field-row">
                <span class="a4-field-label">Installments:</span>
                <span class="a4-field-val" ${{edit ? `contenteditable="true" onblur="updateFormField('${{no}}', 'installments', this.innerText)"` : ''}}>
                  ${{form.installments}} Monthly
                </span>
              </div>

              <!-- Guarantor Info Box -->
              <div class="a4-guarantor-box">
                <div><strong>Guarantor:</strong> <span ${{edit ? `contenteditable="true" onblur="updateFormField('${{no}}', 'guarantor_name', this.innerText)"` : ''}}>${{form.guarantor_name || 'Alhaj Faridul Alam'}}</span></div>
                <div><strong>Mobile:</strong> <span ${{edit ? `contenteditable="true" onblur="updateFormField('${{no}}', 'guarantor_mobile', this.innerText)"` : ''}}>${{form.guarantor_mobile || '01812-334455'}}</span></div>
                <div><strong>Relation:</strong> <span ${{edit ? `contenteditable="true" onblur="updateFormField('${{no}}', 'guarantor_relation', this.innerText)"` : ''}}>${{form.guarantor_relation || 'Village Elder'}}</span></div>
              </div>
            </div>

            <!-- Passport-size Receiver Photo Box -->
            <div class="a4-photo-container">
              <div class="a4-photo-box">
                ${{photo ? `
                  <img src="${{photo}}" class="a4-photo-img" alt="Receiver Photo" />
                ` : `
                  <div class="a4-photo-placeholder">
                    <svg style="width:32px;height:32px;fill:#94a3b8;margin-bottom:2px;" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    <div>Passport Size Photo</div>
                  </div>
                `}}
              </div>
              ${{edit ? `
                <div class="a4-photo-btns no-print">
                  <label class="btn btn-sm btn-outline photo-action-btn" style="padding: 2px 6px; font-size: 10px; cursor: pointer;">
                    Change
                    <input type="file" accept="image/*" style="display:none;" onchange="handlePhotoUpload('${{photoKey}}', this)" />
                  </label>
                  ${{photo ? `
                    <button class="btn btn-sm btn-danger photo-action-btn" style="padding: 2px 6px; font-size: 10px;" onclick="removePhoto('${{photoKey}}')">
                      Del
                    </button>
                  ` : ''}}
                </div>
              ` : ''}}
            </div>
          </div>

          <!-- SECTION D: SUMMARY STRIP -->
          <div class="a4-summary-strip">
            <div class="a4-strip-box strip-received">
              <div style="font-size: 8.5px; text-transform: uppercase;">Total Received</div>
              <div style="font-size: 13px; font-weight: 800;">${{formatTaka(totalReceived)}}</div>
            </div>
            <div class="a4-strip-box ${{dueAmt === 0 ? 'strip-due-green' : 'strip-due-red'}}">
              <div style="font-size: 8.5px; text-transform: uppercase;">Outstanding Due</div>
              <div style="font-size: 13px; font-weight: 800;">${{formatTaka(dueAmt)}}</div>
            </div>
            <div class="a4-strip-box strip-installments">
              <div style="font-size: 8.5px; text-transform: uppercase;">Installments Paid</div>
              <div style="font-size: 13px; font-weight: 800;">${{paidInstallmentsCount}} / ${{totalInstallments}}</div>
            </div>
          </div>
        </div>

        <!-- SECTION E: PAYMENT TABLE WITH EXACTLY 24 ROWS -->
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
              ${{form.rows.map((row, idx) => `
                <tr>
                  <td class="text-center" style="font-weight: 700; color: var(--navy);">${{row.no || (idx + 1)}}</td>
                  <td ${{edit ? `contenteditable="true" onblur="updateRowField('${{no}}', ${{idx}}, 'month', this.innerText)"` : ''}}>
                    ${{row.month || ''}}
                  </td>
                  <td ${{edit ? `contenteditable="true" onblur="updateRowField('${{no}}', ${{idx}}, 'received_date', this.innerText)"` : ''}}>
                    ${{row.received_date || ''}}
                  </td>
                  <td ${{edit ? `contenteditable="true" onblur="updateRowField('${{no}}', ${{idx}}, 'description', this.innerText)"` : ''}}>
                    ${{row.description || ''}}
                  </td>
                  <td class="text-right" style="font-weight: 700; color: ${{row.paid_amount > 0 ? 'var(--navy)' : '#94a3b8'}};"
                    ${{edit ? `contenteditable="true" onblur="updateRowField('${{no}}', ${{idx}}, 'paid_amount', this.innerText.replace(/[^0-9.]/g, ''))"` : ''}}>
                    ${{row.paid_amount > 0 ? formatTaka(row.paid_amount) : '-'}}
                  </td>
                  <td class="text-center" ${{edit ? `contenteditable="true" onblur="updateRowField('${{no}}', ${{idx}}, 'receiver_sign', this.innerText)"` : ''}}>
                    ${{row.receiver_sign || (row.paid_amount > 0 ? 'Signed' : '')}}
                  </td>
                  <td ${{edit ? `contenteditable="true" onblur="updateRowField('${{no}}', ${{idx}}, 'remarks', this.innerText)"` : ''}}>
                    ${{row.remarks || ''}}
                  </td>
                </tr>
              `).join('')}}
              <!-- Navy Total Row -->
              <tr class="total-row">
                <td colspan="4" style="text-align: right; padding-right: 12px; letter-spacing: 0.5px;">TOTAL AMOUNT PAID:</td>
                <td class="text-right" style="font-size: 11.5px; font-weight: 800; color: #ffffff;">${{formatTaka(totalReceived)}}</td>
                <td colspan="2" style="font-size: 9px; text-align: center; color: var(--gold-light);">VERIFIED BY FORUM</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- SECTION F: AUTHORIZATION (3 EQUAL BOXES WITH SIGNATURE LINES) -->
        <div>
          <div class="a4-auth-grid">
            <div class="a4-auth-box">
              <div class="a4-sig-line"></div>
              <div class="a4-auth-role">Finance Secretary</div>
              <div class="a4-auth-name" ${{edit ? `contenteditable="true" onblur="updateFormField('${{no}}', 'finance_secretary', this.innerText)"` : ''}}>
                ${{form.finance_secretary || PPBF_DATA.info.finance_secretary}}
              </div>
            </div>
            <div class="a4-auth-box">
              <div class="a4-sig-line"></div>
              <div class="a4-auth-role">General Secretary</div>
              <div class="a4-auth-name" ${{edit ? `contenteditable="true" onblur="updateFormField('${{no}}', 'secretary', this.innerText)"` : ''}}>
                ${{form.secretary || PPBF_DATA.info.secretary}}
              </div>
            </div>
            <div class="a4-auth-box">
              <div class="a4-sig-line"></div>
              <div class="a4-auth-role">President</div>
              <div class="a4-auth-name" ${{edit ? `contenteditable="true" onblur="updateFormField('${{no}}', 'president', this.innerText)"` : ''}}>
                ${{form.president || PPBF_DATA.info.president}}
              </div>
            </div>
          </div>

          <!-- SECTION G: TRI-BAR + FOOTER LINE -->
          <div class="tri-bar">
            <div class="bar-red"></div>
            <div class="bar-orange"></div>
            <div class="bar-green"></div>
          </div>
          <div class="a4-footer-text">
            ${{PPBF_DATA.info.name_bn}} • ${{PPBF_DATA.info.address}} • Email: ${{PPBF_DATA.info.email}} • Official Cooperative Ledger Form
          </div>
        </div>

      </div>
    </div>
  `;
}}

// 5. ALL INVESTMENT FORMS PRINT VIEW (#/inv/all)
function renderInvAll() {{
  const forms = PPBF_DATA.investments.forms || {{}};
  const keys = Object.keys(forms);

  return `
    <div style="display: flex; justify-content: center; width: 100%;">
      <div class="a4-toolbar no-print">
        <div>
          <a href="#/loans" class="btn btn-sm btn-outline">← Back to Investments</a>
          <span style="font-weight: 700; color: var(--navy); margin-left: 12px;">
            Full Investment Forms Ledger (${{keys.length}} Pages)
          </span>
        </div>
        <div>
          <button class="btn btn-gold" onclick="window.print()">
            <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
            Print All ${{keys.length}} Forms to PDF
          </button>
        </div>
      </div>
    </div>

    <div class="a4-multi-container" style="display: flex; flex-direction: column; gap: 32px; align-items: center;">
      ${{keys.map(k => renderSinglePageA4(k)).join('')}}
    </div>
  `;
}}

// Helper for rendering pure single A4 page in multi-view
function renderSinglePageA4(no) {{
  const form = PPBF_DATA.investments.forms[no];
  if (!form) return '';

  const photoKey = `rec_${{String(no).replace(/ /g, '').replace(/&/g, '_')}}`;
  const photo = getPhoto(photoKey);

  let totalReceived = 0;
  let paidInstallmentsCount = 0;
  form.rows.forEach(r => {{
    const a = parseFloat(r.paid_amount) || 0;
    if (a > 0) {{
      totalReceived += a;
      paidInstallmentsCount++;
    }}
  }});

  const totalAmt = parseFloat(form.total) || 0;
  const secAmt = parseFloat(form.security) || 0;
  const dueAmt = (form.status === 'COMPLETED') ? 0 : Math.max(0, totalAmt - secAmt - totalReceived);
  const totalInstallments = parseInt(form.installments) || 18;

  return `
    <div class="a4-screen-wrapper" style="padding: 0;">
      <div class="a4-page-frame">
        <div>
          <div class="a4-header">
            <img src="{LOGO_B64}" alt="PPBF Logo" class="a4-logo" />
            <div class="a4-title-center">
              <div class="a4-bismillah">${{PPBF_DATA.info.bismillah}}</div>
              <div class="a4-forum-bn">${{PPBF_DATA.info.name_bn}}</div>
              <div class="a4-forum-en">${{PPBF_DATA.info.name_en}}</div>
              <div class="a4-forum-addr">Est. ${{PPBF_DATA.info.established}} • P.M. Khali, Cox's Bazar • Email: ${{PPBF_DATA.info.email}}</div>
            </div>
            <div class="a4-meta-boxes">
              <div class="a4-meta-box">
                <div class="a4-meta-label">Serial No.</div>
                <div class="a4-meta-value">${{no}}</div>
              </div>
              <div class="a4-meta-box" style="background: ${{form.status === 'RUNNING' ? '#fef3c7' : '#dcfce7'}};">
                <div class="a4-meta-label">Status</div>
                <div class="a4-meta-value" style="color: ${{form.status === 'RUNNING' ? '#92400e' : '#166534'}};">
                  ${{form.status}}
                </div>
              </div>
              <div class="a4-meta-box">
                <div class="a4-meta-label">Date</div>
                <div class="a4-meta-value">${{form.date || normalizeDate(new Date().toISOString())}}</div>
              </div>
            </div>
          </div>

          <div class="tri-bar" style="margin-bottom: 6px;">
            <div class="bar-red"></div>
            <div class="bar-orange"></div>
            <div class="bar-green"></div>
          </div>

          <div class="a4-doc-title-row">
            <div class="gold-rule"></div>
            <h2 class="a4-doc-title">Investment Statement</h2>
            <div class="gold-rule"></div>
          </div>

          <div class="a4-details-section">
            <div class="a4-fields-grid">
              <div class="a4-field-row"><span class="a4-field-label">Receiver Name:</span><span class="a4-field-val">${{form.receiver}}</span></div>
              <div class="a4-field-row"><span class="a4-field-label">Total Amount:</span><span class="a4-field-val" style="font-weight:800; color:var(--navy);">${{formatTaka(form.total)}}</span></div>
              <div class="a4-field-row"><span class="a4-field-label">Investment Type:</span><span class="a4-field-val">${{form.type}}</span></div>
              <div class="a4-field-row"><span class="a4-field-label">Forum Invested:</span><span class="a4-field-val">${{formatTaka(form.forum_invested)}}</span></div>
              <div class="a4-field-row"><span class="a4-field-label">Mobile Number:</span><span class="a4-field-val">${{form.mobile}}</span></div>
              <div class="a4-field-row"><span class="a4-field-label">Security Money:</span><span class="a4-field-val">${{formatTaka(form.security)}}</span></div>
              <div class="a4-field-row"><span class="a4-field-label">Issue Date:</span><span class="a4-field-val">${{form.issue_date}}</span></div>
              <div class="a4-field-row"><span class="a4-field-label">Expected Profit:</span><span class="a4-field-val" style="color:var(--gold); font-weight:800;">${{formatTaka(form.profit)}}</span></div>
              <div class="a4-field-row"><span class="a4-field-label">End Date:</span><span class="a4-field-val">${{form.end_date}}</span></div>
              <div class="a4-field-row"><span class="a4-field-label">Installments:</span><span class="a4-field-val">${{form.installments}} Monthly</span></div>
              <div class="a4-guarantor-box">
                <div><strong>Guarantor:</strong> ${{form.guarantor_name || 'Alhaj Faridul Alam'}}</div>
                <div><strong>Mobile:</strong> ${{form.guarantor_mobile || '01812-334455'}}</div>
                <div><strong>Relation:</strong> ${{form.guarantor_relation || 'Village Elder'}}</div>
              </div>
            </div>
            <div class="a4-photo-container">
              <div class="a4-photo-box">
                ${{photo ? `<img src="${{photo}}" class="a4-photo-img" />` : `<div class="a4-photo-placeholder"><svg style="width:32px;height:32px;fill:#94a3b8;margin-bottom:2px;" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><div>Passport Photo</div></div>`}}
              </div>
            </div>
          </div>

          <div class="a4-summary-strip">
            <div class="a4-strip-box strip-received">
              <div style="font-size: 8.5px; text-transform: uppercase;">Total Received</div>
              <div style="font-size: 13px; font-weight: 800;">${{formatTaka(totalReceived)}}</div>
            </div>
            <div class="a4-strip-box ${{dueAmt === 0 ? 'strip-due-green' : 'strip-due-red'}}">
              <div style="font-size: 8.5px; text-transform: uppercase;">Outstanding Due</div>
              <div style="font-size: 13px; font-weight: 800;">${{formatTaka(dueAmt)}}</div>
            </div>
            <div class="a4-strip-box strip-installments">
              <div style="font-size: 8.5px; text-transform: uppercase;">Installments Paid</div>
              <div style="font-size: 13px; font-weight: 800;">${{paidInstallmentsCount}} / ${{totalInstallments}}</div>
            </div>
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
              ${{form.rows.map((row, idx) => `
                <tr>
                  <td class="text-center" style="font-weight: 700; color: var(--navy);">${{row.no || (idx + 1)}}</td>
                  <td>${{row.month || ''}}</td>
                  <td>${{row.received_date || ''}}</td>
                  <td>${{row.description || ''}}</td>
                  <td class="text-right" style="font-weight: 700; color: ${{row.paid_amount > 0 ? 'var(--navy)' : '#94a3b8'}};">
                    ${{row.paid_amount > 0 ? formatTaka(row.paid_amount) : '-'}}
                  </td>
                  <td class="text-center">${{row.receiver_sign || (row.paid_amount > 0 ? 'Signed' : '')}}</td>
                  <td>${{row.remarks || ''}}</td>
                </tr>
              `).join('')}}
              <tr class="total-row">
                <td colspan="4" style="text-align: right; padding-right: 12px;">TOTAL AMOUNT PAID:</td>
                <td class="text-right" style="font-size: 11.5px; font-weight: 800; color: #ffffff;">${{formatTaka(totalReceived)}}</td>
                <td colspan="2" style="font-size: 9px; text-align: center; color: var(--gold-light);">VERIFIED BY FORUM</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <div class="a4-auth-grid">
            <div class="a4-auth-box">
              <div class="a4-sig-line"></div>
              <div class="a4-auth-role">Finance Secretary</div>
              <div class="a4-auth-name">${{form.finance_secretary || PPBF_DATA.info.finance_secretary}}</div>
            </div>
            <div class="a4-auth-box">
              <div class="a4-sig-line"></div>
              <div class="a4-auth-role">General Secretary</div>
              <div class="a4-auth-name">${{form.secretary || PPBF_DATA.info.secretary}}</div>
            </div>
            <div class="a4-auth-box">
              <div class="a4-sig-line"></div>
              <div class="a4-auth-role">President</div>
              <div class="a4-auth-name">${{form.president || PPBF_DATA.info.president}}</div>
            </div>
          </div>

          <div class="tri-bar">
            <div class="bar-red"></div>
            <div class="bar-orange"></div>
            <div class="bar-green"></div>
          </div>
          <div class="a4-footer-text">
            ${{PPBF_DATA.info.name_bn}} • ${{PPBF_DATA.info.address}} • Email: ${{PPBF_DATA.info.email}}
          </div>
        </div>
      </div>
    </div>
  `;
}}

// 6. MEMBER ADMISSION / SAVINGS STATEMENT A4
function renderMemberAdmissionForm(id) {{
  const member = PPBF_DATA.members.find(m => m.id === id) || PPBF_DATA.members[0];

  return `
    <div style="display: flex; justify-content: center; width: 100%;">
      <div class="a4-toolbar no-print">
        <div>
          <a href="#/members" class="btn btn-sm btn-outline">← Back to Members</a>
          <span style="font-weight: 700; color: var(--navy); margin-left: 12px;">
            Member Record: ${{member.name}} (${{member.id}})
          </span>
        </div>
        <div>
          <button class="btn btn-sm btn-gold" onclick="window.print()">
            <svg style="width:14px;height:14px;fill:currentColor" viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
            Print Member Statement
          </button>
        </div>
      </div>
    </div>

    <div class="a4-screen-wrapper">
      <div class="a4-page-frame">
        <div>
          <div class="a4-header">
            <img src="{LOGO_B64}" class="a4-logo" alt="PPBF Logo" />
            <div class="a4-title-center">
              <div class="a4-bismillah">${{PPBF_DATA.info.bismillah}}</div>
              <div class="a4-forum-bn">${{PPBF_DATA.info.name_bn}}</div>
              <div class="a4-forum-en">${{PPBF_DATA.info.name_en}}</div>
              <div class="a4-forum-addr">Est. ${{PPBF_DATA.info.established}} • P.M. Khali, Cox's Bazar • Email: ${{PPBF_DATA.info.email}}</div>
            </div>
            <div class="a4-meta-boxes">
              <div class="a4-meta-box">
                <div class="a4-meta-label">Member ID</div>
                <div class="a4-meta-value">${{member.id}}</div>
              </div>
              <div class="a4-meta-box" style="background: #dcfce7;">
                <div class="a4-meta-label">Status</div>
                <div class="a4-meta-value" style="color: #166534;">ACTIVE</div>
              </div>
              <div class="a4-meta-box">
                <div class="a4-meta-label">Date</div>
                <div class="a4-meta-value">${{normalizeDate(new Date().toISOString())}}</div>
              </div>
            </div>
          </div>

          <div class="tri-bar" style="margin-bottom: 6px;">
            <div class="bar-red"></div>
            <div class="bar-orange"></div>
            <div class="bar-green"></div>
          </div>

          <div class="a4-doc-title-row">
            <div class="gold-rule"></div>
            <h2 class="a4-doc-title">Member Admission & Savings Statement</h2>
            <div class="gold-rule"></div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 105px; gap: 14px; margin-bottom: 16px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; font-size: 11.5px;">
              <div class="a4-field-row"><span class="a4-field-label">Full Name:</span><span class="a4-field-val">${{member.name}}</span></div>
              <div class="a4-field-row"><span class="a4-field-label">National ID:</span><span class="a4-field-val">${{member.nid}}</span></div>
              <div class="a4-field-row"><span class="a4-field-label">Bengali Name:</span><span class="a4-field-val bengali-text">${{member.name_bn}}</span></div>
              <div class="a4-field-row"><span class="a4-field-label">Join Date:</span><span class="a4-field-val">${{member.join_date}}</span></div>
              <div class="a4-field-row"><span class="a4-field-label">Mobile Number:</span><span class="a4-field-val">${{member.mobile}}</span></div>
              <div class="a4-field-row"><span class="a4-field-label">Share Count:</span><span class="a4-field-val">${{member.shares}} Units</span></div>
              <div class="a4-field-row"><span class="a4-field-label">Designation:</span><span class="a4-field-val">${{member.designation}}</span></div>
              <div class="a4-field-row"><span class="a4-field-label">Monthly Share:</span><span class="a4-field-val" style="font-weight:700;">${{formatTaka(member.monthly_share)}}</span></div>
              <div class="a4-guarantor-box">
                <div><strong>Address:</strong> ${{member.address || "P.M. Khali, Cox's Bazar"}}</div>
              </div>
            </div>
            <div class="a4-photo-container">
              <div class="a4-photo-box">
                <div class="a4-photo-placeholder">
                  <div style="font-size: 28px; font-weight: 800; color: var(--navy);">${{member.name.charAt(0)}}</div>
                  <div style="font-size: 9px; color: #64748b; margin-top: 4px;">Member Photo</div>
                </div>
              </div>
            </div>
          </div>

          <div class="a4-summary-strip" style="grid-template-columns: 1fr 1fr 1fr;">
            <div class="a4-strip-box strip-received">
              <div style="font-size: 8.5px; text-transform: uppercase;">Total Savings Balance</div>
              <div style="font-size: 14px; font-weight: 800;">${{formatTaka(member.total_savings)}}</div>
            </div>
            <div class="a4-strip-box strip-installments">
              <div style="font-size: 8.5px; text-transform: uppercase;">Active Equity Shares</div>
              <div style="font-size: 14px; font-weight: 800;">${{member.shares}} Shares</div>
            </div>
            <div class="a4-strip-box strip-due-green">
              <div style="font-size: 8.5px; text-transform: uppercase;">Membership Status</div>
              <div style="font-size: 14px; font-weight: 800;">REGULAR</div>
            </div>
          </div>
        </div>

        <div class="a4-table-wrapper" style="flex: 1;">
          <h4 style="font-size: 12px; color: var(--navy); margin-bottom: 6px; font-weight: 700;">
            Monthly Savings & Share Deposit History
          </h4>
          <table class="a4-payment-table">
            <thead>
              <tr>
                <th class="text-center" style="width: 30px;">#</th>
                <th>Deposit Period</th>
                <th>Deposit Date</th>
                <th>Payment Mode</th>
                <th class="text-right">Deposit (৳)</th>
                <th class="text-right">Cumulative Balance (৳)</th>
                <th>Cashier Verification</th>
              </tr>
            </thead>
            <tbody>
              ${{Array.from({{length: 12}}).map((_, i) => {{
                const dAmt = member.monthly_share;
                const cum = member.total_savings - ((11 - i) * dAmt);
                return `
                  <tr>
                    <td class="text-center" style="font-weight: 700; color: var(--navy);">${{i + 1}}</td>
                    <td>Month ${{i + 1}} (2024)</td>
                    <td>2024-${{String(i + 1).padStart(2, '0')}}-05</td>
                    <td>Cash Deposit</td>
                    <td class="text-right" style="font-weight: 700;">${{formatTaka(dAmt)}}</td>
                    <td class="text-right" style="font-weight: 700; color: var(--tri-green);">${{formatTaka(cum)}}</td>
                    <td>Received by Cashier</td>
                  </tr>
                `;
              }}).join('')}}
            </tbody>
          </table>
        </div>

        <div>
          <div class="a4-auth-grid">
            <div class="a4-auth-box">
              <div class="a4-sig-line"></div>
              <div class="a4-auth-role">Finance Secretary</div>
              <div class="a4-auth-name">${{PPBF_DATA.info.finance_secretary}}</div>
            </div>
            <div class="a4-auth-box">
              <div class="a4-sig-line"></div>
              <div class="a4-auth-role">General Secretary</div>
              <div class="a4-auth-name">${{PPBF_DATA.info.secretary}}</div>
            </div>
            <div class="a4-auth-box">
              <div class="a4-sig-line"></div>
              <div class="a4-auth-role">President</div>
              <div class="a4-auth-name">${{PPBF_DATA.info.president}}</div>
            </div>
          </div>
          <div class="tri-bar">
            <div class="bar-red"></div>
            <div class="bar-orange"></div>
            <div class="bar-green"></div>
          </div>
          <div class="a4-footer-text">
            ${{PPBF_DATA.info.name_bn}} • Member Admission Register
          </div>
        </div>
      </div>
    </div>
  `;
}}

// 7. FORMS HUB (#/forms)
function renderFormsHub() {{
  const list = PPBF_DATA.investments.list || [];
  const members = PPBF_DATA.members || [];

  return `
    <div style="margin-bottom: 24px;">
      <h2 class="serif-title" style="font-size: 26px; color: var(--navy); font-weight: 700;">Official A4 Forms Hub</h2>
      <p style="font-size: 13.5px; color: var(--text-muted);">
        Standardized printable A4 cooperative documents, ledger statements, and member passbooks.
      </p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 24px;">
      <!-- Investment Statement Card -->
      <div class="panel" style="margin-bottom: 0;">
        <div class="panel-header">
          <div class="panel-title">
            <svg style="width:20px;height:20px;fill:var(--gold)" viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
            Investment Statements
          </div>
          <span class="badge badge-navy">24 Records</span>
        </div>
        <div class="panel-body">
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 14px;">
            Standard A4 24-row installment collection statements with receiver photos, guarantor deed, and 3 authorization seals.
          </p>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <a href="#/inv/all" class="btn btn-gold btn-sm">Print All Forms</a>
            <a href="#/loans" class="btn btn-outline btn-sm">Select Individual Form</a>
          </div>
        </div>
      </div>

      <!-- Member Statements Card -->
      <div class="panel" style="margin-bottom: 0;">
        <div class="panel-header">
          <div class="panel-title">
            <svg style="width:20px;height:20px;fill:var(--gold)" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
            Member Admission Forms
          </div>
          <span class="badge badge-navy">${{members.length}} Members</span>
        </div>
        <div class="panel-body">
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 14px;">
            Official admission record, cooperative equity share allocation certificates, and monthly passbook statements.
          </p>
          <a href="#/members" class="btn btn-outline btn-sm">Open Members Directory</a>
        </div>
      </div>
    </div>
  `;
}}

// 8. STATEMENTS & PASSBOOKS (#/statements)
function renderStatements() {{
  const list = PPBF_DATA.investments.list || [];
  const members = PPBF_DATA.members || [];

  return `
    <div style="margin-bottom: 24px;">
      <h2 class="serif-title" style="font-size: 26px; color: var(--navy); font-weight: 700;">Cooperative Statements Center</h2>
      <p style="font-size: 13.5px; color: var(--text-muted);">
        Select any member or investment to generate an instant printable A4 statement.
      </p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">Investment Statements</div>
        </div>
        <div class="panel-body">
          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 400px; overflow-y: auto;">
            ${{list.map(i => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: var(--ivory); border-radius: var(--radius-md); border: 1px solid var(--border);">
                <div>
                  <div style="font-weight: 700; color: var(--navy); font-size: 13.5px;">#${{i.no}} - ${{i.receiver}}</div>
                  <div style="font-size: 11.5px; color: var(--text-muted);">${{i.type}} • ${{formatTaka(i.total)}}</div>
                </div>
                <a href="#/inv/${{encodeURIComponent(i.no)}}" class="btn btn-sm btn-primary">Statement</a>
              </div>
            `).join('')}}
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">Member Savings Passbooks</div>
        </div>
        <div class="panel-body">
          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 400px; overflow-y: auto;">
            ${{members.map(m => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: var(--ivory); border-radius: var(--radius-md); border: 1px solid var(--border);">
                <div>
                  <div style="font-weight: 700; color: var(--navy); font-size: 13.5px;">${{m.name}} (${{m.id}})</div>
                  <div style="font-size: 11.5px; color: var(--text-muted);">${{m.designation}} • ${{formatTaka(m.total_savings)}}</div>
                </div>
                <a href="#/member/${{m.id}}" class="btn btn-sm btn-outline">Passbook</a>
              </div>
            `).join('')}}
          </div>
        </div>
      </div>
    </div>
  `;
}}

// 9. ASSETS REGISTER (#/assets)
function renderAssets() {{
  const assets = PPBF_DATA.assets || [];
  let totalCost = assets.reduce((sum, a) => sum + (parseFloat(a.cost) || 0), 0);
  let totalCurrentVal = assets.reduce((sum, a) => sum + (parseFloat(a.current_val) || 0), 0);

  return `
    <div style="margin-bottom: 20px;">
      <h2 class="serif-title" style="font-size: 26px; color: var(--navy); font-weight: 700;">Cooperative Asset Register</h2>
      <p style="font-size: 13px; color: var(--text-muted);">
        Fixed Assets, Real Estate Advances & Equipment • Net Current Value: <strong>${{formatTaka(totalCurrentVal)}}</strong>
      </p>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card accent-navy">
        <span class="kpi-label">Total Acquisition Cost</span>
        <span class="kpi-val">${{formatTaka(totalCost)}}</span>
      </div>
      <div class="kpi-card accent-green">
        <span class="kpi-label">Current Book Value</span>
        <span class="kpi-val">${{formatTaka(totalCurrentVal)}}</span>
      </div>
      <div class="kpi-card accent-gold">
        <span class="kpi-label">Registered Items</span>
        <span class="kpi-val">${{assets.length}} Assets</span>
      </div>
    </div>

    <div class="panel">
      <div class="table-responsive mobile-sticky-col">
        <table class="data-table">
          <thead>
            <tr>
              <th>Asset ID</th>
              <th>Asset Description</th>
              <th>Category</th>
              <th>Acquisition Date</th>
              <th>Cost (৳)</th>
              <th>Current Valuation (৳)</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${{assets.map(a => `
              <tr>
                <td style="font-weight: 800; color: var(--navy);">${{a.id}}</td>
                <td style="font-weight: 700;">${{a.name}}</td>
                <td><span class="badge badge-navy">${{a.category}}</span></td>
                <td>${{a.purchase_date}}</td>
                <td style="font-weight: 700;">${{formatTaka(a.cost)}}</td>
                <td style="font-weight: 800; color: var(--tri-green);">${{formatTaka(a.current_val)}}</td>
                <td>${{a.location}}</td>
                <td><span class="badge badge-completed">${{a.status}}</span></td>
              </tr>
            `).join('')}}
          </tbody>
        </table>
      </div>
    </div>
  `;
}}

// 10. FINANCE SCREEN (#/finance)
function renderFinance() {{
  const fin = PPBF_DATA.finance || {{}};
  const collections = fin.monthly_collections || [];

  return `
    <div style="margin-bottom: 20px;">
      <h2 class="serif-title" style="font-size: 26px; color: var(--navy); font-weight: 700;">Financial Accounts & Balance Sheet</h2>
      <p style="font-size: 13px; color: var(--text-muted);">
        Capital Reserves, Profit Distribution, and Monthly Inflow / Outflow Analysis.
      </p>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card accent-navy">
        <span class="kpi-label">Cooperative Capital Fund</span>
        <span class="kpi-val">${{formatTaka(fin.capital_fund)}}</span>
      </div>
      <div class="kpi-card accent-gold">
        <span class="kpi-label">General Reserve Fund</span>
        <span class="kpi-val">${{formatTaka(fin.general_reserve)}}</span>
      </div>
      <div class="kpi-card accent-green">
        <span class="kpi-label">Welfare & Relief Fund</span>
        <span class="kpi-val">${{formatTaka(fin.welfare_fund)}}</span>
      </div>
      <div class="kpi-card accent-orange">
        <span class="kpi-label">Realized Profit</span>
        <span class="kpi-val">${{formatTaka(fin.realized_profit)}}</span>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">Monthly Recovery & Cash Flow Statement</div>
      </div>
      <div class="table-responsive mobile-sticky-col">
        <table class="data-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Member Savings (৳)</th>
              <th>Investment Recovered (৳)</th>
              <th>Realized Profit (৳)</th>
              <th>Operating Expenses (৳)</th>
              <th>Net Inflow (৳)</th>
            </tr>
          </thead>
          <tbody>
            ${{collections.map(c => {{
              const net = (c.savings + c.investment_recovered + c.profit) - c.expense;
              return `
                <tr>
                  <td style="font-weight: 800; color: var(--navy);">${{c.month}}</td>
                  <td style="font-weight: 700;">${{formatTaka(c.savings)}}</td>
                  <td style="font-weight: 700; color: var(--tri-green);">${{formatTaka(c.investment_recovered)}}</td>
                  <td style="font-weight: 700; color: var(--gold);">${{formatTaka(c.profit)}}</td>
                  <td style="color: var(--tri-red);">${{formatTaka(c.expense)}}</td>
                  <td style="font-weight: 800; color: var(--navy);">${{formatTaka(net)}}</td>
                </tr>
              `;
            }}).join('')}}
          </tbody>
        </table>
      </div>
    </div>
  `;
}}

// 11. MEDIA / GALLERY (#/media)
function renderMedia() {{
  const items = PPBF_DATA.media || [];

  return `
    <div style="margin-bottom: 20px;">
      <h2 class="serif-title" style="font-size: 26px; color: var(--navy); font-weight: 700;">Cooperative Event Gallery</h2>
      <p style="font-size: 13px; color: var(--text-muted);">
        Visual archives of vehicle handovers, general assemblies, and community enterprise projects.
      </p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
      ${{items.map(m => `
        <div class="panel" style="margin-bottom: 0; display: flex; flex-direction: column;">
          <div style="height: 160px; background: linear-gradient(135deg, #0b2545 0%, #13386a 100%); display: flex; align-items: center; justify-content: center; color: #fff; position: relative;">
            <svg style="width: 48px; height: 48px; fill: var(--gold-light);" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
            <span class="badge badge-gold" style="position: absolute; top: 12px; right: 12px;">${{m.category}}</span>
          </div>
          <div style="padding: 16px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="font-size: 11px; font-weight: 700; color: var(--gold); text-transform: uppercase;">${{m.date}}</div>
              <h3 style="font-size: 16px; font-weight: 700; color: var(--navy); margin: 4px 0 8px 0;">${{m.title}}</h3>
              <p style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.4;">${{m.description}}</p>
            </div>
            <div style="margin-top: 14px; border-top: 1px solid var(--border); padding-top: 10px;">
              <span class="badge badge-navy">${{m.tag || 'Archive'}}</span>
            </div>
          </div>
        </div>
      `).join('')}}
    </div>
  `;
}}

// 12. ABOUT (#/about)
function renderAbout() {{
  const info = PPBF_DATA.info;

  return `
    <div class="panel" style="padding: 32px; margin-bottom: 24px;">
      <div style="text-align: center; max-width: 650px; margin: 0 auto 30px auto;">
        <img src="{LOGO_B64}" style="width: 90px; height: 90px; margin-bottom: 12px;" />
        <div class="bengali-text" style="font-size: 16px; color: var(--gold); font-weight: 600;">${{info.bismillah}}</div>
        <h1 class="bengali-text" style="font-size: 32px; font-weight: 800; color: var(--navy); margin: 6px 0;">${{info.name_bn}}</h1>
        <div style="font-size: 14px; font-weight: 700; color: var(--gold); letter-spacing: 1.5px; margin-bottom: 8px;">${{info.name_en}}</div>
        <p style="font-size: 13.5px; color: var(--text-secondary);">
          Established on <strong>${{info.established}}</strong> in P.M. Khali, Cox's Bazar, Bangladesh.
          A dedicated community-driven savings and Islamic micro-equity investment cooperative empowering local transport operators and small enterprises.
        </p>
      </div>

      <div class="tri-bar" style="margin-bottom: 28px;">
        <div class="bar-red"></div>
        <div class="bar-orange"></div>
        <div class="bar-green"></div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
        <div>
          <h3 style="font-size: 18px; font-weight: 700; color: var(--navy); margin-bottom: 10px;">Executive Committee</h3>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 13.5px;">
            <li style="padding: 10px; background: var(--ivory); border-radius: var(--radius-md);">
              <strong>President:</strong> ${{info.president}}
            </li>
            <li style="padding: 10px; background: var(--ivory); border-radius: var(--radius-md);">
              <strong>General Secretary:</strong> ${{info.secretary}}
            </li>
            <li style="padding: 10px; background: var(--ivory); border-radius: var(--radius-md);">
              <strong>Finance Secretary:</strong> ${{info.finance_secretary}}
            </li>
          </ul>
        </div>

        <div>
          <h3 style="font-size: 18px; font-weight: 700; color: var(--navy); margin-bottom: 10px;">Contact & Registration</h3>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 13.5px;">
            <li style="padding: 10px; background: var(--ivory); border-radius: var(--radius-md);">
              <strong>Headquarters:</strong> ${{info.address}}
            </li>
            <li style="padding: 10px; background: var(--ivory); border-radius: var(--radius-md);">
              <strong>Official Email:</strong> ${{info.email}}
            </li>
            <li style="padding: 10px; background: var(--ivory); border-radius: var(--radius-md);">
              <strong>Phone Helpline:</strong> ${{info.phone}}
            </li>
          </ul>
        </div>
      </div>
    </div>
  `;
}}

// 13. REPORT (#/report)
function renderReport() {{
  const list = PPBF_DATA.investments.list || [];
  let totalInvested = list.reduce((s, i) => s + (parseFloat(i.total) || 0), 0);
  let totalReceived = list.reduce((s, i) => s + (parseFloat(i.received) || 0), 0);
  let recoveryRate = totalInvested > 0 ? Math.round((totalReceived / totalInvested) * 100) : 0;

  return `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
      <div>
        <h2 class="serif-title" style="font-size: 26px; color: var(--navy); font-weight: 700;">Cooperative Audit & Performance Report</h2>
        <p style="font-size: 13px; color: var(--text-muted);">Fiscal Period 2022-2024 Audit Summary</p>
      </div>
      <button class="btn btn-gold" onclick="window.print()">
        <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
        Print Official Report
      </button>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card accent-green">
        <span class="kpi-label">Portfolio Recovery Rate</span>
        <span class="kpi-val">${{recoveryRate}}%</span>
        <span class="kpi-sub">On-time installment compliance</span>
      </div>
      <div class="kpi-card accent-navy">
        <span class="kpi-label">Total Capital Disbursed</span>
        <span class="kpi-val">${{formatTaka(totalInvested)}}</span>
      </div>
      <div class="kpi-card accent-gold">
        <span class="kpi-label">Cumulative Collections</span>
        <span class="kpi-val">${{formatTaka(totalReceived)}}</span>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">Auditor Certification</div>
      </div>
      <div class="panel-body">
        <p style="font-size: 13.5px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">
          This certifies that the books, accounts, investment statement forms, and member records of <strong>Parania Para Business Forum</strong> for the period from 01/10/2022 to date have been audited and verified. All 24 investment statement forms are backed by individual recipient signature acknowledgments, and bank reconciliations reflect genuine community cooperative operations.
        </p>
        <div style="display: flex; gap: 24px; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border);">
          <div>
            <div style="border-top: 1px solid #000; width: 140px; margin-bottom: 4px;"></div>
            <div style="font-size: 11px; font-weight: 700;">Nabi Hossain</div>
            <div style="font-size: 10px; color: var(--text-muted);">Finance Secretary</div>
          </div>
          <div>
            <div style="border-top: 1px solid #000; width: 140px; margin-bottom: 4px;"></div>
            <div style="font-size: 11px; font-weight: 700;">Md. Nurul Absar</div>
            <div style="font-size: 10px; color: var(--text-muted);">General Secretary</div>
          </div>
          <div>
            <div style="border-top: 1px solid #000; width: 140px; margin-bottom: 4px;"></div>
            <div style="font-size: 11px; font-weight: 700;">Alhaj Mohammad Harun</div>
            <div style="font-size: 10px; color: var(--text-muted);">President</div>
          </div>
        </div>
      </div>
    </div>
  `;
}}

// 14. ADMIN (#/admin)
function renderAdmin() {{
  const edit = isEditMode();
  const list = PPBF_DATA.investments.list || [];

  return `
    <div style="margin-bottom: 20px;">
      <h2 class="serif-title" style="font-size: 26px; color: var(--navy); font-weight: 700;">System Administration & Master Tables</h2>
      <p style="font-size: 13px; color: var(--text-muted);">
        Bulk editing, database backup/restore, and system reset controls.
      </p>
    </div>

    <!-- Mode Banner -->
    <div class="panel" style="border-left: 4px solid var(--gold); padding: 18px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
      <div>
        <div style="font-weight: 800; font-size: 16px; color: var(--navy);">
          Current Mode: ${{edit ? '<span style="color:var(--tri-green)">EDIT MODE (UNLOCKED)</span>' : '<span style="color:var(--text-muted)">VIEW ONLY</span>'}}
        </div>
        <div style="font-size: 12.5px; color: var(--text-secondary); margin-top: 2px;">
          ${{edit ? 'Every field is inline-editable. Changes are saved automatically.' : 'Click Unlock to enable inline editing with management passkey.'}}
        </div>
      </div>
      <div>
        <button class="btn ${{edit ? 'btn-danger' : 'btn-primary'}}" onclick="toggleEditMode()">
          ${{edit ? 'Lock to View Mode' : 'Unlock Edit Mode'}}
        </button>
      </div>
    </div>

    <!-- Backup & Restore Actions -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-bottom: 24px;">
      <div class="panel" style="margin-bottom: 0; padding: 20px;">
        <h4 style="font-size: 15px; font-weight: 700; color: var(--navy); margin-bottom: 6px;">Export Full Backup</h4>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">Download all investments, members, forms, and photos as JSON.</p>
        <button class="btn btn-outline" onclick="exportDataJSON()" style="width: 100%;">
          Export JSON
        </button>
      </div>

      <div class="panel" style="margin-bottom: 0; padding: 20px;">
        <h4 style="font-size: 15px; font-weight: 700; color: var(--navy); margin-bottom: 6px;">Import Database</h4>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">Restore from a previously saved JSON backup file.</p>
        <label class="btn btn-outline" style="width: 100%; cursor: pointer;">
          Choose JSON File
          <input type="file" accept=".json" style="display:none;" onchange="importDataJSON(event)" />
        </label>
      </div>

      <div class="panel" style="margin-bottom: 0; padding: 20px;">
        <h4 style="font-size: 15px; font-weight: 700; color: var(--tri-red); margin-bottom: 6px;">Reset to Seed</h4>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">Restore initial 25 investments and default records.</p>
        <button class="btn btn-danger" onclick="resetToSeed()" style="width: 100%;">
          Reset to Factory Seed
        </button>
      </div>
    </div>

    <!-- Master Investments Table -->
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">Master Investment Records (${{list.length}} Items)</div>
      </div>
      <div class="table-responsive mobile-sticky-col">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Receiver</th>
              <th>Type</th>
              <th>Total</th>
              <th>Received</th>
              <th>Due</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${{list.map(i => `
              <tr>
                <td style="font-weight: 800; color: var(--navy);">${{i.no}}</td>
                <td style="font-weight: 700;">${{i.receiver}}</td>
                <td>${{i.type}}</td>
                <td>${{formatTaka(i.total)}}</td>
                <td style="color: var(--tri-green); font-weight: 700;">${{formatTaka(i.received)}}</td>
                <td style="color: ${{i.due > 0 ? 'var(--tri-red)' : 'var(--tri-green)'}}; font-weight: 700;">${{formatTaka(i.due)}}</td>
                <td>
                  <span class="badge ${{i.status === 'RUNNING' ? 'badge-running' : 'badge-completed'}}">
                    ${{i.status}}
                  </span>
                </td>
                <td>
                  <a href="#/inv/${{encodeURIComponent(i.no)}}" class="btn btn-sm btn-outline">
                    Edit Form
                  </a>
                </td>
              </tr>
            `).join('')}}
          </tbody>
        </table>
      </div>
    </div>
  `;
}}

// Initialize Application on DOM Ready
window.addEventListener('DOMContentLoaded', () => {{
  initData();
  renderRoute();
}});

window.addEventListener('hashchange', renderRoute);
"""

with open('app_renderers.js', 'w') as f:
    f.write(renderers_code)
print("Saved app_renderers.js")
