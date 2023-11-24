const request = require('supertest')
const serverApp = require('../server')
const app = request(serverApp)

describe('POST /api/users/register', () => {
	test('registers a new user', async () => {
		const option = {
			email: 'okekedeborah@gmail.com',
			username: 'debee',
			password: 'password',
			first_name: 'Deborah',
			last_name: 'Okeke',
			phone_number: '08109210257'
		}
		const response = await app.post('/api/users/register').send(option)
		expect(response.status).toBe(201)
		expect(response.body).toHaveProperty('success', true)
	})
})
