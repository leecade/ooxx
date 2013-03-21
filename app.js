'use strict'

var conf = require('./config.js')
var http = require('http')
var express = require('express')
var connect = require('connect')
var app = express()
var env = app.set('env', conf.get('env')).get('env')
var routes = require('./routes/routes')
var engines = require('consolidate') //templete engine wrapper
var server = module.exports = http.createServer(app)

// tmp
var errorCatched;

// socket io
var socket = require('./socket.js')

// DBServer
var redis = require('redis')
var db = redis.createClient(conf.get('redisPort'), conf.get('redisHost'))
db.auth(conf.get('redisPasswd'))
db.on("error", function (err){
  errorCatched = true;
  console.warn("#red{[redis] }" + err)
})

// store session
var sessionStore = require('connect-redis')(connect)


// init express env
app.enable('trust proxy')
app.set('title', conf.get('name')) // 在view里使用 settings.title

if (env === 'development') {
  app.use(function(err, req, res, next){
    errorCatched = true;
    console.warn("#red{[express] }" + err.stack)
    res.send(500, 'Something broke!')
  })
}

if (env === 'production') {

}

if (env === 'test') {
  app.use(function(err, req, res, next){
    errorCatched = true;
    console.warn("#red{[express] }" + err.stack)
    res.send(500, 'Something broke!')
  })
  app.use(express.logger())
}

app.engine('html', engines.handlebars)
app.set('view engine', 'html')
app.set('views', __dirname + '/views')

// app.use(app.router)

// middleware
var stylus = require('stylus')
var nib = require('nib')
var expressUglify = require('express-uglify')

app

  // Gzip on, why bigger size?
  // .use(express.compress())
  .use(express.bodyParser())
  .use(express.cookieParser())
  .use(express.session({
    secret: "kqsdjfmlksdhfhzirzeoibrzecrbzuzefcuercazeafxzeokwdfzeijfxcerig"
    , store: new sessionStore({
      host: conf.get('redisHost')
      , port: conf.get('redisPort')
      , pass: conf.get('redisPasswd')
    })
  }))

  // css
  .use(stylus.middleware({
    src: __dirname + '/views'
    , dest: __dirname + '/public'
    , compile: function(str, path) {
        return stylus(str)
          .set('filename', path)

          // only production compress
          .set('compress', 'production' === env)
          .use(nib())
          .import('nib')
    }
  }))

// only production
// 'production' === env && 
app.use(expressUglify.middleware({ 
  src: __dirname + '/views'
  , dest: __dirname + '/public'
  , logLevel: env === 'production' ? 'none' : 'info'
}))

// static handle by nginx ?
app.use(express.static(__dirname + '/public', {maxAge: 86400000}))

/*
app.use(function(req, res, next){
  var ua = req.headers['user-agent'];
  db.zadd('online', Date.now(), ua, next);
});
app.use(function(req, res, next){
  var min = 60 * 1000;
  var ago = Date.now() - min;
  db.zrevrangebyscore('online', '+inf', ago, function(err, users){
    if (err) return next(err);
    req.online = users;
    next();
  });
})
app.all('/', function(req, res, next){
  res.render('index', {
    title: req.online.length + ' users active'
  })
})*/

// set routes
routes(app)

// socket server
socket(server, sessionStore)