import json

with open('seed_data.json', 'r') as f:
    seed_json_str = f.read().strip()

js_code = f"""
// PPBF Cooperative Application Logic
// Single-Page Hash Routing & LocalStorage Persistence System

const SEED_DATA = {seed_json_str};

// State Variables
let PPBF_DATA = null;
let PPBF_PHOTOS = {{}};
let EDIT_PASSWORD = "ppbf2023";

// Initialize Storage
function initData() {{
  try {{
    const saved = localStorage.getItem('ppbf_data_v1');
    if (saved) {{
      PPBF_DATA = JSON.parse(saved);
    }} else {{
      PPBF_DATA = JSON.parse(JSON.stringify(SEED_DATA));
      saveData();
    }}
  }} catch (e) {{
    console.error("Error reading localStorage, using seed", e);
    PPBF_DATA = JSON.parse(JSON.stringify(SEED_DATA));
  }}

  try {{
    const savedPhotos = localStorage.getItem('ppbf_photos_v1');
    if (savedPhotos) {{
      PPBF_PHOTOS = JSON.parse(savedPhotos);
    }}
  }} catch (e) {{
    console.error("Error reading photos", e);
  }}

  syncInvestments();
}}

// Save Data
function saveData() {{
  if (!PPBF_DATA) return;
  try {{
    localStorage.setItem('ppbf_data_v1', JSON.stringify(PPBF_DATA));
  }} catch (e) {{
    console.error("Storage save failed", e);
  }}
}}

// Save Photos separately to avoid payload bloating
function savePhoto(key, dataUrl) {{
  PPBF_PHOTOS[key] = dataUrl;
  try {{
    localStorage.setItem('ppbf_photos_v1', JSON.stringify(PPBF_PHOTOS));
  }} catch (e) {{
    console.error("Photo save failed", e);
  }}
}}

function deletePhoto(key) {{
  delete PPBF_PHOTOS[key];
  try {{
    localStorage.setItem('ppbf_photos_v1', JSON.stringify(PPBF_PHOTOS));
  }} catch (e) {{
    console.error("Photo delete failed", e);
  }}
}}

function getPhoto(key) {{
  return PPBF_PHOTOS[key] || null;
}}

// Date normalizer to YYYY-MM-DD
function normalizeDate(dStr) {{
  if (!dStr) return "";
  const d = new Date(dStr);
  if (isNaN(d.getTime())) return dStr;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${{yyyy}}-${{mm}}-${{dd}}`;
}}

// Number formatter
function formatTaka(val) {{
  const num = parseFloat(val) || 0;
  return '৳ ' + num.toLocaleString('en-US');
}}

// Sync Rules: Master Form -> Followed by List
function syncInvestments() {{
  if (!PPBF_DATA || !PPBF_DATA.investments) return;
  const forms = PPBF_DATA.investments.forms || {{}};
  let list = PPBF_DATA.investments.list || [];

  for (const [no, form] of Object.entries(forms)) {{
    // normalize dates
    form.issue_date = normalizeDate(form.issue_date);
    form.end_date = normalizeDate(form.end_date);
    if (!form.date) form.date = new Date().toISOString().split('T')[0];

    // ensure 24 rows
    if (!form.rows || !Array.isArray(form.rows)) form.rows = [];
    while (form.rows.length < 24) {{
      form.rows.push({{
        no: form.rows.length + 1,
        month: "",
        received_date: "",
        description: "",
        paid_amount: 0,
        receiver_sign: "",
        remarks: ""
      }});
    }}

    // calculate received
    let totalReceived = 0;
    let paidRowsCount = 0;
    form.rows.forEach(r => {{
      const amt = parseFloat(r.paid_amount) || 0;
      if (amt > 0) {{
        totalReceived += amt;
        paidRowsCount++;
      }}
      if (r.received_date) r.received_date = normalizeDate(r.received_date);
    }});

    const totalAmt = parseFloat(form.total) || 0;
    const secAmt = parseFloat(form.security) || 0;
    
    // Status rule & Due calculation
    let dueAmt = 0;
    if (form.status === "COMPLETED") {{
      dueAmt = 0;
    }} else {{
      dueAmt = Math.max(0, totalAmt - secAmt - totalReceived);
    }}

    // Sync or create list record
    let item = list.find(l => String(l.no) === String(no));
    if (!item) {{
      item = {{ no: no }};
      list.push(item);
    }}
    item.receiver = form.receiver;
    item.receiver_bn = form.receiver_bn || "";
    item.type = form.type;
    item.size = item.size || form.type;
    item.total = totalAmt;
    item.received = totalReceived;
    item.forum_invested = parseFloat(form.forum_invested) || (totalAmt - secAmt);
    item.security = secAmt;
    item.profit = parseFloat(form.profit) || 0;
    item.due = dueAmt;
    item.installments = parseInt(form.installments) || 18;
    item.issue_date = form.issue_date;
    item.end_date = form.end_date;
    item.status = form.status || "RUNNING";
    item.remarks = form.remarks || "";
    item.guarantor_name = form.guarantor_name;
    item.guarantor_mobile = form.guarantor_mobile;
  }}

  PPBF_DATA.investments.list = list;
  saveData();
}}

// Mode Management
function isEditMode() {{
  return sessionStorage.getItem('ppbf_edit_mode') === 'true';
}}

function toggleEditMode() {{
  if (isEditMode()) {{
    sessionStorage.setItem('ppbf_edit_mode', 'false');
    showToast("Switched to View-Only mode.");
    renderRoute();
  }} else {{
    openPasswordModal();
  }}
}}

function openPasswordModal() {{
  const existing = document.getElementById('pw-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'pw-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <h3 style="font-size: 16px; font-weight: 700; color: #fff;">Unlock Edit Mode</h3>
        <button class="btn btn-sm btn-outline" style="border:none; color:#fff;" onclick="document.getElementById('pw-modal').remove()">✕</button>
      </div>
      <div class="modal-body">
        <p style="font-size: 13.5px; color: var(--text-muted); margin-bottom: 12px;">
          Enter the management passkey to unlock inline editing. All changes save instantly to your session.
        </p>
        <div style="margin-bottom: 14px;">
          <label style="font-size: 12px; font-weight: 700; color: var(--navy); display: block; margin-bottom: 4px;">Passkey</label>
          <input type="password" id="pw-input" placeholder="Enter passkey (default: ppbf2023)" 
            style="width: 100%; padding: 10px 12px; border: 1px solid var(--border-dark); border-radius: 6px; font-size: 14px;" 
            onkeydown="if(event.key==='Enter') submitPassword()" />
          <span style="font-size: 11px; color: var(--gold); display: block; margin-top: 4px;">Default passkey: <strong>ppbf2023</strong></span>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="document.getElementById('pw-modal').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="submitPassword()">Unlock Editing</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => {{
    const inp = document.getElementById('pw-input');
    if (inp) inp.focus();
  }}, 50);
}}

function submitPassword() {{
  const inp = document.getElementById('pw-input');
  if (inp && inp.value.trim() === EDIT_PASSWORD) {{
    sessionStorage.setItem('ppbf_edit_mode', 'true');
    const modal = document.getElementById('pw-modal');
    if (modal) modal.remove();
    showToast("Edit Mode unlocked. All fields are now editable.");
    renderRoute();
  }} else {{
    alert("Incorrect password. Please use 'ppbf2023'.");
  }}
}}

// Toast Notifications
function showToast(msg) {{
  let container = document.getElementById('toast-container');
  if (!container) {{
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container no-print';
    document.body.appendChild(container);
  }}
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✓</span><span>${{msg}}</span>`;
  container.appendChild(toast);
  setTimeout(() => {{
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }}, 3000);
}}

// A4 Scaling Logic
function autoScaleA4() {{
  const wrappers = document.querySelectorAll('.a4-screen-wrapper');
  wrappers.forEach(w => {{
    const frame = w.querySelector('.a4-page-frame');
    if (!frame) return;
    const availWidth = w.clientWidth - 24;
    if (availWidth < 794) {{
      const scale = Math.max(0.38, availWidth / 794);
      frame.style.transform = `scale(${{scale}})`;
      frame.style.transformOrigin = 'top center';
      w.style.height = `${{Math.round(1122 * scale + 30)}}px`;
    }} else {{
      frame.style.transform = 'none';
      w.style.height = 'auto';
    }}
  }});
}}
window.addEventListener('resize', autoScaleA4);

// Export & Import Data
function exportDataJSON() {{
  const fullBackup = {{
    data: PPBF_DATA,
    photos: PPBF_PHOTOS,
    exported_at: new Date().toISOString(),
    version: "1.0"
  }};
  const blob = new Blob([JSON.stringify(fullBackup, null, 2)], {{ type: 'application/json' }});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `PPBF_Cooperative_Database_${{new Date().toISOString().split('T')[0]}}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Full database backup downloaded.");
}}

function importDataJSON(event) {{
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {{
    try {{
      const parsed = JSON.parse(e.target.result);
      if (parsed.data) {{
        PPBF_DATA = parsed.data;
        if (parsed.photos) PPBF_PHOTOS = parsed.photos;
      }} else {{
        PPBF_DATA = parsed;
      }}
      saveData();
      if (parsed.photos) localStorage.setItem('ppbf_photos_v1', JSON.stringify(PPBF_PHOTOS));
      syncInvestments();
      showToast("Database successfully restored from JSON.");
      renderRoute();
    }} catch (err) {{
      alert("Invalid JSON backup file: " + err.message);
    }}
  }};
  reader.readAsText(file);
}}

function resetToSeed() {{
  if (confirm("Are you sure you want to reset all data back to the original cooperative seed? All current edits will be cleared.")) {{
    PPBF_DATA = JSON.parse(JSON.stringify(SEED_DATA));
    PPBF_PHOTOS = {{}};
    saveData();
    localStorage.removeItem('ppbf_photos_v1');
    syncInvestments();
    showToast("Data restored to initial seed.");
    renderRoute();
  }}
}}

function shareApp() {{
  if (navigator.share) {{
    navigator.share({{
      title: 'PPBF - Parania Para Business Forum',
      text: 'Cooperative savings, investments, and A4 statement records for Parania Para Business Forum.',
      url: window.location.href
    }}).catch(() => {{}});
  }} else {{
    navigator.clipboard.writeText(window.location.href);
    showToast("Application link copied to clipboard!");
  }}
}}

// Mobile Drawer toggle
function toggleDrawer(open) {{
  const drawer = document.getElementById('app-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  if (!drawer || !backdrop) return;
  if (open === undefined) {{
    drawer.classList.toggle('open');
    backdrop.classList.toggle('open');
  }} else if (open) {{
    drawer.classList.add('open');
    backdrop.classList.add('open');
  }} else {{
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
  }}
}}

// Inline Edit Handlers
function updateFormField(invNo, field, val) {{
  if (!PPBF_DATA.investments.forms[invNo]) return;
  PPBF_DATA.investments.forms[invNo][field] = val;
  syncInvestments();
  showToast("Saved.");
}}

function updateRowField(invNo, rowIndex, field, val) {{
  if (!PPBF_DATA.investments.forms[invNo]) return;
  const row = PPBF_DATA.investments.forms[invNo].rows[rowIndex];
  if (!row) return;
  if (field === 'paid_amount') {{
    row[field] = parseFloat(val) || 0;
  }} else {{
    row[field] = val;
  }}
  syncInvestments();
  // Re-render form summary strip and total row without losing focus if possible
  renderRoute();
  showToast("Installment updated.");
}}

function handlePhotoUpload(key, inputElem) {{
  const file = inputElem.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {{
    savePhoto(key, e.target.result);
    showToast("Photo uploaded successfully.");
    renderRoute();
  }};
  reader.readAsDataURL(file);
}}

function removePhoto(key) {{
  if (confirm("Delete this photo?")) {{
    deletePhoto(key);
    showToast("Photo removed.");
    renderRoute();
  }}
}}
"""

with open('app_logic.js', 'w') as f:
    f.write(js_code)

