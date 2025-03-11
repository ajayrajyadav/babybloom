import request from 'supertest';
import { app, server } from '../index.js';
import mongoose from 'mongoose';

describe('Logout API Tests', () => {
    let token;

    beforeAll(async () => {
        // Register a user
        await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@example.com', password: 'password123' });

        // Login to get a token
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'password123' });

        token = res.body.token;
    });

    afterAll(async () => {
        await mongoose.connection.close(); // Close DB connection
    });

    it('should log out successfully', async () => {
        const res = await request(app)
            .post('/api/auth/logout')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Logout successful');
    });

    it('should fail if no token is provided', async () => {
        const res = await request(app)
            .post('/api/auth/logout');

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Not authorized, no token');
    });

    it('should fail if an invalid token is provided', async () => {
        const res = await request(app)
            .post('/api/auth/logout')
            .set('Authorization', 'Bearer invalid_token');

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Not authorized, token failed');
    });
    afterAll((done) => {
        mongoose.connection.close();
        done();
    });
});