# Play Store Publishing Setup Guide

## Step 1: Generate Production Keystore

Run this command in the `android/app` directory:

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore -alias release-key -keyalg RSA -keysize 2048 -validity 10000
```

**Important:** 
- You'll be prompted for passwords - **SAVE THESE SECURELY**
- You'll need these passwords for every update you publish
- If you lose the keystore, you cannot update your app on Play Store
- Store a backup of the keystore in a secure location

## Step 2: Configure Keystore Properties

1. Copy the template file:
   ```bash
   cp android/keystore.properties.template android/keystore.properties
   ```

2. Edit `android/keystore.properties` and fill in your actual values:
   ```properties
   MYAPP_RELEASE_STORE_FILE=release.keystore
   MYAPP_RELEASE_KEY_ALIAS=release-key
   MYAPP_RELEASE_STORE_PASSWORD=your-actual-store-password
   MYAPP_RELEASE_KEY_PASSWORD=your-actual-key-password
   ```

**Note:** `keystore.properties` is already in `.gitignore` and will not be committed to version control.

## Step 3: Build Android App Bundle (AAB)

For Play Store, you need to build an AAB (Android App Bundle), not an APK:

```bash
npm run android:release
```

Or manually:
```bash
cd android
./gradlew bundleRelease
```

The AAB will be generated at:
`android/app/build/outputs/bundle/release/app-release.aab`

## Step 4: Test Release Build (Optional)

Before uploading to Play Store, test the release APK:

```bash
npm run android:release-apk
```

Or manually:
```bash
cd android
./gradlew assembleRelease
```

Install and test the APK from:
`android/app/build/outputs/apk/release/app-release.apk`

## Step 5: Version Management

Before each Play Store upload, update the version in `android/app/build.gradle`:

```gradle
defaultConfig {
    versionCode 2  // Increment by 1 for each upload
    versionName "1.0.1"  // Update as needed (e.g., 1.0.1, 1.1.0, 2.0.0)
}
```

**Rules:**
- `versionCode` must be higher than the previous upload
- `versionName` is what users see (can be any format)

## Step 6: Play Store Console Setup

1. **Create Google Play Developer Account**
   - Go to https://play.google.com/console
   - Pay one-time $25 registration fee

2. **Create New App**
   - Fill in app name, default language, app type
   - Choose free or paid

3. **Complete Store Listing**
   - App name: NanoClockX
   - Short description (80 characters max)
   - Full description (4000 characters max)
   - App icon: 512x512px PNG
   - Feature graphic: 1024x500px PNG
   - Screenshots: At least 2, up to 8 (various device sizes)
   - Phone screenshots: 16:9 or 9:16 ratio
   - Tablet screenshots (if applicable)

4. **Content Rating**
   - Complete the content rating questionnaire
   - Usually "Everyone" for a clock app

5. **Privacy Policy**
   - Required if you collect any user data
   - Even if you don't collect data, it's recommended to have one
   - Host it on a website and provide the URL

6. **Data Safety**
   - Complete the data safety section
   - Declare what data you collect (if any)

7. **App Access**
   - Set up app access restrictions if needed

8. **Upload AAB**
   - Go to "Production" or "Internal testing" track
   - Click "Create new release"
   - Upload the `app-release.aab` file
   - Add release notes
   - Review and roll out

## Current Configuration

- ✅ ProGuard enabled for code obfuscation
- ✅ Release signing configured (requires keystore setup)
- ✅ Version: 1.0.0 (versionCode: 1)
- ✅ Target SDK: 36 (latest)
- ✅ Min SDK: 24 (Android 7.0+)
- ✅ Hermes enabled for better performance

## Troubleshooting

### Build fails with "keystore.properties not found"
- Make sure you've created `android/keystore.properties` from the template
- The build will fall back to debug signing if the file doesn't exist

### "Keystore was tampered with, or password was incorrect"
- Double-check your passwords in `keystore.properties`
- Make sure there are no extra spaces or quotes

### "App not installed" when testing release APK
- Uninstall the debug version first
- Release builds have a different signature

## Security Notes

- ⚠️ **NEVER** commit `keystore.properties` or `release.keystore` to version control
- ⚠️ **BACKUP** your keystore file and passwords securely
- ⚠️ **LOSE** the keystore = cannot update your app on Play Store
- ✅ Both files are already in `.gitignore`

## Next Steps After First Release

1. Monitor crash reports in Play Console
2. Respond to user reviews
3. Plan feature updates
4. Update version code and name for each new release
5. Test thoroughly before each release

