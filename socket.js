'use strict'

var conf = require('./config.js')
var io = require('socket.io')
var gaze = require('gaze')
var env = conf.get('env')

// var redis = require('redis')
module.exports = function(http, sessionStore) {
	var server = io.listen(http)
	server.configure('production', function(){
	  server.enable('browser client etag')
	  server.set('log level', 0)
	  server.set('transports', [
	    'websocket'
		  , 'flashsocket'
		  , 'htmlfile'
		  , 'xhr-polling'
		  , 'jsonp-polling'
	  ])
	})

	server.configure('development', function(){
	  server.set('transports', ['websocket'])
	  server.set('log level', 1)
	})

/*	var pub    = redis.createClient()
  	, sub    = redis.createClient()
  	, client = redis.createClient()

	// pub.auth(password, function (err) { if (err) throw err; });
	// sub.auth(password, function (err) { if (err) throw err; });
	// client.auth(password, function (err) { if (err) throw err; });

	server.set('store', new RedisStore({
	  redis    : redis
		, redisPub : pub
		, redisSub : sub
		, redisClient : client
	}))*/

	var RedisStore = require('socket.io/lib/stores/redis')
	  , redis  = require('socket.io/node_modules/redis')
	  , pub    = redis.createClient()
	  , sub    = redis.createClient()
	  , client = redis.createClient();

	server.set('store', new RedisStore({
	  redis    : redis
	, redisPub : pub
	, redisSub : sub
	, redisClient : client
	}));

	// server.sockets.on('connection', function (socket) {
	//   socket.emit('news', { hello: 'world' });
	//   socket.on('my other event', function (data) {
	//     console.log(data);
	//   });
	// });

	server.on('connection', function (socket) {
	  socket.emit('pub', { hello: 'world' });
    socket.on('sub', function (data) {
      console.log(data);
    });



    env === 'development' && gaze([
      'views/**/*'
    ], function(err, watcher){
    	this.on('all', function(event, filepath) {
    	  socket.emit('debug', 'refresh');
    	})
    })
	});



	return this
}