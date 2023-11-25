require('dotenv').config()
const mongoose = require('mongoose')
const request = require('supertest')
const serverApp = require('../server')
const app = request(serverApp)

beforeAll(async () => {
	await mongoose.connect(process.env.MONGODB_URL)
});

afterAll(async () => {
	await mongoose.connection.close()
})

describe('POST /api/users/register', () => {
	test('should register a new user', async () => {
		const option = {
			email: 'user1@gmail.com',
			username: 'user1',
			password: 'password',
			first_name: 'User',
			last_name: 'Test',
			phone_number: '081023456789'
		}
		const response = await app.post('/api/users/register').send(option)
		expect(response.status).toBe(201)
		expect(response.body).toHaveProperty('success', true)
	})
})
