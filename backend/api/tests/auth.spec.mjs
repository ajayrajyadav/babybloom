import { app, server } from '../index.js';
import request from 'supertest';
import mongoose from 'mongoose'; // ✅ Fix: Import mongoose

describe('Auth API Tests', () => {
  it('should return 400 if credentials are missing', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.statusCode).toEqual(400);
  });

  it('should return 201 for successful user registration', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: `test${Date.now()}@example.com`, // Unique email to avoid conflicts
      password: 'password123'
    });
    expect(res.statusCode).toEqual(201);
  });
});

// ✅ Close server after all tests
afterAll(async () => {
  await mongoose.connection.db.collection('users').deleteMany({ email: /test.*@example.com/ });
  if (server && server.close) {
    server.close();
  }
});