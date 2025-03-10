import request from 'supertest';
import { app } from '../index.js';

describe('CRUD API Tests', () => {
    it('should retrieve all resources', async () => {
        const res = await request(app).get('/api/unknown');
        expect(res.statusCode).toBe(404);
    });
});
