# Pizza Factory - iOS Setup Guide

## Product IDs for App Store Connect

Create these **Consumable** In-App Purchase products in App Store Connect:

| Product ID | Coins | Price |
|---|---|---|
| `com.pizzafactory.coins100` | $100 | $0.99 |
| `com.pizzafactory.coins500` | $500 | $3.99 |
| `com.pizzafactory.coins2000` | $2,000 | $9.99 |
| `com.pizzafactory.coins5000` | $5,000 | $19.99 |

## Setup Steps

### 1. Build the web app
```bash
npm run build
```

### 2. Initialize iOS project
```bash
npx cap add ios
npx cap sync
```

### 3. Open in Xcode
```bash
npx cap open ios
```

### 4. In Xcode:
- Set your **Team** (Apple Developer account)
- Set **Bundle Identifier** to: `com.pizzafactory.game`
- Set **Display Name** to: `Pizza Factory`
- Set minimum deployment target to iOS 15.0

### 5. Add In-App Purchase Capability
- In Xcode, go to your target → "Signing & Capabilities"
- Click "+ Capability"
- Add "In-App Purchase"

### 6. Set up products in App Store Connect
1. Go to https://appstoreconnect.apple.com
2. Create a new app with bundle ID `com.pizzafactory.game`
3. Go to "In-App Purchases" section
4. Add each product from the table above as **Consumable** type
5. Set the price tier for each product

### 7. Implement Native IAP Bridge
In your iOS project, add this Swift code to handle purchases.
Create a new file `IAPManager.swift` in your Xcode project:

```swift
import StoreKit
import WebKit

class IAPManager: NSObject, SKProductsRequestDelegate, SKPaymentTransactionObserver {
    static let shared = IAPManager()
    
    let productIDs: Set<String> = [
        "com.pizzafactory.coins100",
        "com.pizzafactory.coins500",
        "com.pizzafactory.coins2000",
        "com.pizzafactory.coins5000"
    ]
    
    var products: [SKProduct] = []
    var webView: WKWebView?
    
    override init() {
        super.init()
        SKPaymentQueue.default().add(self)
    }
    
    func loadProducts() {
        let request = SKProductsRequest(productIdentifiers: productIDs)
        request.delegate = self
        request.start()
    }
    
    func productsRequest(_ request: SKProductsRequest, didReceive response: SKProductsResponse) {
        products = response.products
    }
    
    func purchase(productId: String) {
        guard let product = products.first(where: { $0.productIdentifier == productId }) else {
            sendCallback(success: false)
            return
        }
        let payment = SKPayment(product: product)
        SKPaymentQueue.default().add(payment)
    }
    
    func restore() {
        SKPaymentQueue.default().restoreCompletedTransactions()
    }
    
    func paymentQueue(_ queue: SKPaymentQueue, updatedTransactions transactions: [SKPaymentTransaction]) {
        for transaction in transactions {
            switch transaction.transactionState {
            case .purchased:
                SKPaymentQueue.default().finishTransaction(transaction)
                sendCallback(success: true)
            case .failed:
                SKPaymentQueue.default().finishTransaction(transaction)
                sendCallback(success: false)
            case .restored:
                SKPaymentQueue.default().finishTransaction(transaction)
                sendRestoreCallback(success: true)
            default:
                break
            }
        }
    }
    
    private func sendCallback(success: Bool) {
        DispatchQueue.main.async {
            self.webView?.evaluateJavaScript("window.__iapCallback && window.__iapCallback(\(success))")
        }
    }
    
    private func sendRestoreCallback(success: Bool) {
        DispatchQueue.main.async {
            self.webView?.evaluateJavaScript("window.__restoreCallback && window.__restoreCallback(\(success))")
        }
    }
}
```

Then in your `AppDelegate.swift` or main view controller, set up the WKWebView message handler:

```swift
// In your ViewController that contains the WKWebView:
let config = WKWebViewConfiguration()
let handler = IAPScriptMessageHandler()
config.userContentController.add(handler, name: "iap")

// Message handler class:
class IAPScriptMessageHandler: NSObject, WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, 
                               didReceive message: WKScriptMessage) {
        guard let body = message.body as? [String: Any],
              let action = body["action"] as? String else { return }
        
        switch action {
        case "purchase":
            if let productId = body["productId"] as? String {
                IAPManager.shared.purchase(productId: productId)
            }
        case "restore":
            IAPManager.shared.restore()
        default:
            break
        }
    }
}
```

### 8. Build & Test
1. Connect your iPhone or use Simulator
2. Build and run from Xcode
3. For testing purchases, use a Sandbox Apple ID in App Store Connect

### 9. Upload to TestFlight
1. In Xcode: Product → Archive
2. Distribute App → App Store Connect
3. In App Store Connect, go to TestFlight
4. Add testers and share the TestFlight link

## Notes
- The game detects touch devices automatically and shows mobile controls
- Virtual joystick appears on the bottom left for movement
- Drop button (X) appears on the bottom right when carrying items
- Pause button appears at the top center
- Coin shop opens by tapping the money display (the + icon)
