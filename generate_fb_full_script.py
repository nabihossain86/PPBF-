import json

with open('logo_base64.txt', 'r') as f:
    LOGO_B64 = f.read().strip()

with open('seed_data_fb.json', 'r') as f:
    SEED_JSON_STR = f.read().strip()

fb_logic_code = f"""
// PPBF Facebook-Style Web App Logic
// Fully Functional Single-Page Hash Routing & LocalStorage State

const FB_SEED_DATA = {SEED_JSON_STR};
let PPBF_DATA = null;
let PPBF_PHOTOS = {{}};
let EDIT_PASSWORD = "ppbf2023";
let CURRENT_ACTIVE_TAB = "home";

// Initialize Data Store
function initData() {{
  try {{
    const saved = localStorage.getItem('ppbf_data_fb_v1');
    if (saved) {{
      PPBF_DATA = JSON.parse(saved);
    }} else {{
      PPBF_DATA = JSON.parse(JSON.stringify(FB_SEED_DATA));
      saveData();
    }}
  }} catch (e) {{
    console.error("Storage read error, using seed", e);
    PPBF_DATA = JSON.parse(JSON.stringify(FB_SEED_DATA));
  }}

  try {{
    const savedPhotos = localStorage.getItem('ppbf_photos_fb_v1');
    if (savedPhotos) {{
      PPBF_PHOTOS = JSON.parse(savedPhotos);
    }}
  }} catch (e) {{
    console.error("Photo storage read error", e);
  }}

  syncInvestments();
}}

function saveData() {{
  if (!PPBF_DATA) return;
  try {{
    localStorage.setItem('ppbf_data_fb_v1', JSON.stringify(PPBF_DATA));
  }} catch (e) {{
    console.error("Storage save failed", e);
  }}
}}

function savePhoto(key, dataUrl) {{
  PPBF_PHOTOS[key] = dataUrl;
  try {{
    localStorage.setItem('ppbf_photos_fb_v1', JSON.stringify(PPBF_PHOTOS));
  }} catch (e) {{
    console.error("Photo save failed", e);
  }}
}}

function deletePhoto(key) {{
  delete PPBF_PHOTOS[key];
  try {{
    localStorage.setItem('ppbf_photos_fb_v1', JSON.stringify(PPBF_PHOTOS));
  }} catch (e) {{
    console.error("Photo delete failed", e);
  }}
}}

function getPhoto(key) {{
  return PPBF_PHOTOS[key] || null;
}}

function normalizeDate(dStr) {{
  if (!dStr) return "";
  const d = new Date(dStr);
  if (isNaN(d.getTime())) return dStr;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${{yyyy}}-${{mm}}-${{dd}}`;
}}

function formatTaka(val) {{
  const num = parseFloat(val) || 0;
  return '৳ ' + num.toLocaleString('en-US');
}}

// Sync Rules: Master Form -> Followed by List Record
function syncInvestments() {{
  if (!PPBF_DATA || !PPBF_DATA.investments) return;
  const forms = PPBF_DATA.investments.forms || {{}};
  let list = PPBF_DATA.investments.list || [];

  for (const [no, form] of Object.entries(forms)) {{
    form.issue_date = normalizeDate(form.issue_date);
    form.end_date = normalizeDate(form.end_date);
    if (!form.date) form.date = new Date().toISOString().split('T')[0];

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

    let totalReceived = 0;
    form.rows.forEach(r => {{
      const amt = parseFloat(r.paid_amount) || 0;
      if (amt > 0) totalReceived += amt;
      if (r.received_date) r.received_date = normalizeDate(r.received_date);
    }});

    const totalAmt = parseFloat(form.total) || 0;
    const secAmt = parseFloat(form.security) || 0;
    
    let dueAmt = (form.status === "COMPLETED") ? 0 : Math.max(0, totalAmt - secAmt - totalReceived);

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
        <h3 style="font-size: 16px; font-weight: 700; color: var(--fb-text-primary);">Unlock Management Edit Mode</h3>
        <button class="fb-icon-btn" style="width:32px;height:32px;" onclick="document.getElementById('pw-modal').remove()">✕</button>
      </div>
      <div class="modal-body">
        <p style="font-size: 13.5px; color: var(--fb-text-secondary); margin-bottom: 14px;">
          Enter management passkey to unlock inline editing. Changes will save automatically.
        </p>
        <div style="margin-bottom: 12px;">
          <input type="password" id="pw-input" placeholder="Enter passkey (default: ppbf2023)" 
            style="width: 100%; padding: 10px 14px; border: 1px solid var(--fb-border); border-radius: 8px; font-size: 14px;" 
            onkeydown="if(event.key==='Enter') submitPassword()" />
          <span style="font-size: 11.5px; color: var(--fb-blue); display: block; margin-top: 6px;">Passkey: <strong>ppbf2023</strong></span>
        </div>
      </div>
      <div class="modal-footer">
        <button class="fb-action-btn" style="max-width:100px;" onclick="document.getElementById('pw-modal').remove()">Cancel</button>
        <button class="fb-action-btn" style="background:var(--fb-blue);color:#fff;max-width:140px;font-weight:700;" onclick="submitPassword()">Unlock</button>
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
    showToast("Edit Mode unlocked. All fields are editable.");
    renderRoute();
  }} else {{
    alert("Incorrect password. Default is 'ppbf2023'.");
  }}
}}

function showToast(msg) {{
  let container = document.getElementById('toast-container');
  if (!container) {{
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'no-print';
    container.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:10000;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
    document.body.appendChild(container);
  }}
  const toast = document.createElement('div');
  toast.style.cssText = 'background:rgba(11,37,69,0.92);color:#fff;padding:10px 20px;border-radius:9999px;font-size:13.5px;font-weight:600;box-shadow:0 4px 12px rgba(0,0,0,0.15);display:flex;align-items:center;gap:8px;backdrop-filter:blur(4px);';
  toast.innerHTML = `<span>✓</span><span>${{msg}}</span>`;
  container.appendChild(toast);
  setTimeout(() => {{
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }}, 2500);
}}

function autoScaleA4() {{
  const wrappers = document.querySelectorAll('.a4-screen-wrapper');
  wrappers.forEach(w => {{
    const frame = w.querySelector('.a4-page-frame');
    if (!frame) return;
    const availWidth = w.clientWidth - 20;
    if (availWidth < 794) {{
      const scale = Math.max(0.35, availWidth / 794);
      frame.style.transform = `scale(${{scale}})`;
      frame.style.transformOrigin = 'top center';
      w.style.height = `${{Math.round(1122 * scale + 24)}}px`;
    }} else {{
      frame.style.transform = 'none';
      w.style.height = 'auto';
    }}
  }});
}}
window.addEventListener('resize', autoScaleA4);

// Functional Reactions (Like / Love / Care)
function togglePostReaction(postId) {{
  const post = PPBF_DATA.posts.find(p => p.id === postId);
  if (!post) return;
  if (!post.user_reacted) {{
    post.user_reacted = 'like';
    post.likes = (post.likes || 0) + 1;
    post.reactions.like = (post.reactions.like || 0) + 1;
  }} else if (post.user_reacted === 'like') {{
    post.user_reacted = 'love';
    post.reactions.like = Math.max(0, post.reactions.like - 1);
    post.reactions.love = (post.reactions.love || 0) + 1;
  }} else {{
    post.user_reacted = null;
    post.likes = Math.max(0, post.likes - 1);
    post.reactions.love = Math.max(0, post.reactions.love - 1);
  }}
  saveData();
  renderRoute();
}}

// Functional Comments
function addPostComment(postId, inputElem) {{
  const text = inputElem.value.trim();
  if (!text) return;
  const post = PPBF_DATA.posts.find(p => p.id === postId);
  if (!post) return;
  if (!post.comments) post.comments = [];
  post.comments.push({{
    author: "Nabi Hossain",
    text: text,
    time: "Just now"
  }});
  inputElem.value = "";
  saveData();
  renderRoute();
  showToast("Comment posted.");
}}

// Functional Post Creation
function openCreatePostModal() {{
  const existing = document.getElementById('post-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'post-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <h3 style="font-size: 16px; font-weight: 700; color: var(--fb-text-primary);">Create Forum Post</h3>
        <button class="fb-icon-btn" style="width:32px;height:32px;" onclick="document.getElementById('post-modal').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
          <div class="fb-user-avatar" style="width:36px;height:36px;font-size:13px;">N</div>
          <div>
            <div style="font-weight:700;font-size:14px;">Nabi Hossain</div>
            <div style="font-size:11.5px;color:var(--fb-text-secondary);">Finance Secretary • Public</div>
          </div>
        </div>
        <textarea id="new-post-text" placeholder="What's on your mind? Share an investment update, member notice, or forum news..." 
          style="width:100%;height:100px;border:none;outline:none;font-size:15px;resize:none;font-family:inherit;"></textarea>
        
        <div style="margin-top:10px;border:1px solid var(--fb-border-light);border-radius:8px;padding:10px;">
          <label style="font-size:12px;font-weight:700;color:var(--navy);display:block;margin-bottom:6px;">Link Investment Form (Optional)</label>
          <select id="new-post-inv" style="width:100%;padding:6px 10px;border:1px solid var(--fb-border);border-radius:6px;font-size:13px;">
            <option value="">None (General Forum Notice)</option>
            ${{PPBF_DATA.investments.list.map(i => `<option value="${{i.no}}">#${{i.no}} - ${{i.receiver}} (${{i.type}})</option>`).join('')}}
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="fb-action-btn" style="background:var(--fb-blue);color:#fff;font-weight:700;width:100%;padding:10px;border-radius:6px;" onclick="submitNewPost()">
          Post to Forum
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}}

function submitNewPost() {{
  const text = document.getElementById('new-post-text').value.trim();
  const invRef = document.getElementById('new-post-inv').value;
  if (!text) {{
    alert("Please write something to share.");
    return;
  }}
  const newPost = {{
    id: "post-" + Date.now(),
    author: "Nabi Hossain",
    author_role: "Finance Secretary, PPBF",
    author_avatar: "N",
    time: "Just now",
    content_bn: text,
    content_en: text,
    inv_ref: invRef || null,
    likes: 1,
    reactions: {{"like": 1, "love": 0, "care": 0}},
    user_reacted: "like",
    comments: []
  }};
  PPBF_DATA.posts.unshift(newPost);
  saveData();
  document.getElementById('post-modal').remove();
  showToast("Post shared to news feed.");
  renderRoute();
}}

// Functional Story Viewer
function openStoryModal(storyId) {{
  const story = PPBF_DATA.stories.find(s => s.id === storyId);
  if (!story) return;

  const existing = document.getElementById('story-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'story-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div style="max-width:380px;width:100%;height:580px;background:${{story.color}};border-radius:16px;box-shadow:0 12px 30px rgba(0,0,0,0.5);display:flex;flex-direction:column;justify-content:space-between;padding:16px;color:#fff;position:relative;overflow:hidden;">
      <!-- Progress Bar at Top -->
      <div style="width:100%;height:3px;background:rgba(255,255,255,0.3);border-radius:2px;overflow:hidden;">
        <div style="width:100%;height:100%;background:#ffffff;animation:storyProg 6s linear;"></div>
      </div>
      
      <!-- Top Author Row -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div class="fb-story-avatar" style="width:34px;height:34px;border-color:#fff;">${{story.author.charAt(0)}}</div>
          <div>
            <div style="font-weight:700;font-size:13.5px;">${{story.author}}</div>
            <div style="font-size:11px;opacity:0.8;">${{story.sub}}</div>
          </div>
        </div>
        <button onclick="document.getElementById('story-modal').remove()" style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer;">✕</button>
      </div>

      <!-- Center Content -->
      <div style="text-align:center;padding:20px 10px;">
        <div style="font-size:28px;font-weight:800;font-family:'Cormorant Garamond',serif;margin-bottom:12px;">${{story.title}}</div>
        <div style="background:rgba(255,255,255,0.18);padding:14px;border-radius:12px;font-size:14px;line-height:1.5;backdrop-filter:blur(4px);">
          ${{story.content}}
        </div>
      </div>

      <!-- Bottom Reaction Strip -->
      <div style="display:flex;gap:8px;">
        <input type="text" placeholder="Reply to story..." style="flex:1;background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.4);border-radius:9999px;padding:8px 14px;color:#fff;outline:none;" />
        <button class="fb-icon-btn" style="background:rgba(255,255,255,0.25);color:#fff;" onclick="showToast('Story liked! ❤️')">❤️</button>
        <button class="fb-icon-btn" style="background:rgba(255,255,255,0.25);color:#fff;" onclick="showToast('Story liked! 👍')">👍</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}}

// Functional Notification Click
function clickNotification(notifId, link) {{
  const notif = PPBF_DATA.notifications.find(n => n.id === notifId);
  if (notif) notif.read = true;
  saveData();
  window.location.hash = link;
}}

function exportDataJSON() {{
  const fullBackup = {{
    data: PPBF_DATA,
    photos: PPBF_PHOTOS,
    exported_at: new Date().toISOString()
  }};
  const blob = new Blob([JSON.stringify(fullBackup, null, 2)], {{ type: 'application/json' }});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `PPBF_Facebook_Backup_${{new Date().toISOString().split('T')[0]}}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Database JSON exported.");
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
      syncInvestments();
      showToast("Data restored from JSON.");
      renderRoute();
    }} catch (err) {{
      alert("Invalid JSON file: " + err.message);
    }}
  }};
  reader.readAsText(file);
}}

function resetToSeed() {{
  if (confirm("Reset all forum data and investments to factory seed?")) {{
    PPBF_DATA = JSON.parse(JSON.stringify(FB_SEED_DATA));
    PPBF_PHOTOS = {{}};
    saveData();
    localStorage.removeItem('ppbf_photos_fb_v1');
    syncInvestments();
    showToast("Restored factory seed.");
    renderRoute();
  }}
}}

function shareApp() {{
  if (navigator.share) {{
    navigator.share({{
      title: 'PPBF - Parania Para Business Forum',
      text: 'Cooperative savings, vehicle financing & A4 statements for Parania Para Business Forum.',
      url: window.location.href
    }}).catch(() => {{}});
  }} else {{
    navigator.clipboard.writeText(window.location.href);
    showToast("Forum link copied to clipboard!");
  }}
}}

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
  renderRoute();
  showToast("Installment updated.");
}}

function handlePhotoUpload(key, inputElem) {{
  const file = inputElem.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {{
    savePhoto(key, e.target.result);
    showToast("Photo updated.");
    renderRoute();
  }};
  reader.readAsDataURL(file);
}}

function removePhoto(key) {{
  if (confirm("Delete this photo?")) {{
    deletePhoto(key);
    showToast("Photo deleted.");
    renderRoute();
  }}
}}
"""

with open('fb_logic_part1.js', 'w') as f:
    f.write(fb_logic_code)

