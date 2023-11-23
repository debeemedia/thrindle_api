const TransactionModel = require("../models/transaction.model")
const UserModel = require("../models/user.model")
const debeerandomgen = require('debeerandomgen')
const base_api_url = 'https://api.flutterwave.com/v3'

async function initiateTransaction (req, res) {
	try {
		// destructure user input from request body
		const {amount, narration} = req.body

		// find the id of the logged-in user, then find the user from the database
		const user_id = req.user.id
		const user = await UserModelfindById(user_id)

		// define transaction details for flutterwave and generate unique tx_ref
		const transactionData = {
			amount,
			currency: 'NGN',
			email: user.email,
			phone_number: user.phone_number,
			full_name: `${user.first_name} ${user.last_name}`,
			tx_ref: `TXN-${debeerandomgen(8)}`,
			narration: 'Thrindle'
		}

		// make post request to flutterwave transfer charge endpoint
		const response = await axios.post(`${base_api_url}/`)

		// create a transaction record and save to the database
		const transaction = new TransactionModel({
			user_id,
			tx_ref,
			amount,
			status: 'pending'
		})
	} catch (error) {
		console.error(error.message)
		res.status(500).json({success: true, message: 'Internal server error'})
	}
}