const express = require('express')
const { initiateTransaction, handleTransaction, getTransactions, searchTransactions } = require('../controllers/transaction.controller')
const { authenticate } = require('../middleware/authentication')
const transactionRouter = express.Router()

transactionRouter.post('/create', authenticate, initiateTransaction)
transactionRouter.post('/webhook/flutterwave', handleTransaction)

transactionRouter.get('', authenticate, getTransactions)
transactionRouter.post('/search', authenticate, searchTransactions)

module.exports = transactionRouter
