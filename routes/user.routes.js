const express = require('express')
const { register } = require('../controllers/register.controller')
const { login } = require('../controllers/login.controller')
const { verifyMail, sendConfirmationMail } = require('../controllers/verify.mail.controller')
const userRouter = express.Router()

userRouter.post('/register', register)
userRouter.post('/login', login)

userRouter.post('/verify', verifyMail, sendConfirmationMail)

module.exports = userRouter
