const request = require('supertest');
const path = require('path');
const fs = require('fs');

const api = request('http://localhost:8080');
const cookiesPath = path.join(__dirname, '../../cookies.integration.txt');

describe('🌐 Integration: User, Baby & Activity Services via API Gateway', () => {
  let babyId;
  let sleepLogId;

  const user = {
    name: "Integration User",
    email: "integration@example.com",
    password: "password123"
  };

  const baby = {
    name: "Integration Baby",
    birthdate: "2023-01-01",
    gender: "Female"
  };

  beforeAll(async () => {
    await api.post('/api/users/register')
      .send(user)
      .set('Content-Type', 'application/json');

    await api.post('/api/users/login')
      .send({ email: user.email, password: user.password })
      .set('Content-Type', 'application/json')
      .expect(200)
      .then(res => {
        const raw = res.headers['set-cookie'];
        fs.writeFileSync(cookiesPath, raw.join(';'));
      });
  });

  const getCookie = () => fs.readFileSync(cookiesPath, 'utf8');

  test('🍼 Should create a baby profile', async () => {
    const res = await api.post('/api/babies/')
      .set('Cookie', getCookie())
      .send(baby)
      .expect(201);

    expect(res.body.name).toBe(baby.name);
    babyId = res.body._id;
  });

  test('📋 Should retrieve baby list for logged-in user', async () => {
    const res = await api.get('/api/babies/')
      .set('Cookie', getCookie())
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.find(b => b._id === babyId)).toBeDefined();
  });

  test('🔍 Should get specific baby by ID', async () => {
    const res = await api.get(`/api/babies/${babyId}`)
      .set('Cookie', getCookie())
      .expect(200);

    expect(res.body._id).toBe(babyId);
  });

  test('😴 Should log and complete a sleep activity', async () => {
    const startRes = await api.post(`/api/activity/sleep`)
      .set('Cookie', getCookie())
      .send({ babyId, startTime: new Date().toISOString(), notes: "Nap" })
      .expect(201);

    expect(startRes.body.data.status).toBe("open");
    sleepLogId = startRes.body.data._id;

    const endRes = await api.patch(`/api/activity/sleep/${sleepLogId}`)
      .set('Cookie', getCookie())
      .send({ endTime: new Date(Date.now() + 3600000).toISOString() })
      .expect(200);

    expect(endRes.body.data.status).toBe("completed");
  });

  test('🍽️ Should log and complete a feeding activity', async () => {
    const feedRes = await api.post(`/api/activity/feeding`)
      .set('Cookie', getCookie())
      .send({
        babyId,
        startTime: new Date().toISOString(),
        amount: 100,
        method: "bottle",
        notes: "Lunch"
      })
      .expect(201);

    expect(feedRes.body.data.type).toBe("feeding");

    const endRes = await api.patch(`/api/activity/feeding/${feedRes.body.data._id}`)
      .set('Cookie', getCookie())
      .send({ endTime: new Date(Date.now() + 1200000).toISOString() })
      .expect(200);

    expect(endRes.body.data.status).toBe("completed");
  });

  test('🧷 Should log a diaper change', async () => {
    const res = await api.post(`/api/activity/diaper`)
      .set('Cookie', getCookie())
      .send({
        babyId,
        time: new Date().toISOString(),
        contents: "BM",
        color: "yellow",
        notes: "Seedy BM"
      })
      .expect(201);

    expect(res.body.data.type).toBe("diaper");
  });

  test('📊 Should get summary', async () => {
    const res = await api.get(`/api/activity/summary/${babyId}`)
      .set('Cookie', getCookie())
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.totalSleep).toBeDefined();
  });

  test('📈 Should get dashboard data', async () => {
    const res = await api.get(`/api/activity/dashboard/${babyId}`)
      .set('Cookie', getCookie())
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.diaperStats).toBeDefined();
  });

  test('🗑️ Should delete baby profile', async () => {
    await api.delete(`/api/babies/${babyId}`)
      .set('Cookie', getCookie())
      .expect(200);
  });

  test('🚫 Should not create baby without login', async () => {
    await api.post('/api/babies/')
      .send(baby)
      .expect(401);
  });

  afterAll(() => {
    if (fs.existsSync(cookiesPath)) {
      fs.unlinkSync(cookiesPath);
    }
  });
});