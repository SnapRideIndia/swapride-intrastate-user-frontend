# Booking & Search Flow — Frontend Reference

> **Audience:** Frontend / Mobile developers
> **Version:** 1.0

---

## 1. Overview

The booking process is split into four main phases:

1.  **Search**: Find available trips between points.
2.  **Selection & Hold**: Lock a seat for 10 minutes.
3.  **Payment**: Applying coupons and confirming payment.
4.  **Operations**: Tracking, ticket details, and boarding.

---

## 2. Search Flow & Onboarding

### A. First-Time Search Strategy (isOnboarded)

The user's profile (`GET /users/me`) contains an `isOnboarded` boolean flag. This specifically dictates which search UI is presented to the user on the Main/Home screen:

- **If `isOnboarded` is `false`**: The frontend renders the **"First-Time User Card"**. This card explicitly asks the user to input their **Home**, **Office**, and **Office Timings** as their very first search. The payload sent to `POST /search/trips` _must_ include `officeTimings` to implicitly trigger the onboarding flow on the backend.
- **If `isOnboarded` is `true`**: The frontend automatically bypasses the first-time card and simply renders the standard **"Direct Search Card"**, which allows the user to browse ad-hoc pickup and dropoff destinations directly.

> **Backend Implicit Onboarding Note:** The backend automatically recognizes the presence of `officeTimings` in the `POST /search/trips` body. It instantly flags the user as `isOnboarded = true`, persists their Home/Office locations into `TravelPreferences`, and caches this new state via Redis. Subsequent calls to the profile or dashboard will reflect `isOnboarded: true` and present the direct search card moving forward.

### B. Place Autocomplete

**Usage & Trigger:** Fires on every keystroke in the **Pickup** or **Dropoff** input field. The API is called each time the text input value changes, returning suggestions to populate the dropdown list.

```http
GET /search/place-autocomplete?input=Hitech&sessionToken=unique-random-uuid
Auth: Bearer <accessToken>
```

**Query Parameters:**

- `input`: Text fragment to search for.
- `sessionToken`: A unique UUID per user search session. Used to group multiple autocomplete requests into a single billable session (reducing Google Maps costs).

**Response:**

```json
[
  {
    "text": "Hitech City, Hyderabad, Telangana, India",
    "placeId": "ChIJKY9_...",
    "mainText": "Hitech City",
    "lat": 17.4471,
    "lng": 78.3812
  },
  {
    "text": "Paradise Circle, Secunderabad, Telangana, India",
    "placeId": "ChIJuU9_...",
    "mainText": "Paradise Circle",
    "lat": 17.4811,
    "lng": 78.4412
  }
]
```

### C. Trip Search

**Usage & Trigger:** Called when the user taps the **"Search"** button on the `SearchScreen`, or when the **"Search"** button inside the search edit popup on the Results screen is tapped. Also fires automatically when the user picks a new date from the date tab strip on the Results screen.

```http
POST /search/trips
Auth: Bearer <accessToken>
Content-Type: application/json

{
  "pickup": {
    "latitude": 17.4471,
    "longitude": 78.3812,
    "address": "Hitech City, Telangana"
  },
  "dropoff": {
    "latitude": 17.4811,
    "longitude": 78.4412,
    "address": "Paradise Circle, Telangana"
  },
  "userLocation": {
    "latitude": 17.4480,
    "longitude": 78.3880
  },
  "tripDate": "2026-03-04",
  "officeTimings": "09:00 AM - 06:00 PM" (Optional)
}
```

**Response:**

