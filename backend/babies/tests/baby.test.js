const request = require('supertest');
const app = require('../index');

describe('Baby Service API Tests', () => {
  it('should create a new baby profile', async () => {
    const res = await request(app)
      .post('/api/babies/')
      .send({ name: 'Baby Test', birthdate: '2023-01-01', gender: 'Male', userId: '123456789' });
    expect(res.status).toBe(201);
  });
});
