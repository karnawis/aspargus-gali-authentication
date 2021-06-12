const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const morgan = require('morgan')
const connectDB = require('./config/db')
dotenv.config({path: './config/config.env'})
const expresshbs = require('express-handlebars')
const routes = require('./routes/index')
const authenticateRoutes = require('./routes/authentication')

//Connect database
connectDB();

const app = express()

//for logging
if (process.env.NODE_ENV==='development') {
    app.use(morgan('dev'))
}

// Sessions
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
     //store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )

//passport
require('./handlers/passport')(passport)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//static folder
app.use(express.static(path.join(__dirname, 'public')))

//templating
app.engine('.hbs', expresshbs({extname: '.hbs', defaultLayout: 'main'}))
app.set('view engine', '.hbs')

//routes
app.use('/', routes)
app.use('/auth', authenticateRoutes)


const PORT = process.env.PORT || 8800

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))