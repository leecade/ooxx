var conf = require('../config.js');
var redis = require("redis").createClient(conf.get("redisPort"),conf.get("redisHost"));
var tabList = [{text:"已加入",href:"/index?type=1"},{text:"未加入",href:"/index?type=3"}]
redis.auth(conf.get("redisPasswd"));
/*
	活动目的地
*/
exports.activetarget = function(req, res) {
	var actid = req.body.actid;
	redis.hgetall("active_purpose"+actid,function(err, replies){
		var target = [];
		for( var key in replies){
			var tmp = {},
				xy = key.split(",");
			tmp.x = xy[0];
			tmp.y = xy[1];
			target.push(tmp);
		}
		res.end(JSON.stringify(target));
	})
}

/*
	任务详情页面
*/
exports.taskdetail = function(req, res) {
	var actid = req.query.actid;

		//smembers("active_join_all:"+actid).hgetall("avart")
	redis.hgetall("active:"+actid,function(err, replies){
		res.render('task_detail', {
			    	title: '',
				  	activeInfo: replies
		})
	})
}

/*
	记录活动的目的地位置信息
*/
exports.positionInfo = function(req, res) {
	var actid = req.body.actid + "",
		posList = JSON.parse( req.body.list ),
		posResult = {};
		for( var key in posList ){ 
			var tmp = posList[key]["lat"] + "," + posList[key]["lng"] ;
			posResult[tmp] = "0";
		}
		redis.hmset("active_purpose"+actid,posResult);
		res.redirect('/tasklist');
}
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
		uid = req.cookies["uid"];
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
			"peoplenum":"0",
			"actid":activeid
		});
		//用户的好友列表到到用户表
		res.end(activeid);
	});
}

/*
	用户所有的任务列表
*/
exports.tasklist = function(req, res) {
	// var uid = req.body.userInfo.uid,
	var uid = req.cookies["uid"],
		photoid = req.cookies["portrait"],
		//搜索的任务类型
		type = req.query.type,
		tasklist = [],
		mul = redis.multi();
	//记录头像id
    redis.hset("avart",uid,photoid);
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
				    	title: '',
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
			    	title: ''
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
			    	title: ''
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
			    	title: '',
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
			    	title: '',
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

	//随机分配用户
	//更新任务的用户id列表
	redis.sadd("active_join_all"+activeId,uid);
	redis.hgetall("active:"+activeId,function (err, obj) {
		var people = obj.peoplenum;
		//分红队
		if ( people%2 ){
			redis.sadd("active_join_red"+activeId,uid);
		} else{
			redis.sadd("active_join_blue"+activeId,uid);
		}
	})
	res.end();
}