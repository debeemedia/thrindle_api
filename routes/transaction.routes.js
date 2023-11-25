const express = require('express')
const { initiateTransaction, handleTransaction, getTransactions, searchTransactions, getTransactionByRef } = require('../controllers/transaction.controller')
const { authenticate } = require('../middleware/authentication')
const transactionRouter = express.Router()

transactionRouter.post('/create', authenticate, initiateTransaction)
transactionRouter.post('/webhook/flutterwave', handleTransaction)

transactionRouter.get('', authenticate, getTransactions)
transactionRouter.get('/:tx_ref', authenticate, getTransactionByRef)
transactionRouter.post('/search', authenticate, searchTransactions)

module.exports = transactionRouter
