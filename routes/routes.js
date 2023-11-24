const express = require('express')
const userRouter = require('./user.routes')
const transactionRouter = require('./transaction.routes')
const router = express.Router()

router.get('', async (req, res) => res.send('Check https://github.com/debeemedia/thrindle_api#readme for documentation'))
router.use('/users', userRouter)
router.use('/transactions', transactionRouter)

module.exports = router
