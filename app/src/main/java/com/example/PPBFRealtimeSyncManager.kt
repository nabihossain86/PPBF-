package com.example

import android.app.Activity
import android.content.Context
import android.util.Log
import androidx.credentials.ClearCredentialStateRequest
import androidx.credentials.CredentialManager
import androidx.credentials.CustomCredential
import androidx.credentials.GetCredentialRequest
import androidx.credentials.exceptions.GetCredentialCancellationException
import com.google.android.libraries.identity.googleid.GetGoogleIdOption
import com.google.android.libraries.identity.googleid.GetSignInWithGoogleOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential.Companion.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL
import com.google.firebase.Firebase
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.auth.auth
import com.google.firebase.database.DataSnapshot
import com.google.firebase.database.DatabaseError
import com.google.firebase.database.DatabaseReference
import com.google.firebase.database.FirebaseDatabase
import com.google.firebase.database.ValueEventListener
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.NonCancellable
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject

data class CloudSyncStatus(
  val platform: String = "android",
  val firebaseInitialized: Boolean = false,
  val isConnected: Boolean = false,
  val isSignedIn: Boolean = false,
  val uid: String = "",
  val email: String = "",
  val displayName: String = "",
  val databaseUrl: String = "",
  val lastSyncAt: String = "",
  val syncState: String = "initializing",
  val lastError: String = "",
  val isAuthLoading: Boolean = false
) {
  fun toJsonString(): String {
    return JSONObject().apply {
      put("platform", platform)
      put("firebaseInitialized", firebaseInitialized)
      put("isConnected", isConnected)
      put("isSignedIn", isSignedIn)
      put("uid", uid)
      put("email", email)
      put("displayName", displayName)
      put("databaseUrl", databaseUrl)
      put("lastSyncAt", lastSyncAt)
      put("syncState", syncState)
      put("lastError", lastError)
      put("isAuthLoading", isAuthLoading)
    }.toString()
  }
}

class PPBFRealtimeSyncManager(context: Context) {

