const mongoose = require('mongoose')

const transactionSchema = mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	tx_ref: {
		type: String,
		required: true
	},
	payment_gateway: {
		type: String,
		required: true,
		default: 'Flutterwave'
	},
	payment_method: {
		type: String,
		required: true,
		default: 'Bank Transfer'
	},
	currency: {
		type: String,
		required: true,
		default: 'NGN'
	},
	amount: {
		type: Number,
		required: true
	},
	status: {
		type: String,
		enum: ['pending', 'successful', 'failed'],
		required: true,
		default: 'pending'
	}
}, {timestamps: true})

// enable search text indexes
transactionSchema.index = ({status: 'text'})

const TransactionModel = mongoose.model('Transaction', transactionSchema)

module.exports = TransactionModel
