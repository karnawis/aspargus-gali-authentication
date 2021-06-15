const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const expresshbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/database')

const routes = require('./routes/index')
const authenticateRoutes = require('./routes/authentication')

// Load config
dotenv.config({ path: './config/config.env' })


require('./handlers/passport')(passport)

//Connect database
connectDB();

const app = express()

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method override
app.use(
  methodOverride(function (request, response) {
    if (request.body && typeof request.body === 'object' && '_method' in request.body) {
      // look in urlencoded POST bodies and delete it
      let method = request.body._method
      delete request.body._method
      return method
    }
  })
)

//for logging
if (process.env.NODE_ENV==='development') {
    app.use(morgan('dev'))
}

//templating
app.engine(
  '.hbs', 
  expresshbs({
    extname: '.hbs', 
    defaultLayout: 'main'
  })
)

app.set('view engine', '.hbs')

// Sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//set user as local
app.use( (request, response, next) => {
  const { user } = request || null
  // console.log('request user >>>', request.user)
  // response.locals.user = request.user || null;
  console.log('request user >>>', user)
  response.locals.user = user;
  next()
})

//static folder
app.use(express.static(path.join(__dirname, 'src')))

//routes
app.use('/', routes)
app.use('/auth', authenticateRoutes)

const PORT = process.env.PORT || 8800

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))