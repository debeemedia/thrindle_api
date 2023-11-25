require('dotenv').config()
const mongoose = require('mongoose')
const request = require('supertest')
const serverApp = require('../server')
const app = request(serverApp)

let server

beforeAll(async () => {
	await mongoose.connect(process.env.MONGODB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});

afterAll(async () => {
	await mongoose.connection.close()
	if (server) {
		await server.close();

	}
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
