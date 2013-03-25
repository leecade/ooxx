var conf = require('../config.js');
var redis = require("redis").createClient(conf.get("redisPort"),conf.get("redisHost"));
redis.auth(conf.get("redisPasswd"));
exports.getpos = function(req, res) {
  var activeId = req.query.act_id;
  var uid      = req.query.uid;
  var team     = req.query.team;
  var x        = req.query.x;
  var y        = req.query.y;

   
   
   var posKey  = "pos"+uid;
   var posVal  = x+","+y;
  //save user pos 
  redis.hgetall(posKey,function(err, rep){
	 rep['pos'] = posVal;
	 console.log(rep);
	 redis.hmset(posKey, rep);
  });

  


  //get user firends pos 
  actJoinKey = "active_join_"+ team + activeId;
  redis.smembers(actJoinKey,function(err,rep){
	
	var multi = redis.multi();
	rep.forEach(function(val){
		multi.hgetall(val);
	});
	multi.exec(function(er,rul){
		var posArr = {}; 
		rul.forEach(function(val, j){
			var xyArr = val['pos'].split(",");
			posArr[j]    = {};
			posArr[j]['x'] = xyArr[0];
			posArr[j]['y'] = xyArr[1];
			posArr[j]['uid'] = val['uid'];
		});

		var posStr = "";
		posStr = JSON.stringify(posArr);
		res.end(posStr);
	});
});
	
} 
