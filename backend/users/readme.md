# 👤 Users Microservice

This microservice handles all user-related functionality for the Babybloom platform, including registration, login, logout, role-based access control (RBAC), and token management using secure cookie-based authentication.

---

## 📦 Overview

- **Language:** JavaScript (Node.js)
- **Framework:** Express.js
- **Database:** MongoDB via Mongoose
- **Auth:** Cookie-based authentication with JWT (Access & Refresh Tokens)
- **RBAC:** Role-based middleware
- **Testing:** Jest + Supertest
- **API Exposure:** Routed through the API Gateway

---

## 📁 Folder Structure
users/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Signup, login, logout, token refresh
│   └── userController.js      # Fetch user profile
├── middleware/
│   ├── authMiddleware.js      # JWT + Cookie verification
│   └── roleMiddleware.js      # Role-based access control
├── models/
│   ├── userModel.js           # Mongoose schema for users
│   └── refreshTokenModel.js   # Refresh token persistence
├── routes/
│   ├── authRoutes.js          # /api/users/…
│   └── userRoutes.js
├── tests/
│   ├── auth.test.js           # Auth E2E tests
│   └── setup.js               # Jest setup with DB reset
├── index.js                   # Entry point
└── package.json

---

## ⚙️ Environment Variables

Ensure the following are set in `.env`:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/users-test
ACCESS_TOKEN_SECRET=yourAccessSecret
REFRESH_TOKEN_SECRET=yourRefreshSecret
COOKIE_DOMAIN=localhost


⸻
---

## 🔐 Authentication

- Access Tokens and Refresh Tokens are set as HTTP-only cookies
- Access Tokens are short-lived (e.g., 15 min)
- Refresh Tokens are stored in MongoDB and used to issue new access tokens
- Middleware validates tokens and enforces roles

---

## 🔄 Auth Flow

1. **Register:** `POST /api/users/register`
2. **Login:** `POST /api/users/login`
   - Returns both access & refresh tokens as cookies
3. **Access Protected Route:** `GET /api/users/me`
4. **Logout:** `POST /api/users/logout`
   - Clears both tokens and removes refresh from DB
5. **Refresh Access Token:** `POST /api/users/refresh-token`

---

## 🔐 Environment Configuration (`.env`)

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/users-test
ACCESS_TOKEN_SECRET=yourAccessSecret
REFRESH_TOKEN_SECRET=yourRefreshSecret
COOKIE_DOMAIN=localhost

⸻

---

## 🧱 Models

### User Model

```js
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ('parent' | 'admin'),
  tokens: [refreshTokenId]
}

### Refresh Token Model
```js
{
  userId: ObjectId,
  token: String,
  expiresAt: Date
}

## 🔌 Endpoints

### Auth Routes (`/api/users`)

| Method | Endpoint         | Description              | Auth Required  |
|--------|------------------|--------------------------|----------------|
| POST   | `/register`      | Register a new user      | ❌             |
| POST   | `/login`         | Login and receive cookies| ❌             |
| POST   | `/logout`        | Logout and clear tokens  | ✅             |
| POST   | `/refresh-token` | Get a new access token   | ✅ (refresh)   |
-------------------------------------------------------------------------


⸻

###User Routes (/api/users)

| Method | Endpoint         | Description              | Auth Required  |
|--------|------------------|--------------------------|----------------|
| GET    | `/me      `      | Receive current user     | ✅             |
-------------------------------------------------------------------------


⸻

## Run Tests
```bash
npm run test:users

### Includes tests for:
- Register
- Login
- Logout
- Refresh
- Protected route
- Role validation

### Sample Test Snippet:
```js
const agent = request.agent("http://localhost:8080");

await agent
  .post("/api/users/register")
  .send({ name: "Ajay", email: "ajay@example.com", password: "password123" })
  .expect(201);

const loginRes = await agent
  .post("/api/users/login")
  .send({ email: "ajay@example.com", password: "password123" })
  .expect(200);

const res = await agent.get("/api/users/me").expect(200);
expect(res.body.email).toBe("ajay@example.com");

⸻

## 🧠 Middleware

### `authMiddleware.js`
- Reads JWT access token from cookies
- Verifies token and attaches `req.user`
- Optional `requireFullUser` flag loads full user document

### `roleMiddleware.js`
- Enforces allowed roles like `['admin']`
- Returns 403 if user’s role is not in the list

---

## ✅ Status
- ✅ API endpoints fully implemented
- ✅ Auth + refresh token flow complete
- ✅ Role-based auth working
- ✅ Tested with Jest/Supertest
- ✅ Integrated via API Gateway

---

## 📌 GitHub Issues Resolved
- ✅ #83 Implement Cookie-Based Authentication and RBAC
- ✅ #66 API: User Signup
- ✅ #58 API: User Login
- ✅ #52 API: Auth Middleware
- ✅ #48 Logout Endpoint
- ✅ #60 Secure Token Storage