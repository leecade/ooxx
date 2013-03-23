var conf = require('../config.js');
var redis = require("redis").createClient(conf.get("redisPort"),conf.get("redisHost"));
redis.auth(conf.get("redisPasswd"));
exports.set = function(req, res) {
  var activeId = req.query.act_id;
  var x        = req.query.x;
  var y        = req.query.y;
	
  var actPosKey = "active_purpose" + activeId;
  var xyVal = x + "," + y;

  
  redis.hset(actPosKey, xyVal, 0, function(err){
	if (err == null) {
	   res.end("true");
	}	
	else {
	   res.end("false");
	}
  });
} 