  private val appContext = context.applicationContext
  private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)
  private val credentialManager = CredentialManager.create(appContext)

  private val _status = MutableStateFlow(CloudSyncStatus())
  val status: StateFlow<CloudSyncStatus> = _status.asStateFlow()

  private var auth: FirebaseAuth? = null
  private var database: FirebaseDatabase? = null
  private var portalRef: DatabaseReference? = null
  private var dataRef: DatabaseReference? = null
  private var photosRef: DatabaseReference? = null
  private var metaRef: DatabaseReference? = null
  private var connectedRef: DatabaseReference? = null

  private var authListener: FirebaseAuth.AuthStateListener? = null
  private var connectedListener: ValueEventListener? = null
  private var dataListener: ValueEventListener? = null
  private var photosListener: ValueEventListener? = null
  private var metaListener: ValueEventListener? = null

  var onStatusChanged: ((CloudSyncStatus) -> Unit)? = null
  var onRemoteDataSnapshot: ((dataJson: String, metaJson: String) -> Unit)? = null
  var onRemotePhotosSnapshot: ((photosJson: String) -> Unit)? = null

  private var latestMetaJson: String = "{}"
  private var latestDataHash: Int = 0
  private var latestPhotosHash: Int = 0
  private var lastPushedDataHash: Int = 0
  private var lastPushedPhotosHash: Int = 0

  fun initialize() {
    val dbUrl = try {
      appContext.getString(R.string.firebase_database_url)
    } catch (_: Exception) {
      DEFAULT_RTDB_URL
    }

    try {
      val firebaseAuth = Firebase.auth
      val db = FirebaseDatabase.getInstance(dbUrl).also { instance ->
        synchronized(LOCK) {
          if (!persistenceInitialized) {
            try {
              instance.setPersistenceEnabled(true)
            } catch (_: Exception) {
              // Already initialized in this process
            }
            persistenceInitialized = true
          }
        }
      }

      auth = firebaseAuth
      database = db
      portalRef = db.getReference(RTDB_PORTAL_ROOT).apply {
        try {
          keepSynced(true)
        } catch (_: Exception) {
        }
      }
      dataRef = portalRef?.child("data")
      photosRef = portalRef?.child("photos")
      metaRef = portalRef?.child("meta")
      connectedRef = db.getReference(".info/connected")

      updateStatus {
        it.copy(
          firebaseInitialized = true,
          databaseUrl = dbUrl,
          syncState = "ready"
        )
      }

      attachAuthListener()
      attachConnectionListener()
      attachRealtimeListeners()
    } catch (e: Exception) {
      Log.w(TAG, "Firebase initialization fallback to offline mode: ${e.message}")
      updateStatus {
        it.copy(
          firebaseInitialized = false,
          databaseUrl = dbUrl,
          syncState = "offline_local",
          lastError = e.localizedMessage ?: "Firebase unavailable"
        )
      }
    }
  }

  private fun attachAuthListener() {
    val firebaseAuth = auth ?: return
    authListener?.let { firebaseAuth.removeAuthStateListener(it) }
    val listener = FirebaseAuth.AuthStateListener { fa ->
      val user = fa.currentUser
      applyUserToStatus(user)
      if (user != null) {
        attachRealtimeListeners()
      }
    }
    authListener = listener
    firebaseAuth.addAuthStateListener(listener)
    applyUserToStatus(firebaseAuth.currentUser)
  }

  private fun applyUserToStatus(user: FirebaseUser?) {
    updateStatus {
      it.copy(
        isSignedIn = user != null,
        uid = user?.uid.orEmpty(),
        email = user?.email.orEmpty(),
        displayName = user?.displayName.orEmpty(),
        syncState = if (user != null) (if (it.isConnected) "live_synced" else "cached_offline") else it.syncState
      )
    }
  }

  private fun attachConnectionListener() {
    val ref = connectedRef ?: return
    connectedListener?.let { ref.removeEventListener(it) }
    val listener = object : ValueEventListener {
      override fun onDataChange(snapshot: DataSnapshot) {
        val connected = snapshot.getValue(Boolean::class.java) ?: false
        updateStatus {
          it.copy(
            isConnected = connected,
            syncState = when {
              connected && it.isSignedIn -> "live_synced"
              connected -> "connected_readonly"
              else -> "offline_cached"
            }
          )
        }
      }

      override fun onCancelled(error: DatabaseError) {
        Log.w(TAG, "Connection listener cancelled: ${error.message}")
      }
    }
    connectedListener = listener
    ref.addValueEventListener(listener)
  }

  private fun attachRealtimeListeners() {
    val mRef = metaRef
    val dRef = dataRef
    val pRef = photosRef

    if (mRef != null) {
      metaListener?.let { mRef.removeEventListener(it) }
      val listener = object : ValueEventListener {
        override fun onDataChange(snapshot: DataSnapshot) {
          val value = snapshot.value
          if (value != null) {
            val metaObj = anyToJsonValue(value) as? JSONObject ?: JSONObject()
            latestMetaJson = metaObj.toString()
            val updatedAt = metaObj.optString("updated_at", "")
            if (updatedAt.isNotBlank()) {
              updateStatus { it.copy(lastSyncAt = updatedAt) }
            }
          }
        }

        override fun onCancelled(error: DatabaseError) {
          Log.w(TAG, "Meta listener cancelled: ${error.message}")
        }
      }
      metaListener = listener
      mRef.addValueEventListener(listener)
    }

    if (dRef != null) {
      dataListener?.let { dRef.removeEventListener(it) }
      val listener = object : ValueEventListener {
        override fun onDataChange(snapshot: DataSnapshot) {
          val raw = snapshot.value ?: return
          val jsonVal = anyToJsonValue(raw)
          if (jsonVal is JSONObject && jsonVal.has("members")) {
            val serialized = jsonVal.toString()
            val h = serialized.hashCode()
            if (h != latestDataHash && h != lastPushedDataHash) {
              latestDataHash = h
              updateStatus {
                it.copy(
                  syncState = if (it.isConnected) "live_synced" else "offline_cached",
                  lastError = ""
                )
              }
              onRemoteDataSnapshot?.invoke(serialized, latestMetaJson)
            }
          }
        }

        override fun onCancelled(error: DatabaseError) {
          val msg = error.message
          Log.w(TAG, "Data listener cancelled: $msg")
          updateStatus {
            it.copy(lastError = if (error.code == DatabaseError.PERMISSION_DENIED) "Sign in with Google for cloud read/write sync" else msg)
          }
        }
      }
      dataListener = listener
      dRef.addValueEventListener(listener)
    }

    if (pRef != null) {
      photosListener?.let { pRef.removeEventListener(it) }
      val listener = object : ValueEventListener {
        override fun onDataChange(snapshot: DataSnapshot) {
          val raw = snapshot.value ?: return
          val jsonVal = anyToJsonValue(raw)
          if (jsonVal is JSONObject) {
            val serialized = jsonVal.toString()
            val h = serialized.hashCode()
            if (h != latestPhotosHash && h != lastPushedPhotosHash) {
              latestPhotosHash = h
              onRemotePhotosSnapshot?.invoke(serialized)
            }
          }
        }

        override fun onCancelled(error: DatabaseError) {
          Log.w(TAG, "Photos listener cancelled: ${error.message}")
        }
      }
      photosListener = listener
      pRef.addValueEventListener(listener)
    }
  }

  fun attemptAutoSignIn() {
    val firebaseAuth = auth ?: return
    if (firebaseAuth.currentUser != null) return
    val clientId = try {
      appContext.getString(R.string.default_web_client_id)
    } catch (_: Exception) {
      return
    }
    if (clientId.isBlank()) return

    val googleIdOption = GetGoogleIdOption.Builder()
      .setFilterByAuthorizedAccounts(true)
      .setServerClientId(clientId)
      .setAutoSelectEnabled(true)
      .build()
    val request = GetCredentialRequest.Builder()
      .addCredentialOption(googleIdOption)
      .build()

    scope.launch {
      try {
        val cred = credentialManager.getCredential(appContext, request).credential
        if (cred is CustomCredential && cred.type == TYPE_GOOGLE_ID_TOKEN_CREDENTIAL) {
          val token = GoogleIdTokenCredential.createFrom(cred.data).idToken
          firebaseAuth.signInWithCredential(GoogleAuthProvider.getCredential(token, null)).await()
        }
      } catch (e: CancellationException) {
        throw e
      } catch (_: Exception) {
        // Silent auto sign-in unavailable on clean device; user can sign in interactively anytime
      }
    }
  }

  fun signInWithGoogle(activity: Activity) {
    val firebaseAuth = auth
    if (firebaseAuth == null) {
      updateStatus { it.copy(lastError = "Firebase Auth unavailable on this device") }
      return
    }
    val clientId = try {
      appContext.getString(R.string.default_web_client_id)
    } catch (_: Exception) {
      updateStatus { it.copy(lastError = "Missing default_web_client_id in configuration") }
      return
    }

    val signInOption = GetSignInWithGoogleOption.Builder(serverClientId = clientId).build()
    val request = GetCredentialRequest.Builder()
      .addCredentialOption(signInOption)
      .build()

    updateStatus { it.copy(isAuthLoading = true, lastError = "") }

    scope.launch {
      try {
        val cred = credentialManager.getCredential(activity, request).credential
        if (cred is CustomCredential && cred.type == TYPE_GOOGLE_ID_TOKEN_CREDENTIAL) {
          val token = GoogleIdTokenCredential.createFrom(cred.data).idToken
          firebaseAuth.signInWithCredential(GoogleAuthProvider.getCredential(token, null)).await()
          updateStatus {
            it.copy(
              isAuthLoading = false,
              lastError = "",
              syncState = if (it.isConnected) "live_synced" else "offline_cached"
            )
          }
        } else {
          updateStatus {
            it.copy(isAuthLoading = false, lastError = "Unexpected credential response")
          }
        }
      } catch (e: GetCredentialCancellationException) {
        Log.w(TAG, "Google Sign-In flow cancelled or dismissed: ${e.message}", e)
        updateStatus {
          it.copy(isAuthLoading = false, lastError = "Sign-in was cancelled. Select an account to continue.")
        }
      } catch (e: CancellationException) {
        throw e
      } catch (e: Exception) {
        Log.e(TAG, "Google Sign-In failed", e)
        updateStatus {
          it.copy(isAuthLoading = false, lastError = e.localizedMessage ?: "Google Sign-In failed")
        }
      }
    }
  }

  fun signOut() {
    val firebaseAuth = auth ?: return
    scope.launch {
      withContext(NonCancellable) {
        try {
          credentialManager.clearCredentialState(ClearCredentialStateRequest())
        } catch (e: Exception) {
          Log.w(TAG, "Failed to clear credential state: ${e.message}")
        } finally {
          firebaseAuth.signOut()
          updateStatus {
            it.copy(
              isSignedIn = false,
              uid = "",
              email = "",
              displayName = "",
              syncState = if (it.isConnected) "connected_readonly" else "offline_cached"
            )
          }
        }
      }
    }
  }

  fun pushData(dataJson: String, metaJson: String) {
    val pRef = portalRef ?: return
    val currentUser = auth?.currentUser ?: return
    if (dataJson.isBlank()) return

    scope.launch(Dispatchers.IO) {
      try {
        val dataObj = JSONObject(dataJson)
        val parsedMeta = if (metaJson.isNotBlank()) JSONObject(metaJson) else JSONObject()
        val nowIso = parsedMeta.optString("updated_at", "").ifBlank {
          java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", java.util.Locale.US).apply {
            timeZone = java.util.TimeZone.getTimeZone("UTC")
          }.format(java.util.Date())
        }
        val metaMap = jsonObjectToMap(parsedMeta).toMutableMap()
        metaMap["updated_at"] = nowIso
        metaMap["updated_by_uid"] = currentUser.uid
        metaMap["updated_by_email"] = currentUser.email.orEmpty()
        metaMap["updated_by_name"] = currentUser.displayName.orEmpty()
        metaMap["device_type"] = "android"

        val dataMap = jsonObjectToMap(dataObj)
        lastPushedDataHash = dataJson.hashCode()
        latestDataHash = lastPushedDataHash

        val childUpdates = mapOf(
          "data" to dataMap,
          "meta" to metaMap
        )
        pRef.updateChildren(childUpdates).await()

        withContext(Dispatchers.Main) {
          updateStatus {
            it.copy(
              lastSyncAt = nowIso,
              syncState = if (it.isConnected) "live_synced" else "offline_queued",
              lastError = ""
            )
          }
        }
      } catch (e: CancellationException) {
        throw e
      } catch (e: Exception) {
        Log.w(TAG, "Cloud data push error: ${e.message}", e)
        withContext(Dispatchers.Main) {
          updateStatus { it.copy(lastError = e.localizedMessage ?: "Cloud push failed") }
        }
      }
    }
  }

  fun pushPhotos(photosJson: String) {
    val phRef = photosRef ?: return
    if (auth?.currentUser == null || photosJson.isBlank()) return

    scope.launch(Dispatchers.IO) {
      try {
        val photosObj = JSONObject(photosJson)
        val photosMap = jsonObjectToMap(photosObj)
        lastPushedPhotosHash = photosJson.hashCode()
        latestPhotosHash = lastPushedPhotosHash
        phRef.setValue(photosMap).await()
      } catch (e: CancellationException) {
        throw e
      } catch (e: Exception) {
        Log.w(TAG, "Cloud photos push error: ${e.message}", e)
      }
    }
  }

  fun pullNow() {
    val pRef = portalRef ?: return
    scope.launch {
      try {
        updateStatus { it.copy(syncState = "syncing", lastError = "") }
        val snap = pRef.get().await()
        val rawMeta = snap.child("meta").value
        val metaStr = if (rawMeta != null) (anyToJsonValue(rawMeta) as? JSONObject)?.toString() ?: "{}" else "{}"
        latestMetaJson = metaStr

        val rawData = snap.child("data").value
        if (rawData != null) {
          val dataObj = anyToJsonValue(rawData) as? JSONObject
          if (dataObj != null && dataObj.has("members")) {
            val dataStr = dataObj.toString()
            latestDataHash = dataStr.hashCode()
            onRemoteDataSnapshot?.invoke(dataStr, metaStr)
          }
        }

        val rawPhotos = snap.child("photos").value
        if (rawPhotos != null) {
          val phObj = anyToJsonValue(rawPhotos) as? JSONObject
          if (phObj != null) {
            val phStr = phObj.toString()
            latestPhotosHash = phStr.hashCode()
            onRemotePhotosSnapshot?.invoke(phStr)
          }
        }

        updateStatus {
          it.copy(
            syncState = if (it.isConnected) "live_synced" else "offline_cached",
            lastError = ""
          )
        }
      } catch (e: CancellationException) {
        throw e
      } catch (e: Exception) {
        Log.w(TAG, "Manual cloud pull failed: ${e.message}", e)
        updateStatus {
          it.copy(
            syncState = if (it.isConnected) "connected_readonly" else "offline_cached",
            lastError = e.localizedMessage ?: "Cloud pull failed"
          )
        }
      }
    }
  }

  fun release() {
    authListener?.let { auth?.removeAuthStateListener(it) }
    connectedListener?.let { connectedRef?.removeEventListener(it) }
    dataListener?.let { dataRef?.removeEventListener(it) }
    photosListener?.let { photosRef?.removeEventListener(it) }
    metaListener?.let { metaRef?.removeEventListener(it) }
  }

  private fun updateStatus(transform: (CloudSyncStatus) -> CloudSyncStatus) {
    val updated = transform(_status.value)
    _status.value = updated
    onStatusChanged?.invoke(updated)
  }

  companion object {
    private const val TAG = "PPBFRealtimeSync"
    private const val RTDB_PORTAL_ROOT = "ppbf_portal"
    private const val DEFAULT_RTDB_URL = "https://ppbf-2023-default-rtdb.asia-southeast1.firebasedatabase.app"
    private val LOCK = Any()
    @Volatile
    private var persistenceInitialized = false

    internal fun jsonObjectToMap(obj: JSONObject): Map<String, Any?> {
      val map = LinkedHashMap<String, Any?>()
      val keys = obj.keys()
      while (keys.hasNext()) {
        val k = keys.next()
        val v = obj.opt(k)
        map[k] = when (v) {
          null, JSONObject.NULL -> null
          is JSONObject -> jsonObjectToMap(v)
          is JSONArray -> jsonArrayToList(v)
          else -> v
        }
      }
      return map
    }

    internal fun jsonArrayToList(arr: JSONArray): List<Any?> {
      val list = ArrayList<Any?>(arr.length())
      for (i in 0 until arr.length()) {
        val v = arr.opt(i)
        list.add(
          when (v) {
            null, JSONObject.NULL -> null
            is JSONObject -> jsonObjectToMap(v)
            is JSONArray -> jsonArrayToList(v)
            else -> v
          }
        )
      }
      return list
    }

    internal fun anyToJsonValue(value: Any?): Any {
      return when (value) {
        null -> JSONObject.NULL
        is Map<*, *> -> {
          val obj = JSONObject()
          value.forEach { (k, v) ->
            if (k != null && v != null) {
              obj.put(k.toString(), anyToJsonValue(v))
            }
          }
          obj
        }
        is Iterable<*> -> {
          val arr = JSONArray()
          value.forEach { item ->
            arr.put(anyToJsonValue(item))
          }
          arr
        }
        is Boolean, is Number, is String -> value
        else -> value.toString()
      }
    }
  }
}
