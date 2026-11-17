// PPBF Cooperative Application Logic
// Single-Page Hash Routing, Canonical 38-Member / 50-Share Data & LocalStorage Persistence

const SEED_DATA = __SEED_DATA_JSON__;
const PPBF_LOGO_SRC = "__LOGO_B64__";

// State Variables
let PPBF_DATA = null;
let PPBF_PHOTOS = {};
let EDIT_PASSWORD = "ppbf2023";
let PENDING_IMPORT_PAYLOAD = null;

const STORAGE_KEY_V2 = "ppbf_data_v2";
const STORAGE_KEY_V1 = "ppbf_data_v1";
const PHOTOS_KEY = "ppbf_photos_v1";
const ROLLBACK_KEY = "ppbf_rollback_snapshot_v2";

// Initialize Storage (preserve existing investment/asset/finance/media edits if migrating from v1)
function initData() {
  try {
    const savedV2 = localStorage.getItem(STORAGE_KEY_V2);
    if (savedV2) {
      PPBF_DATA = JSON.parse(savedV2);
    } else {
      PPBF_DATA = JSON.parse(JSON.stringify(SEED_DATA));
      const legacyV1 = localStorage.getItem(STORAGE_KEY_V1);
      if (legacyV1) {
        try {
          const parsedV1 = JSON.parse(legacyV1);
          if (parsedV1 && parsedV1.investments && parsedV1.investments.forms) {
            PPBF_DATA.investments = parsedV1.investments;
          }
          if (parsedV1 && Array.isArray(parsedV1.assets)) PPBF_DATA.assets = parsedV1.assets;
          if (parsedV1 && parsedV1.finance) PPBF_DATA.finance = parsedV1.finance;
          if (parsedV1 && Array.isArray(parsedV1.media)) PPBF_DATA.media = parsedV1.media;
        } catch (err) {
          console.warn("Legacy v1 migration skipped", err);
        }
      }
      saveData();
    }
  } catch (e) {
    console.error("Error reading localStorage, using seed", e);
    PPBF_DATA = JSON.parse(JSON.stringify(SEED_DATA));
  }

  // Ensure canonical sections exist without mutating stored member values
  if (!PPBF_DATA.source_summary) {
    PPBF_DATA.source_summary = JSON.parse(JSON.stringify(SEED_DATA.source_summary));
  }
  if (!Array.isArray(PPBF_DATA.members)) {
    PPBF_DATA.members = JSON.parse(JSON.stringify(SEED_DATA.members));
  }
  if (!Array.isArray(PPBF_DATA.share_serials)) {
    PPBF_DATA.share_serials = JSON.parse(JSON.stringify(SEED_DATA.share_serials));
  }
  if (!Array.isArray(PPBF_DATA.audit_log)) {
    PPBF_DATA.audit_log = [];
  }

  try {
    const savedPhotos = localStorage.getItem(PHOTOS_KEY);
    if (savedPhotos) {
      PPBF_PHOTOS = JSON.parse(savedPhotos);
    }
  } catch (e) {
    console.error("Error reading photos", e);
  }

  syncInvestments();
  initCloudSync();
}

// Save Data (LocalStorage + Debounced Firebase RTDB Cloud Sync)
function saveData() {
  if (!PPBF_DATA) return;
  try {
    localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(PPBF_DATA));
  } catch (e) {
    console.error("Storage save failed", e);
  }
  if (!IS_APPLYING_CLOUD_SNAPSHOT) {
    scheduleCloudDataPush();
  }
}

