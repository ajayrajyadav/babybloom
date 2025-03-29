# 👶 Babies Microservice

This service handles baby profiles within the Babybloom platform. It allows parents to create, retrieve, and manage babies associated with their account.

---

## 📦 Overview

- **Language:** JavaScript (Node.js)
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Auth:** Cookie-based JWT authentication via shared middleware
- **Testing:** Jest + Supertest
- **Deployed Behind:** API Gateway

---

## 🗂️ Folder Structure

```bash
babies/
├── index.js                 # Entry point
├── package.json             # NPM config
├── jest.config.js           # Jest configuration
├── .env                     # Environment config
├── cookies.txt              # For Supertest cookie session
├── controllers/             # Controller logic
│   └── babyController.js    # Baby creation, list, detail
├── models/
│   └── Baby.js              # Mongoose schema
├── middleware/
│   └── authMiddleware.js    # Shared cookie-based auth
├── routes/
│   └── babyRoutes.js        # Routes for /api/babies
├── tests/                   # Jest tests
│   ├── baby.test.js         # API tests for baby flow
│   └── setup.js             # Connects to MongoDB, cleans DBs

---

## 🔌 Endpoints

### Baby Routes (`/api/babies`)

| Method | Endpoint | Description                        | Auth Required |
|--------|----------|------------------------------------|----------------|
| POST   | `/`      | Create a baby profile              | ✅ Yes         |
| GET    | `/`      | Get all babies for logged-in user | ✅ Yes         |
| GET    | `/:id`   | Get baby by ID                     | ✅ Yes         |
| DELETE | `/:id`   | Delete baby by ID                  | ✅ Yes         |

---

## 🧠 Middleware

### `authMiddleware.js`
- Reads JWT token from cookies  
- Verifies the token and attaches `req.user`  
- Used in all routes to ensure requests are authenticated

---

## 🧪 Testing

- Integration tested using Jest + Supertest  
- Each test:
  - Connects to real MongoDB (non-mocked)  
  - Registers and logs in a test user  
  - Performs protected route calls using cookie-based auth

---

## ✅ Status

- ✅ Baby schema and model implemented  
- ✅ API endpoints fully working and protected  
- ✅ Integrated with Users service via shared `userId`  
- ✅ Fully tested with real DB and cookies  
- ✅ Working behind API Gateway

---

## 📌 GitHub Issues Resolved

- ✅ #46 Baby Profile Creation  
- ✅ #47 List Babies for Authenticated User  
- ✅ #49 Get Baby by ID  
- ✅ #51 Delete Baby Endpoint  
- ✅ #62 Testing: Login API  
- ✅ #65 API: Rate Limiting (basic check at gateway)

---

## 🔗 Integration

- 🧩 This service is wired through the API Gateway at `/api/babies`  
- Auth flows and cookies are shared with the Users service

---

## 🏁 Coming Soon

- 💡 Baby Profile Editing  
- 🧩 Cross-service querying for dashboard stats  
- 🔒 Per-baby access control for multi-user households

---

## 🛠️ Developer Notes

- Reuses `authMiddleware.js` from shared common module  
- Use `cookies.txt` for test agents to simulate login sessions  
- Test coverage uses real DB state — not mocked or stubbed

---

## 📬 Contact

Maintained by [@ajayrajyadav](https://github.com/ajayrajyadav)  
Part of the **[Babybloom](https://github.com/ajayrajyadav/babybloom)** platform