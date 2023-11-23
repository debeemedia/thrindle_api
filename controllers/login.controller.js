require('dotenv').config
const UserModel = require("../models/user.model");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function login (req, res) {
	try {
		// destructure user input from request body
		const {
			email,
			username,
			password
		} = req.body

		// check for required fields (allow login with password and either email or username)
		if (!password && (!email || !username)) {
			return res.status(400).json({success: false, message: 'Please provide login details'})
		}

		// find the user by email or username
		const user = await UserModel.findOne({$or: [{email}, {username}]}, '-__v')
		// check if user exists
		if (!user) {
			return res.status(404).json({success: false, message: 'User not found'})
		}

		// compare password and issue token
		bcrypt.compare(password, user.password, (err, result) => {
			if (result === true) {
				const token = jwt.sign({id: user._id, username: user.username}, process.env.TOKEN_SECRET, {expiresIn: '1h'})

				return res.status(200).json({success: true, message: token})
			} else {
				return res.status(401).json({success: false, message: 'Incorrect credentials'})
			}
		})

	} catch (error) {
		console.error(error.message)
		res.status(500).json({success: true, message: 'Internal server error'})
	}
}

module.exports = {login}