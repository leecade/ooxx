var index = require('../routes/index')
var error = require('../routes/error')
var users = require('../routes/users')
var about = require('../routes/about')

module.exports = function(app) {

  // app.get('/', index.index)
  app.get('/', index.welcome)

  app.get('/users', users.index)
  app.get('/users/:uid', users.show)

  app.get('/about', about.index)

  app.get('*', error.pageNotFound)
}