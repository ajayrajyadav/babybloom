import request from 'supertest';
import { app } from '../index.js';
import mongoose from 'mongoose';

describe('Role-Based Access Control (RBAC)', () => {
  let adminToken, userToken;

  beforeAll(async () => {
    console.log("🚀 Ensuring test users exist...");

    // Login Admin to check if they exist
    let adminExists = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'password' });

    if (adminExists.statusCode !== 200) {
      console.log("⚠️ Admin user not found. Registering...");
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'admin@example.com', password: 'password', role: 'admin' });
    } else {
      console.log("✅ Admin user already exists.");
    }

    // Login Normal User to check if they exist
    let userExists = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'password' });

    if (userExists.statusCode !== 200) {
      console.log("⚠️ Normal user not found. Registering...");
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'user@example.com', password: 'password', role: 'user' });
    } else {
      console.log("✅ Normal user already exists.");
    }

    console.log("✅ Test users verified. Proceeding to login...");

    // Login Admin
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'password' });

    console.log("🔍 Admin Login Response:", adminRes.statusCode, adminRes.body);

    if (adminRes.statusCode !== 200 || !adminRes.body.accessToken) {
      throw new Error(`❌ Admin login failed: ${adminRes.statusCode} - ${adminRes.body.message || JSON.stringify(adminRes.body)}`);
    }

    adminToken = adminRes.body.accessToken;

    // Login Normal User
    const userRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'password' });

    console.log("🔍 User Login Response:", userRes.statusCode, userRes.body);

    if (userRes.statusCode !== 200 || !userRes.body.accessToken) {
      throw new Error(`❌ User login failed: ${userRes.statusCode} - ${userRes.body.message || JSON.stringify(userRes.body)}`);
    }

    userToken = userRes.body.accessToken;

    console.log("📝 Admin Token:", adminToken);
    console.log("📝 User Token:", userToken);

    expect(adminToken).toBeDefined();
    expect(userToken).toBeDefined();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('Should allow admin to access protected route', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);

    console.log("🔍 Admin Access Response:", res.statusCode, res.body);
    expect(res.statusCode).toBe(200);
  });

  it('Should deny normal user access to admin route', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${userToken}`);

    console.log("🔍 User Access Response:", res.statusCode, res.body);
    expect(res.statusCode).toBe(403);
  });
});