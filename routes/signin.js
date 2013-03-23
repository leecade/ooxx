var conf = require('../config.js');
var redis = require("redis").createClient(conf.get("redisPort"),conf.get("redisHost"));
redis.auth(conf.get("redisPasswd"));
exports.sign = function(req, res) {
  var activeId = req.query.act_id;
  var uid      = req.query.uid;
  var team     = req.query.team;
  var x        = req.query.x;
  var y        = req.query.y;

  var signin = "active_purpose" + activeId;
  redis.hgetall(signin, function(err, rep){
	for (var key in rep) {
	    var xyArr = key.split(",");
	    if (xyArr[0]-x<10 || xyArr[1]<10) {
		redis.hset(signin, key, team, function(err){
			if (err == null) {
			    res.end("false");	
			}
			else {
			    res.end("true");	
			}
		});
	    }	

	}
  });
	
  res.end("true");
} 
