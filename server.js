const express = require('express')
const app = express()
const mongoose = require('mongoose')
//handles auth, has strategies
//can swap out - eg, local auth vs oauth strategies
const passport = require('passport')

//keeps users logged in
//more middleware for session storage
//don't use in prod, can leak memory
const session = require('express-session') 
const MongoStore = require('connect-mongo')(session)

// messages for failed logins, etc 
// show above login form
const flash = require('express-flash')

//logs out different requests (server side)
const logger = require('morgan')
//connect to DB
const connectDB = require('./config/database')

//routes
const mainRoutes = require('./routes/main')
const todoRoutes = require('./routes/todos')

// tell express to use environment variables
require('dotenv').config({path: './config/.env'})

// Passport config - connect to passport config file
// to choose the strategy, etc
require('./config/passport')(passport)

//connect to DB
// go to the database file in config folder (required above)
connectDB()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// initialize morgan -> use in dev env't rather than prod
// set format for logging (eg dev has colours, other options incl "tiny" etc)
app.use(logger('dev'))

// Sessions
//keeps us logged in across multiple sessions
app.use(
    session({
      //randomizing cookies a bit more? sort of? makes them more unique
      //can be in .env
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      // store session info in mongoDB
      // optional, but needed for persistent sessions
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )
  
// Passport middleware (initialize passport)
app.use(passport.initialize())
//use sessions as well
app.use(passport.session())

//setting flash
app.use(flash())
  
// set up routes
app.use('/', mainRoutes)
app.use('/todos', todoRoutes)
 

app.listen(process.env.PORT || 3000, ()=>{
    console.log('Server is running, you better catch it!')
})    
