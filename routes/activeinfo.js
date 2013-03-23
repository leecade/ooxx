var conf = require('../config.js');
var redis = require("redis").createClient(conf.get("redisPort"),conf.get("redisHost"));
var tabList = [{text:"已经加入",href:"/index"},{text:"未加入",href:"/index?type=3"}]
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
		uid = req.body.uid,
		peopleNum = req.body.num;
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
			"starttime":startTime,
			"endtime":endTime,
			"type":type,
			"des":des,
			"scope":scope,
			"peoplenum":peopleNum,
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
	var uid = req.cookies["uid"],
		//搜索的任务类型
		type = req.query.type,
		tasklist = [],
		mul = redis.multi();

	//用户创建的项目和用户已经加入
	if ( type == 1 ){
		mul.smembers("user:active:"+uid).smembers("user:"+uid+":join_active").exec(function(err, replies){
				var multi = redis.multi();
				replies.forEach(function(val,key){
					val.forEach(function(id){
						multi.hgetall("active:"+id);
					});
				});
				multi.exec(function(err,resu){
					/*resu.forEach(function(val,key){
						resu[key]["tasktype"] = 1;
					});*/
					tabList[0]["selected"] = 1;
					res.render('index', {
				    	title: 'xxxx',
				    	tablist:tabList,
					  	activeList: resu
					})
				});
		})
		/*mul.smembers("user:active:"+uid,function(err, replies){
			var multi = redis.multi(),
				result = {data:[]}; 
			replies.forEach(function(val){
				multi.hgetall("active:"+val);
			});
			multi.exec(function(err,resu){
				resu.forEach(function(val,key){
					resu[key]["tasktype"] = 1;
				});
				res.render('index', {
			    	title: 'xxxx'
				  	, activeList: resu
				})
			});
		})*/	
	}
	//搜索用户已经加入的任务
	/*else if( type == 2 ){
		redis.smembers("user:"+uid+":join_active",function(err, replies){
			var multi = redis.multi();
			replies.forEach(function(val){
				multi.hgetall("active:"+val);
			});
			multi.exec(function(err,resu){
				resu.forEach(function(val,key){
					resu[key]["tasktype"] = 2;
				});
				res.render('index', {
			    	title: 'xxxx'
				  	, activeList: resu
				})
			});
		})
		//搜索用户未加入的任务(这里type=3为了预留2后续需要区分用户创建的和未创建的)
	}*/ else if ( type == 3 ){
		redis.sdiff("allactive","user:active:"+uid,"user:"+uid+":join_active",function(err, replies){
			var multi = redis.multi();
			replies.forEach(function(val){
				multi.hgetall("active:"+val);
			});
			multi.exec(function(err,resu){
				resu.forEach(function(val,key){
					resu[key]["tasktype"] = 3;
				});
				tabList[1]["selected"] = 1;
				res.render('index', {
			    	title: 'xxxx',
			    	tablist:tabList,
				  	activeList: resu
				})
			});
		})
		//搜索所有的项目
	} else {
		mul.smembers("user:active:"+uid).smembers("user:"+uid+":join_active").sdiff("allactive","user:active:"+uid,"user:"+uid+":join_active").exec(function(err, replies){
				var multi = redis.multi();
				//设置标记为区分项目的类型
				redis.set("taskmark",1);
				replies.forEach(function(val,key){
					val.forEach(function(id){
						multi.hgetall("active:"+id);
					});
					multi.get("taskmark");
				});
				multi.exec(function(err,resu){
					//首先展现用户创建的项目
					var tasktype = 1;
					resu.forEach(function(val,key){
						if( tasktype >=3 ){
							resu[key]["tasktype"] = tasktype;
						}
						//标志位
						if( resu[key] == 1 ){
							++ tasktype;
							resu.splice(key,1);
						}
					});
					// res.end( JSON.stringify(result) );

					// app.get('/index', function( req, res){
					// 		res.render('index', {
					// 	    title: 'Users Index'
					// 	    , users: result
					// 	  })
					// })
				res.render('index', {
			    	title: 'xxxx',
			    	tablist:tabList,
				  	activeList: resu
					})
				});
			});
	}
	
}

/*
	用户加入任务
*/
exports.joinactive = function(req, res) {
	var uid = req.cookies["uid"],
		activeId = req.body.activeid;
	//加入用户 活动列表
	redis.sadd("user:"+uid+":join_active",activeId);
	//更新任务拥有的人数
	redis.hincrby("active:"+activeId,"peoplenum",1);
	res.end();
}