// Save Photos separately to avoid payload bloating
function savePhoto(key, dataUrl) {
  const safeKey = String(key || '').replace(/[.#$\[\]\/]/g, '_');
  PPBF_PHOTOS[safeKey] = dataUrl;
  try {
    localStorage.setItem(PHOTOS_KEY, JSON.stringify(PPBF_PHOTOS));
  } catch (e) {
    console.error("Photo save failed", e);
  }
  if (!IS_APPLYING_CLOUD_SNAPSHOT) {
    scheduleCloudPhotosPush();
  }
}

function deletePhoto(key) {
  const safeKey = String(key || '').replace(/[.#$\[\]\/]/g, '_');
  delete PPBF_PHOTOS[safeKey];
  delete PPBF_PHOTOS[key];
  try {
    localStorage.setItem(PHOTOS_KEY, JSON.stringify(PPBF_PHOTOS));
  } catch (e) {
    console.error("Photo delete failed", e);
  }
  if (!IS_APPLYING_CLOUD_SNAPSHOT) {
    scheduleCloudPhotosPush();
  }
}

function getPhoto(key) {
  const safeKey = String(key || '').replace(/[.#$\[\]\/]/g, '_');
  return PPBF_PHOTOS[safeKey] || PPBF_PHOTOS[key] || null;
}

// ============================================================================
// FIREBASE AUTH & REALTIME DATABASE CLOUD SYNC (WEB + ANDROID SEAMLESS SYNC)
// Database: https://ppbf-2023-default-rtdb.asia-southeast1.firebasedatabase.app
// ============================================================================
const PPBF_FIREBASE_WEB_CONFIG = {
  apiKey: "AIzaSyA4QD3fQPj8pT_t2a-iv-VUpYmPNU39Wj8",
  authDomain: "ppbf-2023.firebaseapp.com",
  databaseURL: "https://ppbf-2023-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ppbf-2023",
  storageBucket: "ppbf-2023.firebasestorage.app",
  messagingSenderId: "883610013326",
  appId: "1:883610013326:android:ea94f0b69102527275c3df"
};

const CLOUD_STATE = {
  platform: (typeof window !== 'undefined' && window.AndroidFirebaseSync) ? 'android' : 'web',
  firebaseInitialized: false,
  isConnected: false,
  isSignedIn: false,
  uid: '',
  email: '',
  displayName: '',
  databaseUrl: PPBF_FIREBASE_WEB_CONFIG.databaseURL,
  lastSyncAt: '',
  syncState: 'initializing',
  lastError: '',
  isAuthLoading: false
};

let IS_APPLYING_CLOUD_SNAPSHOT = false;
let cloudDataPushTimer = null;
let cloudPhotosPushTimer = null;
let webFirebaseApp = null;
let webFirebaseInitialized = false;
let webLastAppliedHash = '';

function updateCloudStatusUI() {
  if (typeof refreshCloudSyncUI === 'function') {
    refreshCloudSyncUI();
  }
}

function applyCloudStatusObject(obj) {
  if (!obj || typeof obj !== 'object') return;
  Object.assign(CLOUD_STATE, obj);
  updateCloudStatusUI();
}

function toDenseArray(val, fallback = []) {
  if (Array.isArray(val)) return val;
  if (val && typeof val === 'object') {
    const numericKeys = Object.keys(val)
      .filter(k => /^\d+$/.test(k))
      .sort((a, b) => Number(a) - Number(b));
    if (numericKeys.length > 0) {
      return numericKeys.map(k => val[k]);
    }
  }
  return Array.isArray(fallback) ? JSON.parse(JSON.stringify(fallback)) : [];
}

function normalizeCloudDataset(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const rawMembers = toDenseArray(raw.members, []);
  if (rawMembers.length === 0) return null;

  const fallbackRoot = (typeof PPBF_DATA === 'object' && PPBF_DATA) ? PPBF_DATA : SEED_DATA;
  const cloned = JSON.parse(JSON.stringify(raw));
  if (!cloned.info) cloned.info = JSON.parse(JSON.stringify(fallbackRoot.info || SEED_DATA.info));
  if (!cloned.source_summary) cloned.source_summary = JSON.parse(JSON.stringify(fallbackRoot.source_summary || SEED_DATA.source_summary));
  cloned.share_serials = toDenseArray(cloned.share_serials, fallbackRoot.share_serials || SEED_DATA.share_serials);
  if (!cloned.investments || typeof cloned.investments !== 'object') {
    cloned.investments = JSON.parse(JSON.stringify(fallbackRoot.investments || SEED_DATA.investments));
  }
  cloned.investments.list = toDenseArray(cloned.investments.list, fallbackRoot.investments?.list || []);
  if (!cloned.investments.forms || typeof cloned.investments.forms !== 'object') {
    cloned.investments.forms = JSON.parse(JSON.stringify(fallbackRoot.investments?.forms || {}));
  } else {
    Object.values(cloned.investments.forms).forEach(f => {
      if (f && typeof f === 'object') {
        f.rows = toDenseArray(f.rows, []);
      }
    });
  }
  cloned.assets = toDenseArray(cloned.assets, fallbackRoot.assets || []);
  if (!cloned.finance || typeof cloned.finance !== 'object') {
    cloned.finance = JSON.parse(JSON.stringify(fallbackRoot.finance || SEED_DATA.finance));
  } else {
    cloned.finance.monthly_collections = toDenseArray(
      cloned.finance.monthly_collections,
      fallbackRoot.finance?.monthly_collections || []
    );
  }
  cloned.media = toDenseArray(cloned.media, fallbackRoot.media || []);
  cloned.audit_log = toDenseArray(cloned.audit_log, fallbackRoot.audit_log || []);

  cloned.members = rawMembers.map(m => {
    const member = Object.assign({}, m);
    member.serials = toDenseArray(member.serials, []);
    member.ledger = toDenseArray(member.ledger, []);
    if (!member.yrs || typeof member.yrs !== 'object') {
      member.yrs = {};
    } else {
      Object.keys(member.yrs).forEach(yr => {
        member.yrs[yr] = toDenseArray(member.yrs[yr], []);
      });
    }
    if (!member.nom || typeof member.nom !== 'object') member.nom = {};
    if (!member.bank || typeof member.bank !== 'object') member.bank = {};
    return member;
  });
  return cloned;
}

function mergeCloudSnapshot(rawCloudData, rawMeta, announceToast = true) {
  const normalized = normalizeCloudDataset(rawCloudData);
  if (!normalized) return false;

  const incomingStr = JSON.stringify(normalized);
  const currentStr = JSON.stringify(PPBF_DATA);
  if (incomingStr === currentStr) {
    if (rawMeta && rawMeta.updated_at) {
      CLOUD_STATE.lastSyncAt = rawMeta.updated_at;
      updateCloudStatusUI();
    }
    return false;
  }

  IS_APPLYING_CLOUD_SNAPSHOT = true;
  try {
    PPBF_DATA = normalized;
    syncInvestments();
    localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(PPBF_DATA));
    if (rawMeta && rawMeta.updated_at) {
      CLOUD_STATE.lastSyncAt = rawMeta.updated_at;
    }
    CLOUD_STATE.syncState = CLOUD_STATE.isConnected ? 'live_synced' : 'offline_cached';
    CLOUD_STATE.lastError = '';
  } finally {
    IS_APPLYING_CLOUD_SNAPSHOT = false;
  }

  updateCloudStatusUI();
  if (typeof renderRoute === 'function') {
    renderRoute();
  }
  if (announceToast) {
    showToast("Synchronized latest records from Firebase Cloud.");
  }
  return true;
}

function mergeCloudPhotos(rawPhotos) {
  if (!rawPhotos || typeof rawPhotos !== 'object') return;
  const incomingStr = JSON.stringify(rawPhotos);
  if (incomingStr === JSON.stringify(PPBF_PHOTOS)) return;
  IS_APPLYING_CLOUD_SNAPSHOT = true;
  try {
    PPBF_PHOTOS = Object.assign({}, PPBF_PHOTOS, rawPhotos);
    localStorage.setItem(PHOTOS_KEY, JSON.stringify(PPBF_PHOTOS));
  } catch (e) {
    console.warn("Cloud photo cache skipped", e);
  } finally {
    IS_APPLYING_CLOUD_SNAPSHOT = false;
  }
  if (typeof renderRoute === 'function') {
    renderRoute();
  }
}

window.onAndroidCloudStatus = function(statusJson) {
  try {
    const parsed = typeof statusJson === 'string' ? JSON.parse(statusJson) : statusJson;
    applyCloudStatusObject(parsed);
  } catch (e) {
    console.warn("Invalid Android status payload", e);
  }
};

window.onAndroidCloudData = function(dataJson, metaJson) {
  try {
    const dataObj = typeof dataJson === 'string' ? JSON.parse(dataJson) : dataJson;
    const metaObj = metaJson ? (typeof metaJson === 'string' ? JSON.parse(metaJson) : metaJson) : {};
    mergeCloudSnapshot(dataObj, metaObj, true);
  } catch (e) {
    console.warn("Invalid Android cloud data payload", e);
  }
};

window.onAndroidCloudPhotos = function(photosJson) {
  try {
    const photosObj = typeof photosJson === 'string' ? JSON.parse(photosJson) : photosJson;
    mergeCloudPhotos(photosObj);
  } catch (e) {
    console.warn("Invalid Android cloud photos payload", e);
  }
};

function scheduleCloudDataPush() {
  if (cloudDataPushTimer) clearTimeout(cloudDataPushTimer);
  cloudDataPushTimer = setTimeout(() => {
    if (CLOUD_STATE.isSignedIn) {
      pushCloudDataNow(false);
    }
  }, 450);
}

function scheduleCloudPhotosPush() {
  if (cloudPhotosPushTimer) clearTimeout(cloudPhotosPushTimer);
  cloudPhotosPushTimer = setTimeout(() => {
    if (CLOUD_STATE.isSignedIn) {
      pushCloudPhotosNow();
    }
  }, 550);
}

function buildCloudMeta(deviceType) {
  return {
    updated_at: new Date().toISOString(),
    updated_by_uid: CLOUD_STATE.uid || '',
    updated_by_email: CLOUD_STATE.email || '',
    updated_by_name: CLOUD_STATE.displayName || '',
    device_type: deviceType || CLOUD_STATE.platform,
    member_count: Array.isArray(PPBF_DATA?.members) ? PPBF_DATA.members.length : 0,
    share_count: Array.isArray(PPBF_DATA?.share_serials) ? PPBF_DATA.share_serials.length : 0
  };
}

function pushCloudDataNow(showConfirmToast = true) {
  if (!PPBF_DATA) return;
  const meta = buildCloudMeta(CLOUD_STATE.platform);
  if (window.AndroidFirebaseSync && typeof window.AndroidFirebaseSync.pushData === 'function') {
    if (!CLOUD_STATE.isSignedIn) {
      if (showConfirmToast) showToast("Sign in with Google first to push data to Firebase Cloud.");
      return;
    }
    window.AndroidFirebaseSync.pushData(JSON.stringify(PPBF_DATA), JSON.stringify(meta));
    CLOUD_STATE.lastSyncAt = meta.updated_at;
    updateCloudStatusUI();
    if (showConfirmToast) showToast("Cooperative dataset pushed to Firebase Realtime Database.");
    return;
  }

  if (webFirebaseInitialized && typeof firebase !== 'undefined' && firebase.database && CLOUD_STATE.isSignedIn) {
    const portalRef = firebase.database().ref('ppbf_portal');
    webLastAppliedHash = JSON.stringify(PPBF_DATA);
    portalRef.update({
      data: JSON.parse(webLastAppliedHash),
      meta: meta
    }).then(() => {
      CLOUD_STATE.lastSyncAt = meta.updated_at;
      CLOUD_STATE.syncState = CLOUD_STATE.isConnected ? 'live_synced' : 'offline_queued';
      CLOUD_STATE.lastError = '';
      updateCloudStatusUI();
      if (showConfirmToast) showToast("Cooperative dataset synced to Firebase Cloud.");
    }).catch(err => {
      CLOUD_STATE.lastError = err && err.message ? err.message : 'Cloud write error';
      updateCloudStatusUI();
      if (showConfirmToast) showToast("Cloud sync error: " + CLOUD_STATE.lastError);
    });
  } else if (showConfirmToast) {
    showToast("Sign in with Google to synchronize changes to Firebase Cloud.");
  }
}

function pushCloudPhotosNow() {
  if (!PPBF_PHOTOS) return;
  if (window.AndroidFirebaseSync && typeof window.AndroidFirebaseSync.pushPhotos === 'function') {
    if (CLOUD_STATE.isSignedIn) {
      window.AndroidFirebaseSync.pushPhotos(JSON.stringify(PPBF_PHOTOS));
    }
    return;
  }
  if (webFirebaseInitialized && typeof firebase !== 'undefined' && firebase.database && CLOUD_STATE.isSignedIn) {
    firebase.database().ref('ppbf_portal/photos').set(PPBF_PHOTOS).catch(e => {
      console.warn("Web photo push failed", e);
    });
  }
}

function cloudPullNow() {
  if (window.AndroidFirebaseSync && typeof window.AndroidFirebaseSync.pullNow === 'function') {
    window.AndroidFirebaseSync.pullNow();
    showToast("Checking Firebase Realtime Database for latest updates...");
    return;
  }
  if (webFirebaseInitialized && typeof firebase !== 'undefined' && firebase.database) {
    CLOUD_STATE.syncState = 'syncing';
    updateCloudStatusUI();
    firebase.database().ref('ppbf_portal').once('value').then(snap => {
      const val = snap.val();
      if (val && val.data) {
        const changed = mergeCloudSnapshot(val.data, val.meta || {}, false);
        if (val.photos) mergeCloudPhotos(val.photos);
        showToast(changed ? "Pulled latest records from Firebase Cloud." : "Already up to date with Firebase Cloud.");
      } else {
        showToast("Cloud database has no snapshot yet. Use Push Local Data to initialize.");
      }
      CLOUD_STATE.syncState = CLOUD_STATE.isConnected ? 'live_synced' : 'offline_cached';
      updateCloudStatusUI();
    }).catch(err => {
      CLOUD_STATE.lastError = err && err.message ? err.message : 'Pull failed';
      updateCloudStatusUI();
      showToast("Cloud pull error: " + CLOUD_STATE.lastError);
    });
  } else {
    showToast("Running offline with local cached dataset.");
  }
}

function cloudSignInWithGoogle() {
  if (window.AndroidFirebaseSync && typeof window.AndroidFirebaseSync.signInWithGoogle === 'function') {
    window.AndroidFirebaseSync.signInWithGoogle();
    return;
  }
  if (webFirebaseInitialized && typeof firebase !== 'undefined' && firebase.auth) {
    const provider = new firebase.auth.GoogleAuthProvider();
    CLOUD_STATE.isAuthLoading = true;
    CLOUD_STATE.lastError = '';
    updateCloudStatusUI();
    firebase.auth().signInWithPopup(provider).then(() => {
      CLOUD_STATE.isAuthLoading = false;
      updateCloudStatusUI();
      showToast("Signed in with Google. Realtime Database sync active.");
    }).catch(err => {
      if (err && (err.code === 'auth/popup-blocked' || err.code === 'auth/operation-not-supported-in-this-environment')) {
        firebase.auth().signInWithRedirect(provider).catch(redirErr => {
          CLOUD_STATE.isAuthLoading = false;
          CLOUD_STATE.lastError = redirErr.message || 'Sign-in unavailable';
          updateCloudStatusUI();
        });
      } else {
        CLOUD_STATE.isAuthLoading = false;
        CLOUD_STATE.lastError = err && err.message ? err.message : 'Google Sign-In failed';
        updateCloudStatusUI();
        showToast("Sign-in: " + CLOUD_STATE.lastError);
      }
    });
  } else {
    showToast("Connect to internet in HTTPS/hosted browser or use the Android APK for Google Sign-In.");
  }
}

function cloudSignOut() {
  if (window.AndroidFirebaseSync && typeof window.AndroidFirebaseSync.signOut === 'function') {
    window.AndroidFirebaseSync.signOut();
    showToast("Signed out of Google Cloud Sync.");
    return;
  }
  if (webFirebaseInitialized && typeof firebase !== 'undefined' && firebase.auth) {
    firebase.auth().signOut().then(() => {
      showToast("Signed out of Firebase Auth.");
    });
  }
}

function loadExternalScript(src) {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined' || !document.head) {
      reject(new Error('DOM unavailable'));
      return;
    }
    const existing = Array.from(document.querySelectorAll('script')).find(s => s.src === src);
    if (existing) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load ' + src));
    document.head.appendChild(s);
  });
}

function attachWebFirebaseListeners() {
  if (typeof firebase === 'undefined' || !firebase.apps) return;
  if (!firebase.apps.length) {
    webFirebaseApp = firebase.initializeApp(PPBF_FIREBASE_WEB_CONFIG);
  } else {
    webFirebaseApp = firebase.app();
  }
  webFirebaseInitialized = true;
  CLOUD_STATE.firebaseInitialized = true;

  const auth = firebase.auth();
  const db = firebase.database();

  auth.onAuthStateChanged(user => {
    CLOUD_STATE.isSignedIn = Boolean(user);
    CLOUD_STATE.uid = user ? user.uid : '';
    CLOUD_STATE.email = user && user.email ? user.email : '';
    CLOUD_STATE.displayName = user && user.displayName ? user.displayName : '';
    CLOUD_STATE.isAuthLoading = false;
    CLOUD_STATE.syncState = user ? (CLOUD_STATE.isConnected ? 'live_synced' : 'offline_cached') : (CLOUD_STATE.isConnected ? 'connected_readonly' : 'offline_cached');
    updateCloudStatusUI();
  });

  db.ref('.info/connected').on('value', snap => {
    CLOUD_STATE.isConnected = Boolean(snap.val());
    CLOUD_STATE.syncState = CLOUD_STATE.isConnected
      ? (CLOUD_STATE.isSignedIn ? 'live_synced' : 'connected_readonly')
      : 'offline_cached';
    updateCloudStatusUI();
  });

  db.ref('ppbf_portal/meta').on('value', snap => {
    const m = snap.val();
    if (m && m.updated_at) {
      CLOUD_STATE.lastSyncAt = m.updated_at;
      updateCloudStatusUI();
    }
  });

  db.ref('ppbf_portal/data').on('value', snap => {
    const val = snap.val();
    if (val && Array.isArray(val.members) && val.members.length > 0) {
      const serialized = JSON.stringify(val);
      if (serialized !== webLastAppliedHash) {
        webLastAppliedHash = serialized;
        mergeCloudSnapshot(val, { updated_at: CLOUD_STATE.lastSyncAt }, false);
      }
    }
  }, err => {
    if (err && err.code === 'PERMISSION_DENIED') {
      CLOUD_STATE.lastError = 'Sign in with Google for cloud read/write sync';
      updateCloudStatusUI();
    }
  });

  db.ref('ppbf_portal/photos').on('value', snap => {
    const ph = snap.val();
    if (ph) mergeCloudPhotos(ph);
  }, () => {});
}

function initCloudSync() {
  if (typeof window !== 'undefined' && window.AndroidFirebaseSync && typeof window.AndroidFirebaseSync.getStatusJson === 'function') {
    CLOUD_STATE.platform = 'android';
    try {
      const status = JSON.parse(window.AndroidFirebaseSync.getStatusJson());
      applyCloudStatusObject(status);
    } catch (e) {
      console.warn("Android sync status read failed", e);
    }
    return;
  }

  CLOUD_STATE.platform = 'web';
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    CLOUD_STATE.syncState = 'offline_cached';
    updateCloudStatusUI();
    return;
  }
  if (typeof document === 'undefined' || !document.head) return;

  const base = 'https://www.gstatic.com/firebasejs/10.14.1/';
  loadExternalScript(base + 'firebase-app-compat.js')
    .then(() => loadExternalScript(base + 'firebase-auth-compat.js'))
    .then(() => loadExternalScript(base + 'firebase-database-compat.js'))
    .then(() => attachWebFirebaseListeners())
    .catch(() => {
      CLOUD_STATE.firebaseInitialized = false;
      CLOUD_STATE.syncState = 'offline_local';
      updateCloudStatusUI();
    });
}

// Date normalizer to YYYY-MM-DD
function normalizeDate(dStr) {
  if (!dStr) return "";
  const d = new Date(dStr);
  if (isNaN(d.getTime())) return dStr;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function formatDisplayDate(dStr) {
  if (!dStr) return "Not provided";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dStr)) {
    const [y, m, d] = dStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mi = parseInt(m, 10) - 1;
    if (mi >= 0 && mi < 12) return `${d} ${months[mi]} ${y} (${dStr})`;
  }
  return dStr;
}

