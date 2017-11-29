var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var methodOverride = require('method-override');
var User = require('./models/user_model');
var jsonwebtoken = require("jsonwebtoken");
var cors = require('cors');


var app = express();

//authetication middleware
app.use(function(req,res,next){
  if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT'){
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err,decode){
      if(err) req.user = undefined;
      req.user = decode;
      next();
    });
  }else{
    req.user = undefined;
    next();
  }
});

//Route initialization
var index = require('./routes/index');
var users = require('./routes/users');

//API access middleware
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//database setup
const config = {
  db : "mongodb://localhost/letsrun"
};
mongoose.connect(config.db);
mongoose.Promise = global.Promise;
mongoose.connection.on('connected', function(){
  console.log('Mongoose default connection open to ' + config.db)
})

app.use(favicon(path.join(__dirname, 'public','images', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(cookieParser());
app.use(methodOverride());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

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
