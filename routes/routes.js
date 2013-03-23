var index = require('../routes/index')
var error = require('../routes/error')
var users = require('../routes/users')
var about = require('../routes/about')
var activeinfo = require('../routes/activeinfo')
var userpos = require('../routes/userpos')
var signin = require('../routes/signin')
var setitem = require('../routes/setitem')
module.exports = function(app) {

  app.get('/', index.index)

  app.get('/users', users.index)
  app.get('/users/:uid', users.show)

  app.get('/about', about.index)

  app.post('/activeinfo', activeinfo.store)
  app.get('/userpos', userpos.getpos)
  app.get('/signin', signin.sign)
  app.get('/setitem', setitem.set)

  app.get('*', error.pageNotFound)
}