```json
[
  {
    "routeId": "d90ff610-e2ef-477e-b254-342a109bf119",
    "routeName": "Hitech city - Paradise",
    "originalPrice": 45,
    "discountedPrice": 45,
    "baseFare": 45,
    "appliedCoupon": null,
    "pickup": {
      "pointId": "69ea25df-09d6-4a36-9d49-f3b51c9132eb",
      "name": "Hitech City Metro Station",
      "address": "Hitech City Metro, Madhapur",
      "latitude": 17.4474,
      "longitude": 78.3762,
      "distanceText": "3.2 km",
      "images": [
        {
          "id": "130146c9-...",
          "imageUrl": "https://swapride-intrastate-documents.s3..."
        }
      ]
    },
    "dropoff": {
      "pointId": "f999085a-c5ed-4494-ba74-47147a17d574",
      "name": "Paradise Circle MG Road",
      "address": "Paradise Circle, MG Road, Secunderabad",
      "latitude": 17.4435,
      "longitude": 78.4872,
      "distanceText": "4.6 km walk",
      "images": [...]
    },
    "nearestPoint": {
      "name": "Hitech City Metro Station",
      "distanceText": "3.2 km",
      "travelTimeText": "8 mins",
      "proximityMessage": "Hitech City Metro Station is quite close! Just a 8 mins walk."
    },
    "allStops": [
      {
        "pointId": "69ea25df-09d6-4a36-9d49-f3b51c9132eb",
        "name": "Hitech City Metro Station",
        "address": "Hitech City Metro, Madhapur",
        "latitude": 17.4474,
        "longitude": 78.3762,
        "sequence": 1,
        "arrivalTime": "2026-03-05T06:30:00.000Z",
        "isUserSegment": true,
        "images": [...]
      },
      ...
    ],
    "timings": [
      {
        "tripId": "b0083d70-7de6-4a6d-bd44-ca582b6aab6a",
        "busNumber": "BUS-TEST-01",
        "pickupArrivalTime": "2026-03-05T06:30:00.000Z",
        "dropoffArrivalTime": "2026-03-05T07:36:00.000Z",
        "availableSeats": 39
      }
    ]
  }
]
```

### D. Get Saved Locations

**Usage & Trigger:** Called when the user clicks the Pickup or Dropoff input field on the `SearchScreen`, auto-loading relevant locations.

```http
GET /users/me/saved-locations?type=pickup
Auth: Bearer <accessToken>
```

**Query Parameters:**

- `type` (optional): "pickup" or "dropoff". If "pickup", returns only Home. If "dropoff", returns only Office. If omitted, returns both.

**Response:**

```json
[
  {
    "id": "e4f8d5b1-...",
    "userId": "9b12a3c4-...",
    "label": "Home",
    "address": "123 Maple Street",
    "latitude": 39.7817,
    "longitude": -89.6501
  }
]
```

### E. Get Recent Searches

**Usage & Trigger:** Called simultaneously with Saved Locations when focusing on the Pickup or Dropoff input field.

```http
GET /search/recent-searches?type=pickup
Auth: Bearer <accessToken>
```

**Query Parameters:**

- `type` (optional): "pickup" or "dropoff". If omitted, returns up to 10 recent searches of both types.

**Response:**

```json
[
  {
    "id": "18f918bb-...",
    "type": "pickup",
    "address": "Lodha Vesta",
    "latitude": 19.2134,
    "longitude": 73.0856,
    "timestamp": "2024-03-05T08:00:00.000Z"
  }
]
```

---

## 3. Booking Initiation (Seat Hold)

### A. Initiate One-Way Booking

**Usage & Trigger:**

1. User taps the **"Proceed"** button on a result card or a timing chip in `SearchResultsScreen`.
2. User is navigated to `BookingOptionsScreen`.
3. User taps the **"Proceed"** button under "Book One-way ride".
4. App calls the API and navigates to `CONFIRMATION` screen on success.

```http
POST /bookings/initiate
Auth: Bearer <accessToken>

{
  "tripId": "uuid-...",
  "pickupStopId": "uuid-...",
  "dropoffStopId": "uuid-...",
  "totalAmount": 50
}
```

**Response:**

```json
{
  "bookingId": "b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1",
  "expiresAt": "2026-03-04T18:40:00Z",
  "subTotal": 50,
  "discountAmount": 5,
  "totalAmount": 45,
  "assignedSeats": [
    {
      "seatId": "s1s1s1s1-s1s1-s1s1-s1s1-s1s1s1s1s1s1",
      "seatNumber": "A1"
    }
  ],
  "coupon": {
    "id": "c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1",
    "code": "SWAP10",
    "discountAmount": 5
  },
  "message": "Seats locked for 10 minutes. Please confirm payment method."
}
```

### B. Round-Trip Booking

**Usage & Trigger:**

1. User taps **"Proceed"** on the outbound leg in `SearchResultsScreen`.
2. User taps **"Show return buses"** on the `BookingOptionsScreen`.
3. App performs a return search; User taps **"Proceed"** (or timing chip) on the return result.
4. App calls the round-trip API and navigates to `CONFIRMATION` on success.

```http
POST /bookings/initiate-round-trip
Auth: Bearer <accessToken>

{
  "outbound": { "tripId": "uuid...", "pickupStopId": "...", "dropoffStopId": "...", "totalAmount": 50 },
  "returnTrip": { "tripId": "uuid...", "pickupStopId": "...", "dropoffStopId": "...", "totalAmount": 50 }
}
```

