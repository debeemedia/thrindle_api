require('dotenv').config()
const mongoose = require('mongoose')
const request = require('supertest')
const serverApp = require('../server')
const app = request(serverApp)

beforeEach(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URL)
})

afterEach(async () => {
    await mongoose.connection.close()
})

describe('POST /api/users/login', () => {
	test('allows a user to login', async () => {
		const option = {
			username: 'debee',
			password: 'password'
		}
		const response = await app.post('/api/users/login').send(option)
		expect(response.status).not.toBe(200)
		expect(response.body).toHaveProperty('success', false)
		expect(response.body).toHaveProperty('message', 'User is not verified')
	})
	test('should allow a user to login', async () => {
		const option = {
			email: 'okekedeborah@gmail.com',
			password: 'password'
		}
		const response = await app.post('/api/users/login').send(option)
		expect(response.status).toBe(200)
		expect(response.body).toHaveProperty('success', true)
	})
})