// HTML Escaping & Display Helpers
function escHtml(val) {
  if (val === null || val === undefined) return "";
  return String(val)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function displayOrMissing(val, fallback = "Not provided") {
  if (val === null || val === undefined) return `<span style="color:var(--text-light);font-weight:500;">${fallback}</span>`;
  const s = String(val).trim();
  if (!s) return `<span style="color:var(--text-light);font-weight:500;">${fallback}</span>`;
  return escHtml(val);
}

// Precise Number Formatters (without mutating stored floats)
function formatTaka(val) {
  if (val === null || val === undefined || val === "") return "—";
  const num = Number(val);
  if (!Number.isFinite(num)) return String(val);
  const absFormatted = Math.abs(num).toLocaleString('en-US', { maximumFractionDigits: 4 });
  return (num < 0 ? "-৳ " : "৳ ") + absFormatted;
}

function formatExactNumber(val) {
  if (val === null || val === undefined || val === "") return "—";
  const num = Number(val);
  if (!Number.isFinite(num)) return String(val);
  return num.toLocaleString('en-US', { maximumFractionDigits: 6 });
}

// PII Masking Helpers (Masked in View-Only Mode, Revealed in Authorized Edit Mode)
function maskPhone(phone) {
  if (!phone || !String(phone).trim()) return '<span style="color:var(--text-light);">Not provided</span>';
  const raw = String(phone).trim();
  if (isEditMode()) return escHtml(raw);
  const digits = raw.replace(/\s+/g, '');
  if (digits.length <= 4) return "••••";
  return `${escHtml(digits.slice(0, 4))}•••${escHtml(digits.slice(-2))} <span class="pii-masked-pill">Masked</span>`;
}

function maskNID(nid) {
  if (!nid || !String(nid).trim()) return '<span style="color:var(--text-light);">Not provided</span>';
  const raw = String(nid).trim();
  if (isEditMode()) return escHtml(raw);
  if (raw.length <= 4) return "••••";
  return `•••• ••${escHtml(raw.slice(-4))} <span class="pii-masked-pill">Masked</span>`;
}

function maskEmail(email) {
  if (!email || !String(email).trim()) return '<span style="color:var(--text-light);">Not provided</span>';
  const raw = String(email).trim();
  if (isEditMode()) return escHtml(raw);
  const parts = raw.split('@');
  if (parts.length !== 2) return '•••• <span class="pii-masked-pill">Masked</span>';
  const local = parts[0];
  const shown = local.slice(0, Math.min(2, local.length));
  return `${escHtml(shown)}•••@${escHtml(parts[1])} <span class="pii-masked-pill">Masked</span>`;
}

function maskBankAcc(acc) {
  if (!acc || !String(acc).trim()) return '<span style="color:var(--text-light);">Not provided</span>';
  const raw = String(acc).trim();
  if (isEditMode()) return escHtml(raw);
  if (raw.length <= 4) return "••••";
  return `••••••${escHtml(raw.slice(-4))} <span class="pii-masked-pill">Masked</span>`;
}

function maskSensitiveDate(d) {
  if (!d || !String(d).trim()) return '<span style="color:var(--text-light);">Not provided</span>';
  if (isEditMode()) return escHtml(formatDisplayDate(d));
  return `${escHtml(String(d).slice(0, 4))}-••-•• <span class="pii-masked-pill">Masked</span>`;
}

// Audit Trail Logger
function recordAudit(entity, recordId, field, beforeVal, afterVal) {
  if (!PPBF_DATA) return;
  if (!Array.isArray(PPBF_DATA.audit_log)) PPBF_DATA.audit_log = [];
  if (JSON.stringify(beforeVal) === JSON.stringify(afterVal)) return;
  PPBF_DATA.audit_log.unshift({
    id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    who: isEditMode() ? "Authorized Executive (Passkey Session)" : "System",
    timestamp: new Date().toISOString(),
    entity: entity,
    record_id: String(recordId),
    field: field,
    before: beforeVal === undefined ? null : beforeVal,
    after: afterVal === undefined ? null : afterVal
  });
  if (PPBF_DATA.audit_log.length > 500) {
    PPBF_DATA.audit_log = PPBF_DATA.audit_log.slice(0, 500);
  }
}

// Controlled Member Inline Edit (Never overwrites historical ledger array)
function updateMemberField(memberId, path, newValue) {
  if (!isEditMode()) {
    showToast("Unlock Edit Mode to modify member records.");
    return;
  }
  if (path === 'ledger' || path.startsWith('ledger.')) {
    showToast("Historical ledger records are protected from overwriting.");
    return;
  }
  const member = (PPBF_DATA.members || []).find(m => Number(m.id) === Number(memberId));
  if (!member) return;

  const keys = path.split('.');
  let target = member;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!target[keys[i]] || typeof target[keys[i]] !== 'object') {
      target[keys[i]] = {};
    }
    target = target[keys[i]];
  }
  const leafKey = keys[keys.length - 1];
  const beforeVal = target[leafKey];

  let coerced = typeof newValue === 'string' ? newValue.trim() : newValue;
  const numericFields = ['shares', 'paid', 'due', 'total', 'own', 'profit', 'payout', 'pt', 'fine', 'finepaid'];
  if (numericFields.includes(leafKey)) {
    const cleaned = String(coerced).replace(/[^0-9.-]/g, '');
    if (cleaned === '' || isNaN(Number(cleaned))) return;
    coerced = Number(cleaned);
  }

  if (beforeVal === coerced) return;
  target[leafKey] = coerced;

  // Keep share_serials display names synchronized if English/Bengali name updated
  if (leafKey === 'en' || leafKey === 'bn') {
    (PPBF_DATA.share_serials || []).forEach(s => {
      if (Number(s.member_id) === Number(member.id)) {
        if (leafKey === 'en') s.member_name_en = coerced;
        if (leafKey === 'bn') s.member_name_bn = coerced;
      }
    });
  }

  recordAudit("member", member.id, path, beforeVal, coerced);
  saveData();
  showToast(`Member #${member.id} updated & audited.`);
}

