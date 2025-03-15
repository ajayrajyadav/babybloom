import request from 'supertest';
import { app, server } from '../index.js';
import { authorizeRoles } from "../middleware/roleMiddleware.js";

describe('CRUD API Tests', () => {
    it('should retrieve all resources', async () => {
        const res = await request(app).get('/api/unknown');
        expect(res.statusCode).toBe(404);
    });
    afterAll(async () => {
        if (server) {
          await new Promise((resolve) => server.close(resolve));
        }
    });
});
