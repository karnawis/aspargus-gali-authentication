const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
dotenv.config({path: './config/config.env'})
const expresshbs = require('express-handlebars')
const routes = require('./routes/index')

connectDB();

const app = express()

//for logging
if (process.env.NODE_ENV==='development') {
    app.use(morgan('dev'))
}

//templating
app.engine('.hbs', expresshbs({extname: '.hbs', defaultLayout: 'main'}))
app.set('view engine', '.hbs')

//routes
app.use('/', routes)

const PORT = process.env.PORT || 8800

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))