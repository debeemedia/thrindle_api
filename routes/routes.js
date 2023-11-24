const express = require('express')
const userRouter = require('./user.routes')
const transactionRouter = require('./transaction.routes')
const router = express.Router()

router.use('/users', userRouter)
router.use('/transactions', transactionRouter)

module.exports = router
