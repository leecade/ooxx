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

	var RedisStore = require('socket.io/lib/stores/redis')
	var redis  = require('socket.io/node_modules/redis')

	// create dbs
	var dbController = {
		pub: redis.createClient()
		, sub: redis.createClient()
		, client: redis.createClient()
	}

	// auth
	for(var _db in dbController) {
		dbController[_db].on("error", function(err) {
			console.log("#red{[redis] }" + err)
		}).auth(conf.get('redisPasswd'))
	}

	server.set('store', new RedisStore({
	  redis    : redis
		, redisPub : dbController.pub
		, redisSub : dbController.sub
		, redisClient : dbController.client
	}))

	server.on('connection', function (socket) {
	  socket.emit('pub', { hello: 'world' })
    socket.on('sub', function (data) {
      console.log(data)
    })

    env === 'development' && gaze([
      'views/**/*'
    ], function(err, watcher){
    	this.on('all', function(event, filepath) {
    	  socket.emit('debug', 'refresh')
    	})
    })
	})
	return this
}