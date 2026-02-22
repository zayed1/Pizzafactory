# Pizza Factory - iOS App Complete Setup Guide

This guide walks you through every step to take your Pizza Factory game from Replit and publish it on the Apple App Store.

---

## Prerequisites (What You Need)

- A **Mac computer** (macOS 13 Ventura or later recommended)
- **Xcode 15+** installed from the Mac App Store (free)
- **Apple Developer Account** ($99/year) - sign up at https://developer.apple.com
- **Node.js 18+** installed on your Mac - download from https://nodejs.org
- An **iPhone** for testing (or use Xcode Simulator)

---

## Step 1: Download the Project from Replit

1. Open your Replit project in the browser
2. In the **Files** panel on the left side, click the three dots menu (**...**) at the top of the file list
3. Click **"Download as ZIP"**
4. A `.zip` file will download to your computer — the filename will be your project name (e.g., `Pizza-Factory-Game.zip` or similar)
5. Transfer this ZIP file to your **Mac**:
   - **If you're already on a Mac**: The file is in your Downloads folder
   - **If you're on another computer**: Use AirDrop, iCloud Drive, USB drive, Google Drive, or email to send it to your Mac

---

## Step 2: Set Up the Project on Your Mac

Open **Terminal** on your Mac (found in Applications → Utilities → Terminal) and run these commands one by one:

```bash
# 1. Go to your Downloads folder (or wherever you saved the ZIP)
cd ~/Downloads

# 2. Unzip the project (replace the filename with your actual ZIP name)
# Tip: type "unzip " then drag the ZIP file into Terminal to auto-fill the path
unzip YourProjectName.zip -d ~/Desktop/PizzaFactory

# 3. Go into the project folder
cd ~/Desktop/PizzaFactory

# 4. Install all project dependencies (this may take 1-2 minutes)
npm install

# 5. Build the web app (this creates the dist/public folder)
npm run build
```

After running `npm run build`, you should see a `dist/public/` folder created inside the project. This contains the compiled game files that will be loaded inside the iOS app.

**How to verify it worked:** Run `ls dist/public/` — you should see files like `index.html`, `assets/`, etc.

---

## Step 3: Set Up Capacitor for iOS

Still in Terminal, inside the project folder:

```bash
# 1. Add the iOS platform to Capacitor
npx cap add ios

# 2. Copy the built web files to the iOS project
npx cap sync
```

This creates an `ios/` folder containing the Xcode project.

---

## Step 4: Open the Project in Xcode

```bash
# Open the iOS project in Xcode
npx cap open ios
```

Xcode will open with your project. You should see **App** in the left sidebar.

---

## Step 5: Configure the App in Xcode

### 5.1 - Set Your Team and Bundle ID

1. In the left sidebar, click on **App** (the blue icon at the top)
2. Click the **Signing & Capabilities** tab
3. Check **"Automatically manage signing"**
4. Under **Team**, select your Apple Developer account
   - If you don't see your account, go to Xcode menu → Settings → Accounts → click **+** → sign in with your Apple ID
5. Under **Bundle Identifier**, type: `com.pizzafactory.game`

### 5.2 - Set Display Name and Version

1. Click the **General** tab
2. Set **Display Name** to: `Pizza Factory`
3. Set **Version** to: `1.0.0`
4. Set **Build** to: `1`
5. Set **Minimum Deployments** to: `iOS 15.0`

### 5.3 - Force Landscape Orientation

This ensures the game always runs sideways (landscape mode):

1. Still in the **General** tab, scroll down to **Deployment Info**
2. Under **Device Orientation**:
   - **Uncheck** "Portrait"
   - **Uncheck** "Upside Down"
   - **Check** "Landscape Left"
   - **Check** "Landscape Right"

### 5.4 - Add App Icon

1. In the left sidebar, expand **App** → click **Assets**
2. Click on **AppIcon**
3. Drag and drop your app icon image (1024x1024 PNG recommended)
   - You can create one at https://www.canva.com or https://appicon.co

---

## Step 6: Add In-App Purchase Capability

1. In Xcode, click **App** in the left sidebar
2. Go to **Signing & Capabilities** tab
3. Click the **+ Capability** button (top left)
4. Search for **"In-App Purchase"** and double-click it
5. It will appear under your capabilities list

---

## Step 7: Add the IAP (In-App Purchase) Native Code

Capacitor manages its own WebView, so we need to create a **Capacitor Plugin** that bridges the game's JavaScript purchase requests to Apple's StoreKit.

### 7.1 - Create the IAP Plugin

In Xcode, you need to create **two Swift files** inside the `App/App/` folder:

#### File 1: IAPPlugin.swift

