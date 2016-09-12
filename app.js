
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var fs = require('fs');

// var redis = require('redis');
// var RedisStore = require('connect-redis')(session);



//initialize mongoose schemas
require('./models/models');
var index = require('./routes/index');
var api = require('./routes/api');
var authenticate = require('./routes/authenticate')(passport);
var mongoose = require('mongoose');         


//connect to local Mongo
// mongoose.connect('mongodb://localhost/test-chirp');              //connect to Mongo
// connect to mongodb replicaset
var options = {
    user: '@@user@@',
    pass: '@@pass@@',
    auth: { authdb: "admin" }
}


// mongoose.connect('mongodb://mongodb-member1,mongodb-member0/test-chirp',options);

// mongoose.connect('mongodb://mongodb-member1,mongodb-member0/tasks');  


var app = express();

var accessLogStream = fs.createWriteStream(__dirname + '/access.log', { flags: 'a' });
// var client;

if (process.env.NODE_ENV == 'production') {
    app.use(morgan('combined', { stream: accessLogStream }));
    mongoose.connect('mongodb://mongodb-member1,mongodb-member0/test-chirp', options);
    // client = redis.createClient('@@redis-port@@', '@@redis-host@@', { auth_pass: 'VJn5oj9xWFv2VlwGGHzlPUHKWZtT+AGvvjbOn0/LrO4=' });

} else {
    // app.use(morgan('dev'));
    mongoose.connect('mongodb://localhost/test-chirp');
    // client = redis.createClient('tcp://localhost:6379')
}




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(logger('dev'));

// app.use(session({
//   secret: 'keyboard cat'
// }));

app.use(session({
  secret: 'keyboard cat'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/auth', authenticate);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//// Initialize Passport
var initPassport = require('./passport-init');
initPassport(passport);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
