require('dotenv').config()
const TransactionModel = require("../models/transaction.model")
const UserModel = require("../models/user.model")
const debeerandomgen = require('debeerandomgen')
const base_api_url = 'https://api.flutterwave.com/v3'

async function initiateTransaction (req, res) {
	try {
		// destructure user input from request body
		const {amount} = req.body

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
		const response = await axios.post(`${base_api_url}/charges?type=bank_transfer`, JSON.stringify(transactionData), {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
			}
		})

		console.log(response.data)

		// create a transaction record and save to the database
		const transaction = new TransactionModel({
			user_id,
			tx_ref,
			amount,
			status: 'pending'
		})
		await transaction.save()

		// send a response
		res.status(201).json({success: true, message: 'Transaction initiated successfully'})

	} catch (error) {
		console.error(error.message)
		res.status(500).json({success: false, message: 'Transaction initiation unsuccessful'})
	}
}

async function handleTransaction (req, res) {
	try {
		// get payload from flutterwave and find the user and transaction records in the database
		const payload = req.body
		const email = payload.data.customer.email
		const tx_ref = payload.data.tx_ref
		const user = await UserModel.findOne({email})
		const transaction = await TransactionModel.findOne({tx_ref})
		const transaction_id = transaction._id

		// check if transaction was successful
		if (payload.data.status === 'successful' && payload.data.charged_amount >= payload.data.amount) {
			// update transaction record to completed
			await TransactionModel.findByIdAndUpdate(transaction_id, {status: 'completed'})

		} else if (payload.data.status === 'failed') {
			// update transaction record to failed
			await TransactionModel.findByIdAndUpdate(transaction_id, {status: 'failed'})

		}
		// acknowledge webhook and return 200 status code to flutterwave
		res.status(200)

	} catch (error) {
		console.error(error.message)
		res.status(500).json({success: false, message: 'Internal server error'})
	}
}

async function getTransactions (req, res) {
	try {
		
	} catch (error) {
		
	}
}

module.exports = {
	initiateTransaction,
	handleTransaction
}
