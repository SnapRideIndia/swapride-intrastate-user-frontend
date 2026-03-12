# SwapRide Notification System - User App Integration Guide

This document provides a comprehensive guide for integrating the SwapRide notification system into the **User App**.

## 🔐 Authentication

All notification endpoints require a valid JWT token. The system automatically determines the user context based on the token.

- **User App:** Uses `Bearer {user_token}`

---

## 📊 Notification APIs

These endpoints are used by the User App to fetch and manage personal notifications.

### 1. List My Notifications
`GET /notifications`

**Purpose:** List notifications filtered by type, priority, or read status.  
**Query Parameters:**
- `offset`: (number) Default `0`.
- `limit`: (number) Default `20`.
- `q`: (string) Search title/content. Optional.
- `type`: (string) Filter by category. Default: `"all"`.
- `priority`: (string) `LOW`, `MEDIUM`, `HIGH`. Default: `"all"`.
- `status`: (string) `read`, `unread`. Default: `"all"`.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Arriving Soon! ✨",
      "content": "Your stop Hitech City is ~5 mins away.",
      "type": "PROXIMITY_ALERT",
      "priority": "HIGH",
      "metadata": {
        "bookingId": "uuid",
        "images": ["url1", "url2"]
      },
      "createdAt": "2026-03-11T10:00:00Z",
      "read": false
    }
  ],
  "pagination": { "total": 1, "limit": 20, "offset": 0, "hasMore": false }
}
```

### 2. Get Notification Details
`GET /notifications/:id`

**Purpose:** Fetch full details of a specific notification.

### 3. Mark as Read
`PATCH /notifications/:id/read` (Single)  
`PATCH /notifications/read-all` (Bulk)

---

## 📦 Data Structures & Constants

### Notification Types
| Type | Description |
| --- | --- |
| `SYSTEM_ALERT` | Critical system updates or maintenance. |
| `TRIP_UPDATE` | Updates regarding active or scheduled trips. |
| `PROMOTIONAL` | Marketing and offer notifications. |
| `WALLET_UPDATE` | Credits, debits, or payment confirmations. |
| `PROXIMITY_ALERT` | Triggered when a bus is near pickup/dropoff. |
| `REGISTRATION` | Welcome and account activation alerts. |
| `BOOKING` | Journey confirmation and details. |
| `BOOKING_ERROR` | Failed transaction or schedule issues. |
| `SECURITY` | Password changes and login alerts. |

### Notification Priorities
| Priority | Usage |
| --- | --- |
| `LOW` | Informational updates, silent delivery. |
| `MEDIUM` | Standard alerts, shown in notification tray. |
| `HIGH` | Immediate action required, top-of-drawer, sound alert. |

### Metadata Schema
Notifications can include rich metadata for better UX:
- `images`: Array of S3 URLs to be displayed in a gallery or push tray.
- `bookingId`: Link to a specific booking for one-tap navigation.
- `pointName`: Boarding or drop-off point name.
- `duration`: Estimated time (e.g., "5 mins").

---

## 🔔 Integration Checklist

1. **Push Identification:** When a push arrives, check the `type` in the payload.
2. **Deep Linking:** If `metadata.bookingId` exists, navigate the user to the Booking Details screen.
3. **Rich Media:** If `metadata.images` exists, use the first image for the notification tray and show the full gallery in the "Notification Detail" view.
4. **Real-time Sync:** When a user opens the notification drawer, call `PATCH /notifications/read-all` to clear badges.