// Sync Rules: Master Form -> Followed by List
function syncInvestments() {
  if (!PPBF_DATA || !PPBF_DATA.investments) return;
  const forms = PPBF_DATA.investments.forms || {};
  let list = PPBF_DATA.investments.list || [];

  for (const [no, form] of Object.entries(forms)) {
    form.issue_date = normalizeDate(form.issue_date);
    form.end_date = normalizeDate(form.end_date);
    if (!form.date) form.date = new Date().toISOString().split('T')[0];

    if (!form.rows || !Array.isArray(form.rows)) form.rows = [];
    while (form.rows.length < 24) {
      form.rows.push({
        no: form.rows.length + 1,
        month: "",
        received_date: "",
        description: "",
        paid_amount: 0,
        receiver_sign: "",
        remarks: ""
      });
    }

    let totalReceived = 0;
    form.rows.forEach(r => {
      const amt = parseFloat(r.paid_amount) || 0;
      if (amt > 0) totalReceived += amt;
      if (r.received_date) r.received_date = normalizeDate(r.received_date);
    });

    const totalAmt = parseFloat(form.total) || 0;
    const secAmt = parseFloat(form.security) || 0;
    const dueAmt = (form.status === "COMPLETED") ? 0 : Math.max(0, totalAmt - secAmt - totalReceived);

    let item = list.find(l => String(l.no) === String(no));
    if (!item) {
      item = { no: no };
      list.push(item);
    }
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
  }

  PPBF_DATA.investments.list = list;
  saveData();
}

