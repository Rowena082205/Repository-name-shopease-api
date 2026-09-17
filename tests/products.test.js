const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

beforeAll(async () => {
	await mongoose.connect(process.env.MONGO_URI_TEST, {
		runtimeAdapters: { os: require('os') }
	});

	await request(app)
		.post('/api/auth/register')
		.send({
			name: 'Jest Test User',
			email: 'jest-test@example.com',
			password: 'Password123!'
		});

	const loginRes = await request(app)
		.post('/api/auth/login')
		.send({
			email: 'jest-test@example.com',
			password: 'Password123!'
		});

	global.testToken = loginRes.body.token;
});

afterAll(async () => {
	await mongoose.connection.close();
});

describe('POST /api/products', () => {
	it('rejects a negative price', async () => {
		const res = await request(app)
			.post('/api/products')
			.set('Authorization', `Bearer ${global.testToken}`)
			.send({ name: 'Bad Item', price: -10, category: 'Electronics' });

		expect(res.statusCode).toBe(400);
	});

	it('creates a product with valid data', async () => {
		const res = await request(app)
			.post('/api/products')
			.set('Authorization', `Bearer ${global.testToken}`)
			.send({ name: 'Wireless Mouse', price: 799, category: 'Electronics' });

		expect(res.statusCode).toBe(201);
		expect(res.body.name).toBe('Wireless Mouse');
	});
});
