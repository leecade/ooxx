var index = require('../routes/index')
var error = require('../routes/error')
var users = require('../routes/users')
var about = require('../routes/about')

module.exports = function(app) {

  // app.get('/', index.index)
  app.get('/', index.welcome)
  app.get('/index', index.index)

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

  app.get('*', error.pageNotFound)
}