// Mode Management
function isEditMode() {
  return sessionStorage.getItem('ppbf_edit_mode') === 'true';
}

function toggleEditMode() {
  toggleThreeDotMenu(false);
  if (isEditMode()) {
    sessionStorage.setItem('ppbf_edit_mode', 'false');
    showToast("Switched to View-Only mode. Sensitive PII masked.");
    renderRoute();
  } else {
    openPasswordModal();
  }
}

function openPasswordModal() {
  const existing = document.getElementById('pw-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'pw-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <h3 style="font-size: 18.5px; font-weight: 700; color: #fff;">Unlock Executive Edit Mode</h3>
        <button class="btn btn-sm btn-outline" style="border:none; color:#fff; background:transparent;" onclick="document.getElementById('pw-modal').remove()">✕</button>
      </div>
      <div class="modal-body">
        <p style="font-size: 14.5px; color: var(--text-muted); margin-bottom: 12px;">
          Enter the management passkey to unlock inline editing, full NID/contact/bank PII visibility, and audited record updates.
        </p>
        <div style="margin-bottom: 14px;">
          <label style="font-size: 13px; font-weight: 700; color: var(--navy); display: block; margin-bottom: 4px;">Management Passkey</label>
          <input type="password" id="pw-input" placeholder="Enter passkey (default: ppbf2023)"
            style="width: 100%; padding: 10px 12px; border: 1px solid var(--border-medium); border-radius: 8px; font-size: 15px;"
            onkeydown="if(event.key==='Enter') submitPassword()" />
          <span style="font-size: 12px; color: var(--gold); display: block; margin-top: 6px;">Default passkey: <strong>ppbf2023</strong></span>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="document.getElementById('pw-modal').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="submitPassword()">Unlock Editing</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => {
    const inp = document.getElementById('pw-input');
    if (inp) inp.focus();
  }, 50);
}

function submitPassword() {
  const inp = document.getElementById('pw-input');
  if (inp && inp.value.trim() === EDIT_PASSWORD) {
    sessionStorage.setItem('ppbf_edit_mode', 'true');
    const modal = document.getElementById('pw-modal');
    if (modal) modal.remove();
    recordAudit("session", "auth", "edit_mode", "VIEW_ONLY", "UNLOCKED");
    saveData();
    showToast("Edit Mode unlocked. Sensitive fields visible & changes audited.");
    renderRoute();
  } else {
    showToast("Incorrect passkey. Please use 'ppbf2023'.");
  }
}

