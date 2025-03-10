import { app } from '../index.js';
import request from 'supertest';

describe('Auth API Tests', () => {
  it('should return 400 if credentials are missing', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.statusCode).toEqual(400);
  });

  it('should return 201 for successful user registration', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(res.statusCode).toEqual(201);
  });
});

// ✅ Close server after all tests
afterAll((done) => {
  if (server?.close) server.close();
  done();
});