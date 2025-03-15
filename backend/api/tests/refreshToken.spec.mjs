import request from "supertest";
import { app } from "../index.js";
import mongoose from "mongoose";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

describe("🔄 Token Refresh API Tests", () => {
  let cookieJar; // Stores cookies
  let accessToken;

  beforeAll(async () => {
    // ✅ Register a test user
    await request(app).post("/api/auth/register").send({
      email: "testuser@example.com",
      password: "password123",
      role: "user",
    });

    // ✅ Login to get tokens & cookies
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "password123",
    });

    accessToken = loginRes.body.accessToken;
    cookieJar = loginRes.headers["set-cookie"]; // ✅ Store refresh token from cookies

    expect(accessToken).toBeDefined();
    expect(cookieJar).toBeDefined();
  });

  it("✅ Should refresh an expired access token using a valid refresh token", async () => {
    const res = await request(app)
      .post("/api/auth/refresh-token") // ✅ Correct endpoint
      .set("Cookie", cookieJar); // ✅ Send cookies

    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it("❌ Should reject an invalid refresh token", async () => {
    const res = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", "refreshToken=invalid_token");

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Refresh token not found or expired");
  });

  it("❌ Should fail if refresh token is missing", async () => {
    const res = await request(app).post("/api/auth/refresh-token");

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("No refresh token provided");
  });

  it("✅ Should store refresh token in cookies upon login", async () => {
    expect(cookieJar.find((cookie) => cookie.startsWith("refreshToken"))).toBeDefined();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});