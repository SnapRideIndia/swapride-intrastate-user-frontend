# User Suggestions — Stop Recommendation APIs

> **Audience:** Mobile / frontend developers

---

## 1. Purpose & Overview

The **User Suggestions** feature allows riders to submit **new pickup/dropoff stop recommendations** for their regular commute (for example, a better stop near home or office).  
These submissions are stored as `StopSuggestion` records and reviewed by the operations team in the admin dashboard.

The flow has two sides:

- **User‑side APIs** — create/delete and list *my* suggestions.
- **Admin‑side APIs** — list, inspect, update status, and delete any suggestion.

All user‑side endpoints require a **user JWT** (`Authorization: Bearer <token>`).  
All admin‑side endpoints require an **admin JWT** plus appropriate permissions.

---

## 2. Data Model (StopSuggestion)

Key fields:

- **Location**
  - `pickupAddress` — full address for the proposed pickup stop.
  - `pickupLat`, `pickupLng` — latitude/longitude of the pickup stop.
  - `dropoffAddress` — full address for the proposed dropoff stop.
  - `dropoffLat`, `dropoffLng` — latitude/longitude of the dropoff stop.
- **Commute context**
  - `shift` — enum `MORNING | EVENING` (see below).
  - `reachingTime` — string; approximate time user needs to reach pickup (e.g. `"08:15 am"`).
- **Meta**
  - `description` — optional free‑text details about the suggestion.
  - `status` — enum `PENDING | REVIEWED | IMPLEMENTED | REJECTED` (admin‑managed).
  - `adminNotes` — internal notes added by reviewers.

Enums in code:

- `SuggestionShift`  
  - `MORNING` — typically home → office commute.  
  - `EVENING` — typically office → home commute.
- `SuggestionStatus`  
  - `PENDING`, `REVIEWED`, `IMPLEMENTED`, `REJECTED`.

---

## 3. User APIs (`/suggestions`)

All of these operate on the **authenticated user** and require a valid user JWT.

### 3.1 Submit a new suggestion

**Endpoint**

- **POST** `/suggestions`  
- Auth: `Authorization: Bearer <user_jwt>`

**Body (`CreateStopSuggestionDto`)**

```json
{
  "pickupAddress": "Metropolis Mana Towers, Hitech City, Hyderabad, Telangana 500081",
  "pickupLat": 17.4471,
  "pickupLng": 78.3812,
  "dropoffAddress": "Qualcomm, Financial District, Nanakramguda, Hyderabad, Telangana 500032",
  "dropoffLat": 17.4023,
  "dropoffLng": 78.3473,
  "shift": "MORNING",
  "reachingTime": "08:15 am",
  "description": "Current pickup is too far to walk safely; this stop has better lighting and footpath.",
  "updatePrefs": false
}
```

**Field notes**

- `shift`:
  - `MORNING` — user is suggesting a better **home → office** commute path.
  - `EVENING` — user is suggesting a better **office → home** commute path.
- `updatePrefs`:
  - When `true`, the backend will also update the user's **TravelPreferences** (`home` / `office` locations) to match this suggestion, based on `shift`.
  - When `false`, the suggestion is stored and reviewed, but saved preferences are not changed automatically.

**Response**

- Returns the persisted `StopSuggestion` record (with server‑generated fields like `id`, `createdAt`, `status`).

### 3.2 List my suggestions

**Endpoint**

- **GET** `/suggestions/me`  
- Auth: `Authorization: Bearer <user_jwt>`

**Query params**

- `offset` (optional, default `0`) — pagination offset.
- `limit` (optional, default `10`) — page size.

**Response shape**

```json
{
  "data": [/* array of StopSuggestion objects belonging to the user */],
  "pagination": {
    "total": 12,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

### 3.3 Delete my suggestion

**Endpoint**

- **DELETE** `/suggestions/:id`  
- Auth: `Authorization: Bearer <user_jwt>`

Notes:

- Only the **owner** of the suggestion can delete it.  
  If `:id` does not belong to the authenticated user, a `403 Forbidden` is returned.

---

## 4. Typical Frontend Usage

- **Mobile app (user)**
  - Show a **“Suggest a stop”** form that collects:
    - pickup/dropoff addresses (via existing place autocomplete),
    - coordinates (from selected place),
    - shift, reaching time, optional description, `updatePrefs` toggle.
  - Submit via `POST /suggestions`.
  - Show user's history via `GET /suggestions/me`, with a simple list + delete option.