**Response:**

```json
{
  "outboundBookingId": "b1-uuid",
  "returnBookingId": "b2-uuid",
  "expiresAt": "2026-03-04T18:40:00Z",
  "coupon": {
    "id": "c1-uuid",
    "code": "ROUND20",
    "totalDiscount": 20
  },
  "outbound": {
    "bookingId": "b1-uuid",
    "subTotal": 50,
    "discountAmount": 10,
    "totalAmount": 40,
    "coupon": { "id": "c1-uuid", "code": "ROUND20", "discountAmount": 10 },
    "assignedSeats": [{ "seatId": "s1-uuid", "seatNumber": "A1" }]
  },
  "return": {
    "bookingId": "b2-uuid",
    "subTotal": 50,
    "discountAmount": 10,
    "totalAmount": 40,
    "coupon": { "id": "c1-uuid", "code": "ROUND20", "discountAmount": 10 },
    "assignedSeats": [{ "seatId": "s2-uuid", "seatNumber": "B2" }]
  },
  "totalPayable": 80,
  "message": "Outbound and return seats locked for 10 minutes. One coupon applied to round-trip. Confirm payment for both."
}
```

### C. Booking Confirmation Details

**Usage & Trigger:** This is the **single source of truth** for the `ConfirmBookingScreen`. It is called automatically after successful initiation (Step 3) or after a seat change. It ensures the UI displays processed data (like exact walk distances).

```http
GET /bookings/:bookingId/details?userLat=17.44&userLng=78.38
Auth: Bearer <accessToken>
```

**Response (One-Way):**

```json
{
  "isRoundTrip": false,
  "totalPayable": 45,
  "expiresAt": "2026-03-04T18:40:00Z",
  "bookingId": "b1-uuid",
  "tripId": "t1-uuid",
  "bookingStatus": "HELD",
  "subTotal": 50,
  "discountAmount": 5,
  "totalAmount": 45,
  "coupon": { "id": "c1-uuid", "code": "SWAP10", "discountAmount": 5 },
  "assignedSeats": [{ "seatId": "s1-uuid", "seatNumber": "A1" }],
  "pickup": {
    "name": "Hitech City",
    "address": "HITEC City, Madhapur",
    "arrivalTime": "2026-03-04T18:35:00Z",
    "distanceText": "0.3 km",
    "walkDurationText": "4 mins"
  },
  "dropoff": {
    "name": "Paradise",
    "address": "Paradise Circle, Secunderabad",
    "arrivalTime": "2026-03-04T19:15:00Z"
  }
}
```

**Response (Round-Trip):**

```json
{
  "isRoundTrip": true,
  "totalPayable": 90,
  "expiresAt": "2026-03-04T18:40:00Z",
  "outbound": {
    "bookingId": "b1-uuid",
    "bookingStatus": "HELD",
    "subTotal": 50,
    "discountAmount": 5,
    "totalAmount": 45,
    "pickup": {
      "name": "Hitech City",
      "address": "...",
      "arrivalTime": "...",
      "distanceText": "..."
    },
    "dropoff": { "name": "Paradise", "address": "...", "arrivalTime": "..." },
    "assignedSeats": [{ "seatNumber": "A1" }]
  },
  "return": {
    "bookingId": "b2-uuid",
    "bookingStatus": "HELD",
    "subTotal": 50,
    "discountAmount": 5,
    "totalAmount": 45,
    "pickup": { "name": "Paradise", "address": "...", "arrivalTime": "..." },
    "dropoff": {
      "name": "Hitech City",
      "address": "...",
      "arrivalTime": "..."
    },
    "assignedSeats": [{ "seatNumber": "B2" }]
  }
}
```

---

## 4. Seat selection

After the seat is auto-assigned, the user can tap **"Change Seat"** on the `ConfirmBookingScreen` to view the live seat map and pick a different seat.

### A. Get Seat Map

**Usage & Trigger:** Loads **automatically** when the `SeatSelectionScreen` mounts.

```http
GET /trips/:tripId/seats
Auth: Bearer <accessToken>
```

**Response:**

```json
{
  "seats": [
    {
      "seatId": "s1-uuid",
      "seatNumber": "A1",
      "rowPosition": 0,
      "colPosition": 0,
      "seatType": "SEATER",
      "status": "AVAILABLE"
    },
    {
      "seatId": "s2-uuid",
      "seatNumber": "A2",
      "rowPosition": 0,
      "colPosition": 1,
      "seatType": "SEATER",
      "status": "BOOKED"
    }
  ]
}
```

