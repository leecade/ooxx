var conf = require('../config.js');
var redis = require("redis").createClient(conf.get("redisPort"),conf.get("redisHost"));
redis.auth(conf.get("redisPasswd"));
/*
	发布任务
*/
exports.publishtask = function(req, res) {
	var title = req.body.title + "",
		startTime = req.body.starttime + "",
		endTime = req.body.endtime + "",
		des = req.body.des + "",
		type = req.body.type + "",
		scope = req.body.scope + "",
		uid = req.body.uid;
	//项目的全局id
	redis.incr("activeid");
	redis.get("activeid",function(err,rep){
		var activeid = rep;
		//用户创建的项目id集合
		redis.sadd("user:active:"+uid,activeid);
		//记录创建的所有项目id集合
		redis.sadd("allactive",activeid);
		//项目信息列表
		redis.hmset("active:"+activeid,{
			"title":title,
			"startTime":startTime,
			"endTime":endTime,
			"type":type,
			"des":des,
			"scope":scope,
			"actid":activeid
		});
		//用户的好友列表到到用户表

		//活动的目的列表
		redis.hmset("active:purpose:"+activeid,{"1,2":"0","3.4,5.55555":"0"});
	});
}

/*
	用户所有的任务列表
*/
exports.tasklist = function(req, res) {
	// var uid = req.body.userInfo.uid,
	var uid = req.query.uid,
		//搜索的任务类型
		type = req.query.type,
		tasklist = [];

	//搜索所有的项目
	if ( !type ){
		var mul = redis.multi();
		mul.smembers("user:active:"+uid).smembers("user:"+uid+":join_active").sdiff("allactive","user:active:"+uid,"user:"+uid+":join_active").exec(function(err, replies){
				var multi = redis.multi(),
				result = {data:[]}; 
				replies.forEach(function(val){
					val.forEach(function(id){
						multi.hgetall("active:"+id);
					})
				});
				multi.exec(function(err,resu){

					// res.end( JSON.stringify(result) );

					// app.get('/index', function(req, res){
					// 		res.render('index', {
					// 	    title: 'Users Index'
					// 	    , users: result
					// 	  })
					// })
				res.render('index', {
			    	title: 'xxxx'
				  	, activeList: resu
					})
				});
			});
	}
	//用户创建的项目
	else if ( type == 1 ){
		redis.smembers("user:active:"+uid,function(err, replies){
			var multi = redis.multi(),
				result = {data:[]}; 
			replies.forEach(function(val){
				multi.hgetall("active:"+val);
			});
			multi.exec(function(err,resu){
				res.render('index', {
			    	title: 'xxxx'
				  	, activeList: resu
				})
			});
		})	
	}
	//搜索用户已经加入的任务
	else if( type == 2 ){
		redis.smembers("user:"+uid+":join_active",function(err, replies){
			var multi = redis.multi(),
				result = {data:[]}; 
			replies.forEach(function(val){
				multi.hgetall("active:"+val);
			});
			multi.exec(function(err,resu){
				res.render('index', {
			    	title: 'xxxx'
				  	, activeList: resu
				})
			});
		})
		//搜索用户已经加入的任务
	} else if ( type == 3 ){
		redis.sdiff("allactive","user:active:"+uid,"user:"+uid+":join_active",function(err, replies){
			var multi = redis.multi(),
				result = {data:[]}; 
			replies.forEach(function(val){
				multi.hgetall("active:"+val);
			});
			multi.exec(function(err,resu){
				res.render('index', {
			    	title: 'xxxx'
				  	, activeList: resu
				})
			});
		})
	}
	
}

/*
	用户加入任务
*/
exports.join = function(req, res) {
	var uid = req.query.uid,
		activeId = req.query.activeid;
	redis.sadd("user:"+uid+":join_active",activeId);
}