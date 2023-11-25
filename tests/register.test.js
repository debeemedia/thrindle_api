const request = require('supertest')
const serverApp = require('../server')
const app = request(serverApp)

beforeEach(async () => {
	await mongoose.connect(process.env.MONGODB_URL)
})

afterEach(async () => {
	await mongoose.connection.close()
})

describe('POST /api/users/register', () => {
	test('should register a new user', async () => {
		const option = {
			email: 'debeemediasolutions@gmail.com',
			username: 'debeemedia',
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
