---

# 📝 Activity Logs Microservice

Tracks all baby-related activities: **sleep**, **feeding**, and **diaper changes**.  
Supports partial entries (start only, or start + end), summaries, and dashboard aggregation.

---

## 🔌 Endpoints

### Sleep (`/api/activity/sleep`)

| Method | Endpoint            | Description                        | Auth Required  |
|--------|---------------------|------------------------------------|----------------|
| POST   | `/`                 | Start a sleep log                  | ✅ Yes         |
| PATCH  | `/:id`              | Complete a sleep log with endTime  | ✅ Yes         |

### Feeding (`/api/activity/feeding`)

| Method | Endpoint            | Description                          | Auth Required  |
|--------|---------------------|--------------------------------------|----------------|
| POST   | `/`                 | Start a feeding log                  | ✅ Yes         |
| PATCH  | `/:id`              | Complete feeding log with endTime    | ✅ Yes         |

### Diaper (`/api/activity/diaper`)

| Method | Endpoint            | Description                          | Auth Required  |
|--------|---------------------|--------------------------------------|----------------|
| POST   | `/`                 | Log a diaper change                  | ✅ Yes         |

### Summary & Dashboard

| Method | Endpoint                          | Description                      | Auth Required |
|--------|-----------------------------------|----------------------------------|---------------|
| GET    | `/summary/:babyId`               | Daily/Weekly/Monthly summary     | ✅ Yes         |
| GET    | `/dashboard/:babyId`             | Aggregated dashboard data        | ✅ Yes         |

---

## 🧠 Middleware

### `authMiddleware.js`
- Reads JWT token from cookies  
- Verifies and attaches `req.user`  
- Optional `requireFullUser` flag to populate user model

---

## 🧪 Testing

- ✅ Unit and integration tests written using **Jest** + **Supertest**  
- ✅ Uses **real MongoDB** via `.env`  
- ✅ Tests simulate login with cookie-based auth  
- ✅ Includes test coverage for:
  - Sleep start and end
  - Feeding start and end
  - Diaper creation
  - Summary and dashboard endpoints

---

## ✅ Status

- ✅ Activity types supported: sleep, feeding, diaper  
- ✅ Partial logging supported (start → later complete)  
- ✅ Aggregations: duration, totals, formatted output  
- ✅ Summary & dashboard endpoints per baby  
- ✅ Cookie-auth tested and integrated  
- ✅ Integration tested via API Gateway

---

## 📌 GitHub Issues Resolved

- ✅ #3 Feeding Tracking  
- ✅ #4 Diaper Change Tracking  
- ✅ #7 Sleep Tracking  
- ✅ #78 API Gateway: Authentication Middleware  
- ✅ #83 Cookie-Based Authentication and RBAC  
- ✅ #62 Testing: Login API  
- ✅ #65 API: Rate Limiting (handled at Gateway)

---

## 🔗 Integration

- 🧩 Connected to the API Gateway under `/api/activity/`  
- Respects cookie-based authentication from Users service  
- `babyId` from Babies service used to associate logs  
- Future support for multi-parent/nanny permissions

---

## 🛠️ Developer Notes

- 💡 Duration auto-calculated on PATCH for sleep/feeding  
- 🧪 All tests run E2E with real DB — no mocks  
- 🧱 Uses shared `common/authMiddleware.js` module  
- 🧠 Aggregation logic lives in `activitySummaryController.js`

---

## 📬 Contact

Maintained by [@ajayrajyadav](https://github.com/ajayrajyadav)  
Part of the **[Babybloom](https://github.com/ajayrajyadav/babybloom)** platform