// Validation & Data Integrity Report Analyzer
function analyzeDataIntegrity(dataset) {
  const d = dataset || PPBF_DATA;
  const members = d.members || [];
  const serialsMap = d.share_serials || [];
  const src = d.source_summary || {
    distinct_profiles: 38,
    share_serials: 50,
    total_shares: 50,
    total_target: 1850000,
    paid: 1769000,
    due: 81000,
    profit: 1126937
  };

  // Duplicate IDs
  const idCounts = {};
  const duplicateIds = [];
  members.forEach(m => {
    const key = String(m.id);
    idCounts[key] = (idCounts[key] || 0) + 1;
    if (idCounts[key] === 2) duplicateIds.push(m.id);
  });

  // Serials coverage from member.serials + share_serials table
  const memberSerialCounts = {};
  const duplicateMemberSerials = [];
  const mismatchedSerialLinks = [];
  let sumShares = 0;

  members.forEach(m => {
    sumShares += Number(m.shares) || 0;
    const arr = Array.isArray(m.serials) ? m.serials : [];
    if (arr.length !== Number(m.shares)) {
      mismatchedSerialLinks.push(`Member #${m.id} (${m.en}): shares=${m.shares} vs serials.length=${arr.length}`);
    }
    arr.forEach(sn => {
      memberSerialCounts[sn] = (memberSerialCounts[sn] || 0) + 1;
      if (memberSerialCounts[sn] === 2) duplicateMemberSerials.push(sn);
    });
  });

  const missingSerials = [];
  for (let s = 1; s <= 50; s++) {
    if (!memberSerialCounts[s]) missingSerials.push(s);
  }

  // Calculated sums across stored members
  let calcPaid = 0;
  let calcDue = 0;
  let calcTotal = 0;
  let calcOwn = 0;
  let calcProfitFieldSum = 0;
  let calcPayout = 0;
  let calcFine = 0;
  let calcFinePaid = 0;
  const negativeDueMembers = [];

  const emptyCounts = {
    edu: 0,
    inst: 0,
    prof: 0,
    company: 0,
    email: 0,
    nid: 0,
    blood: 0,
    nom_name: 0,
    bank_acc: 0
  };

  members.forEach(m => {
    calcPaid += Number(m.paid) || 0;
    calcDue += Number(m.due) || 0;
    calcTotal += Number(m.total) || 0;
    calcOwn += Number(m.own) || 0;
    calcProfitFieldSum += Number(m.profit) || 0;
    calcPayout += Number(m.payout) || 0;
    calcFine += Number(m.fine) || 0;
    calcFinePaid += Number(m.finepaid) || 0;

    if (Number(m.due) < 0) {
      negativeDueMembers.push({ id: m.id, en: m.en, due: m.due });
    }
    if (!String(m.edu || "").trim()) emptyCounts.edu++;
    if (!String(m.inst || "").trim()) emptyCounts.inst++;
    if (!String(m.prof || "").trim()) emptyCounts.prof++;
    if (!String(m.company || "").trim()) emptyCounts.company++;
    if (!String(m.email || "").trim()) emptyCounts.email++;
    if (!String(m.nid || "").trim()) emptyCounts.nid++;
    if (!String(m.blood || "").trim()) emptyCounts.blood++;
    if (!m.nom || (!String(m.nom.en || "").trim() && !String(m.nom.bn || "").trim())) emptyCounts.nom_name++;
    if (!m.bank || !String(m.bank.acc || "").trim()) emptyCounts.bank_acc++;
  });

  return {
    profileCount: members.length,
    serialMappingCount: serialsMap.length,
    uniqueSerialCount: Object.keys(memberSerialCounts).length,
    totalSharesSum: sumShares,
    duplicateIds,
    duplicateMemberSerials,
    missingSerials,
    mismatchedSerialLinks,
    negativeDueMembers,
    emptyCounts,
    sourceSummary: src,
    calculated: {
      paid: calcPaid,
      due: calcDue,
      total: calcTotal,
      own: calcOwn,
      profitFieldSum: calcProfitFieldSum,
      payout: calcPayout,
      fine: calcFine,
      finePaid: calcFinePaid
    },
    isClean: duplicateIds.length === 0 &&
             duplicateMemberSerials.length === 0 &&
             missingSerials.length === 0 &&
             mismatchedSerialLinks.length === 0 &&
             members.length === 38 &&
             sumShares === 50
  };
}

// Toast Notifications
function showToast(msg) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container no-print';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✓</span><span>${escHtml(msg)}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// More Options Menu Toggle & Navigation
function toggleMoreMenu(forceOpen) {
  const panel = document.getElementById('more-menu-panel');
  const backdrop = document.getElementById('more-menu-backdrop');
  const btn = document.getElementById('more-menu-trigger');
  if (!panel || !backdrop) return;

  const isOpen = panel.classList.contains('open');
  const nextState = forceOpen !== undefined ? Boolean(forceOpen) : !isOpen;

  if (nextState) {
    panel.classList.add('open');
    backdrop.classList.add('open');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  } else {
    panel.classList.remove('open');
    backdrop.classList.remove('open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
  if (typeof updateNavActive === 'function' && typeof getActiveRoute === 'function') {
    updateNavActive(getActiveRoute());
  }
  if (typeof updateAndroidBackCapability === 'function') {
    updateAndroidBackCapability();
  }
}

const toggleThreeDotMenu = toggleMoreMenu;

function navigateTo(hash) {
  toggleMoreMenu(false);
  window.location.hash = hash;
}

const ROUTE_STACK = ['#/home'];

function updateAndroidBackCapability() {
  if (typeof window !== 'undefined' && window.AndroidApp && typeof window.AndroidApp.setCanGoBack === 'function') {
    const panel = document.getElementById('more-menu-panel');
    const isMenuOpen = Boolean(panel && panel.classList.contains('open'));
    const hasModal = Boolean(document.getElementById('pw-modal') || document.getElementById('import-modal'));
    const hash = (window.location && window.location.hash) || '#/home';
    const canBack = isMenuOpen || hasModal || hash !== '#/home' || ROUTE_STACK.length > 1;
    window.AndroidApp.setCanGoBack(canBack);
  }
}

function pushRouteHistory(hash) {
  if (!hash) return;
  if (ROUTE_STACK[ROUTE_STACK.length - 1] !== hash) {
    ROUTE_STACK.push(hash);
    if (ROUTE_STACK.length > 50) ROUTE_STACK.shift();
  }
  updateAndroidBackCapability();
}

function goBackOrHome() {
  toggleMoreMenu(false);
  if (ROUTE_STACK.length > 1) {
    ROUTE_STACK.pop();
    const prev = ROUTE_STACK[ROUTE_STACK.length - 1] || '#/home';
    window.location.hash = prev;
  } else {
    window.location.hash = '#/home';
  }
  updateAndroidBackCapability();
}

window.handleAndroidHardwareBack = function() {
  const pw = document.getElementById('pw-modal');
  if (pw) {
    pw.remove();
    updateAndroidBackCapability();
    return true;
  }
  const imp = document.getElementById('import-modal');
  if (imp) {
    imp.remove();
    updateAndroidBackCapability();
    return true;
  }
  const panel = document.getElementById('more-menu-panel');
  if (panel && panel.classList.contains('open')) {
    toggleMoreMenu(false);
    return true;
  }
  const hash = (window.location && window.location.hash) || '#/home';
  if (hash !== '#/home' || ROUTE_STACK.length > 1) {
    goBackOrHome();
    return true;
  }
  return false;
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    toggleMoreMenu(false);
    const pw = document.getElementById('pw-modal');
    if (pw) pw.remove();
    const imp = document.getElementById('import-modal');
    if (imp) imp.remove();
    updateAndroidBackCapability();
  }
});

