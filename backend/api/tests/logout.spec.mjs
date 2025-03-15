import request from 'supertest';
import { app, server } from '../index.js';
import mongoose from 'mongoose';

describe('Logout API Tests', () => {
    let token;
    let refreshToken;

    beforeAll(async () => {
        console.log("🚀 Registering Test User...");
        await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@example.com', password: 'password123' });

        console.log("🔑 Logging in Test User...");
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'password123' });

        console.log("✅ Login Response:", res.body);

        // Extract access token
        token = res.body.accessToken;
        
        // Extract refresh token from set-cookie header
        const cookies = res.headers['set-cookie'];
        refreshToken = cookies ? cookies.find(cookie => cookie.startsWith('refreshToken=')) : undefined;

        console.log("📝 Stored Token:", token);
        console.log("🍪 Stored Refresh Token:", refreshToken);

        // Ensure token and refreshToken exist before proceeding
        expect(token).toBeDefined();
        expect(refreshToken).toBeDefined();
    });

    afterAll(async () => {
        await mongoose.connection.close(); // Close DB connection
        if (server) server.close(); // Close server only if it exists
    });

    it('should log out successfully', async () => {
        console.log("🚪 Logging out user...");
        const res = await request(app)
            .post('/api/auth/logout')
            .set('Authorization', `Bearer ${token}`)
            .set('Cookie', refreshToken); // Use extracted cookie directly

        console.log("🔍 Logout Response:", res.body);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Logged out successfully');
    });

    it('should fail if no token is provided', async () => {
        const res = await request(app)
            .post('/api/auth/logout');

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/no token/i);
    });

    it('should fail if an invalid token is provided', async () => {
        const res = await request(app)
            .post('/api/auth/logout')
            .set('Authorization', 'Bearer invalid_token')
            .set('Cookie', [`refreshToken=invalid_token`]); // Set an invalid refresh token

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/token failed/i);
    });
});