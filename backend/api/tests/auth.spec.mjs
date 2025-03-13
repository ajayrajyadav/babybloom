import request from 'supertest';
import { app } from '../index.js';

describe('Role-Based Access Control (RBAC)', () => {
  let adminToken, userToken;

  beforeAll(async () => {
    const adminRes = await request(app).post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'admin123' });
    adminToken = adminRes.body.token;

    const userRes = await request(app).post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'user123' });
    userToken = userRes.body.token;
  });

  it('Should allow admin to access protected route', async () => {
    const res = await request(app).get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });

  it('Should deny normal user access to admin route', async () => {
    const res = await request(app).get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });
});
