exports.index = function(req, res) {
	res.render('users', {
    title: 'Users Index'
    , users: [{name: 'abc'}, {name: 'zhang3'}, {name: 'li4'}]
  })
}

exports.show = function(req, res) {
	res.render('users_show', {
		uid: req.params.uid
	})
}