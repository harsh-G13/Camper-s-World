if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const app = express();
const path = require('path');
const methodOverride = require('method-override')
const flash = require('connect-flash')
const ExpressError = require('./utils/ExpressError.js')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const dbURL = process.env.db_URL || 'mongodb://localhost:27017/yelp-camp'
const MongoStore = require('connect-mongo');

mongoose.connect(dbURL);
const db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected")
})
// mongoose.connect(dbURL);
// const db = mongoose.connection;
// db.on("error", console.log.bind(console, "connection error:"));
// db.once("open", () => {
//     console.log("Database Connected")
// })

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))
const secret = process.env.CLOUDINARY_SECRET ||'thisshouldbeabettersect!';
const sessionConfig= {
    store: MongoStore.create({mongoUrl:dbURL,touchAfter:24*3600}),
    name :'session',
    secret,
    saveUninitialized : true,
    secure : true,
    resave: false,
    cookie: {
        httpOnly : true,
        express : Date.now() + 1000*60*60*24*7,
        maxAge : Date.now() + 1000*60*60*24*7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(helmet());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
    "https://events.mapbox.com/events/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
 
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/docup1g2k/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
                "https://thumbs.dreamstime.com/b/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser= req.user;
    next();
})


app.use('/',userRoutes)
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)
app.get('/', (req, res) => {

    res.render('home.ejs')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    // const {statusCode=500}=err;
    if (!err.message) err.message = "Something went wrong!"
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).render('error', { err });
    
})
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`serving of ${port}`);
})