// Unified Print Helper (supports Android WebView PrintManager bridge + Browser Print)
function printCurrentPage() {
  toggleThreeDotMenu(false);
  if (window.AndroidPrint && typeof window.AndroidPrint.printPage === 'function') {
    window.AndroidPrint.printPage();
  } else {
    window.print();
  }
}

function androidToggleLayout() {
  toggleThreeDotMenu(false);
  if (window.AndroidApp && typeof window.AndroidApp.toggleLayout === 'function') {
    window.AndroidApp.toggleLayout();
  }
}

function androidRefreshApp() {
  toggleThreeDotMenu(false);
  if (window.AndroidApp && typeof window.AndroidApp.refresh === 'function') {
    window.AndroidApp.refresh();
  } else {
    window.location.reload();
  }
}

// A4 Scaling Logic
function autoScaleA4() {
  const wrappers = document.querySelectorAll('.a4-screen-wrapper');
  wrappers.forEach(w => {
    const frame = w.querySelector('.a4-page-frame');
    if (!frame) return;
    const availWidth = w.clientWidth - 24;
    if (availWidth < 794) {
      const scale = Math.max(0.36, availWidth / 794);
      frame.style.transform = `scale(${scale})`;
      frame.style.transformOrigin = 'top center';
      w.style.height = `${Math.round(1122 * scale + 28)}px`;
    } else {
      frame.style.transform = 'none';
      w.style.height = 'auto';
    }
  });
}
window.addEventListener('resize', autoScaleA4);