### B. Change Seat

**Usage & Trigger:** Fires when the user selects a seat and taps the **"Confirm Seat"** button in `SeatSelectionScreen`. Returns user to `CONFIRMATION` screen.

```http
PATCH /bookings/:bookingId/seat
Auth: Bearer <accessToken>

{
  "seatNumber": "B3"
}
```

**Response:**

```json
{
  "bookingId": "b1-uuid",
  "assignedSeat": {
    "seatId": "s3-uuid",
    "seatNumber": "B3"
  },
  "message": "Seat changed successfully"
}
```

---

## 5. Payment & Discounts

### A. Apply Coupon

**Usage & Trigger:** User taps **"Apply Promo code?"** on `ConfirmBookingScreen`, enters a code in the modal, and presses **Apply**.

```http
POST /bookings/:bookingId/apply-coupon
Auth: Bearer <accessToken>

{
  "couponCode": "SWAP50"
}
```

**Response (One-Way):**

```json
{
  "bookingId": "uuid-...",
  "subTotal": 100,
  "discountAmount": 50,
  "totalAmount": 50,
  "coupon": { "id": "c-uuid", "code": "SWAP50" },
  "message": "Coupon applied successfully"
}
```

**Response (Round-Trip):**

```json
{
  "bookingId": "outbound-uuid",
  "returnBookingId": "return-uuid",
  "subTotal": 200,
  "discountAmount": 100,
  "totalAmount": 100,
  "coupon": { "id": "c-uuid", "code": "SWAP50" },
  "outbound": {
    "bookingId": "outbound-uuid",
    "discountAmount": 50,
    "totalAmount": 50
  },
  "return": {
    "bookingId": "return-uuid",
    "discountAmount": 50,
    "totalAmount": 50
  },
  "message": "Coupon applied to round-trip successfully"
}
```

### B. Confirm Payment

**Usage & Trigger:** User taps the **"Proceed to payment"** button at the bottom of `ConfirmBookingScreen`.

```http
POST /bookings/:bookingId/confirm
Auth: Bearer <accessToken>

{
  "paymentMethod": "WALLET" // or "RAZORPAY"
}
```

**Response (Wallet Success):**

```json
{
  "status": "SUCCESS",
  "message": "Payment successful via Wallet",
  "bookingId": "uuid-..."
}
```

**Response (Razorpay Pending):**

```json
{
  "status": "PENDING_GATEWAY",
  "message": "Razorpay order created",
  "gatewayData": {
    "orderId": "booking-uuid",
    "amount": 45,
    "currency": "INR",
    "gatewayOrderId": "order_KljS...",
    "razorpayOrderId": "order_KljS...",
    "razorpayKeyId": "rzp_test_..."
  }
}
```

---

## 6. Post-Booking Operations

> **Note on Confirm Booking Details screen:** The `ConfirmBookingScreen` (`CONFIRMATION` state) uses the `/bookings/:bookingId/details` API (Step 4) to load all data consistently from the server.

### A. Ticket Detail

**Usage & Trigger:** This is used to render the final Ticket/Pass. Called when tapping **"View Digital Pass"** or **"View ticket"** in the UI.

```http
GET /bookings/ticket/:bookingId
Auth: Bearer <accessToken>
```

**Response:**

```json
{
  "qrCodeToken": "eyJhbGciOiJIUzI1NiJ9...",
  "route": {
    "from": "Hitech City",
    "to": "Paradise",
    "date": "04/03/2026",
    "timeRange": "6:30 PM - 7:15 PM"
  },
  "bus": {
    "registrationNumber": "TS 09 AB 1234",
    "model": "Volvo Multi-Axle"
  },
  "booking": {
    "id": "b1-uuid",
    "seats": ["A1"],
    "status": "CONFIRMED",
    "boardingStatus": "NOT_BOARDED"
  }
}
```

### B. My Bookings List ("Your Tickets")

**Usage & Trigger:** Loads automatically when the `MyBookingsScreen` mounts. Displayed under the header **"Your Tickets"**.

```http
GET /bookings/my-bookings
Auth: Bearer <accessToken>
```

**Response:**

