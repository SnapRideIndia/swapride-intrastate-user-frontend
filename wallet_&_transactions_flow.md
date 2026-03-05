# Wallet & Transactions Flow — Frontend Reference

> **Audience:** Frontend / Mobile developers
> **Version:** 1.0

---

## 1. Wallet Overview

The user has a digital wallet that can be used to pay for rides. The wallet can be topped up via payment gateways (Razorpay/Stripe/etc.).

---

## 2. Get Wallet Balance

Fetch the current balance to display on the home screen or wallet screen.

```http
GET /wallet/balance
Auth: Bearer <accessToken>
```

**Response:**

```json
{
  "balance": 1500.5,
  "isActive": true
}
```

---

## 3. Top-Up Flow

This is a multi-step process involving the Payment Gateway SDK on the frontend.

### Step 1 — Initiate Top-Up

Tell the backend you want to add money.

```http
POST /wallet/topup/initiate
Auth: Bearer <accessToken>
Content-Type: application/json

{
  "amount": 500
}
```

**Response:**

```json
{
  "topUpId": "TOPUP_1708234567890_1234abcd",
  "amount": 500,
  "gatewayData": {
    "orderId": "TOPUP_1708234567890_1234abcd",
    "amount": 500,
    "currency": "INR",
    "gatewayOrderId": "order_N12345xyz",
    "razorpayOrderId": "order_N12345xyz",
    "razorpayKeyId": "rzp_test_..."
  }
}
```

### Step 2 — Gateway SDK (Frontend Action)

Use the `gatewayData` to open the Razorpay/Stripe checkout on the mobile app.

### Step 3 — Payment Success

Once the SDK returns success:

1.  The Gateway sends a **Webhook** to the Backend (Backend handles this automatically).
2.  The Backend verifies the payment and credits the wallet.
3.  **Frontend Action:** Poll `GET /wallet/balance` or wait for a push notification/socket event to confirm the new balance.

---

## 4. Transaction History

### A. Wallet Passbook (Wallet-only events)

Shows credits (top-ups, refunds) and debits (ride payments).

```http
GET /wallet/transactions?limit=20&offset=0
Auth: Bearer <accessToken>
```

**Response:**

```json
{
  "transactions": [
    {
      "id": "t1-uuid",
      "walletId": "w1-uuid",
      "type": "CREDIT",
      "amount": 500,
      "balanceBefore": 0,
      "balanceAfter": 500,
      "referenceId": "TOPUP_1708234567890_...",
      "referenceType": "TOPUP",
      "description": "Wallet top-up via Gateway",
      "status": "SUCCESS",
      "createdAt": "2026-02-18T10:00:00Z"
    },
    {
      "id": "t2-uuid",
      "walletId": "w1-uuid",
      "type": "DEBIT",
      "amount": 100,
      "balanceBefore": 500,
      "balanceAfter": 400,
      "referenceId": "b1-uuid",
      "referenceType": "BOOKING",
      "description": "Payment for Ride #Hitech-Paradise",
      "status": "SUCCESS",
      "createdAt": "2026-02-18T12:00:00Z"
    }
  ],
  "total": 50,
  "limit": 20,
  "offset": 0
}
```

### B. Unified Financials (All Payments)

Shows **everything**: Wallet transactions AND direct Gateway payments (if you allow paying for rides directly via card/UPI without wallet).

```http
GET /financials/transactions?limit=20&offset=0&filter=ALL
Auth: Bearer <accessToken>
```

**Response:**

```json
{
  "data": [
    {
      "id": "tx-uuid-1",
      "amount": 500,
      "type": "CREDIT",
      "source": "WALLET",
      "description": "Wallet top-up via Gateway",
      "status": "SUCCESS",
      "date": "2026-02-18T10:00:00Z",
      "referenceId": "TOPUP_...",
      "balanceBefore": 0,
      "balanceAfter": 500
    },
    {
      "id": "tx-uuid-2",
      "amount": 45,
      "type": "DEBIT",
      "source": "GATEWAY",
      "description": "Direct Booking Payment",
      "status": "SUCCESS",
      "date": "2026-02-18T11:30:00Z",
      "referenceId": "booking-uuid"
    }
  ],
  "pagination": {
    "total": 120,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

**Query Parameters:**

- `filter`: `ALL` (default), `WALLET`, `GATEWAY`

---

## API Quick Reference

| Method | Endpoint                   | Description                         | Auth      |
| ------ | -------------------------- | ----------------------------------- | --------- |
| GET    | `/wallet/balance`          | Get current balance                 | ✅ Bearer |
| GET    | `/wallet/transactions`     | Get wallet passbook history         | ✅ Bearer |
| POST   | `/wallet/topup/initiate`   | Start top-up (returns gateway data) | ✅ Bearer |
| GET    | `/financials/transactions` | Get unified transaction history     | ✅ Bearer |
