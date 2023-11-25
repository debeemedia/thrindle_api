const UserModel = require("../models/user.model");
const { buildEmailTemplate, sendMail } = require("../utils/send.mail")

async function register (req, res) {
	try {
		// destructure user input from request body
		const {
			email,
			username,
			password,
			first_name,
			last_name,
			phone_number
		} = req.body

		// check for required fields
		if (!email || !username || !password || !first_name || !last_name) {
			return res.status(400).json({success: false, message: 'Please provide required fields'})
		}

		// check if email and username exist
		const existingEmail = await UserModel.findOne({email})
		if (existingEmail) {
			return res.status(400).json({success: false, message: 'Email already exists'})
		}
		const existingUsername = await UserModel.findOne({username})
		if (existingUsername) {
			return res.status(400).json({success: false, message: 'Username already exists'})
		}

		// save user to database
		const user = new UserModel({
			email,
			username,
			password,
			first_name,
			last_name,
			phone_number
		})

		await user.save()

		// send welcome message with verification link to user
		const emailOption = {
			to: email,
			from: 'Thrindle',
			subject: 'Registration Successful',
			html: await buildEmailTemplate('welcome.message.ejs', user)
		}
		await sendMail(emailOption, res)

		// return response to client
		res.status(201).json({success: true, message: 'User registration successful'})

	} catch (error) {
		console.error(error.message)
		res.status(500).json({success: false, message: 'Internal server error'})
	}
}

module.exports = {register}
