'use strict'

// Fetch the server configuration
var conf = require('./config.js')
var errorCatched = false

// output log
require("consoleplusplus")
console.disableTimestamp()

// Track process for debug
process.title = conf.get('name')
process.env.NODE_ENV = conf.get('env')
process.addListener('uncaughtException', function (err, stack) {
  console.warn("#red{[process] }" + err.stack)
  console.log('\u0007') // Terminal bell
})

// var fs = require('fs')
var server = require('./app.js')
var gaze = require('gaze')
var cluster = require("cluster")
var cpuNum = Math.min(require("os").cpus().length, conf.get('clusters'))


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
    , 'app.js'
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

  server.listen(conf.get('port'), conf.get('ip'), function() {
    var address = server.address()
    console.info('[#blue{' + conf.get('env') + '}] #black{running on} #underline{http://' + address.address + ':' + address.port + '} #black{by: worker} ##underline{' + process.pid + '}')
  })
}