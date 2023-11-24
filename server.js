// import packages
require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ejs = require('ejs')
const cors = require('cors')
const router = require('./routes/routes')

// set views
app.set('views', './views')
app.set('view engine', 'ejs')

// use middleware
app.use(cors())
app.use(express.json())
app.use('/api', router)

// define port
const port = process.env.PORT || 7001

// connect to database
mongoose.connect(process.env.MONGODB_URL)
const db = mongoose.connection
db.on('error', () => console.log('Error connecting to database'))
db.once('connected', () => console.log('Database connected'))

// listen on server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})
