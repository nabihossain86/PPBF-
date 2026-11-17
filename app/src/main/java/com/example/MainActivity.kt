package com.example

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.print.PrintAttributes
import android.print.PrintManager
import android.webkit.JavascriptInterface
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import com.example.ui.theme.MyApplicationTheme
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject

class MainActivity : ComponentActivity() {

  private val ioScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
  private lateinit var syncManager: PPBFRealtimeSyncManager
  private var fileUploadCallback: ValueCallback<Array<Uri>>? = null
  private var pendingExportContent: String? = null

  private val fileChooserLauncher =
    registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
      val uris = WebChromeClient.FileChooserParams.parseResult(result.resultCode, result.data)
      fileUploadCallback?.onReceiveValue(uris)
      fileUploadCallback = null
    }

  private val exportDocumentLauncher =
    registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
      val content = pendingExportContent
      pendingExportContent = null
      val uri = result.data?.data
      if (result.resultCode == RESULT_OK && uri != null && content != null) {
        ioScope.launch {
          val ok = try {
            contentResolver.openOutputStream(uri)?.use { out ->
              out.write(content.toByteArray(Charsets.UTF_8))
              out.flush()
            }
            true
          } catch (_: Exception) {
            false
          }
          withContext(Dispatchers.Main) {
            val msg = if (ok) "Export saved successfully." else "Could not write export file."
            Toast.makeText(this@MainActivity, msg, Toast.LENGTH_SHORT).show()
          }
        }
      }
    }

  fun requestFileChooser(
    filePathCallback: ValueCallback<Array<Uri>>?,
    fileChooserParams: WebChromeClient.FileChooserParams?
  ) {
    fileUploadCallback?.onReceiveValue(null)
    fileUploadCallback = filePathCallback
    val intent = fileChooserParams?.createIntent() ?: Intent(Intent.ACTION_GET_CONTENT).apply {
      type = "*/*"
      addCategory(Intent.CATEGORY_OPENABLE)
    }
    try {
      fileChooserLauncher.launch(intent)
    } catch (_: Exception) {
      fileUploadCallback?.onReceiveValue(null)
      fileUploadCallback = null
    }
  }

  fun launchExportPicker(filename: String, mimeType: String, content: String) {
    pendingExportContent = content
    val intent = Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
      addCategory(Intent.CATEGORY_OPENABLE)
      type = mimeType.ifBlank { "application/octet-stream" }
      putExtra(Intent.EXTRA_TITLE, filename.ifBlank { "ppbf_export.json" })
    }
    try {
      exportDocumentLauncher.launch(intent)
    } catch (_: Exception) {
      pendingExportContent = null
      Toast.makeText(this, "No document picker available on this device.", Toast.LENGTH_SHORT).show()
    }
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()

    syncManager = PPBFRealtimeSyncManager(this).apply {
      initialize()
      attemptAutoSignIn()
    }

    setContent {
      MyApplicationTheme {
        PPBFAppScreen(
          activity = this,
          syncManager = syncManager,
          onFileChooser = { callback, params -> requestFileChooser(callback, params) },
          onExportFile = { filename, mimeType, content -> launchExportPicker(filename, mimeType, content) }
        )
      }
    }
  }

  override fun onDestroy() {
    if (::syncManager.isInitialized) {
      syncManager.release()
    }
    super.onDestroy()
  }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun PPBFAppScreen(
  activity: MainActivity,
  syncManager: PPBFRealtimeSyncManager,
  onFileChooser: (ValueCallback<Array<Uri>>?, WebChromeClient.FileChooserParams?) -> Unit,
  onExportFile: (String, String, String) -> Unit
) {
  var webViewInstance by remember { mutableStateOf<WebView?>(null) }
  var isDesktopLayout by remember { mutableStateOf(false) }
  var webPageLoaded by remember { mutableStateOf(false) }
  var minSplashElapsed by remember { mutableStateOf(false) }
  var canHandleInAppBack by remember { mutableStateOf(false) }

  LaunchedEffect(Unit) {
    delay(800L)
    minSplashElapsed = true
  }

  val showSplash = !(webPageLoaded && minSplashElapsed)

  val targetAssetUrl = if (isDesktopLayout) {
    "file:///android_asset/PPBF_Desktop.html"
  } else {
    "file:///android_asset/PPBF_Mobile.html"
  }

  fun pushJsEvent(script: String) {
    val wv = webViewInstance ?: return
    wv.post {
      wv.evaluateJavascript(script, null)
    }
  }

  LaunchedEffect(webViewInstance) {
    syncManager.onStatusChanged = { status ->
      pushJsEvent("window.onAndroidCloudStatus && window.onAndroidCloudStatus(${JSONObject.quote(status.toJsonString())});")
    }
    syncManager.onRemoteDataSnapshot = { dataJson, metaJson ->
      pushJsEvent(
        "window.onAndroidCloudData && window.onAndroidCloudData(${JSONObject.quote(dataJson)}, ${JSONObject.quote(metaJson)});"
      )
    }
    syncManager.onRemotePhotosSnapshot = { photosJson ->
      pushJsEvent("window.onAndroidCloudPhotos && window.onAndroidCloudPhotos(${JSONObject.quote(photosJson)});")
    }
  }

  BackHandler(enabled = canHandleInAppBack || (webViewInstance?.canGoBack() == true)) {
    val wv = webViewInstance
    if (wv != null) {
      wv.evaluateJavascript(
        "(function(){ return window.handleAndroidHardwareBack ? window.handleAndroidHardwareBack() : false; })()"
      ) { result ->
        if (result != "true") {
          if (wv.canGoBack()) {
            wv.goBack()
          } else {
            canHandleInAppBack = false
          }
        }
      }
    }
  }

  Surface(
    modifier = Modifier.fillMaxSize(),
    color = Color(0xFF0B2545)
  ) {
    Box(
      modifier = Modifier
        .fillMaxSize()
        .windowInsetsPadding(WindowInsets.safeDrawing)
    ) {
      AndroidView(
        modifier = Modifier
          .fillMaxSize()
          .testTag("ppbf_webview"),
        factory = { ctx ->
          WebView(ctx).apply {
            settings.apply {
              javaScriptEnabled = true
              domStorageEnabled = true
              allowFileAccess = true
              allowContentAccess = true
              useWideViewPort = true
              loadWithOverviewMode = true
              cacheMode = WebSettings.LOAD_DEFAULT
              displayZoomControls = false
              builtInZoomControls = true
              setSupportZoom(true)
            }

            addJavascriptInterface(object {
              @JavascriptInterface
              fun printPage() {
                activity.runOnUiThread {
                  val printManager = activity.getSystemService(Context.PRINT_SERVICE) as? PrintManager
                  val jobName = "PPBF Document " + System.currentTimeMillis()
                  val printAdapter = createPrintDocumentAdapter(jobName)
                  printManager?.print(jobName, printAdapter, PrintAttributes.Builder().build())
                }
              }
            }, "AndroidPrint")

            addJavascriptInterface(object {
              @JavascriptInterface
              fun toggleLayout() {
                activity.runOnUiThread {
                  isDesktopLayout = !isDesktopLayout
                }
              }

              @JavascriptInterface
              fun refresh() {
                activity.runOnUiThread {
                  reload()
                }
              }

              @JavascriptInterface
              fun isDesktopLayout(): Boolean = isDesktopLayout

              @JavascriptInterface
              fun setCanGoBack(canBack: Boolean) {
                activity.runOnUiThread {
                  canHandleInAppBack = canBack
                }
              }

              @JavascriptInterface
              fun exportFile(filename: String, mimeType: String, content: String) {
                activity.runOnUiThread {
                  onExportFile(filename, mimeType, content)
                }
              }

              @JavascriptInterface
              fun shareText(title: String, text: String, url: String) {
                activity.runOnUiThread {
                  val shareIntent = Intent(Intent.ACTION_SEND).apply {
                    type = "text/plain"
                    putExtra(Intent.EXTRA_SUBJECT, title)
                    putExtra(Intent.EXTRA_TEXT, "$text\n$url".trim())
                  }
                  try {
                    activity.startActivity(Intent.createChooser(shareIntent, title.ifBlank { "Share PPBF" }))
                  } catch (_: Exception) {
                  }
                }
              }
            }, "AndroidApp")

            addJavascriptInterface(object {
              @JavascriptInterface
              fun getStatusJson(): String = syncManager.status.value.toJsonString()

              @JavascriptInterface
              fun signInWithGoogle() {
                activity.runOnUiThread {
                  syncManager.signInWithGoogle(activity)
                }
              }

              @JavascriptInterface
              fun signOut() {
                activity.runOnUiThread {
                  syncManager.signOut()
                }
              }

              @JavascriptInterface
              fun pushData(dataJson: String, metaJson: String) {
                syncManager.pushData(dataJson, metaJson)
              }

              @JavascriptInterface
              fun pushPhotos(photosJson: String) {
                syncManager.pushPhotos(photosJson)
              }

              @JavascriptInterface
              fun pullNow() {
                activity.runOnUiThread {
                  syncManager.pullNow()
                }
              }
            }, "AndroidFirebaseSync")

            webViewClient = object : WebViewClient() {
              override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                webPageLoaded = true
                val statusJson = syncManager.status.value.toJsonString()
                view?.evaluateJavascript(
                  "window.onAndroidCloudStatus && window.onAndroidCloudStatus(${JSONObject.quote(statusJson)});",
                  null
                )
              }

              override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false
                if (url.startsWith("file://") || url.contains("#")) {
                  return false
                }
                val action = when {
                  url.startsWith("tel:") -> Intent.ACTION_DIAL
                  url.startsWith("mailto:") -> Intent.ACTION_SENDTO
                  else -> Intent.ACTION_VIEW
                }
                return try {
                  ctx.startActivity(Intent(action, Uri.parse(url)))
                  true
                } catch (_: Exception) {
                  false
                }
              }
            }

            webChromeClient = object : WebChromeClient() {
              override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
              ): Boolean {
                onFileChooser(filePathCallback, fileChooserParams)
                return true
              }
            }

            loadUrl(targetAssetUrl)
            webViewInstance = this
          }
        },
        update = { wv ->
          val currentUrl = wv.url ?: ""
          val expectedFile = if (isDesktopLayout) "PPBF_Desktop.html" else "PPBF_Mobile.html"
          if (!currentUrl.contains(expectedFile)) {
            wv.loadUrl(targetAssetUrl)
          }
        }
      )

      AnimatedVisibility(
        visible = showSplash,
        exit = fadeOut(animationSpec = tween(durationMillis = 320))
      ) {
        PPBFSplashOverlay()
      }
    }
  }
}

