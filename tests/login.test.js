require('dotenv').config()
require('./tests.setup')
const request = require('supertest')
const serverApp = require('../server')
const app = request(serverApp)

describe('POST /api/users/login', () => {
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
