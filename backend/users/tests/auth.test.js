require('dotenv').config();
const request = require('supertest');
const app = require('../index'); // Now correctly importing app instance
const mongoose = require('mongoose');
const User = require('../models/userModel');

let adminToken;
let userToken;

describe('🔐 Authentication & Admin Tests', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('📝 Register a new regular user', async () => {
        const res = await request(app)
            .post('/users/register')
            .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('User registered successfully as parent');
    });

    test('🔐 Login as the regular user', async () => {
        const res = await request(app)
            .post('/users/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
        userToken = res.body.token;
    });

    test('🚫 Attempting to register an admin as a regular user (should fail)', async () => {
        const userLogin = await request(app)
            .post('/users/login')
            .send({ email: 'test@example.com', password: 'password123' });
    
        const userToken = userLogin.body.token; // Get the token of the regular user
    
        const res = await request(app)
            .post('/users/register/admin')
            .set('Authorization', `Bearer ${userToken}`) // Attach regular user's token
            .send({ name: 'New Admin', email: 'newadmin@example.com', password: 'adminpassword', role: 'admin' });
    
        expect(res.statusCode).toBe(403);
        expect(res.body.message).toBe('Only admins can create admin users');
    });

    test('🔼 Promote regular user to admin in MongoDB', async () => {
        await User.updateOne({ email: "test@example.com" }, { role: "admin" });

        const updatedUser = await User.findOne({ email: "test@example.com" });
        expect(updatedUser.role).toBe("admin");
    });

    test('🔄 Logging in as new admin user', async () => {
        const res = await request(app)
            .post('/users/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
        adminToken = res.body.token;
    });

    test('👑 Creating a new admin as an existing admin', async () => {
        const res = await request(app)
            .post('/users/register/admin')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'New Admin', email: 'newadmin@example.com', password: 'adminpassword', role: 'admin' });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('User registered successfully as admin');
    });

    test('🚪 Testing admin-only endpoint (should succeed)', async () => {
        const res = await request(app)
            .get('/users/admin')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Admin access granted');
    });

    test('🚪 Testing admin-only endpoint with regular user token (should fail)', async () => {
        const res = await request(app)
            .get('/users/admin')
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toBe(403);
        expect(res.body.message).toBe('Only admins can access this route');
    });

    test('🔓 Logging out admin', async () => {
        const res = await request(app)
            .post('/users/logout')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Logged out successfully');
    });

});