1. In Xcode's left sidebar, right-click on the **App** folder (inside the App group)
2. Click **New File...** → choose **Swift File** → click Next
3. Name it `IAPPlugin` → click Create
4. Replace all the contents with this code:

```swift
import Capacitor
import StoreKit

@objc(IAPPlugin)
class IAPPlugin: CAPPlugin, SKProductsRequestDelegate, SKPaymentTransactionObserver {
    
    let productIDs: Set<String> = [
        "com.pizzafactory.coins100",
        "com.pizzafactory.coins500",
        "com.pizzafactory.coins2000",
        "com.pizzafactory.coins5000"
    ]
    
    var products: [SKProduct] = []
    var purchaseCall: CAPPluginCall?
    
    override func load() {
        SKPaymentQueue.default().add(self)
        loadProducts()
        
        // Register the message handler on Capacitor's WebView
        bridge?.webView?.configuration.userContentController.add(self as! WKScriptMessageHandler, name: "iap")
    }
    
    func loadProducts() {
        let request = SKProductsRequest(productIdentifiers: productIDs)
        request.delegate = self
        request.start()
    }
    
    func productsRequest(_ request: SKProductsRequest, didReceive response: SKProductsResponse) {
        products = response.products
        print("IAP: Loaded \(products.count) products")
    }
    
    @objc func purchase(_ call: CAPPluginCall) {
        guard let productId = call.getString("productId") else {
            call.reject("Missing productId")
            return
        }
        guard let product = products.first(where: { $0.productIdentifier == productId }) else {
            call.reject("Product not found: \(productId)")
            return
        }
        purchaseCall = call
        let payment = SKPayment(product: product)
        SKPaymentQueue.default().add(payment)
    }
    
    @objc func restore(_ call: CAPPluginCall) {
        purchaseCall = call
        SKPaymentQueue.default().restoreCompletedTransactions()
    }
    
    func paymentQueue(_ queue: SKPaymentQueue, updatedTransactions transactions: [SKPaymentTransaction]) {
        for transaction in transactions {
            switch transaction.transactionState {
            case .purchased:
                SKPaymentQueue.default().finishTransaction(transaction)
                sendToWebView(success: true)
                purchaseCall?.resolve(["success": true])
                purchaseCall = nil
            case .failed:
                SKPaymentQueue.default().finishTransaction(transaction)
                sendToWebView(success: false)
                purchaseCall?.reject("Purchase failed")
                purchaseCall = nil
            case .restored:
                SKPaymentQueue.default().finishTransaction(transaction)
                sendToWebView(success: true)
                purchaseCall?.resolve(["success": true])
                purchaseCall = nil
            default:
                break
            }
        }
    }
    
    private func sendToWebView(success: Bool) {
        DispatchQueue.main.async {
            self.bridge?.webView?.evaluateJavaScript(
                "window.__iapCallback && window.__iapCallback(\(success))"
            )
        }
    }
}
```

#### File 2: IAPPlugin.m (Objective-C Bridge)

1. Right-click on the **App** folder again → **New File...**
2. Choose **Objective-C File** → click Next
3. Name it `IAPPlugin` → click Create
4. If Xcode asks "Would you like to configure an Objective-C bridging header?" click **Create Bridging Header**
5. Replace the contents of `IAPPlugin.m` with:

```objc
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(IAPPlugin, "IAPPlugin",
    CAP_PLUGIN_METHOD(purchase, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(restore, CAPPluginReturnPromise);
)
```

### 7.2 - How It Works

The game's JavaScript code (in `IAPBridge.ts`) sends purchase requests using WebKit message handlers. The native `IAPPlugin` receives these messages, processes the purchase through Apple's StoreKit, and sends the result back to the game via `window.__iapCallback`. This all happens automatically — you just need to add the files above.

---

## Step 8: Set Up Products in App Store Connect

1. Go to https://appstoreconnect.apple.com and sign in
2. Click **My Apps** → click the **+** button → **New App**
3. Fill in:
   - **Platform**: iOS
   - **Name**: Pizza Factory
   - **Primary Language**: English (or Arabic)
   - **Bundle ID**: Select `com.pizzafactory.game`
   - **SKU**: `pizzafactory001`
4. Click **Create**

### 8.1 - Add In-App Purchase Products

1. In your app page, click **In-App Purchases** in the left sidebar
2. Click the **+** button to add each product:

| Product ID | Type | Display Name | Price |
|---|---|---|---|
| `com.pizzafactory.coins100` | Consumable | 100 Coins | $0.99 |
| `com.pizzafactory.coins500` | Consumable | 500 Coins | $3.99 |
| `com.pizzafactory.coins2000` | Consumable | 2,000 Coins | $9.99 |
| `com.pizzafactory.coins5000` | Consumable | 5,000 Coins | $19.99 |

