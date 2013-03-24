var conf = require('../config.js');
var redis = require("redis").createClient(conf.get("redisPort"),conf.get("redisHost"));
redis.auth(conf.get("redisPasswd"));
exports.getpos = function(req, res) {
  var activeId = req.query.act_id;
  var uid      = req.query.uid;
  var team     = req.query.team;
  var x        = req.query.x;
  var y        = req.query.y;

   
   
   var posKey  = "pos:"+uid;
   var posVal  = x+","+y;
  //save user pos 
  redis.set(posKey,posVal);


  //get user firends pos 
  actJoinKey = "active_join_"+ team + activeId;
  redis.multi().smembers(actJoinKey).exec(function(err, rep){
	var arr = rep[0];
	var arrSize = rep[0].length;
	
	arr.forEach(function(val, i){
	   redis.get(val, function(err, posVal){
			
		var tmpKey = "tmp" + team + activeId +"_"+ val+ "_" + posVal;

	         redis.set(tmpKey, "1");
	   });	
	});

  });

    redis.keys("tmp"+team+activeId + "*", function (err, rep){
	var posArr = {};
	
	rep.forEach(function(val, j){
		var posInfoArr = val.split("_");
		var userIdArr = posInfoArr[1].split(":");
		var userId = userIdArr[1].toString();
	    posArr[j] = {};
	
		posArr[j]['uid'] = {};
	//	console.log(posInfoArr[2]);
			xyArr = posInfoArr[2].split(",");
	        posArr[j]['x'] = xyArr[0];
			posArr[j]['y'] = xyArr[1];
			posArr[j]['uid'] = userId;
	});
	var posStr = JSON.stringify(posArr);

	  
	res.end(posStr);
  });
  
} 
