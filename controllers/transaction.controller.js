require('dotenv').config()
const TransactionModel = require("../models/transaction.model")
const UserModel = require("../models/user.model")
const debeerandomgen = require('debeerandomgen')
const { buildEmailTemplate, sendMail } = require('../utils/send.mail')
const base_api_url = 'https://api.flutterwave.com/v3'

async function initiateTransaction (req, res) {
	try {
		// destructure user input from request body
		const {amount} = +req.body

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

		// send mail to the user
		const emailOption = {
			to: user.email,
			from: 'Thrindle',
			subject: 'Transaction Initiation Successful',
			html: await buildEmailTemplate('transaction.creation.ejs', transaction)
		}
		sendMail(emailOption, res)

		// send a response
		res.status(201).json({success: true, message: 'Transaction initiated successfully'})

	} catch (error) {
		console.error(error.message)
		res.status(500).json({success: false, message: 'Transaction initiation unsuccessful'})
	}
}

async function handleTransaction (req, res) {
	try {
		// use hash in the webhook to verify the authenticity of the payload
		const hash = process.env.FLUTTERWAVE_WEBHOOK_HASH
		const signature = req.headers.verif-hash
		if (!signature) {
			return res.status(401).json({success: false, message: 'No secret hash provided'})
		}
		if (signature != hash) {
			return res.status(401).json({success: false, message: 'Invalid secret hash'})
		}

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

			// send mail to the user
			const emailOption = {
				to: user.email,
				from: 'Thrindle',
				subject: 'Transaction Completed',
				html: await buildEmailTemplate('transaction.successful.ejs', transaction)
			}
			sendMail(emailOption, res)

		} else if (payload.data.status === 'failed') {
			// update transaction record to failed
			await TransactionModel.findByIdAndUpdate(transaction_id, {status: 'failed'})

			// send mail to the user
			const emailOption = {
				to: user.email,
				from: 'Thrindle',
				subject: 'Transaction Failed',
				html: await buildEmailTemplate('transaction.failed.ejs', transaction)
			}
			sendMail(emailOption, res)
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
		// get the id of the logged-in user
		const user_id = req.user.id
		// find the user's transactions
		const transactions = await TransactionModel.find({user_id}).select('-__v')
		// check if there are transaction records
		if (!transactions) {
			return res.status(404).json({success: false, message: 'No transactions found'})
		}
		// return response
		res.status(200).json({success: true, message: transactions})

	} catch (error) {
		console.error(error.message)
		res.status(500).json({success: false, message: 'Internal server error'})
	}
}

async function searchTransactions (req, res) {
	try {
		// get the search query which is the tx_ref as well as page and limit for pagination from the request body
		const {tx_ref} = req.body
		const {page} = +req.body || 1 // set defaults
		const {limit} = +req.body || 10 // set defaults

		// check if tx_ref is provided
		if (!tx_ref) {
			return res.status(400).json({success: false, message: 'Please provide tx_ref'})
		}

		// implement pagination
		const skip = (page - 1) * limit
		const transactions = await TransactionModel.find({$text: {$search: tx_ref}}).skip(skip).limit(limit)

		// check if there are transactions available for the search
		if (!transactions || transactions.length < 1) {
			return res.status(404).json({success: false, message: 'No transactions found'})
		}

		// count the relevant search documents in the transaction collection and find the total pages
		const totalCount = await TransactionModel.countDocuments({$text: {$search: tx_ref}})
		const totalPages = Math.ceil(totalCount / limit)

		// return the transaction search results and the pagination details
		res.status(200).json({sucess: true, message: {transactions, pagination: {page, limit, totalPages, totalCount}}})
		
	} catch (error) {
		console.error(error.message)
		res.status(500).json({success: false, message: 'Internal server error'})
	}
}

module.exports = {
	initiateTransaction,
	handleTransaction,
	getTransactions,
	searchTransactions
}
