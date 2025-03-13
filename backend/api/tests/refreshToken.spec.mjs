import request from 'supertest';
import { app } from '../index.js';

describe('Token Refresh', () => {
  let refreshToken;

  beforeAll(async () => {
    const res = await request(app).post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'user123' });
    refreshToken = res.body.refreshToken;
  });

  it('Should return a new access token', async () => {
    const res = await request(app).post('/api/auth/refresh')
      .send({ token: refreshToken });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('Should reject an invalid refresh token', async () => {
    const res = await request(app).post('/api/auth/refresh')
      .send({ token: 'invalid_token' });

    expect(res.statusCode).toBe(403);
  });
});
