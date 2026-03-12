# SwapRide - FCM Integration Guide (User App)

This guide provides the necessary credentials and steps to integrate Firebase Cloud Messaging (FCM) into the SwapRide User Application.

## 🔑 Firebase Credentials

Use the following values for initializing the Firebase SDK in the User App. These values are synchronized with the SwapRide Backend and Admin Dashboard.

| Parameter | Value |
| --- | --- |
| **Project ID** | `swapride-intrastate-72729` |
| **API Key** | `AIzaSyDoXbeRwWuAM2OeSYM2KpEQ08N9-VZvV-c` |
| **Auth Domain** | `swapride-intrastate-72729.firebaseapp.com` |
| **Messaging Sender ID** | `32487957135` |
| **App ID** | `1:32487957135:web:ecd8f1072a3ded888486fa` |
| **Storage Bucket** | `swapride-intrastate-72729.firebasestorage.app` |
| **VAPID Key** (for Web/PN) | `BNjCyYD8bS8POW4JPInFxjU--DwlteicRmMP1CDSz3pvnVTPZH57A3nE2hXoqU646rd44cQ5_p_VfZ-jHgSa7tU` |

### JSON Format 
```json
{
  "apiKey": "AIzaSyDoXbeRwWuAM2OeSYM2KpEQ08N9-VZvV-c",
  "authDomain": "swapride-intrastate-72729.firebaseapp.com",
  "projectId": "swapride-intrastate-72729",
  "storageBucket": "swapride-intrastate-72729.firebasestorage.app",
  "messagingSenderId": "32487957135",
  "appId": "1:32487957135:web:ecd8f1072a3ded888486fa",
  "vapidKey": "BNjCyYD8bS8POW4JPInFxjU--DwlteicRmMP1CDSz3pvnVTPZH57A3nE2hXoqU646rd44cQ5_p_VfZ-jHgSa7tU"
}
```

---

## 🛠️ Integration Steps

### 1. Initialize Firebase
Initialize the Firebase app using the credentials above. Ensure you enable the **Messaging** module.

### 2. Request Permissions & Get Token
Upon app launch (or after login), request notification permissions from the user. Once granted, generate the unique FCM Registration Token for the device.

### 3. Register Token with Backend
This is a **critical step**. To receive push notifications, the User App must register its token with the SwapRide Backend.

- **Endpoint:** `POST /notifications/devices/register`
- **Method:** `POST`
- **Auth:** Required (User JWT Token)
- **Body:**
```json
{
  "fcmToken": "YOUR_GENERATED_FCM_TOKEN",
  "deviceType": "ANDROID" // or "IOS" or "WEB"
}
```

### 4. Handle Foreground Messages
When the app is in the foreground, the system will not show a default notification tray alert. You must handle the `onMessage` event to show an in-app toast or banner.

---

## 🔔 Topic Subscriptions (Auto-handled)

The backend handles core topic subscriptions based on the user type. The User App is automatically subscribed to the `users` topic upon registration of the device token.

- **Global Topic:** `all`
- **User Topic:** `users`

---

## 📝 Best Practices
1. **Token Refresh**: Listen for token refresh events and update the backend if the FCM token changes.
2. **Metadata Payload**: The backend sends a `notificationId` and `type` in the data payload. Use these for deep-linking (e.g., navigating to a specific booking details screen).
3. **Images**: For rich notifications, the system provides an `image` URL in the notification payload. Ensure your app handles image rendering in push alerts.
