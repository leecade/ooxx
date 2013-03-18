'use strict'

// Fetch the server configuration
var conf = require('./config.js')
var errorCatched = false

// Track process for debug
process.title = conf.get('name')
process.env.NODE_ENV = conf.get('env')
process.addListener('uncaughtException', function (err, stack) {
  console.log('Caught exception: ' + err + '\n' + err.stack)
  console.log('\u0007') // Terminal bell
})

// output log
require("consoleplusplus")
console.disableTimestamp()

var fs = require('fs')
var gaze = require('gaze')
var http = require('http')
var cluster = require("cluster")
var cpuNum = Math.min(require("os").cpus().length, conf.get('cpuNum'))

// webServer
var express = require('express')
var connect = require('connect')
var app = express()
var env = app.set('env', conf.get('env')).get('env')
var routes = require('./routes')
var engines = require('consolidate') //templete engine wrapper
var server = http.createServer(app)

// socket io
var socket = require('./socket.js')

// DBServer
var redis = require('redis')
var db = redis.createClient()
db.on("error", function (err){
  errorCatched = true;
  console.warn("#red{[redis] }" + err)
})

// store session
var sessionStore = require('connect-redis')(connect)


// init express env
app.enable('trust proxy')

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

  // Gzip on, why bigger?
  // .use(express.compress())
  .use(express.bodyParser())
  .use(express.cookieParser())
  .use(express.session({
    secret: "kqsdjfmlksdhfhzirzeoibrzecrbzuzefcuercazeafxzeokwdfzeijfxcerig"
    , store: new sessionStore()
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
// app.use(express.static(__dirname + '/public', {maxAge: 86400000}))
app.use(express.static(__dirname + '/public'))

app.get('/users', function(req, res, next){
  res.render('users', {
    title: 'Users'
    , users: [{name: 'abc'}, {name: 'zhang3'}, {name: 'li4'}]
  })
})

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
app.get('/', routes.index)

app.get('*', function(req, res) {  
  res.redirect('/')
})
/*
1. 多核负载均衡
2. 支持即时服务重启
3. 服务稳定性, worker 出错自动重启
 */
if(cluster.isMaster) {

  // cluster.worker 在主进程不能用!
  // 
  // 妈的 node 0.8 API: cluster.kill ==> cluster.destroy
  // https://github.com/joyent/node/wiki/API-changes-between-v0.6-and-v0.8
  // store worker.pid
  var workers = []

  for(var i = 0; i < cpuNum; i++) {
    workers.push(cluster.fork())
  }
  
  process.on('SIGHUP', function() {
    // master 进程忽略 SIGHUP 信号
  })

  // watch config file auto restart when dev mode
  // env === 'development' && 
  gaze([
    'config.js'
    , 'package.json'
    , 'server.js'
    , 'socket.js'
    , 'routes/**/*.js'
    , 'config/**/*.json'
  ], function(err, watcher){
    this.on('all', function(event, filepath) {
      console.debug('#underline{' + filepath + '} #black{was} ' + event + ', #black{restart..}')

      workers.forEach(function(worker) {
        // process.kill(pid)
        worker.process.kill()
      })
    })
  })

  cluster.on('exit', function(worker, code, signal) {
    // update workers
    workers = workers.filter(function(li) {
      return li !== worker
    })

    console.warn('#black{worker} ##underline{' + worker.process.pid + '} #red{died}')
    
    // worker 异常关闭后自动重启
    !errorCatched && workers.push(cluster.fork())
  })
}
else {
  // console.log('worker #' + process.pid, 'started');
  process.on('SIGHUP', function() {
      // 接收到 SIGHUP 信号时，关闭 worker
      // process.exit(0)
  })

/*  var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(conf.get('name') + ': server works')
  }).listen(conf.get('port'), conf.get('ip'), function() {
    var address = server.address()
    console.info('[#blue{' + conf.get('env') + '}] #black{running on} #underline{http://' + address.address + ':' + address.port + '} #black{by: worker} ##underline{' + process.pid + '}')
  })*/

  server.listen(conf.get('port'), conf.get('ip'), function() {
    var address = server.address()
    console.info('[#blue{' + conf.get('env') + '}] #black{running on} #underline{http://' + address.address + ':' + address.port + '} #black{by: worker} ##underline{' + process.pid + '}')
  })

  // socket server
  socket(server, sessionStore)
}

// store session
/*var express = require('express');
var RedisStore = require('connect-redis')(express);

var app = express.createServer(
    express.session({ secret: 'keyboard cat', store : new RedisStore() })
);*/