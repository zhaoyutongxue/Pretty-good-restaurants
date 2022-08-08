if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// console.log(process.env.secret)
const express = require('express')
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const port = process.env.PORT || 3000
const session = require('express-session')
const methodOverride = require('method-override')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user')
// const helmet = require('helmet')


const campgroundsRoute = require('./routes/campgrounds')
const reviewsRoute = require('./routes/reviews')
const usersRoute = require('./routes/users')

const mongoSanitize = require('express-mongo-sanitize');

// connect to database
// process.env.DB_URL
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'; 
const MongoStore = require('connect-mongo');
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    // useCreateIndex:true, 
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database connected")
})




const app = express()

// use EJS for HTML templating: use a template to render data. \
// set view engine to EJS.
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
// __dirname is an environment variable that tells you the absolute path of the directory containing the currently executing function
app.set('views', path.join(__dirname, '/views'))

// use npm package "method-override" for HTML verb PUT
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
// express session
const secret = process.env.SECRET || 'keyboard cat'
const store = new MongoStore({
    mongoUrl : dbUrl,
    secret,
    touchAfter: 24*60*60

}) 

store.on("error",function(e){
    console.log("session store error", e)
})

app.use(session({
    store,
    name: "heysession",//this will change the default name connect.sid to session
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        // secure: true,//when we deploy the app, we will change it. 
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))

// set up path for static files
app.use(express.static(path.join(__dirname, '/public')))

// set up passport
app.use(passport.initialize())
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//  sanitize the received data, and remove any offending keys, or replace the characters with a 'safe' one.
app.use(mongoSanitize());

// flash message middleware. Also store req.user for all templates. 
app.use(flash())
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.warning = req.flash('warning')
    next()
})

// use helmet to secure the app
// app.use(helmet({
//     contentSecurityPolicy: false
//   }))

// use the routers
app.use('/', usersRoute)
app.use('/campgrounds', campgroundsRoute)
app.use('/campgrounds/:id/reviews', reviewsRoute)

app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'colt@gmail.com', username: 'colt ' });
    const newUser = await User.register(user, 'monkey');
    res.send(newUser)
})


// Home page, empty for now
app.get('/home', catchAsync(async (req, res) => {
    res.render('campgrounds/home')
}))



// if nothing matches, response with 404
app.all('*', (req, res, next) => {
    next(new ExpressError('page not found!', 404));
})

// error handling
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    // console.log(err)
    // console.log('this is the err.message: ' + err.message);
    if (!err.message) err.message = 'oh no, something went wrong';
    res.status(statusCode).render('error', { err })
})

app.listen(port, () => {
    console.log(`Yelp camp app listening on port ${port}`)
})