// Export JSON Backup (uses Android SAF picker inside APK, Blob download on Web)
function exportDataJSON() {
  toggleMoreMenu(false);
  const fullBackup = {
    data: PPBF_DATA,
    photos: PPBF_PHOTOS,
    exported_at: new Date().toISOString(),
    version: "2.0-38profiles-50shares"
  };
  const filename = `PPBF_Cooperative_Database_${new Date().toISOString().split('T')[0]}.json`;
  const payloadStr = JSON.stringify(fullBackup, null, 2);
  if (window.AndroidApp && typeof window.AndroidApp.exportFile === 'function') {
    window.AndroidApp.exportFile(filename, 'application/json', payloadStr);
    showToast("Choose save location for JSON database backup...");
    return;
  }
  const blob = new Blob([payloadStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Full database JSON backup downloaded.");
}

// Export Member Dataset CSV (UTF-8 BOM preserves Bengali Unicode in Excel)
function exportMembersCSV() {
  toggleMoreMenu(false);
  const members = PPBF_DATA.members || [];
  const headers = [
    "id", "serials", "shares", "en", "bn", "father", "mother", "perm", "cur",
    "dob", "edu", "inst", "prof", "company", "mobile", "email", "blood", "join",
    "nid", "paid", "due", "total", "own", "profit", "payout", "pt", "fine", "finepaid",
    "nom_en", "nom_bn", "nom_rel", "nom_mobile", "bank_name", "bank_branch", "bank_type", "bank_acc"
  ];
  const csvEsc = (v) => {
    const s = v === null || v === undefined ? "" : String(v);
    return '"' + s.replace(/"/g, '""') + '"';
  };
  const rows = [headers.join(',')];
  members.forEach(m => {
    const nom = m.nom || {};
    const bank = m.bank || {};
    const vals = [
      m.id,
      Array.isArray(m.serials) ? m.serials.join('|') : '',
      m.shares,
      m.en, m.bn, m.father, m.mother, m.perm, m.cur,
      m.dob, m.edu, m.inst, m.prof, m.company, m.mobile, m.email, m.blood, m.join,
      m.nid, m.paid, m.due, m.total, m.own, m.profit, m.payout, m.pt, m.fine, m.finepaid,
      nom.en, nom.bn, nom.rel, nom.mobile, bank.bank, bank.branch, bank.type, bank.acc
    ].map(csvEsc);
    rows.push(vals.join(','));
  });
  const bom = "\uFEFF";
  const filename = `PPBF_Members_38Profiles_50Shares_${new Date().toISOString().split('T')[0]}.csv`;
  const csvStr = bom + rows.join('\r\n');
  if (window.AndroidApp && typeof window.AndroidApp.exportFile === 'function') {
    window.AndroidApp.exportFile(filename, 'text/csv', csvStr);
    showToast("Choose save location for UTF-8 CSV export...");
    return;
  }
  const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Member dataset exported as UTF-8 CSV.");
}

// Validated Import Modal with Preview, Duplicate Detection & Rollback
function openImportModal() {
  toggleThreeDotMenu(false);
  const existing = document.getElementById('import-modal');
  if (existing) existing.remove();
  PENDING_IMPORT_PAYLOAD = null;

  const hasRollback = Boolean(localStorage.getItem(ROLLBACK_KEY));

  const modal = document.createElement('div');
  modal.id = 'import-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-card" style="max-width: 600px;">
      <div class="modal-header">
        <h3 style="font-size: 18.5px; font-weight: 700; color: #fff;">Validated Data Import & Rollback</h3>
        <button class="btn btn-sm btn-outline" style="border:none; color:#fff; background:transparent;" onclick="document.getElementById('import-modal').remove()">✕</button>
      </div>
      <div class="modal-body">
        <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 14px;">
          Upload a PPBF JSON backup to preview member counts, share serial coverage, duplicate checks, and financial totals before applying. A pre-import snapshot is saved automatically for one-click rollback.
        </p>
        <label class="btn btn-outline" style="width: 100%; cursor: pointer; margin-bottom: 14px;">
          Select JSON Backup File
          <input type="file" accept=".json" style="display:none;" onchange="previewImportJSON(event)" />
        </label>
        <div id="import-preview-box" style="display:none; background: var(--ivory); border: 1px solid var(--border-medium); border-radius: 10px; padding: 14px; font-size: 13.5px;"></div>
        ${hasRollback ? `
          <div style="margin-top: 14px; padding: 10px 12px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;">
            <span style="font-size: 13px; color: #92400e; font-weight: 600;">Pre-import rollback snapshot available</span>
            <button class="btn btn-sm btn-danger" onclick="rollbackImport()">Rollback Snapshot</button>
          </div>
        ` : ''}
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="document.getElementById('import-modal').remove()">Close</button>
        <button class="btn btn-primary" id="apply-import-btn" style="display:none;" onclick="applyPendingImport()">Apply Validated Import</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function previewImportJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const previewBox = document.getElementById('import-preview-box');
    const applyBtn = document.getElementById('apply-import-btn');
    try {
      const parsed = JSON.parse(e.target.result);
      const dataCandidate = parsed.data ? parsed.data : parsed;
      const photosCandidate = parsed.photos || null;

      if (!dataCandidate || !Array.isArray(dataCandidate.members)) {
        throw new Error("Missing 'members' array in JSON payload.");
      }

      const report = analyzeDataIntegrity(dataCandidate);
      PENDING_IMPORT_PAYLOAD = { data: dataCandidate, photos: photosCandidate };

      if (previewBox) {
        previewBox.style.display = 'block';
        previewBox.innerHTML = `
          <div style="font-weight: 800; color: var(--navy); margin-bottom: 8px;">Import Validation Preview (${escHtml(file.name)})</div>
          <div>• Distinct Member Profiles: <strong>${report.profileCount}</strong></div>
          <div>• Unique Share Serials Covered: <strong>${report.uniqueSerialCount}</strong> (Total Shares: ${report.totalSharesSum})</div>
          <div>• Duplicate Member IDs: <strong style="color:${report.duplicateIds.length ? 'var(--tri-red)' : 'var(--tri-green)'}">${report.duplicateIds.length}</strong></div>
          <div>• Duplicate Share Serials: <strong style="color:${report.duplicateMemberSerials.length ? 'var(--tri-red)' : 'var(--tri-green)'}">${report.duplicateMemberSerials.length}</strong></div>
          <div>• Calculated Member Paid Sum: <strong>${formatTaka(report.calculated.paid)}</strong> | Due Sum: <strong>${formatTaka(report.calculated.due)}</strong></div>
          <div style="margin-top: 8px; color: ${report.isClean ? 'var(--tri-green)' : '#b45309'}; font-weight: 700;">
            ${report.isClean ? '✓ Passed schema & canonical count checks.' : '⚠ Warnings detected (see Admin Report if applied).'}
          </div>
        `;
      }
      if (applyBtn) applyBtn.style.display = 'inline-flex';
    } catch (err) {
      PENDING_IMPORT_PAYLOAD = null;
      if (applyBtn) applyBtn.style.display = 'none';
      if (previewBox) {
        previewBox.style.display = 'block';
        previewBox.innerHTML = `<span style="color:var(--tri-red); font-weight:700;">Invalid JSON file: ${escHtml(err.message)}</span>`;
      }
    }
  };
  reader.readAsText(file);
}

function applyPendingImport() {
  if (!PENDING_IMPORT_PAYLOAD) return;
  try {
    localStorage.setItem(ROLLBACK_KEY, JSON.stringify({ data: PPBF_DATA, photos: PPBF_PHOTOS, saved_at: new Date().toISOString() }));
    PPBF_DATA = PENDING_IMPORT_PAYLOAD.data;
    if (PENDING_IMPORT_PAYLOAD.photos) {
      PPBF_PHOTOS = PENDING_IMPORT_PAYLOAD.photos;
      localStorage.setItem(PHOTOS_KEY, JSON.stringify(PPBF_PHOTOS));
    }
    recordAudit("system", "import", "dataset", "previous_state", "imported_json");
    saveData();
    syncInvestments();
    const modal = document.getElementById('import-modal');
    if (modal) modal.remove();
    showToast("Database imported. Rollback snapshot saved.");
    renderRoute();
  } catch (err) {
    showToast("Import failed: " + err.message);
  }
}

function rollbackImport() {
  const snap = localStorage.getItem(ROLLBACK_KEY);
  if (!snap) {
    showToast("No pre-import snapshot found.");
    return;
  }
  try {
    const parsed = JSON.parse(snap);
    PPBF_DATA = parsed.data;
    PPBF_PHOTOS = parsed.photos || {};
    saveData();
    localStorage.setItem(PHOTOS_KEY, JSON.stringify(PPBF_PHOTOS));
    syncInvestments();
    const modal = document.getElementById('import-modal');
    if (modal) modal.remove();
    showToast("Rolled back to pre-import snapshot.");
    renderRoute();
  } catch (err) {
    showToast("Rollback error: " + err.message);
  }
}

function importDataJSON(event) {
  previewImportJSON(event);
}

function resetToSeed() {
  toggleThreeDotMenu(false);
  if (confirm("Are you sure you want to reset all data back to the original 38-member / 50-share cooperative seed? All current edits will be cleared.")) {
    PPBF_DATA = JSON.parse(JSON.stringify(SEED_DATA));
    PPBF_PHOTOS = {};
    saveData();
    localStorage.removeItem(PHOTOS_KEY);
    syncInvestments();
    showToast("Data restored to canonical 38-member / 50-share seed.");
    renderRoute();
  }
}

function shareApp() {
  toggleMoreMenu(false);
  const title = 'PPBF - Parania Para Business Forum';
  const text = 'Cooperative savings, 38-member / 50-share registry, investments, and A4 statements for Parania Para Business Forum (Est. 01/10/2022).';
  const url = window.location.href;
  if (window.AndroidApp && typeof window.AndroidApp.shareText === 'function') {
    window.AndroidApp.shareText(title, text, url.startsWith('file://') ? 'https://ppbf-2023-default-rtdb.asia-southeast1.firebasedatabase.app' : url);
    return;
  }
  if (navigator.share) {
    navigator.share({ title, text, url }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url);
    showToast("Application link copied to clipboard!");
  } else {
    showToast("URL: " + url);
  }
}

// Inline Edit Handlers for Investment Forms (Audited)
function updateFormField(invNo, field, val) {
  if (!isEditMode() || !PPBF_DATA.investments.forms[invNo]) return;
  const before = PPBF_DATA.investments.forms[invNo][field];
  PPBF_DATA.investments.forms[invNo][field] = val;
  recordAudit("investment_form", invNo, field, before, val);
  syncInvestments();
  showToast("Saved & audited.");
}

function updateRowField(invNo, rowIndex, field, val) {
  if (!isEditMode() || !PPBF_DATA.investments.forms[invNo]) return;
  const row = PPBF_DATA.investments.forms[invNo].rows[rowIndex];
  if (!row) return;
  const before = row[field];
  if (field === 'paid_amount') {
    row[field] = parseFloat(val) || 0;
  } else {
    row[field] = val;
  }
  recordAudit("investment_row", `${invNo}#${rowIndex + 1}`, field, before, row[field]);
  syncInvestments();
  renderRoute();
  showToast("Installment updated & audited.");
}

function handlePhotoUpload(key, inputElem) {
  if (!isEditMode()) return;
  const file = inputElem.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    savePhoto(key, e.target.result);
    recordAudit("photo", key, "image", "previous", "uploaded_image");
    saveData();
    showToast("Photo uploaded successfully.");
    renderRoute();
  };
  reader.readAsDataURL(file);
}

function removePhoto(key) {
  if (!isEditMode()) return;
  if (confirm("Delete this photo?")) {
    deletePhoto(key);
    recordAudit("photo", key, "image", "existing", "deleted");
    saveData();
    showToast("Photo removed.");
    renderRoute();
  }
}
