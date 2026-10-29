# Scalable API Architecture & Contracts

## 1. Architecture Overview
The API layer in `src/api/` provides an enterprise-ready, modular foundation that can easily scale from offline/mock development to high-throughput production backends.

```
┌────────────────────────────────────────────────────────┐
│                   Domain Services                      │
│      leaderboardService.js      profileService.js      │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                      apiClient                         │
│   • Request Interceptors (Auth, Headers, Tracing)      │
│   • Timeout Controller (AbortSignal)                   │
│   • Response Interceptors (Transformations, Refresh)   │
│   • Error Normalization (ApiError, NetworkError)       │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│           Fetch API / Remote Backend Gateway           │
└────────────────────────────────────────────────────────┘
```

---

## 2. Error Hierarchy
All API operations throw strictly typed errors derived from `ApiError`:

| Class | HTTP Status | Description |
| :--- | :--- | :--- |
| `ApiError` | Variable | Base class with status, payload, and ISO timestamp |
| `NetworkError` | 0 | Thrown when offline, DNS fails, or CORS blocks request |
| `TimeoutError` | 408 | Thrown when request duration exceeds `VITE_API_TIMEOUT_MS` |

---

## 3. Endpoints Registry (`src/api/endpoints.js`)

```javascript
export const API_ENDPOINTS = Object.freeze({
  LEADERBOARD: {
    GET_SCORES: '/leaderboard',
    SUBMIT_SCORE: '/leaderboard/submit',
  },
  PROFILE: {
    GET_PROFILE: '/profile/me',
    UPDATE_ACHIEVEMENTS: '/profile/achievements',
  },
  TELEMETRY: {
    LOG_EVENT: '/telemetry/events',
  },
});
```

---

## 4. Leaderboard Service (`src/api/services/leaderboardService.js`)

### `getScores()`
- **Return Type**: `Promise<Array<LeaderboardEntry>>`
- **Behavior**: Retrieves high score list. If offline or `VITE_ENABLE_MOCK_API=true`, reads from persistent local storage fallback.

### `submitScore(pilot, score)`
- **Parameters**: `pilot: string`, `score: number`
- **Return Type**: `Promise<{ success: boolean, rank: number }>`
- **Behavior**: Appends score, re-ranks leaderboard, caches locally, and transmits telemetry to the server.

---

## 5. Adding New API Services
To add a new service (e.g., `inventoryService.js`):
1. Register endpoints in `src/api/endpoints.js`.
2. Import `apiClient` from `src/api/client.js`.
3. Wrap operations with `try/catch` and log via `logger.js`.
4. Provide offline fallback via `storage.js`.

