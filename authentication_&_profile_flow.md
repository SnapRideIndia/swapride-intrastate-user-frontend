# Authentication Flow — Frontend Reference

> **Audience:** Frontend / Mobile developers
> **Version:** 2.0 — Smart OTP

---

## Flow 1 — Smart OTP (Login + Register)

The user enters their mobile number. The backend auto-detects new vs existing.

### Step 1 — Send OTP

```
POST /users/auth/send-otp
Body: { mobileNumber }  ← no type needed

  ├── invalid mobile format → 400 Bad Request
```

**Response:**

```json
{
  "message": "OTP sent successfully",
  "ttl": 300
}
```

### Step 2 — Verify OTP

**Response (Existing User):**

```json
{
  "message": "Login successful",
  "accessToken": "ey...",
  "refreshToken": "ey...",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

**Response (New User):**

```json
{
  "message": "OTP verified. Please complete registration.",
  "isNewUser": true,
  "verificationId": "v1v1v1v1-v1v1-v1v1-v1v1-v1v1v1v1v1v1"
}
```

**Frontend smart-switch logic:**

```js
const response = await verifyOtp({ mobileNumber, otp });

if (response.accessToken) {
  // ✅ Existing user — Login complete
  saveTokens(response.accessToken, response.refreshToken);
  navigate('/home');
} else if (response.isNewUser && response.verificationId) {
  // 🆕 New user — redirect to registration
  saveVerificationId(response.verificationId); // temp storage
  navigate('/register');
}
```

> The frontend never decides login vs register — it just reads the response shape.

### Step 3 — Complete Registration (new users only)

**Response:**

```json
{
  "accessToken": "ey...",
  "refreshToken": "ey...",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

---

## Flow 2 — Password Login

**Response:**

```json
{
  "accessToken": "ey...",
  "refreshToken": "ey...",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

---

## Flow 3 — Forgot Password

### Step 1 — Send OTP

```
POST /users/auth/send-otp
Body: { mobileNumber, type: "FORGOT_PASSWORD" }

  ├── mobile not registered → 404 Not Found  ← no OTP sent
  └── registered → OTP sent → { message, ttl: 300 }
```

### Step 2 — Verify OTP

**Response:**

```json
{
  "message": "OTP verified",
  "verificationId": "v1v1v1v1-v1v1-v1v1-v1v1-v1v1v1v1v1v1"
}
```

### Step 3 — Reset Password

```
POST /users/auth/reset-password
Body: { verificationId, newPassword }

  ├── verificationId expired (>30 min) → 400 Bad Request
  ├── user not found → 404 Not Found
  └── success → { message: "Password reset successfully" }
        → navigate to Login
```

---

## Session Management

To allow users to stay logged in for 90 days without compromising security, you must implement **Silent Token Refresh**.

> **Access Token:** Short-lived (7 days). Used for API calls.  
> **Refresh Token:** Long-lived (90 days). Used _only_ to get new Access Tokens.

### How to Implement (The Interceptor Pattern)

Do **not** check token expiry manually before every call. Instead, use an HTTP Interceptor (Axios, Dio, etc.) to handle `401 Unauthorized` errors globally.

#### The Logic Flow

1.  Attach `accessToken` to every request header: `Authorization: Bearer <token>`.
2.  If an API verifies the token and returns `200 OK`, proceed normally.
3.  If the API returns `401 Unauthorized`:
    - **Pause** the failed request.
    - **Call** `POST /users/auth/refresh` sending the stored `refreshToken`.
    - **If Success:**
      - Save the new `accessToken` & `refreshToken`.
      - Update the authorization header of the failed request with the _new_ token.
      - **Retry** the original request.
    - **If Failure (401 again):**
      - The refresh token is invalid or expired.
      - **Logout** the user (clear storage and redirect to Login).

#### Code Example (JavaScript/Axios)

```javascript
// Response Interceptor
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite loops

      try {
        // 1. Call Refresh API (use a separate client to avoid interceptor loop)
        const response = await axios.post('/users/auth/refresh', {
          refreshToken: localStorage.getItem('refreshToken'),
        });

        // 2. Save new tokens
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // 3. Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 4. Refresh failed? Session expired. Logout.
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
```

### Logout

Securely invalidate the session (server-side).

```
POST /users/auth/logout
Auth: Bearer <accessToken>
```

**Response:**

```json
{ "message": "Logged out successfully" }
```

> **Frontend Action:** On success, clear local storage (`accessToken`, `refreshToken`) and redirect to Login.

---

## User Profile & Updates

### Get Profile

```
GET /users/me
Auth: Bearer <accessToken>
```

**Response:**

```json
{
  "id": "u1u1u1u1-u1u1-u1u1-u1u1-u1u1u1u1u1u1",
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "mobileNumber": "+919876543210",
  "profileUrl": "https://s3.amazonaws.com/...",
  "gender": "MALE",
  "dateOfBirth": "1990-01-01",
  "bloodGroup": "O+",
  "status": "ACTIVE",
  "isOnboarded": true,
  "walletBalance": 100.0,
  "totalBookings": 5,
  "totalAmountSpent": 250.0,
  "lastBookingDate": "2026-03-01T10:00:00Z"
}
```

**Response Fields:**
| Field | Type | Description |
|---|---|---|
| `id` | UUID | Unique user identifier |
| `fullName` | string | Full name of the user |
| `mobileNumber` | string | Mobile number (Format: `+91XXXXXXXXXX`) |
| `email` | string | Email address |
| `profileUrl` | string? | URL to profile picture (null if not set) |
| `gender` | string? | Gender (MALE/FEMALE) |
| `dateOfBirth` | string? | Date of Birth (YYYY-MM-DD or ISO) |
| `bloodGroup` | string? | Blood group (e.g., A+, O-) |

### Update Profile

Update profile details, including full name, email, demographics, or upload a new profile picture.

```
PATCH /users/profile
Auth: Bearer <accessToken>
Content-Type: multipart/form-data
```

**Response:**

```json
{
  "id": "u1u1u1u1-u1u1-u1u1-u1u1-u1u1u1u1u1u1",
  "fullName": "John Doe",
  "email": "john.doe.updated@example.com",
  "mobileNumber": "+919876543210",
  "profileUrl": "https://s3.amazonaws.com/...",
  "gender": "MALE",
  "dateOfBirth": "1990-01-01",
  "bloodGroup": "O+",
  "status": "ACTIVE"
}
```

**Body Parameters:**
| Field | Type | Required | Description |
|---|---|---|---|
| `profile` | File | No | Image file to upload as profile picture |
| `fullName` | string | No | Full Name |
| `email` | string | No | New email address |
| `bloodGroup` | string | No | Blood Group (e.g. A+, O-) |
| `gender` | string | No | "MALE" or "FEMALE" |
| `dateOfBirth` | string | No | Date string (YYYY-MM-DD) |

> **Note:** `mobileNumber` cannot be updated here.

### Delete Account

Permanently deactivate the account (soft delete).

```
DELETE /users/profile
Auth: Bearer <accessToken>
```

**Response:**

```json
{
  "message": "Your account deletion is pending. You can return within 30 days to restore it."
}
```

> **Note:** The user will be logged out immediately.

### Travel Preferences

Manage saved locations (Home/Office) and commuting timings.

#### Get Preferences

```
GET /users/me/travel-preferences
Auth: Bearer <accessToken>
```

**Response:**

```json
{
  "home": {
    "id": "...",
    "label": "Home",
    "address": "...",
    "latitude": 17.4,
    "longitude": 78.3
  },
  "office": {
    "id": "...",
    "label": "Office",
    "address": "...",
    "latitude": 17.4,
    "longitude": 78.3
  },
  "officeTimings": "9:00 AM - 6:00 PM"
}
```

#### Update Home

```
PATCH /users/me/travel-preferences/home
Auth: Bearer <accessToken>
Body: { "address": "...", "latitude": 17.44, "longitude": 78.34 }
```

#### Update Office

```
PATCH /users/me/travel-preferences/office
Auth: Bearer <accessToken>
Body: { "address": "...", "latitude": 17.44, "longitude": 78.38 }
```

#### Update Office Timings

```
PATCH /users/me/travel-preferences/office-timings
Auth: Bearer <accessToken>
Body: { "timings": "9:00 AM - 6:00 PM" }
```

---

## API Quick Reference

| Method | Endpoint                                      | Body Fields                                                                  | Auth      |
| ------ | --------------------------------------------- | ---------------------------------------------------------------------------- | --------- |
| POST   | `/users/auth/send-otp`                        | `mobileNumber`, `type?`                                                      | ❌        |
| POST   | `/users/auth/verify-otp`                      | `mobileNumber`, `otp`, `type?`                                               | ❌        |
| POST   | `/users/auth/register`                        | `verificationId`, `fullName`, `email`, `password`, `referralCode?`           | ❌        |
| POST   | `/users/auth/login`                           | `identifier`, `password`                                                     | ❌        |
| POST   | `/users/auth/reset-password`                  | `verificationId`, `newPassword`                                              | ❌        |
| POST   | `/users/auth/refresh`                         | `refreshToken`                                                               | ❌        |
| POST   | `/users/auth/logout`                          | —                                                                            | ✅ Bearer |
| GET    | `/users/me`                                   | —                                                                            | ✅ Bearer |
| PATCH  | `/users/profile`                              | `profile` (file), `fullName`, `email`, `gender`, `dateOfBirth`, `bloodGroup` | ✅ Bearer |
| DELETE | `/users/profile`                              | —                                                                            | ✅ Bearer |
| GET    | `/users/me/travel-preferences`                | —                                                                            | ✅ Bearer |
| PATCH  | `/users/me/travel-preferences/home`           | `address`, `latitude`, `longitude`                                           | ✅ Bearer |
| PATCH  | `/users/me/travel-preferences/office`         | `address`, `latitude`, `longitude`                                           | ✅ Bearer |
| PATCH  | `/users/me/travel-preferences/office-timings` | `timings` (string)                                                           | ✅ Bearer |

---

## Error Reference

| Code  | Cause                                    | Show to user                              |
| ----- | ---------------------------------------- | ----------------------------------------- |
| `400` | Invalid mobile / expired verificationId  | "Please try again"                        |
| `401` | Wrong OTP or wrong password              | "Incorrect OTP / Invalid credentials"     |
| `404` | Forgot password — mobile not registered  | "No account found with this number"       |
| `409` | Register — email or mobile already taken | "Account already exists. Try logging in." |
