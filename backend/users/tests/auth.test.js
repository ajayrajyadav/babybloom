const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const User = require("../models/userModel");

let agent;
let regularUserCookies;
let adminCookies;

beforeAll(async () => {
    await mongoose.connection.db.dropDatabase();
    agent = request.agent("http://localhost:8080/api");
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe("🔐 Authentication & Admin Tests", () => {
    test("📝 Register a new regular user", async () => {
        const res = await agent.post("/users/register").send({
            name: "Test User",
            email: "test@example.com",
            password: "testpassword",
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("User registered successfully as parent");
    });

    test("🔐 Login as the regular user and store cookies", async () => {
        const res = await agent.post("/users/login").send({
            email: "test@example.com",
            password: "testpassword",
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Login successful");
        regularUserCookies = res.headers["set-cookie"]; // Store cookies
    });

    test("🚫 Attempting to register an admin as a regular user (should fail)", async () => {
        const res = await agent
            .post("/users/register/admin")
            .set("Cookie", regularUserCookies)
            .send({
                name: "New Admin",
                email: "admin@example.com",
                password: "adminpassword",
                role: "admin",
            });
        expect(res.statusCode).toBe(403);
        expect(res.body.message).toBe("Forbidden: Only admins can access this route");
    });

    test("🔼 Promote regular user to admin in MongoDB", async () => {
        await User.findOneAndUpdate({ email: "test@example.com" }, { role: "admin" });
    });

    test("🔄 Logging in as new admin user and store cookies", async () => {
        const res = await agent.post("/users/login").send({
            email: "test@example.com",
            password: "testpassword",
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Login successful");
        adminCookies = res.headers["set-cookie"]; // Store cookies
    });

    test("👑 Creating a new admin as an existing admin", async () => {
        const res = await agent
            .post("/users/register/admin")
            .set("Cookie", adminCookies)
            .send({
                name: "Second Admin",
                email: "secondadmin@example.com",
                password: "adminpassword",
                role: "admin",
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("User registered successfully as admin");
    });

    test("🚪 Testing admin-only endpoint (should succeed)", async () => {
        const res = await agent.get("/users/admin").set("Cookie", adminCookies);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Admin data retrieved successfully");
    });

    test("🚪 Testing admin-only endpoint with regular user token (should fail)", async () => {
        // 🚀 Step 1: Ensure the test user is a regular user
        await User.updateOne({ email: "test@example.com" }, { $set: { role: "parent" } });
    
        // 🚀 Step 2: Log in as the **updated regular user**
        const loginRes = await agent
            .post("/users/login")
            .send({ email: "test@example.com", password: "testpassword" });
    
        // 🚀 Step 3: Capture fresh session cookies
        const newRegularUserCookies = loginRes.headers["set-cookie"];
    
        // 🚀 Step 4: Attempt admin access with fresh **regular user session**
        const res = await agent.get("/users/admin").set("Cookie", newRegularUserCookies);
    
        console.log("🚨 DEBUG - Response Status:", res.statusCode);
        console.log("🚨 DEBUG - Response Body:", res.body);
    
        expect(res.statusCode).toBe(403);
        expect(res.body.message).toBe("Forbidden: Only admins can access this route");
    });

    test("🔓 Logging out admin", async () => {
        const res = await agent.post("/users/logout").set("Cookie", adminCookies);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Logged out successfully");
    });
});