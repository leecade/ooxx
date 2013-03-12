var fs = require('fs')
var gaze = require('gaze')
var http = require('http')
var cluster = require("cluster")
var conf = require('./config.js')
var cpuNum = Math.min(require("os").cpus().length, conf.get('cpuNum'))

// output color log

/*
console.log("A (boring) console.log message");
console.info("#red{this} is #cyan{a} #yellow{nice} message");
console.debug("An (irrelevant) console.debug message");
console.info("A (somewhat important) console.info message");
console.warn("A (quite important) console.warning message");
console.error("A (critical!) console.error message");

reset | bold | italic | underline | blink | black | red | green | yellow | blue | magenta | cyan | white | 
 */
require("consoleplusplus")
console.disableTimestamp()


/*
1. 多核负载均衡
2. 支持即时服务重启
 */
if(cluster.isMaster) {

  // cluster.worker 在主进程不能用!
  var workers = [];

  for(var i = 0, worker; i < cpuNum; i++) {
    worker = cluster.fork()
    workers.push(worker.pid)
  }
  process.on('SIGHUP', function() {
    // master 进程忽略 SIGHUP 信号
  })

  // watch config file auto restart when dev
  conf.get('env') === 'dev' && gaze([
    'config.js'
    , 'config/**/*.json'
  ], function(err, watcher){
    this.on('all', function(event, filepath) {
      console.debug('#underline{' + filepath + '} #black{was} ' + event + ', #black{restart..}')
      workers.forEach(function(pid) {
        process.kill(pid)
      })
    })
  })

  cluster.on('death', function(worker, code, signal) {
    var index = workers.indexOf(worker.pid)
    index !== -1 && workers.splice(index, 1)
    console.warn('#black{worker} ##underline{' + worker.process.pid + '} #red{died}')
    cluster.fork()
  })
}
else {
  // console.log('worker #' + process.pid, 'started');
  process.on('SIGHUP', function() {
      // 接收到 SIGHUP 信号时，关闭 worker
      process.exit(0)
  });
  var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end('server works')
  }).listen(conf.get('port'), conf.get('ip'), function() {
    var address = server.address()
    console.info('[#blue{' + conf.get('env') + '}] #black{running on} #underline{http://' + address.address + ':' + address.port + '} #black{by: worker} ##underline{' + process.pid + '}')
  })
}






/*if (cluster.isMaster) {
    process.title = appName + ' master';
    console.log(process.title, 'started');

    var workers = [];

    // 根据 CPU 个数来启动相应数量的 worker
    for (var i = 0; i < numCPUs; i++) {
        var worker = cluster.fork();
        workers.push(worker.pid);
    }

    process.on('SIGHUP', function() {
        // master 进程忽略 SIGHUP 信号
    });

    // 监测文件改动，如果有修改，就将所有的 worker kill 掉
    fs.watch(__dirname, function(event, filename) {
        workers.forEach(function(pid) {
            process.kill(pid);
        });
    });

    cluster.on('death', function(worker) {
        var index = workers.indexOf(worker.pid);
        if (index != -1) {
            workers.splice(index, 1);
        }
        console.log(appName, 'worker', '#' + worker.pid, 'died');
        worker = cluster.fork();
        workers.push(worker.pid);
    });

}*/



// store session
/*var express = require('express');
var RedisStore = require('connect-redis')(express);

var app = express.createServer(
    express.session({ secret: 'keyboard cat', store : new RedisStore() })
);*/