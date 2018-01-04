let express      = require('express');
let path         = require('path');
let favicon      = require('serve-favicon');
let logger       = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser   = require('body-parser');
let expressHbs   = require('express-handlebars');
let mongoose     = require('mongoose');
let session      = require('express-session');
let passport     = require('passport');
let flash        = require('connect-flash');
let validator    = require('express-validator');
let MongoStore   = require('connect-mongo')(session); 

//Routes
let indexRoute = require('./routes/index');
let userRoute = require('./routes/user');

let app = express();

//Mongoose connection
mongoose.connect('mongodb://localhost:27017/shopping', {useMongoClient: true});
require('./config/passport');


// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}))
app.set('view engine', '.hbs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({ 
  secret: 'mySecretSuperOne', 
  resave: false, 
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); 

//Static files
app.use(express.static(path.join(__dirname, 'public')));

// Global vars
app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

//Routes
app.use('/user', userRoute);
app.use('/', indexRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
