const express = require('express');
//const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
var path = require('path');
const flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var bodyParser=require('body-parser');
var morgan = require('morgan')
var cookieParser = require('cookie-parser')
var port     = process.env.PORT || 2727;

var app = express();




//Passport config
require('./config/passport')(passport);

//DB Config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db , { useNewUrlParser:true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

//Static Folder
app.use( express.static(path.join(__dirname,'Public')));


//View Engine
//app.use(expressLayouts);
 app.engine('html', require('ejs',).renderFile);

app.set('Views',path.join(__dirname,'Views'));
app.set('Path',path.join(__dirname,'Views'));
app.set('view engine', 'html');


/*
//EJS
app.use(expressLayouts);
app.engine('ejs', require('ejs').renderFile);
app.set('Views',path.join(__dirname,'Views'));
app.set('view engine', 'ejs');
*/

//Body-parser
app.use(express.urlencoded({ extended: true}));
app.use(bodyParser.json());

//app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
//app.use(bodyParser()); // get information from html forms

app.use(session({ 
    secret: 'DragonBallroxxx', 
    resave:false, 
    saveUninitialized:false, 
    // cookie:{ 
    //     maxAge:1000*60, 
    //     sameSite:true} 
    })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

//Express Session
// app.use(session({
//     secret: 'DragonBallroxxx',
//     resave: true,
//     saveUninitialized: true,
//     cookie:{
//         maxAge : 1000*60*2,
//         sameSite:true,
//        secure: true,
//     },
//     name: 'mid',

// }));

//Passport Middleware
// app.use(passport.initialize());
// app.use(passport.session());

//Connect Flash
//app.use(flash());

//Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes
//var IndexRoute = require('./Routes/route');
require('./Routes/route.js')( app, passport);
//app.use('/', IndexRoute);

// launch ======================================================================
app.listen(port);
console.log('Connected to port ' + port);