@Composable
fun PPBFSplashOverlay() {
  Box(
    modifier = Modifier
      .fillMaxSize()
      .background(
        Brush.verticalGradient(
          colors = listOf(Color(0xFF07192F), Color(0xFF0B2545), Color(0xFF13386A))
        )
      )
      .testTag("ppbf_splash_overlay"),
    contentAlignment = Alignment.Center
  ) {
    Column(
      horizontalAlignment = Alignment.CenterHorizontally,
      verticalArrangement = Arrangement.Center,
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 28.dp)
    ) {
      Surface(
        shape = CircleShape,
        color = Color.White,
        shadowElevation = 12.dp,
        modifier = Modifier.size(124.dp)
      ) {
        Image(
          painter = painterResource(id = R.drawable.ic_ppbf_logo),
          contentDescription = "PPBF Official Seal",
          contentScale = ContentScale.Fit,
          modifier = Modifier
            .fillMaxSize()
            .padding(8.dp)
            .clip(CircleShape)
        )
      }

      Spacer(modifier = Modifier.height(22.dp))

      Text(
        text = "বিসমিল্লাহির রাহমানির রাহীম",
        color = Color(0xFFD4A359),
        fontSize = 16.sp,
        fontWeight = FontWeight.SemiBold,
        textAlign = TextAlign.Center
      )

      Spacer(modifier = Modifier.height(6.dp))

      Text(
        text = "পরানিয়া পাড়া বিজনেস ফোরাম",
        color = Color.White,
        fontSize = 25.sp,
        fontWeight = FontWeight.Bold,
        textAlign = TextAlign.Center
      )

      Spacer(modifier = Modifier.height(4.dp))

      Text(
        text = "PARANIA PARA BUSINESS FORUM • EST. 2022",
        color = Color(0xFFD4A359),
        fontSize = 12.sp,
        fontWeight = FontWeight.Bold,
        letterSpacing = 1.4.sp,
        textAlign = TextAlign.Center
      )

      Spacer(modifier = Modifier.height(18.dp))

      Row(
        modifier = Modifier
          .width(180.dp)
          .height(4.dp)
          .clip(RoundedCornerShape(4.dp))
      ) {
        Box(modifier = Modifier.weight(1f).fillMaxSize().background(Color(0xFFE11D48)))
        Box(modifier = Modifier.weight(1f).fillMaxSize().background(Color(0xFFF59E0B)))
        Box(modifier = Modifier.weight(1f).fillMaxSize().background(Color(0xFF0E9F5C)))
      }

      Spacer(modifier = Modifier.height(24.dp))

      Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(10.dp),
        modifier = Modifier
          .clip(RoundedCornerShape(999.dp))
          .background(Color.White.copy(alpha = 0.1f))
          .padding(horizontal = 16.dp, vertical = 9.dp)
      ) {
        CircularProgressIndicator(
          modifier = Modifier.size(16.dp),
          color = Color(0xFFD4A359),
          strokeWidth = 2.dp
        )
        Text(
          text = "Loading Executive Portal & Cloud Sync...",
          color = Color.White.copy(alpha = 0.9f),
          fontSize = 13.sp,
          fontWeight = FontWeight.Medium
        )
      }
    }
  }
}
