require('dotenv').config()
const mongoose = require('mongoose')
const request = require('supertest')
const serverApp = require('../server')
const app = request(serverApp)

beforeEach(async () => {
	await mongoose.connect(process.env.MONGODB_URL)
})

afterEach(async () => {
	await mongoose.connection.close()
})

describe('POST /api/transactions/create', () => {
	test('should initiate a transaction for the logged-in user', async () => {
		const option = {
			amount: 10
		}
		const response = await app.post('/api/transactions/create').send(option)
		expect(response.status).toBe(201)
		expect(response.body).toHaveProperty('success', true)
	})
})

describe('GET /api/transactions', () => {
	test('should get all transactions by the logged-in user', async () => {
		const response = await app.get('/api/transactions')
		expect(response.status).toBe(200)
		expect(response.body).toHaveProperty('success', true)
	})
})

describe('POST /api/transactions/search', () => {
	test('should search for a logged-in user\'s transaction', async () => {
		const option = {
			status: 'pending'
		}
		const response = await app.post('/api/transactions/search').send(option)
		expect(response.status).toBe(200)
		expect(response.body).toHaveProperty('success', true)
	})
})
