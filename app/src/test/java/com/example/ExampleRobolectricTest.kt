package com.example

import android.content.Context
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onNodeWithTag
import androidx.test.core.app.ApplicationProvider
import org.json.JSONArray
import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
class ExampleRobolectricTest {

  @get:Rule
  val composeTestRule = createAndroidComposeRule<MainActivity>()

  @Test
  fun `verify app identity and firebase resources`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    assertEquals("PPBF", context.getString(R.string.app_name))
    assertEquals("com.forum.ppbf", context.packageName)
    assertEquals(
      "https://ppbf-2023-default-rtdb.asia-southeast1.firebasedatabase.app",
      context.getString(R.string.firebase_database_url)
    )
    val webClientId = context.getString(R.string.default_web_client_id)
    assertTrue("Expected valid Google OAuth client ID", webClientId.endsWith(".apps.googleusercontent.com"))
  }

  @Test
  fun `verify bundled web portals exist in android assets`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val mobileHtml = context.assets.open("PPBF_Mobile.html").bufferedReader().use { it.readText() }
    val desktopHtml = context.assets.open("PPBF_Desktop.html").bufferedReader().use { it.readText() }
    assertTrue(mobileHtml.contains("পরানিয়া পাড়া বিজনেস ফোরাম"))
    assertTrue(desktopHtml.contains("ppbf-2023-default-rtdb"))
    assertTrue(mobileHtml.contains("handleAndroidHardwareBack"))
    assertTrue(desktopHtml.contains("AndroidFirebaseSync"))
  }

  @Test
  fun `verify realtime database json roundtrip fidelity preserves nested members yrs ledger and negative due`() {
    val original = JSONObject().apply {
      put(
        "members",
        JSONArray().put(
          JSONObject().apply {
            put("id", 10)
            put("en", "Member Ten")
            put("paid", 49500)
            put("due", -1250)
            put("own", 2.040816)
            put(
              "yrs",
              JSONObject().apply {
                put("2022", JSONArray().put(0).put(1000).put(1000))
              }
            )
            put(
              "ledger",
              JSONArray().put(
                JSONObject().apply {
                  put("s", 10)
                  put("share", 1)
                  put("paid", 49500)
                  put("due", -1250)
                }
              )
            )
          }
        )
      )
    }

    val mapRepresentation = PPBFRealtimeSyncManager.jsonObjectToMap(original)
    val restored = PPBFRealtimeSyncManager.anyToJsonValue(mapRepresentation) as? JSONObject
    assertNotNull(restored)

    val restoredMember = restored!!.getJSONArray("members").getJSONObject(0)
    assertEquals(10, restoredMember.getInt("id"))
    assertEquals(-1250, restoredMember.getInt("due"))
    assertEquals(2.040816, restoredMember.getDouble("own"), 0.000001)
    assertEquals(1000, restoredMember.getJSONObject("yrs").getJSONArray("2022").getInt(1))
    assertEquals(-1250, restoredMember.getJSONArray("ledger").getJSONObject(0).getInt("due"))
  }

  @Test
  fun `verify cloud sync status json serialization`() {
    val status = CloudSyncStatus(
      platform = "android",
      firebaseInitialized = true,
      isConnected = true,
      isSignedIn = true,
      uid = "uid-123",
      email = "ppbf2023@gmail.com",
      displayName = "Executive Admin",
      databaseUrl = "https://ppbf-2023-default-rtdb.asia-southeast1.firebasedatabase.app",
      lastSyncAt = "2026-11-16T00:00:00.000Z",
      syncState = "live_synced"
    )
    val parsed = JSONObject(status.toJsonString())
    assertEquals("android", parsed.getString("platform"))
    assertEquals(true, parsed.getBoolean("isSignedIn"))
    assertEquals("ppbf2023@gmail.com", parsed.getString("email"))
    assertEquals("live_synced", parsed.getString("syncState"))
  }

  @Test
  fun `verify main activity launches splash overlay and webview cleanly`() {
    composeTestRule.waitForIdle()
    composeTestRule.onNodeWithTag("ppbf_webview").assertExists()
    composeTestRule.onNodeWithTag("ppbf_splash_overlay").assertIsDisplayed()
  }
}
