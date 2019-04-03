var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');

var firebase = require("firebase");

var morgan = require('morgan');
var methodOverride = require('method-override');
var User = require('./models/user_model');
var jsonwebtoken = require("jsonwebtoken");
var cors = require('cors');
var Event = require('./models/event_model');


var app = express();

//Route initialization
var users = require('./routes/users');
var events = require('./routes/events');
var forum = require('./routes/forum');
var messages = require('./routes/messages');

//var url = "mongodb://localhost/yelp_camp";

//mongoose.connect(url)  //DATABASE URL CONNECTOR         process.env.DATABASEURL ||

mongoose
  .connect(

    "mongodb://Maksim:" + process.env.MONGO_ATLAS_PW + "@maksimdb-shard-00-00-7j1q5.mongodb.net:27017,maksimdb-shard-00-01-7j1q5.mongodb.net:27017,maksimdb-shard-00-02-7j1q5.mongodb.net:27017/test?ssl=true&replicaSet=MaksimDB-shard-0&authSource=admin&retryWrites=true",
  
    {
      // "user": process.env.MONGODB_NAME,
      // "pass": process.env.MONGO_ATLAS_PW,
      "user": 'Maksim',
      "pass": '11021102a',
       useNewUrlParser: true
  }
    )

  .then(() => {
    console.log("Connected to database!");
  })
  .catch(err =>
    console.log("Connection failed! " + " error - " + err)
  );
  mongoose.set('debug', true);


    //firebase storage

    // var config = {
    //   apiKey: process.env.FIREBASE_API_KEY,
    //   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    //   databaseURL: process.env.DATABASE_URL,
    //   storageBucket: process.env.STORAGE_BUCKED,
    // };
  
    // firebase.initializeApp(config);
  
    // firebase.storage();
  
    



// app.use(favicon(path.join(__dirname, 'public','images', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(cookieParser());
app.use(methodOverride());
app.use(morgan('dev'));



// const randNumber = Math.floor((Math.random() * 45));

app.use("/images", express.static(path.join("images")));
app.use('/public', express.static(path.join('public/images')));

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
app.use('/api/forum', forum);
app.use('/api/messages', messages);

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
