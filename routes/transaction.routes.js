const express = require('express')
const { initiateTransaction, handleTransaction, getTransactions, searchTransactions } = require('../controllers/transaction.controller')
const transactionRouter = express.Router()

transactionRouter.post('/create', initiateTransaction)
transactionRouter.post('/webhook/flutterwave', handleTransaction)

transactionRouter.get('', getTransactions)
transactionRouter.post('/search', searchTransactions)

module.exports = transactionRouter
