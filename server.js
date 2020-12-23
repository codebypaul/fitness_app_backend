// Imports
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const passport = require('passport');
const session = require('express-session')
require('./config/passport')(passport);
const PORT = process.env.PORT || 8000;


// API
const users = require('./api/users');
// const books = require('./api/books');

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Initialize Passport and use config file
app.use(passport.initialize());
app.use(passport.session());


// const sessionObject = {
//     secret: process.env.SECRET_SESSION,
//     resave: false,
//     saveUninitialized: false,
//     store : new MongoStore({ mongooseConnection:mongoose.connection })
// }
//express session use session object
// app.use(session(sessionObject));

app.use((req, res, next) => {
    // console.log(` res.locals : ${res.locals}`);
    // Before every route, we will attach a user to res.local
    // res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next();
});

// Home route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Smile, you are being watched by the Backend Engineering Team' });
});

// Routes
app.use('/api/users', users);


app.listen(PORT, () => {
    console.log(`Server is listening 🎧 on port: ${PORT}`);
});

