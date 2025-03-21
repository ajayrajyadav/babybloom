const request = require('supertest');
const path = require('path');
const fs = require('fs');

// Base URL for API Gateway
const api = request('http://localhost:8080');

// New path for cookie storage relative to backend/tests/integration/
const cookiesPath = path.join(__dirname, '../../cookies.integration.txt');

describe('🌐 Integration: User & Baby Service via API Gateway', () => {
  let babyId;

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

  test('🍼 Should create a baby profile', async () => {
    const cookie = fs.readFileSync(cookiesPath, 'utf8');
    const res = await api.post('/api/babies/')
      .set('Cookie', cookie)
      .send(baby)
      .expect(201);

    expect(res.body.name).toBe(baby.name);
    babyId = res.body._id;
  });

  test('📋 Should retrieve baby list for logged-in user', async () => {
    const cookie = fs.readFileSync(cookiesPath, 'utf8');
    const res = await api.get('/api/babies/')
      .set('Cookie', cookie)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.find(b => b._id === babyId)).toBeDefined();
  });

  test('🔍 Should get specific baby by ID', async () => {
    const cookie = fs.readFileSync(cookiesPath, 'utf8');
    const res = await api.get(`/api/babies/${babyId}`)
      .set('Cookie', cookie)
      .expect(200);

    expect(res.body._id).toBe(babyId);
  });

  test('🗑️ Should delete baby profile', async () => {
    const cookie = fs.readFileSync(cookiesPath, 'utf8');
    await api.delete(`/api/babies/${babyId}`)
      .set('Cookie', cookie)
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