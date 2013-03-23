var index = require('../routes/index')
var error = require('../routes/error')
var users = require('../routes/users')
var about = require('../routes/about')
var activeinfo = require('../routes/activeinfo')
module.exports = function(app) {
 //权限控制
	 app.all("/*",function(req, res,next){
	 	var uid = req.cookies["uid"],
	 		path = req.params[0];
	 	//如果有uid证明是登录了,根目录没有权限限制
	   if ( (uid && uid.length === 10) || !path){
	   		next();
	   } else{
	   		res.redirect('/');
	   }
	 })
  // app.get('/', index.index)
  app.get('/', index.welcome)
  app.get('/index', activeinfo.tasklist)

  app.get('/users', users.index)
  app.get('/users/:uid', users.show)
  app.get('/map', function(req, res){
  	res.render('map', {
    	title: ''
	  // title: req.online.length + ' users active'
		})
	})


	app.get('/create', function(req, res) {
		res.render('create')
	})
	app.get('/test', function(req, res) {
		res.render('test')
	})
  app.get('/about', about.index)

  app.post('/activeinfo', activeinfo.publishtask)
  app.get('/tasklist', activeinfo.tasklist)
  app.post('/joinactive', activeinfo.joinactive)
  /*app.get('*', error.pageNotFound)*/
}