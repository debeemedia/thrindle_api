const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true
	},
	username: {
		type: String,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	},
	first_name: {
		type: String,
		required: true,
		trim: true
	},
	last_name: {
		type: String,
		required: true,
		trim: true
	},
	phone_number: {
		type: String,
		trim: true
	},
	verified: {
		type: Boolean,
		default: false
	}
})

// hash user password before saving
userSchema.pre('save', async (next) => {
	const user = this
	try {
		if (user.isModified('password')) {
			const hashedPassword = await bcrypt.hash(user.password, 10)
			user.password = hashedPassword

		}
	} catch (error) {
		return next(error)
	}
})

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel
