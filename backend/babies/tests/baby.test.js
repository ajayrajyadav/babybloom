const request = require('supertest');
require('dotenv').config();
const mongoose = require('mongoose');

const baseUrl = 'http://localhost:8080/api';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.disconnect();
});

// Helper to register and login
const createUserAndLogin = async () => {
  const agent = request.agent(baseUrl);
  const email = `test-${Date.now()}@example.com`;
  const password = 'password123';

  await agent.post('/users/register').send({
    name: 'Test User',
    email,
    password
  });

  const loginRes = await agent.post('/users/login').send({
    email,
    password
  });

  const cookies = loginRes.headers['set-cookie'];
  return { agent, cookies };
};

describe('👶 Baby Service Tests via Gateway', () => {
  test('🍼 Create baby profile', async () => {
    const { agent, cookies } = await createUserAndLogin();

    const res = await agent
      .post('/babies/')
      .set('Cookie', cookies)
      .send({ name: 'Test Baby', birthdate: '2023-01-01', gender: 'Male' });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test Baby');
  });

  test('📋 Get all babies for logged-in user', async () => {
    const { agent, cookies } = await createUserAndLogin();

    const createRes = await agent
      .post('/babies/')
      .set('Cookie', cookies)
      .send({ name: 'List Baby', birthdate: '2023-01-01', gender: 'Male' });

    const babyId = createRes.body._id;

    const res = await agent
      .get('/babies/')
      .set('Cookie', cookies);

    expect(res.statusCode).toBe(200);
    const found = res.body.find(b => b._id === babyId);
    console.log("🧪 Found Baby in List:", found);
    expect(found).toBeDefined();
  });

  test('🔍 Get specific baby by ID', async () => {
    const { agent, cookies } = await createUserAndLogin();

    const createRes = await agent
      .post('/babies/')
      .set('Cookie', cookies)
      .send({ name: 'Specific Baby', birthdate: '2023-01-01', gender: 'Male' });

    const babyId = createRes.body._id;

    const res = await agent
      .get(`/babies/${babyId}`)
      .set('Cookie', cookies);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(babyId);
  });

  test('✏️ Update baby profile', async () => {
    const { agent, cookies } = await createUserAndLogin();

    const createRes = await agent
      .post('/babies/')
      .set('Cookie', cookies)
      .send({ name: 'Old Name', birthdate: '2023-01-01', gender: 'Male' });

    const babyId = createRes.body._id;

    const res = await agent
      .put(`/babies/${babyId}`)
      .set('Cookie', cookies)
      .send({ name: 'Updated Baby' });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Baby');
  });

  test('🚫 Fail to create baby without auth', async () => {
    const res = await request(baseUrl)
      .post('/babies/')
      .send({ name: 'Unauthorized Baby', birthdate: '2023-01-01', gender: 'Male' });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/No token, authorization denied/);
  });

  test('🗑️ Delete baby profile', async () => {
    const { agent, cookies } = await createUserAndLogin();

    const createRes = await agent
      .post('/babies/')
      .set('Cookie', cookies)
      .send({ name: 'Delete Baby', birthdate: '2023-01-01', gender: 'Male' });

    const babyId = createRes.body._id;

    const res = await agent
      .delete(`/babies/${babyId}`)
      .set('Cookie', cookies);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Baby profile deleted');
  });
});