// import packages
require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ejs = require('ejs')
const cors = require('cors')
const router = require('./routes/routes')

// use middleware
app.use(cors())
app.use(express.json())

// set views
app.set('views', './views')
app.set('view engine', 'ejs')

// use router
app.get('/', async (req, res) => res.send('deBee welcomes you to Thrindle! For api, go to /api'))
app.use('/api', router)

// error-handling middleware
app.use((err, req, res, next) => {
	if (err) {
		res.json({success: false, message: err.message})
	}
	next()
})

// define port
const port = process.env.PORT || 7002

// connect to database
mongoose.connect(process.env.MONGODB_URL)
const db = mongoose.connection
db.on('error', () => console.log('Error connecting to database'))
db.once('connected', () => console.log('Database connected'))

// run server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})

module.exports = app
