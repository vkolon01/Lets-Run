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

//Route initialization
var users = require('./routes/users');
var events = require('./routes/events');

mongoose
  .connect(

    "mongodb://Maksim:" + process.env.MONGO_ATLAS_PW + "@maksimdb-shard-00-00-7j1q5.mongodb.net:27017,maksimdb-shard-00-01-7j1q5.mongodb.net:27017,maksimdb-shard-00-02-7j1q5.mongodb.net:27017/test?ssl=true&replicaSet=MaksimDB-shard-0&authSource=admin&retryWrites=true"
  )

  .then(() => {
    console.log("Connected to database!");
  })
  .catch(err =>
    console.log("Connection failed! " + " error - " + err)
  );

app.use(favicon(path.join(__dirname, 'public','images', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(cookieParser());
app.use(methodOverride());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use('/api/users', users);
app.use('/api/events', events);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

module.exports = app;
