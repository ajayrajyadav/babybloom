const request = require("supertest");
const mongoose = require("mongoose");
require("dotenv").config();

const baseUrl = "http://localhost:8080/api";
let agent;
let cookies;
let babyId;
let sleepLogId;

beforeAll(async () => {
  agent = request.agent(baseUrl);
  // agent = request.agent(app);
  const email = `test-${Date.now()}@example.com`;
  const password = "password123";

  await agent.post("/users/register/").send({
    name: "Test User",
    email,
    password,
  }).expect(201);

  const loginRes = await agent.post("/users/login/").send({
    email,
    password,
  }).expect(200);

  cookies = loginRes.headers["set-cookie"];

  const babyRes = await agent
    .post("/babies/")
    .set("Cookie", cookies)
    .send({ name: "Test Baby", birthdate: "2023-05-01", gender: "Female" })
    .expect(201);

  babyId = babyRes.body._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  console.log("🔌 Disconnected from MongoDB after activity tests");
});

describe("🍼 Activity Log Endpoints", () => {
  test("🛏️ should create a sleep start log", async () => {
    const res = await agent
      .post("/activity/sleep/")
      .set("Cookie", cookies)
      .send({
        babyId,
        startTime: "2025-03-27T07:00:00Z",
        notes: "Test Nap",
      })
      .expect(201);

    expect(res.body.data.status).toBe("open");
    sleepLogId = res.body.data._id;
  });

  test("😴 should complete the sleep log", async () => {
    const res = await agent
      .patch(`/activity/sleep/${sleepLogId}`)
      .set("Cookie", cookies)
      .send({ endTime: "2025-03-27T08:00:00Z" })
      .expect(200);

    expect(res.body.data.status).toBe("completed");
    expect(res.body.data.duration).toBe(60); // 1 hour in minutes
  });

  test("🍽️ should create and complete a feeding log", async () => {
    const res = await agent
      .post("/activity/feeding")
      .set("Cookie", cookies)
      .send({
        babyId,
        startTime: "2025-03-27T07:00:00Z",
        endTime: "2025-03-27T08:00:00Z",
        amount: 90,
        method: "bottle",
        notes: "Test Feeding"
      })
      .expect(201);
  
    const feedingId = res.body.data._id;
  
    // Optionally test the PATCH if desired
    const updateRes = await agent
      .patch(`/activity/feeding/${feedingId}`)
      .set("Cookie", cookies)
      .send({
        endTime: "2025-03-27T08:00:00Z"
      })
      .expect(200);
  
    expect(updateRes.body.success).toBe(true);
  });

  test("🧷 should log a diaper change", async () => {
    const res = await agent
      .post("/activity/diaper/")
      .set("Cookie", cookies)
      .send({
        babyId,
        time: "2025-03-27T10:00:00Z",
        type: "diaper", // ✅ important
        contents: "BM",
        color: "yellow",
        notes: "Seedy",
      })
      .expect(201);

    expect(res.body.data.type).toBe("diaper");
  });

  test("📊 should get summary", async () => {
    const res = await agent
      .get(`/activity/summary/${babyId}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body.data).toHaveProperty("totalSleep");
    expect(res.body.data).toHaveProperty("totalFeeding");
    expect(res.body.data).toHaveProperty("diaperStats");
  });

  test("📈 should get dashboard data", async () => {
    const res = await agent
      .get(`/activity/dashboard/${babyId}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body.data).toHaveProperty("period");
    expect(res.body.data).toHaveProperty("diaperStats");
  });

  test("🕒 should get last sleep log", async () => {
    const res = await agent
      .get(`/activity/sleep/last/${babyId}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.type).toBe("sleep");
  });

  test("🍼 should get last feeding log", async () => {
    const res = await agent
      .get(`/activity/feeding/last/${babyId}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.type).toBe("feeding");
  });

  test("🧷 should get last diaper log", async () => {
    const res = await agent
      .get(`/activity/diaper/last/${babyId}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.type).toBe("diaper");
  });

  test("📂 should get completed sleep logs", async () => {
    const res = await agent
      .get(`/activity/sleep/completed/${babyId}?period=daily`)
      .set("Cookie", cookies)
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("🥣 should get completed feeding logs", async () => {
    const res = await agent
      .get(`/activity/feeding/completed/${babyId}?period=daily`)
      .set("Cookie", cookies)
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("🧻 should get completed diaper logs", async () => {
    const res = await agent
      .get(`/activity/diaper/completed/${babyId}?period=daily`)
      .set("Cookie", cookies)
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
  });
});