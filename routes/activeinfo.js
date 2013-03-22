var conf = require('../config.js');
var redis = require("redis").createClient(conf.get("redisPort"),conf.get("redisHost"));
redis.auth(conf.get("redisPasswd"));

exports.store = function(req, res) {
	var title = req.body.title + "",
		startTime = req.body.starttime + "",
		endTime = req.body.endtime + "",
		des = req.body.des + "",
		type = req.body.type + "",
		scope = req.body.scope + "";
	//项目的全局id
	redis.incr("activeid");
	redis.get("activeid",function(err,rep){
		var activeid = rep;
		//用户创建的项目id集合
		redis.sadd("userid:owner:active",activeid);
		//项目信息列表
		redis.hmset("active:id:"+activeid,{
			"title":title,
			"startTime":startTime,
			"endTime":endTime,
			"type":type,
			"des":des,
			"scope":scope
		});
		//这个活动
		redis.hmset("active:purpose:"+activeid,{"1,2":"0","3.4,5.55555":"0"});
	});
}