```json
{
  "data": [
    {
      "id": "b1-uuid",
      "status": "CONFIRMED",
      "totalAmount": 45,
      "trip": {
        "id": "t1-uuid",
        "routeName": "Hitech City - Paradise",
        "busNumber": "TS 09 AB 1234",
        "departureTime": "2026-03-04T18:30:00Z"
      },
      "pickup": "Hitech City",
      "dropoff": "Paradise",
      "seatCount": 1,
      "createdAt": "2026-03-04T10:00:00Z",
      "roundTrip": null
    }
  ],
  "pagination": {
    "total": 3,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

### C. Live Tracking

**Usage & Trigger:** Called from a **"Track My Bus"** button on the Ticket Detail screen or a booking card to provide live GPS position, driver info, and ETA.

```http
GET /bookings/track/:bookingId
Auth: Bearer <accessToken>
```

**Response:**

```json
{
  "booking": {
    "id": "...",
    "status": "CONFIRMED",
    "boardingStatus": "NOT_BOARDED"
  },
  "driver": {
    "name": "John Doe",
    "phone": "+919876543210",
    "avatar": "https://s3.amazonaws.com/...",
    "rating": 4.8
  },
  "bus": {
    "busNumber": "TS 09 AB 1234",
    "model": "Volvo",
    "liveLocation": {
      "lat": 17.4482,
      "lng": 78.3914,
      "speed": 42,
      "heading": 115,
      "lastUpdatedAt": "2026-03-04T18:32:10Z"
    }
  },
  "trip": {
    "id": "t1-uuid",
    "scheduledDeparture": "2026-03-04T18:30:00Z",
    "scheduledArrival": "2026-03-04T19:15:00Z",
    "routeName": "Hitech City - Paradise"
  },
  "pickupPoint": {
    "name": "Hitech City",
    "latitude": 17.4471,
    "longitude": 78.3812,
    "images": []
  },
  "dropoffPoint": {
    "name": "Paradise",
    "latitude": 17.4811,
    "longitude": 78.4412,
    "images": []
  },
  "stops": [
    {
      "name": "Hitech City",
      "address": "...",
      "latitude": 17.4471,
      "longitude": 78.3812,
      "sequence": 1,
      "arrivalTime": "2026-03-04T18:30:00Z"
    }
  ],
  "encodedPolyline": "gxcpCe_z|M...",
  "smartStatus": {
    "header": "Pickup at",
    "time": "6:35 pm",
    "description": "Bus is on its way. Last crossed stop is Mindspace.",
    "durationRemaining": "5 mins"
  }
}
```

---

## API Quick Reference

> APIs listed in the **standard sequence** of the booking journey.

| #   | Method | Endpoint                            | Screen / Trigger                                                       |
| --- | ------ | ----------------------------------- | ---------------------------------------------------------------------- |
| 1   | GET    | `/search/place-autocomplete`        | Every keystroke in Pickup / Dropoff field                              |
| 2a  | GET    | `/users/me/saved-locations`         | Tapping Pickup/Dropoff field in `SearchScreen`                         |
| 2b  | GET    | `/search/recent-searches`           | Tapping Pickup/Dropoff field in `SearchScreen`                         |
| 3   | POST   | `/search/trips`                     | **"Search"** button or date tab change                                 |
| 4a  | POST   | `/bookings/initiate`                | Result "Proceed" -> Options "Proceed"                                  |
| 4b  | POST   | `/bookings/initiate-round-trip`     | Result "Proceed" -> "Show return buses" -> Return Result "Proceed"     |
| 5   | GET    | `/bookings/:bookingId/details`      | Auto-load on **ConfirmBookingScreen** mount                            |
| 6a  | GET    | `/trips/:tripId/seats`              | Auto-load on **SeatSelectionScreen** mount                             |
| 6b  | PATCH  | `/bookings/:bookingId/seat`         | **"Confirm Seat"** button on `SeatSelectionScreen`                     |
| 7   | POST   | `/bookings/:bookingId/apply-coupon` | **"Apply Promo code?"** -> **Apply** in modal                          |
| 8   | POST   | `/bookings/:bookingId/confirm`      | **"Proceed to payment"** button on `ConfirmBookingScreen`              |
| 9   | GET    | `/bookings/ticket/:bookingId`       | **"View Digital Pass"** on success or **"View ticket"** on ticket card |
| 10  | GET    | `/bookings/my-bookings`             | Auto-load on **"Your Tickets"** screen mount                           |
| 11  | GET    | `/bookings/track/:bookingId`        | **"Track Ride"** button                                                |