For each product:
1. Click **+** → **Consumable**
2. Enter the **Reference Name** (e.g., "100 Coins")
3. Enter the **Product ID** exactly as shown above
4. Click **Create**
5. Set the **Price** tier
6. Add a **Description** (e.g., "Get 100 coins to upgrade your pizza factory!")
7. Add a **Screenshot** of the coin shop (take one from the game)
8. Click **Save**

---

## Step 9: Test on Your iPhone

### 9.1 - Test with Simulator

1. In Xcode, at the top, select a simulator (e.g., "iPhone 15")
2. Click the **Play** button (▶) or press `Cmd + R`
3. The game should open in landscape mode in the simulator

### 9.2 - Test on Real iPhone

1. Connect your iPhone to your Mac with a USB cable
2. On your iPhone, go to **Settings → Privacy & Security → Developer Mode** → turn it ON
3. In Xcode, select your iPhone from the device dropdown at the top
4. Click **Play** (▶) to build and install on your phone
5. The first time, you may need to trust the developer on your phone:
   - Go to iPhone **Settings → General → VPN & Device Management**
   - Tap your developer certificate → **Trust**

### 9.3 - Test In-App Purchases (Sandbox)

1. In App Store Connect, go to **Users and Access → Sandbox → Testers**
2. Click **+** to create a Sandbox test account (use a new email)
3. On your iPhone, go to **Settings → App Store → Sandbox Account**
4. Sign in with the Sandbox test account
5. Now when you tap "Buy" in the game, it will use the Sandbox (no real money charged)

---

## Step 10: Upload to TestFlight (Beta Testing)

1. In Xcode, go to menu: **Product → Archive**
   - Wait for the build to complete (may take a few minutes)
2. The **Organizer** window will open
3. Click **Distribute App**
4. Choose **App Store Connect** → click Next
5. Choose **Upload** → click Next
6. Keep default options → click Next → click **Upload**
7. Wait for the upload to finish

Then in App Store Connect:
1. Go to your app → **TestFlight** tab
2. Wait for the build to finish processing (10-30 minutes)
3. Click on the build → add **Test Information**
4. Click **Add External Testers** or **Add Internal Testers**
5. Share the TestFlight invitation link with testers

---

## Step 11: Submit to App Store

1. In App Store Connect, go to your app → **App Store** tab
2. Fill in all required information:
   - **Screenshots**: Add screenshots in landscape orientation for different iPhone sizes (6.7", 6.5", 5.5")
   - **Description**: Write a description of your game
   - **Keywords**: pizza, factory, idle, management, cooking, game
   - **Category**: Games → Simulation
   - **Age Rating**: Fill out the questionnaire (should be 4+)
   - **Privacy Policy URL**: You need a privacy policy page (can use a free generator)
3. Under **Build**, click **+** and select your uploaded build
4. Click **Submit for Review**
5. Apple review typically takes 1-3 days

---

## Updating the App Later

When you make changes to the game in Replit:

1. Download the updated project from Replit (ZIP)
2. Replace the files on your Mac
3. Run these commands in Terminal:

```bash
cd ~/Desktop/PizzaFactory
npm install
npm run build
npx cap sync
npx cap open ios
```

4. In Xcode, increase the **Build** number (e.g., from 1 to 2)
5. Product → Archive → Distribute App → Upload

---

## Important Files Reference

| File/Folder | What It Is |
|---|---|
| `dist/public/` | Built game files (created after `npm run build`) |
| `ios/` | Xcode project folder (created after `npx cap add ios`) |
| `capacitor.config.ts` | Capacitor settings (app ID, web directory) |
| `client/src/` | Game source code |
| `client/src/game/IAPBridge.ts` | JavaScript side of in-app purchase bridge |
| `client/src/game/CoinShop.tsx` | Coin shop UI component |
| `IOS_SETUP_GUIDE.md` | This guide |

---

## Troubleshooting

### "No signing certificate" error
- Make sure you're signed into your Apple Developer account in Xcode → Settings → Accounts

### Game shows blank/white screen
- Run `npm run build` again, then `npx cap sync`

### In-app purchases not working
- Make sure you added the "In-App Purchase" capability in Xcode
- Make sure products are created in App Store Connect and status is "Ready to Submit"
- Use a Sandbox test account, not your real Apple ID

### App rejected by Apple
- Make sure you have a privacy policy URL
- Make sure screenshots match the actual app
- Make sure the app description is accurate

### Landscape not working
- Check that Portrait is unchecked in Xcode → General → Deployment Info
- Make sure only Landscape Left and Landscape Right are checked
