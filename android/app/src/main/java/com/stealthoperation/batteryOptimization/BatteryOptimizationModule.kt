package com.stealthoperation

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.os.PowerManager
import android.util.Log
class BatteryOptimizationModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val context = reactContext

    override fun getName(): String {
        return "BatteryOptimization"
    }

    @ReactMethod
    fun isBatteryOptimizationEnabled(promise: Promise) {
        try {
            val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager
            val packageName = context.packageName
            if (powerManager.isIgnoringBatteryOptimizations(packageName)) {
                promise.resolve(false)  // Not optimized
            } else {
                promise.resolve(true)   // Optimized
            }
        } catch (e: Exception) {
            promise.reject("Error", "Unable to check battery optimization status: ${e.message}")
        }
    }

    @ReactMethod
    fun openBatteryOptimizationSettings() {
        try {
            // Open the battery optimization settings page for your app
            val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS)
            val uri = Uri.parse("package:" + context.packageName)
            intent.data = uri
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            context.startActivity(intent)
        } catch (e: Exception) {
            e.printStackTrace()
            Log.e("BatteryOptimization", "Error opening battery optimization settings: ${e.message}")
        }
    }
}
